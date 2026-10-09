export type { GameTheme } from '../utils/themeConfig';

export type GameMode = 'classic' | 'daily';

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  movesUsed: number;
  stars: number; // 1, 2, or 3
  timeSeconds: number;
  isCurrentUser?: boolean;
  dateKey: string;
  avatar: string;
  rank?: number;
  badge?: string;
  timestamp: number;
}

export interface DailyPuzzleConfig {
  dateKey: string; // e.g. "2026-10-09"
  puzzleNumber: number;
  title: string;
  subtitle: string;
  icon: string;
  initialGrid: Grid;
  presetBlocksTotal: number;
  maxMoves: number;
  targetScore: number;
  predefinedShapeBatches: ShapeDefinition[][];
}

export type CellValue = {
  filled: boolean;
  color?: string; // hex or tailwind-friendly color code
  shapeId?: string;
  clearing?: boolean; // animation flag
  superBlasting?: boolean; // all-block blast glowing detonation
  isPresetObstacle?: boolean; // special marker for pre-generated daily challenge blocks
  justPlaced?: boolean;
};

export type Grid = CellValue[][]; // 8x8

export interface ShapeDefinition {
  id: string;
  name: string;
  matrix: number[][]; // 1 for filled, 0 for empty
  color: string; // main fill color
  glowColor: string; // particle / glow color
  borderColor: string;
  weight: number; // spawn probability weight
}

export interface TrayPiece {
  instanceId: string;
  shape: ShapeDefinition;
  used: boolean;
}

export interface DragPosition {
  clientX: number;
  clientY: number;
}

export interface ActiveDrag {
  piece: TrayPiece;
  pieceIndex: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  // Offset relative to piece anchor so the block displays above the finger/mouse
  offsetY: number;
  // Grid coordinates if currently hovering valid/invalid cell
  hoverGridCoord: { row: number; col: number } | null;
  isValidPlacement: boolean;
}

export interface ClearResult {
  clearedRows: number[];
  clearedCols: number[];
  cellsCount: number;
  totalLines: number;
  points: number;
  comboStreak: number;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize?: number;
}
