import React, { useState } from 'react';
import { Trophy, Star, RotateCcw, Share2, Check, Flame } from 'lucide-react';
import { DailyPuzzleConfig } from '../types/game';
import {
  submitDailyScore,
  getSavedPlayerName,
  savePlayerName,
  getDailyStreak,
} from '../utils/leaderboardStorage';

interface DailyVictoryModalProps {
  isOpen: boolean;
  isWon: boolean;
  score: number;
  movesUsed: number;
  stars: number;
  timeSeconds: number;
  presetsCleared: number;
  dailyConfig: DailyPuzzleConfig;
  onPlayAgain: () => void;
  onOpenLeaderboard: () => void;
  onClose: () => void;
}

export const DailyVictoryModal: React.FC<DailyVictoryModalProps> = ({
  isOpen,
  isWon,
  score,
  movesUsed,
  stars,
  timeSeconds,
  presetsCleared,
  dailyConfig,
  onPlayAgain,
  onOpenLeaderboard,
  onClose,
}) => {
  const [playerName, setPlayerName] = useState<string>(() => getSavedPlayerName());
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedRank, setSubmittedRank] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmitScore = () => {
    savePlayerName(playerName);
    const { userRank } = submitDailyScore({
      dateKey: dailyConfig.dateKey,
      playerName: playerName || 'Player',
      score,
      movesUsed,
      stars,
      timeSeconds,
    });
    setSubmittedRank(userRank);
    setIsSubmitted(true);
  };

  const handleShare = async () => {
    const text = `🧩 Block Blast Daily #${dailyConfig.puzzleNumber} (${dailyConfig.dateKey})\n${'⭐'.repeat(
      stars
    )} (${stars}/3 Stars)\n🏆 Score: ${score.toLocaleString()} pts (${movesUsed}/${
      dailyConfig.maxMoves
    } moves)\n${submittedRank ? `Rank: #${submittedRank} on Leaderboard!\n` : ''}Play now!`;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const streak = getDailyStreak();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 p-6 sm:p-7 shadow-2xl relative text-center overflow-hidden">
        {/* Glow ambient aura */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            isWon ? 'bg-amber-400/30' : 'bg-sky-400/20'
          }`}
        />

        {/* Big Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-3xl mb-3 shadow-lg">
          {isWon ? '🏆' : '🧩'}
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] tracking-tight">
          {isWon ? 'Challenge Solved!' : 'Daily Attempt Finished!'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {dailyConfig.title} (Puzzle #{dailyConfig.puzzleNumber})
        </p>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2 my-4">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`transition-all duration-300 ${
                starIdx <= stars ? 'scale-110 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]' : 'opacity-30'
              }`}
            >
              <Star
                className={`w-9 h-9 sm:w-11 sm:h-11 ${
                  starIdx <= stars
                    ? 'text-amber-400 fill-amber-400 animate-bounce'
                    : 'text-slate-600 fill-slate-800'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950/70 border border-white/10 my-3 text-center">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Score
            </div>
            <div className="text-lg sm:text-xl font-black font-mono text-white tabular-nums">
              {score.toLocaleString()}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Moves
            </div>
            <div className="text-lg sm:text-xl font-black font-mono text-amber-400 tabular-nums">
              {movesUsed}/{dailyConfig.maxMoves}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Time
            </div>
            <div className="text-lg sm:text-xl font-black font-mono text-sky-400 tabular-nums">
              {timeSeconds}s
            </div>
          </div>
        </div>

        {/* Streak banner */}
        {streak > 0 && isWon && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold font-['Outfit'] mb-3">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>{streak}-Day Challenge Streak Active!</span>
          </div>
        )}

        {/* Leaderboard Submission Box */}
        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-white/10 my-3 text-left">
          <div className="text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Enter Name for Daily Leaderboard:</span>
            {submittedRank && (
              <span className="text-amber-400 font-extrabold">Rank #{submittedRank}!</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              disabled={isSubmitted}
              maxLength={15}
              placeholder="Your Player Tag"
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold text-sm outline-none focus:border-amber-400"
            />
            <button
              onClick={handleSubmitScore}
              disabled={isSubmitted}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold font-['Outfit'] transition-all shadow-md cursor-pointer whitespace-nowrap ${
                isSubmitted
                  ? 'bg-emerald-500 text-slate-950 cursor-default'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 hover:scale-105 active:scale-95'
              }`}
            >
              {isSubmitted ? 'Submitted!' : 'Submit'}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={() => {
              onClose();
              onOpenLeaderboard();
            }}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>View Rankings</span>
          </button>

          <button
            onClick={handleShare}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Result</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Challenge</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs transition-all shadow-md cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
