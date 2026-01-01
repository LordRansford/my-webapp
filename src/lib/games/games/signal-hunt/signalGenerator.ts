/**
 * Signal Generator
 * 
 * Generates deterministic security signals based on seed and phase.
 */

import { SeededRNG } from '@/lib/games/framework/SeededRNG';
import type { Signal, Evidence, Difficulty } from './types';

export function generateSignalQueue(
  seed: number,
  turn: number,
  phase: 1 | 2 | 3 | 4,
  falsePositiveRate: number
): Signal[] {
  const rng = new SeededRNG(seed + turn * 1000);
  const signalCount = getSignalCountForPhase(phase);
  const signals: Signal[] = [];
  
  for (let i = 0; i < signalCount; i++) {
    const isFalsePositive = rng.random() < falsePositiveRate;
    const signal = generateSignal(rng, turn, phase, isFalsePositive);
    signals.push(signal);
  }
  
  return signals;
}

function generateSignal(
  rng: SeededRNG,
  turn: number,
  phase: number,
  isFalsePositive: boolean
): Signal {
  const signalTypes = [
    { name: 'Unusual Network Traffic', severity: 'high' as const },
    { name: 'Suspicious File Activity', severity: 'medium' as const },
    { name: 'Anomalous Process Behavior', severity: 'high' as const },
    { name: 'Failed Login Attempts', severity: 'medium' as const },
    { name: 'Data Exfiltration Pattern', severity: 'critical' as const },
    { name: 'Malware Signature Detected', severity: 'critical' as const },
  ];
  
  const type = rng.sample(signalTypes, 1)[0];
  const threatProbability = isFalsePositive 
    ? rng.random() * 0.3  // False positives have low threat probability
    : 0.7 + rng.random() * 0.3;  // Real threats have high probability
  
  const evidence = generateEvidence(rng, phase, isFalsePositive);
  
  return {
    id: `signal-${turn}-${rng.next()}`,
    name: type.name,
    description: `${type.name} detected from source ${rng.next().toString(36).substring(2, 8)}`,
    severity: type.severity,
    threatProbability,
    evidence,
    source: `source-${rng.next()}`,
    timestamp: turn,
    isFalsePositive,
  };
}

function generateEvidence(
  rng: SeededRNG,
  phase: number,
  isFalsePositive: boolean
): Evidence[] {
  const evidenceTypes: Evidence['type'][] = ['network', 'file', 'process', 'user', 'system'];
  const count = phase <= 2 ? 2 : phase === 3 ? 3 : 4;
  
  const evidence: Evidence[] = [];
  for (let i = 0; i < count; i++) {
    const type = rng.sample(evidenceTypes, 1)[0];
    const confidence = isFalsePositive
      ? 0.3 + rng.random() * 0.4  // Lower confidence for false positives
      : 0.7 + rng.random() * 0.3;  // Higher confidence for real threats
    
    evidence.push({
      id: `evidence-${i}`,
      type,
      description: `${type} evidence ${i + 1}`,
      confidence,
      revealed: false,
    });
  }
  
  return evidence;
}

function getSignalCountForPhase(phase: 1 | 2 | 3 | 4): number {
  switch (phase) {
    case 1: return 3 + Math.floor(Math.random() * 2); // 3-4
    case 2: return 5 + Math.floor(Math.random() * 2); // 5-6
    case 3: return 6 + Math.floor(Math.random() * 2); // 6-8
    case 4: return 8 + Math.floor(Math.random() * 2); // 8-10
  }
}
