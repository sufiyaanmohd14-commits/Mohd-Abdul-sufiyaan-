import React from 'react';
import { ActiveDrag } from '../types/game';

interface DraggedPieceOverlayProps {
  activeDrag: ActiveDrag | null;
  cellSize: number;
}

export const DraggedPieceOverlay: React.FC<DraggedPieceOverlayProps> = ({
  activeDrag,
  cellSize,
}) => {
  if (!activeDrag) return null;

  const { piece, currentX, currentY, offsetY } = activeDrag;
  const matrix = piece.shape.matrix;
  const rows = matrix.length;
  const cols = matrix[0].length;

  const targetY = currentY - offsetY;
  const shapeWidth = cols * cellSize + (cols - 1) * 4;
  const shapeHeight = rows * cellSize + (rows - 1) * 4;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-none will-change-transform"
      style={{
        left: `${currentX}px`,
        top: `${targetY}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        className="grid gap-1 drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)]"
        style={{
          width: `${shapeWidth}px`,
          height: `${shapeHeight}px`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {matrix.map((row, r) =>
          row.map((val, c) => (
            <div
              key={`${r}-${c}`}
              className={`rounded-lg sm:rounded-xl relative transition-all ${
                val === 1
                  ? 'border border-white/30 shadow-[0_4px_8px_rgba(0,0,0,0.4)]'
                  : 'opacity-0'
              }`}
              style={{
                backgroundColor: val === 1 ? piece.shape.color : 'transparent',
              }}
            >
              {val === 1 && (
                <div className="absolute inset-0 rounded-lg sm:rounded-xl overflow-hidden pointer-events-none">
                  {/* Top highlight */}
                  <div className="absolute top-0 inset-x-0 h-1/3 bg-gradient-to-b from-white/45 to-transparent" />
                  {/* Bottom inner shadow */}
                  <div className="absolute bottom-0 inset-x-0 h-1/4 bg-gradient-to-t from-black/35 to-transparent" />
                  <div className="absolute inset-1 rounded-md border border-white/25 bg-white/10" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
