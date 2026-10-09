import React from 'react';
import { Trophy, Calendar, Flame, Target, Infinity } from 'lucide-react';
import { GameMode, DailyPuzzleConfig } from '../types/game';

interface DailyChallengeHeaderProps {
  mode: GameMode;
  dailyConfig: DailyPuzzleConfig;
  streak: number;
  movesRemaining: number;
  presetsRemaining: number;
  isCompleted: boolean;
  onSwitchMode: (mode: GameMode) => void;
  onOpenLeaderboard: () => void;
  onResetDaily: () => void;
}

export const DailyChallengeHeader: React.FC<DailyChallengeHeaderProps> = ({
  mode,
  dailyConfig,
  streak,
  movesRemaining,
  presetsRemaining,
  isCompleted,
  onSwitchMode,
  onOpenLeaderboard,
  onResetDaily: _onResetDaily,
}) => {
  const percentCleared = Math.round(
    ((dailyConfig.presetBlocksTotal - presetsRemaining) / dailyConfig.presetBlocksTotal) * 100
  );

  return (
    <div className="w-full max-w-lg mx-auto px-2 sm:px-3 pt-1 select-none">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between gap-2 p-1 bg-slate-900/80 rounded-2xl border border-white/10 backdrop-blur-md mb-2 shadow-md">
        <button
          onClick={() => onSwitchMode('classic')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer font-['Outfit'] ${
            mode === 'classic'
              ? 'bg-amber-400 text-slate-950 shadow-md scale-[1.02]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Infinity className="w-4 h-4" />
          <span>Classic Mode</span>
        </button>

        <button
          onClick={() => onSwitchMode('daily')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer font-['Outfit'] relative ${
            mode === 'daily'
              ? 'bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 shadow-md scale-[1.02]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-300" />
          <span>Daily Challenge</span>
          {streak > 0 && (
            <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] bg-black/30 text-amber-200 px-1.5 py-0.5 rounded-full font-mono">
              🔥{streak}
            </span>
          )}
        </button>
      </div>

      {/* Daily Challenge Info Bar (Visible in Daily Mode) */}
      {mode === 'daily' && (
        <div className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-slate-900/90 to-slate-950/90 border border-amber-500/30 shadow-lg flex flex-col gap-2 relative overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">{dailyConfig.icon}</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm sm:text-base font-extrabold text-white font-['Outfit'] leading-tight">
                    {dailyConfig.title}
                  </h2>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded-full font-mono font-bold">
                    #{dailyConfig.puzzleNumber}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>{dailyConfig.dateKey}</span>
                  {streak > 0 && (
                    <span className="text-amber-400 font-bold ml-1 flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-amber-400" />
                      {streak} Streak
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Leaderboard CTA Button */}
            <button
              onClick={onOpenLeaderboard}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 hover:text-amber-200 text-xs font-bold font-['Outfit'] flex items-center gap-1.5 transition-all shadow-sm cursor-pointer shrink-0"
              title="View Daily Leaderboard & Rankings"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Leaderboard</span>
            </button>
          </div>

          {/* Goal & Moves Metric Bar */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5 text-xs">
            {/* Metric 1: Moves Left */}
            <div className="flex items-center justify-between bg-black/30 p-2 rounded-xl border border-white/5">
              <span className="text-slate-400 text-[11px] font-medium">Moves Left:</span>
              <span
                className={`font-mono font-black text-sm tabular-nums ${
                  movesRemaining <= 2
                    ? 'text-red-400 animate-pulse'
                    : movesRemaining <= 4
                    ? 'text-amber-400'
                    : 'text-white'
                }`}
              >
                {movesRemaining} / {dailyConfig.maxMoves}
              </span>
            </div>

            {/* Metric 2: Preset Blocks Cleared */}
            <div className="flex items-center justify-between bg-black/30 p-2 rounded-xl border border-white/5">
              <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                <Target className="w-3 h-3 text-amber-400" />
                <span>Cleared:</span>
              </span>
              <span className="font-mono font-black text-sm tabular-nums text-emerald-400">
                {percentCleared}%
                <span className="text-[10px] text-slate-400 font-normal ml-1">
                  ({dailyConfig.presetBlocksTotal - presetsRemaining}/{dailyConfig.presetBlocksTotal})
                </span>
              </span>
            </div>
          </div>

          {/* Completed Badge Indicator */}
          {isCompleted && (
            <div className="text-center py-0.5">
              <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider font-['Outfit'] flex items-center justify-center gap-1">
                ⭐ Puzzle Solved! Submit your score to climb the leaderboard!
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
