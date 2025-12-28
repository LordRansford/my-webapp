// Movement requirement tracking and danger zones

export type DangerZone = {
  id: string;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  expansionRate: number;
  damage: number;
  startTime: number;
  duration: number;
  active: boolean;
};

export type MovementTracker = {
  lastPosition: { x: number; y: number };
  lastMoveTime: number;
  stationaryTime: number;
  totalDistance: number;
  movementBonus: number; // Point multiplier for constant movement
};

const STATIONARY_THRESHOLD_MS = 1500; // 1.5 seconds
const MOVEMENT_THRESHOLD_PX = 50; // Must move 50px every 3 seconds
const MOVEMENT_CHECK_INTERVAL_MS = 3000; // Check every 3 seconds
const DANGER_ZONE_EXPANSION_RATE = 30; // pixels per second
const DANGER_ZONE_MAX_RADIUS = 80;
const DANGER_ZONE_DURATION_MS = 2000; // 2 seconds to expand

export function createMovementTracker() {
  const tracker: MovementTracker = {
    lastPosition: { x: 0, y: 0 },
    lastMoveTime: 0,
    stationaryTime: 0,
    totalDistance: 0,
    movementBonus: 1.0,
  };

  return {
    update(currentX: number, currentY: number, currentTime: number): {
      isStationary: boolean;
      shouldSpawnDangerZone: boolean;
      movementBonus: number;
    } {
      const dx = currentX - tracker.lastPosition.x;
      const dy = currentY - tracker.lastPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Check if player moved significantly
      if (distance > 5) {
        // Player moved
        tracker.lastMoveTime = currentTime;
        tracker.stationaryTime = 0;
        tracker.totalDistance += distance;
        tracker.lastPosition = { x: currentX, y: currentY };

        // Calculate movement bonus (increases with constant movement)
        const timeSinceLastCheck = currentTime - (tracker.lastMoveTime - MOVEMENT_CHECK_INTERVAL_MS);
        if (timeSinceLastCheck < MOVEMENT_CHECK_INTERVAL_MS) {
          tracker.movementBonus = Math.min(1.5, 1.0 + (tracker.totalDistance / 200) * 0.1);
        } else {
          tracker.totalDistance = 0;
          tracker.movementBonus = 1.0;
        }
      } else {
        // Player is stationary
        tracker.stationaryTime = currentTime - tracker.lastMoveTime;
      }

      const isStationary = tracker.stationaryTime > STATIONARY_THRESHOLD_MS;
      const shouldSpawnDangerZone = isStationary && tracker.stationaryTime > STATIONARY_THRESHOLD_MS;

      return {
        isStationary,
        shouldSpawnDangerZone,
        movementBonus: tracker.movementBonus,
      };
    },

    reset(x: number, y: number, time: number) {
      tracker.lastPosition = { x, y };
      tracker.lastMoveTime = time;
      tracker.stationaryTime = 0;
      tracker.totalDistance = 0;
      tracker.movementBonus = 1.0;
    },

    getTracker() {
      return tracker;
    },
  };
}

export function createDangerZone(x: number, y: number, startTime: number): DangerZone {
  return {
    id: `danger-${Date.now()}-${Math.random()}`,
    x,
    y,
    radius: 20,
    maxRadius: DANGER_ZONE_MAX_RADIUS,
    expansionRate: DANGER_ZONE_EXPANSION_RATE,
    damage: 1,
    startTime,
    duration: DANGER_ZONE_DURATION_MS,
    active: true,
  };
}

export function updateDangerZone(zone: DangerZone, currentTime: number, dt: number): boolean {
  if (!zone.active) return false;

  const elapsed = currentTime - zone.startTime;
  if (elapsed >= zone.duration) {
    zone.active = false;
    return false;
  }

  // Expand radius
  const expansion = (zone.expansionRate * dt) / 1000;
  zone.radius = Math.min(zone.maxRadius, zone.radius + expansion);

  return true;
}

export function checkDangerZoneCollision(
  zone: DangerZone,
  playerX: number,
  playerY: number,
  playerRadius: number
): boolean {
  if (!zone.active) return false;

  const dx = playerX - zone.x;
  const dy = playerY - zone.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return dist < zone.radius + playerRadius;
}

