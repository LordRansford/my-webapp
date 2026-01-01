/**
 * Proof Sprint - Move Definitions
 * 
 * Defines available proof moves/techniques.
 */

import type { Move, Statement } from './types';

export function getMoveDefinitions(): Move[] {
  return [
    {
      id: 'distribute',
      type: 'distribute',
      name: 'Distribute',
      description: 'Distribute multiplication over addition',
      penalty: 0,
      applicable: (statements) => statements.some(s => s.expression.includes('(')),
    },
    {
      id: 'factor',
      type: 'factor',
      name: 'Factor',
      description: 'Factor out common terms',
      penalty: 0.1,
      applicable: (statements) => true, // Can always try to factor
    },
    {
      id: 'simplify',
      type: 'simplify',
      name: 'Simplify',
      description: 'Simplify expression',
      penalty: 0,
      applicable: (statements) => true,
    },
    {
      id: 'combine',
      type: 'combine',
      name: 'Combine Like Terms',
      description: 'Combine similar terms',
      penalty: 0,
      applicable: (statements) => true,
    },
    {
      id: 'substitute',
      type: 'substitute',
      name: 'Substitute',
      description: 'Substitute one expression for another',
      penalty: 0.05,
      applicable: (statements) => statements.length >= 2,
    },
    {
      id: 'expand',
      type: 'expand',
      name: 'Expand',
      description: 'Expand expression (powerful but penalized)',
      penalty: 0.1,
      applicable: (statements) => statements.some(s => s.expression.includes('^')),
    },
    {
      id: 'theorem',
      type: 'theorem',
      name: 'Apply Theorem',
      description: 'Apply mathematical theorem (very powerful but high penalty)',
      penalty: 0.2,
      applicable: (statements) => statements.length >= 2,
    },
  ];
}
