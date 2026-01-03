import { useState, useEffect } from 'react';
import SafeIcon from '@/components/content/SafeIcon';

// Achievement definitions
const ACHIEVEMENTS = {
  // Foundations Level
  'phishing-detective': {
    id: 'phishing-detective',
    title: 'Phishing Detective',
    description: 'Correctly identified 25 phishing attempts with 95%+ accuracy',
    icon: 'shield-check',
    color: 'emerald',
    level: 'foundations',
    points: 100,
    criteria: { type: 'phishing_accuracy', threshold: 0.95, count: 25 }
  },
  'password-master': {
    id: 'password-master',
    title: 'Password Master',
    description: 'Created 5 strong passwords with 100+ bits of entropy',
    icon: 'key',
    color: 'blue',
    level: 'foundations',
    points: 50,
    criteria: { type: 'password_entropy', threshold: 100, count: 5 }
  },
  'foundations-complete': {
    id: 'foundations-complete',
    title: 'Foundations Complete',
    description: 'Finished all Foundations modules with 80%+ quiz scores',
    icon: 'award',
    color: 'amber',
    level: 'foundations',
    points: 200,
    criteria: { type: 'level_complete', level: 'foundations', minScore: 0.8 }
  },
  'cia-expert': {
    id: 'cia-expert',
    title: 'CIA Triad Expert',
    description: 'Classified 50 scenarios correctly using the CIA framework',
    icon: 'target',
    color: 'purple',
    level: 'foundations',
    points: 75,
    criteria: { type: 'cia_classifications', threshold: 0.9, count: 50 }
  },
  
  // Applied Level
  'threat-modeler': {
    id: 'threat-modeler',
    title: 'Threat Modeler',
    description: 'Created 10 comprehensive threat models',
    icon: 'map',
    color: 'indigo',
    level: 'applied',
    points: 150,
    criteria: { type: 'threat_models_created', count: 10 }
  },
  'vulnerability-hunter': {
    id: 'vulnerability-hunter',
    title: 'Vulnerability Hunter',
    description: 'Identified all vulnerability types in 20 code samples',
    icon: 'search',
    color: 'red',
    level: 'applied',
    points: 125,
    criteria: { type: 'vulnerability_identification', accuracy: 0.95, count: 20 }
  },
  'applied-complete': {
    id: 'applied-complete',
    title: 'Applied Complete',
    description: 'Finished all Applied modules with 85%+ quiz scores',
    icon: 'award',
    color: 'amber',
    level: 'applied',
    points: 250,
    criteria: { type: 'level_complete', level: 'applied', minScore: 0.85 }
  },
  'log-analyst': {
    id: 'log-analyst',
    title: 'Log Analyst',
    description: 'Correctly triaged 30 security alerts',
    icon: 'activity',
    color: 'cyan',
    level: 'applied',
    points: 100,
    criteria: { type: 'log_analysis', accuracy: 0.9, count: 30 }
  },
  
  // Practice Level
  'architect': {
    id: 'architect',
    title: 'Security Architect',
    description: 'Designed 5 secure system architectures with zero trust principles',
    icon: 'layers',
    color: 'violet',
    level: 'practice',
    points: 200,
    criteria: { type: 'architectures_designed', count: 5 }
  },
  'incident-responder': {
    id: 'incident-responder',
    title: 'Incident Responder',
    description: 'Successfully handled 10 incident response scenarios',
    icon: 'zap',
    color: 'orange',
    level: 'practice',
    points: 175,
    criteria: { type: 'incidents_handled', score: 0.85, count: 10 }
  },
  'practice-complete': {
    id: 'practice-complete',
    title: 'Practice Complete',
    description: 'Finished all Practice modules with 90%+ quiz scores',
    icon: 'award',
    color: 'amber',
    level: 'practice',
    points: 300,
    criteria: { type: 'level_complete', level: 'practice', minScore: 0.9 }
  },
  'crypto-practitioner': {
    id: 'crypto-practitioner',
    title: 'Cryptography Practitioner',
    description: 'Correctly implemented crypto in 15 scenarios',
    icon: 'lock',
    color: 'emerald',
    level: 'practice',
    points: 150,
    criteria: { type: 'crypto_implementation', accuracy: 0.9, count: 15 }
  },
  
  // Special Achievements
  'course-master': {
    id: 'course-master',
    title: 'Cybersecurity Master',
    description: 'Completed all three levels with excellence',
    icon: 'trophy',
    color: 'yellow',
    level: 'master',
    points: 500,
    criteria: { type: 'all_levels_complete', minScore: 0.85 }
  },
  'speed-learner': {
    id: 'speed-learner',
    title: 'Speed Learner',
    description: 'Completed a level in under 2 weeks',
    icon: 'zap',
    color: 'pink',
    level: 'special',
    points: 100,
    criteria: { type: 'speed_completion', maxDays: 14 }
  },
  'streak-champion': {
    id: 'streak-champion',
    title: 'Streak Champion',
    description: 'Maintained a 30-day learning streak',
    icon: 'calendar',
    color: 'green',
    level: 'special',
    points: 150,
    criteria: { type: 'streak', days: 30 }
  },
  'case-study-scholar': {
    id: 'case-study-scholar',
    title: 'Case Study Scholar',
    description: 'Read and analyzed all 9+ case studies in detail',
    icon: 'book-open',
    color: 'blue',
    level: 'special',
    points: 75,
    criteria: { type: 'case_studies_read', count: 9 }
  }
};

