import { Grid, ShapeDefinition, TrayPiece } from '../types/game';

export const GRID_SIZE = 8;

export function createEmptyGrid(): Grid {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => ({
      filled: false,
    }))
  );
}

// Check if a piece matrix can be placed at (startRow, startCol) on the grid
export function canPlaceShape(
  grid: Grid,
  matrix: number[][],
  startRow: number,
  startCol: number
): boolean {
  const rows = matrix.length;
  const cols = matrix[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (matrix[r][c] === 1) {
        const targetRow = startRow + r;
        const targetCol = startCol + c;

        // Check grid boundary
        if (
          targetRow < 0 ||
          targetRow >= GRID_SIZE ||
          targetCol < 0 ||
          targetCol >= GRID_SIZE
        ) {
          return false;
        }

        // Check if cell is already occupied
        if (grid[targetRow][targetCol].filled) {
          return false;
        }
      }
    }
  }

  return true;
}

// Clone grid and place the piece
export function placeShape(
  grid: Grid,
  matrix: number[][],
  startRow: number,
  startCol: number,
  shape: ShapeDefinition
): Grid {
  const newGrid: Grid = grid.map((row) =>
    row.map((cell) => ({ ...cell, justPlaced: false, clearing: false }))
  );
  const rows = matrix.length;
  const cols = matrix[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (matrix[r][c] === 1) {
        const targetRow = startRow + r;
        const targetCol = startCol + c;
        newGrid[targetRow][targetCol] = {
          filled: true,
          color: shape.color,
          shapeId: shape.id,
          justPlaced: true,
        };
      }
    }
  }

  return newGrid;
}

// Find all rows and columns that are 100% full
export function findFullLines(grid: Grid): { rows: number[]; cols: number[] } {
  const fullRows: number[] = [];
  const fullCols: number[] = [];

  // Check rows
  for (let r = 0; r < GRID_SIZE; r++) {
    let rowFull = true;
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!grid[r][c].filled) {
        rowFull = false;
        break;
      }
    }
    if (rowFull) {
      fullRows.push(r);
    }
  }

  // Check columns
  for (let c = 0; c < GRID_SIZE; c++) {
    let colFull = true;
    for (let r = 0; r < GRID_SIZE; r++) {
      if (!grid[r][c].filled) {
        colFull = false;
        break;
      }
    }
    if (colFull) {
      fullCols.push(c);
    }
  }

  return { rows: fullRows, cols: fullCols };
}

// Calculate clear score based on lines cleared and combo streak
export function calculateClearScore(linesCount: number, comboStreak: number): number {
  if (linesCount === 0) return 0;

  // Base score scaling exponentially with number of lines cleared at once
  const baseScores = [0, 100, 300, 600, 1000, 1500, 2100, 2800];
  const base = baseScores[linesCount] || linesCount * 400;

  // Combo streak multiplier: Streak 1 = 1x, Streak 2 = 1.5x, Streak 3 = 2x, etc.
  const streakMultiplier = 1 + Math.max(0, comboStreak - 1) * 0.5;

  return Math.round(base * streakMultiplier);
}

// Check if a shape can fit ANYWHERE on the grid
export function canShapeFitAnywhere(grid: Grid, shape: ShapeDefinition): boolean {
  const matrix = shape.matrix;
  const rows = matrix.length;
  const cols = matrix[0].length;

  for (let r = 0; r <= GRID_SIZE - rows; r++) {
    for (let c = 0; c <= GRID_SIZE - cols; c++) {
      if (canPlaceShape(grid, matrix, r, c)) {
        return true;
      }
    }
  }

  return false;
}

// Game is over if NONE of the remaining unplaced pieces in the tray can fit anywhere
export function isGameOver(grid: Grid, trayPieces: TrayPiece[]): boolean {
  const activePieces = trayPieces.filter((p) => !p.used);
  if (activePieces.length === 0) {
    return false; // Will refill next
  }

  for (const piece of activePieces) {
    if (canShapeFitAnywhere(grid, piece.shape)) {
      return false; // At least one piece can fit!
    }
  }

  return true; // No piece can fit anywhere!
}
