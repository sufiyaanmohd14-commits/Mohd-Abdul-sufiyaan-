import React from 'react';
import { ActiveDrag, Grid } from '../types/game';
import { GRID_SIZE } from '../utils/gameLogic';
import { GameTheme, THEMES } from '../utils/themeConfig';

export type { GameTheme };

interface GridBoardProps {
  grid: Grid;
  theme: GameTheme;
  activeDrag: ActiveDrag | null;
  boardRef: React.RefObject<HTMLDivElement | null>;
  selectedPieceIndex: number | null;
  isShaking?: boolean;
  isMorphing?: boolean;
  onCellClick?: (row: number, col: number) => void;
}

export const GridBoard: React.FC<GridBoardProps> = ({
  grid,
  theme,
  activeDrag,
  boardRef,
  selectedPieceIndex: _selectedPieceIndex,
  isShaking = false,
  isMorphing = false,
  onCellClick,
}) => {
  const currentThemeMeta = THEMES[theme] || THEMES.midnight;

  // Determine if a cell is covered by the current activeDrag preview
  const getDragPreviewStatus = (row: number, col: number) => {
    if (!activeDrag || !activeDrag.hoverGridCoord) return null;

    const { row: hRow, col: hCol } = activeDrag.hoverGridCoord;
    const matrix = activeDrag.piece.shape.matrix;
    const shapeRows = matrix.length;
    const shapeCols = matrix[0].length;

    const rOffset = row - hRow;
    const cOffset = col - hCol;

    if (
      rOffset >= 0 &&
      rOffset < shapeRows &&
      cOffset >= 0 &&
      cOffset < shapeCols &&
      matrix[rOffset][cOffset] === 1
    ) {
      return {
        isValid: activeDrag.isValidPlacement,
        color: activeDrag.piece.shape.color,
        borderColor: activeDrag.piece.shape.borderColor,
      };
    }
    return null;
  };

  return (
    <div className="relative mx-auto w-full max-w-[420px] select-none p-1.5 sm:p-2">
      {/* Morph Glow Aura when theme is dynamically shifting */}
      {isMorphing && (
        <div
          className="absolute -inset-1 rounded-3xl blur-xl opacity-75 transition-all duration-300 pointer-events-none animate-pulse"
          style={{ backgroundColor: `${currentThemeMeta.accentColor}55` }}
        />
      )}

      {/* Board Container */}
      <div
        ref={boardRef}
        className={`relative grid grid-cols-8 gap-1 sm:gap-1.5 rounded-2xl border-4 p-2 sm:p-3 transition-all duration-300 ${
          currentThemeMeta.boardBgClass
        } ${isShaking ? 'animate-[bounce_0.2s_infinite]' : ''}`}
        style={{
          aspectRatio: '1 / 1',
        }}
      >
        {Array.from({ length: GRID_SIZE }).map((_, r) =>
          Array.from({ length: GRID_SIZE }).map((_, c) => {
            const cell = grid[r][c];
            const preview = getDragPreviewStatus(r, c);

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => onCellClick?.(r, c)}
                data-row={r}
                data-col={c}
                className={`relative flex items-center justify-center rounded-lg sm:rounded-xl border transition-all duration-150 ${
                  cell.filled
                    ? cell.superBlasting
                      ? 'scale-110 brightness-150 shadow-[0_0_20px_#ffffff] z-30 border-white'
                      : 'border-transparent shadow-[0_3px_6px_rgba(0,0,0,0.35)]'
                    : currentThemeMeta.emptyCellClass
                } ${
                  cell.clearing
                    ? 'scale-75 opacity-0 transition-all duration-200'
                    : ''
                }`}
                style={{
                  backgroundColor: cell.filled
                    ? cell.superBlasting
                      ? '#FFFFFF'
                      : cell.color
                    : undefined,
                }}
              >
                {/* 3D Chamfer and Bevel for filled blocks */}
                {cell.filled && !cell.superBlasting && (
                  <div className="pointer-events-none absolute inset-0 rounded-lg sm:rounded-xl overflow-hidden">
                    {/* Top highlight */}
                    <div className="absolute top-0 inset-x-0 h-[30%] bg-gradient-to-b from-white/45 to-transparent" />
                    {/* Bottom inner shadow */}
                    <div className="absolute bottom-0 inset-x-0 h-[25%] bg-gradient-to-t from-black/40 to-transparent" />
                    {/* Inner glowing center */}
                    <div className="absolute inset-1 rounded-md sm:rounded-lg border border-white/20 bg-white/10 flex items-center justify-center">
                      {/* Special jewel shine for Daily Challenge Preset Obstacle Blocks */}
                      {cell.isPresetObstacle && (
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rotate-45 bg-white/80 shadow-[0_0_6px_#ffffff] rounded-[2px] animate-pulse" />
                      )}
                    </div>
                  </div>
                )}

                {/* Super Blast White-Hot Sparkle */}
                {cell.superBlasting && (
                  <div className="pointer-events-none absolute inset-0 rounded-lg sm:rounded-xl bg-white animate-ping opacity-80" />
                )}

                {/* Drag Hover Preview Overlay */}
                {preview && (
                  <div
                    className={`pointer-events-none absolute inset-0 rounded-lg sm:rounded-xl z-20 transition-all duration-75 ${
                      preview.isValid
                        ? 'animate-pulse scale-95 shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                        : 'bg-red-600/70 border-2 border-red-400'
                    }`}
                    style={{
                      backgroundColor: preview.isValid
                        ? `${preview.color}CC`
                        : undefined,
                      borderColor: preview.isValid
                        ? preview.borderColor
                        : undefined,
                      borderWidth: preview.isValid ? '2px' : undefined,
                    }}
                  >
                    {preview.isValid && (
                      <div className="absolute inset-0 bg-white/20 rounded-md sm:rounded-lg" />
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