// Get user achievements from localStorage
function getUserAchievements() {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('cyber_achievements');
  return stored ? JSON.parse(stored) : [];
}

// Save achievement to localStorage
function unlockAchievement(achievementId) {
  if (typeof window === 'undefined') return;
  const achievements = getUserAchievements();
  if (!achievements.includes(achievementId)) {
    achievements.push(achievementId);
    localStorage.setItem('cyber_achievements', JSON.stringify(achievements));
    
    // Trigger custom event for other components to react
    window.dispatchEvent(new CustomEvent('achievement-unlocked', {
      detail: { achievementId, achievement: ACHIEVEMENTS[achievementId] }
    }));
  }
}

// Achievement Badge Component
export function AchievementBadge({ achievementId, unlocked = false, size = 'md', showDetails = true }) {
  const achievement = ACHIEVEMENTS[achievementId];
  if (!achievement) return null;

  const sizes = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  };

  const iconSizes = {
    sm: 20,
    md: 28,
    lg: 40
  };

  const colors = {
    emerald: unlocked ? 'bg-emerald-500' : 'bg-gray-300',
    blue: unlocked ? 'bg-blue-500' : 'bg-gray-300',
    amber: unlocked ? 'bg-amber-500' : 'bg-gray-300',
    purple: unlocked ? 'bg-purple-500' : 'bg-gray-300',
    indigo: unlocked ? 'bg-indigo-500' : 'bg-gray-300',
    red: unlocked ? 'bg-red-500' : 'bg-gray-300',
    cyan: unlocked ? 'bg-cyan-500' : 'bg-gray-300',
    violet: unlocked ? 'bg-violet-500' : 'bg-gray-300',
    orange: unlocked ? 'bg-orange-500' : 'bg-gray-300',
    yellow: unlocked ? 'bg-yellow-500' : 'bg-gray-300',
    pink: unlocked ? 'bg-pink-500' : 'bg-gray-300',
    green: unlocked ? 'bg-green-500' : 'bg-gray-300',
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${unlocked ? '' : 'opacity-50'}`}>
      <div
        className={`${sizes[size]} ${colors[achievement.color]} rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110`}
        title={achievement.description}
      >
        <SafeIcon 
          name={achievement.icon} 
          size={iconSizes[size]} 
          color="white" 
          style={{ marginRight: 0 }}
        />
      </div>
      {showDetails && (
        <div className="text-center">
          <p className={`text-sm font-semibold ${unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
            {achievement.title}
          </p>
          {unlocked && (
            <p className="text-xs text-gray-600">{achievement.points} pts</p>
          )}
        </div>
      )}
    </div>
  );
}

// Achievements Dashboard
export default function AchievementsDashboard({ courseId = 'cybersecurity', levelId = null }) {
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [recentUnlock, setRecentUnlock] = useState(null);

  useEffect(() => {
    setUnlockedAchievements(getUserAchievements());

    // Listen for new achievements
    const handleAchievement = (event) => {
      setUnlockedAchievements(getUserAchievements());
      setRecentUnlock(event.detail);
      
      // Clear recent unlock after animation
      setTimeout(() => setRecentUnlock(null), 5000);
    };

    window.addEventListener('achievement-unlocked', handleAchievement);
    return () => window.removeEventListener('achievement-unlocked', handleAchievement);
  }, []);

  // Filter achievements by level if specified
  let achievementsToShow = Object.values(ACHIEVEMENTS);
  if (levelId) {
    achievementsToShow = achievementsToShow.filter(a => a.level === levelId || a.level === 'special');
  }

  if (showUnlockedOnly) {
    achievementsToShow = achievementsToShow.filter(a => unlockedAchievements.includes(a.id));
  }

  const totalPoints = achievementsToShow
    .filter(a => unlockedAchievements.includes(a.id))
    .reduce((sum, a) => sum + a.points, 0);

  const maxPoints = achievementsToShow.reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
          <p className="text-sm text-gray-600">
            {unlockedAchievements.length} of {Object.keys(ACHIEVEMENTS).length} unlocked
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-blue-600">{totalPoints}</p>
          <p className="text-xs text-gray-600">of {maxPoints} points</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${(totalPoints / maxPoints) * 100}%` }}
          />
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
          className={`rounded-lg px-3 py-1 text-sm font-medium transition ${
            showUnlockedOnly
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {showUnlockedOnly ? 'Show All' : 'Show Unlocked Only'}
        </button>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {achievementsToShow.map(achievement => (
          <AchievementBadge
            key={achievement.id}
            achievementId={achievement.id}
            unlocked={unlockedAchievements.includes(achievement.id)}
            size="md"
            showDetails={true}
          />
        ))}
      </div>

      {/* Recent Unlock Notification */}
      {recentUnlock && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-in-right">
          <div className="rounded-lg border-2 border-yellow-400 bg-white p-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <AchievementBadge
                achievementId={recentUnlock.achievementId}
                unlocked={true}
                size="sm"
                showDetails={false}
              />
              <div>
                <p className="text-sm font-bold text-gray-900">Achievement Unlocked!</p>
                <p className="text-xs text-gray-600">{recentUnlock.achievement.title}</p>
                <p className="text-xs font-semibold text-blue-600">
                  +{recentUnlock.achievement.points} points
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Export helper functions for other components to use
export { ACHIEVEMENTS, getUserAchievements, unlockAchievement };
