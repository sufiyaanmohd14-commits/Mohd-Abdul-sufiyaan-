import { Grid, DailyPuzzleConfig, ShapeDefinition } from '../types/game';
import { GRID_SIZE, createEmptyGrid } from './gameLogic';
import { SHAPES } from './shapes';

// Deterministic Pseudo-Random Number Generator (Mulberry32)
export function createSeededRandom(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getRelativeDateKey(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 8 Curated Daily Configuration Archetypes
interface PuzzleArchetype {
  name: string;
  subtitle: string;
  icon: string;
  maxMoves: number;
  targetScore: number;
  pattern: number[][]; // 8x8 matrix, 1 = preset obstacle block
}

const ARCHETYPES: PuzzleArchetype[] = [
  {
    name: 'Citadel Gate',
    subtitle: 'Clear the reinforced fortress walls before your moves run out!',
    icon: '🏰',
    maxMoves: 10,
    targetScore: 1800,
    pattern: [
      [1, 0, 0, 1, 1, 0, 0, 1],
      [0, 1, 0, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [1, 0, 1, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 1, 0, 1],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 0, 0, 0, 0, 1, 0],
      [1, 0, 0, 1, 1, 0, 0, 1],
    ],
  },
  {
    name: 'Diamond Vault',
    subtitle: 'Shatter the central gem vault and trigger cascading line blasts!',
    icon: '💎',
    maxMoves: 9,
    targetScore: 1600,
    pattern: [
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 1, 0, 1, 1, 0, 1, 0],
      [1, 0, 1, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 1, 0, 1],
      [0, 1, 0, 1, 1, 0, 1, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
    ],
  },
  {
    name: 'Hourglass Citadel',
    subtitle: 'Time is ticking! Clear the constricted corridors of the hourglass.',
    icon: '⏳',
    maxMoves: 11,
    targetScore: 2000,
    pattern: [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 0, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 1, 0, 0, 0, 0, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
    ],
  },
  {
    name: 'Crossroads Matrix',
    subtitle: 'Strategically carve paths through intersecting block barriers.',
    icon: '⚔️',
    maxMoves: 10,
    targetScore: 1750,
    pattern: [
      [1, 1, 0, 0, 0, 0, 1, 1],
      [1, 0, 0, 1, 1, 0, 0, 1],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 1, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [1, 0, 0, 1, 1, 0, 0, 1],
      [1, 1, 0, 0, 0, 0, 1, 1],
    ],
  },
  {
    name: 'Solar Crown',
    subtitle: 'Conquer the radiant royal crown arrangement with precision fits.',
    icon: '👑',
    maxMoves: 10,
    targetScore: 1900,
    pattern: [
      [1, 0, 0, 1, 1, 0, 0, 1],
      [1, 1, 0, 1, 1, 0, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
    ],
  },
  {
    name: 'Nebula Spiral',
    subtitle: 'Disassemble the inward curling cosmic vortex before energy depletes.',
    icon: '🌀',
    maxMoves: 12,
    targetScore: 2100,
    pattern: [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 1, 1, 1, 1, 1, 0],
      [1, 0, 1, 0, 0, 0, 1, 0],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [1, 0, 1, 1, 1, 0, 1, 0],
      [1, 0, 0, 0, 0, 0, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 0],
    ],
  },
  {
    name: 'Twin Spires',
    subtitle: 'Twin tower pillars occupy the columns — clear both in tandem.',
    icon: '🗼',
    maxMoves: 10,
    targetScore: 1800,
    pattern: [
      [0, 1, 1, 0, 0, 1, 1, 0],
      [0, 1, 1, 0, 0, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 1, 1, 0, 1, 0],
      [0, 1, 0, 1, 1, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 0, 0, 1, 1, 0],
      [0, 1, 1, 0, 0, 1, 1, 0],
    ],
  },
  {
    name: 'Pixel Heart',
    subtitle: 'Blast through the beloved heart emblem for maximum daily glory!',
    icon: '💖',
    maxMoves: 9,
    targetScore: 1650,
    pattern: [
      [0, 1, 1, 0, 0, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
];

const PRESET_GEM_COLORS = [
  '#F43F5E', // Ruby Rose
  '#F59E0B', // Amber Topaz
  '#10B981', // Jade Emerald
  '#38BDF8', // Sapphire Cyan
  '#A855F7', // Amethyst Purple
  '#EC4899', // Pink Tourmaline
];

/**
 * Generates the deterministic Daily Puzzle Configuration for any given date.
 */
export function getDailyPuzzleConfig(dateKey: string = getTodayDateKey()): DailyPuzzleConfig {
  const seed = hashString(dateKey);
  const rand = createSeededRandom(seed);

  // Pick archetype deterministically
  const archetypeIndex = Math.floor(rand() * ARCHETYPES.length);
  const archetype = ARCHETYPES[archetypeIndex];

  // Calculate puzzle sequence number (days since 2026-01-01)
  const baseEpoch = new Date('2026-01-01').getTime();
  const currentEpoch = new Date(dateKey).getTime();
  const puzzleNumber = Math.max(1, Math.floor((currentEpoch - baseEpoch) / (1000 * 60 * 60 * 24)) + 1);

  // Build 8x8 pre-generated grid
  const initialGrid: Grid = createEmptyGrid();
  let presetBlocksTotal = 0;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (archetype.pattern[r][c] === 1) {
        presetBlocksTotal++;
        // Choose color deterministically for symmetry or variety
        const colorIndex = (r + c + Math.floor(rand() * 3)) % PRESET_GEM_COLORS.length;
        initialGrid[r][c] = {
          filled: true,
          color: PRESET_GEM_COLORS[colorIndex],
          isPresetObstacle: true,
        };
      }
    }
  }

  // Generate deterministic batches of polyomino shapes (up to 8 rounds of 3 pieces)
  const predefinedShapeBatches: ShapeDefinition[][] = [];
  const allShapes = [...SHAPES];

  for (let batch = 0; batch < 8; batch++) {
    const currentBatch: ShapeDefinition[] = [];
    for (let p = 0; p < 3; p++) {
      const shapeIdx = Math.floor(rand() * allShapes.length);
      currentBatch.push(allShapes[shapeIdx]);
    }
    predefinedShapeBatches.push(currentBatch);
  }

  return {
    dateKey,
    puzzleNumber,
    title: archetype.name,
    subtitle: archetype.subtitle,
    icon: archetype.icon,
    initialGrid,
    presetBlocksTotal,
    maxMoves: archetype.maxMoves,
    targetScore: archetype.targetScore,
    predefinedShapeBatches,
  };
}

/**
 * Calculates remaining preset obstacles in the current grid
 */
export function countRemainingPresetBlocks(grid: Grid): number {
  let count = 0;
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c].filled && grid[r][c].isPresetObstacle) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Evaluates Star Rating (1 to 3 stars)
 */
export function calculateStarRating(
  clearedPreset: number,
  totalPreset: number,
  movesUsed: number,
  maxMoves: number
): number {
  const isAllCleared = clearedPreset >= totalPreset;
  if (isAllCleared) {
    // 3 Stars if completed efficiently (in <= 75% of max moves)
    if (movesUsed <= Math.ceil(maxMoves * 0.75)) {
      return 3;
    }
    return 2;
  }

  // If cleared at least 70% of presets
  if (clearedPreset / totalPreset >= 0.7) {
    return 1;
  }
  return 0;
}
