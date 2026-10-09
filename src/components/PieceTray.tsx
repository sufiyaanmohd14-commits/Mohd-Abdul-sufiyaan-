import React from 'react';
import { TrayPiece } from '../types/game';
import { canShapeFitAnywhere } from '../utils/gameLogic';
import { Grid } from '../types/game';

interface PieceTrayProps {
  pieces: TrayPiece[];
  grid: Grid;
  selectedPieceIndex: number | null;
  onSelectPiece: (index: number) => void;
  onDragStart: (
    e: React.MouseEvent | React.TouchEvent,
    piece: TrayPiece,
    index: number
  ) => void;
}

export const PieceTray: React.FC<PieceTrayProps> = ({
  pieces,
  grid,
  selectedPieceIndex,
  onSelectPiece,
  onDragStart,
}) => {
  return (
    <div className="mx-auto w-full max-w-[420px] px-2 sm:px-4 py-2">
      <div className="flex items-center justify-between gap-2 sm:gap-3 rounded-2xl bg-slate-900/40 p-2 sm:p-3 border border-white/5 backdrop-blur-sm min-h-[125px] sm:min-h-[140px]">
        {pieces.map((piece, index) => {
          if (piece.used) {
            return (
              <div
                key={piece.instanceId}
                className="flex-1 h-24 sm:h-28 rounded-xl border border-dashed border-white/5 flex items-center justify-center opacity-20"
              >
                <div className="w-8 h-8 rounded-full border border-white/10" />
              </div>
            );
          }

          // Check if piece can still be placed anywhere
          const canFit = canShapeFitAnywhere(grid, piece.shape);
          const isSelected = selectedPieceIndex === index;
          const matrix = piece.shape.matrix;
          const rows = matrix.length;
          const cols = matrix[0].length;

          // Determine cellSize in mini-tray preview
          const maxDim = Math.max(rows, cols);
          const cellSizeClass =
            maxDim >= 4 ? 'w-4 h-4 sm:w-5 sm:h-5' : maxDim === 3 ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-6 h-6 sm:w-7 sm:h-7';

          return (
            <div
              key={piece.instanceId}
              onMouseDown={(e) => onDragStart(e, piece, index)}
              onTouchStart={(e) => onDragStart(e, piece, index)}
              onClick={() => onSelectPiece(index)}
              className={`flex-1 h-24 sm:h-28 rounded-xl border flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-200 select-none touch-none relative ${
                isSelected
                  ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_15px_rgba(251,191,36,0.25)] scale-105'
                  : 'border-white/10 bg-slate-800/40 hover:bg-slate-800/70 hover:border-white/20'
              } ${!canFit ? 'opacity-40 grayscale-[40%]' : ''}`}
            >
              {/* Mini Shape Grid */}
              <div
                className="grid gap-1 transition-transform duration-150 hover:scale-105"
                style={{
                  gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                }}
              >
                {matrix.map((row, rIdx) =>
                  row.map((val, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className={`${cellSizeClass} rounded-md transition-all ${
                        val === 1
                          ? 'shadow-[0_2px_4px_rgba(0,0,0,0.3)] relative overflow-hidden'
                          : 'opacity-0'
                      }`}
                      style={{
                        backgroundColor: val === 1 ? piece.shape.color : 'transparent',
                      }}
                    >
                      {val === 1 && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-0 inset-x-0 h-1/3 bg-gradient-to-b from-white/35 to-transparent rounded-t-md" />
                          <div className="absolute bottom-0 inset-x-0 h-1/4 bg-gradient-to-t from-black/25 to-transparent rounded-b-md" />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Cannot fit warning badge */}
              {!canFit && (
                <div className="absolute top-1 right-1.5 text-[10px] font-bold text-red-400 tracking-wider">
                  NO FIT
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
