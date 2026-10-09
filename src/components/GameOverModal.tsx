import React from 'react';
import { Trophy, RotateCcw, Flame } from 'lucide-react';
import { CrownScore } from './CrownScore';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  linesCleared: number;
  maxCombo: number;
  onPlayAgain: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  score,
  highScore,
  isNewHighScore,
  linesCleared,
  maxCombo,
  onPlayAgain,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700/80 p-6 sm:p-8 shadow-2xl text-center transform scale-100 transition-all">
        {/* Header Icon / Title */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
          <Trophy className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] mb-1">
          {isNewHighScore ? 'New High Score!' : 'Game Over'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mb-6">
          {isNewHighScore
            ? 'Incredible performance! You set a new personal record.'
            : 'No more moves fit on the board. Great effort!'}
        </p>

        {/* Score Cards */}
        <div className="space-y-3 mb-6">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-white/5 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Final Score
            </span>
            <span className="text-3xl font-black text-white font-mono tabular-nums">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/60 border border-amber-400/20 flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-300 font-bold uppercase text-[11px] tracking-wider font-['Outfit']">
              Personal Best
            </span>
            <CrownScore score={highScore} size="md" isNewBest={isNewHighScore} />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/40 border border-white/5 flex flex-col items-center">
              <span className="text-slate-400">Lines Cleared</span>
              <span className="text-lg font-bold text-white font-mono tabular-nums mt-0.5">
                {linesCleared}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/40 border border-white/5 flex flex-col items-center">
              <span className="text-slate-400 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" /> Max Combo
              </span>
              <span className="text-lg font-bold text-amber-400 font-mono tabular-nums mt-0.5">
                {maxCombo}x
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onPlayAgain}
          className="w-full py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-base shadow-lg shadow-amber-400/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          Play Again
        </button>
      </div>
    </div>
  );
};
