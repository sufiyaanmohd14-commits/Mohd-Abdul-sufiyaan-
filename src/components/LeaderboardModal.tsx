import React, { useState, useEffect } from 'react';
import { X, Trophy, Medal, Star, Share2, Check, User, Clock, Flame } from 'lucide-react';
import { LeaderboardEntry } from '../types/game';
import {
  getDailyLeaderboard,
  getSavedPlayerName,
  savePlayerName,
  getDailyStreak,
} from '../utils/leaderboardStorage';
import { getTodayDateKey, getRelativeDateKey } from '../utils/dailyPuzzle';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateKey?: string;
  userScore?: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  dateKey: initialDateKey,
  userScore: _userScore,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(initialDateKey || getTodayDateKey());
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState<string>(() => getSavedPlayerName());
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      const activeDate = initialDateKey || getTodayDateKey();
      setSelectedDate(activeDate);
      setEntries(getDailyLeaderboard(activeDate));
      setPlayerName(getSavedPlayerName());
      setStreak(getDailyStreak());
    }
  }, [isOpen, initialDateKey]);

  useEffect(() => {
    setEntries(getDailyLeaderboard(selectedDate));
  }, [selectedDate]);

  if (!isOpen) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setPlayerName(newName);
    savePlayerName(newName);
  };

  const currentUserEntry = entries.find((e) => e.isCurrentUser);

  const handleShare = async () => {
    const text = currentUserEntry
      ? `🧩 Block Blast Daily (${selectedDate})\n⭐ Stars: ${'⭐'.repeat(currentUserEntry.stars)}\n🏆 Score: ${currentUserEntry.score.toLocaleString()} pts (${currentUserEntry.movesUsed} moves)\nRank: #${currentUserEntry.rank || 1} on the Daily Leaderboard!\nPlay now!`
      : `🧩 Block Blast Daily Challenge (${selectedDate})\nCan you beat the daily pre-set grid configuration on the leaderboard? Play now!`;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2200);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 text-slate-950 flex items-center justify-center font-black shadow-md">
          <Medal className="w-4 h-4 fill-amber-950" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 flex items-center justify-center font-black shadow-md">
          <Medal className="w-4 h-4 fill-slate-800" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-amber-600 to-amber-800 text-white flex items-center justify-center font-black shadow-md">
          <Medal className="w-4 h-4 fill-amber-200" />
        </div>
      );
    }
    return (
      <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-mono font-bold border border-white/5">
        #{rank}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-900/95">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white font-['Outfit'] flex items-center gap-2">
                Daily Leaderboard
                {streak > 0 && (
                  <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono flex items-center gap-0.5">
                    <Flame className="w-3 h-3 fill-amber-400" /> {streak}d
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Compete on the global pre-generated daily grid challenge!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Date Selector & Name Bar */}
        <div className="p-3 sm:p-4 bg-slate-950/70 border-b border-white/10 shrink-0 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            {/* Date Switcher */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setSelectedDate(getTodayDateKey())}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedDate === getTodayDateKey()
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setSelectedDate(getRelativeDateKey(-1))}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedDate === getRelativeDateKey(-1)
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Yesterday
              </button>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-['Outfit'] border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Share Score</span>
                </>
              )}
            </button>
          </div>

          {/* Player Name Edit Field */}
          <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-400 font-medium">Player Tag:</span>
            <input
              type="text"
              value={playerName}
              onChange={handleNameChange}
              maxLength={15}
              placeholder="Your Name"
              className="bg-transparent text-white font-bold outline-none flex-1 min-w-0"
            />
          </div>
        </div>

        {/* Scrollable Leaderboard List */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-2 flex-1">
          {entries.map((entry, idx) => {
            const isUser = entry.isCurrentUser;
            return (
              <div
                key={entry.id || idx}
                className={`p-2.5 sm:p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                  isUser
                    ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_15px_rgba(251,191,36,0.2)] scale-[1.01]'
                    : 'border-white/5 bg-slate-800/40 hover:bg-slate-800/70'
                }`}
              >
                {/* Left: Rank & Player Info */}
                <div className="flex items-center gap-2.5 min-w-0">
                  {getRankBadge(entry.rank || idx + 1)}

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 font-['Outfit']">
                      <span className="text-base">{entry.avatar}</span>
                      <span
                        className={`font-bold text-sm truncate ${
                          isUser ? 'text-amber-300 font-extrabold' : 'text-white'
                        }`}
                      >
                        {isUser ? playerName : entry.playerName}
                      </span>
                      {isUser && (
                        <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                          YOU
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {entry.timeSeconds}s
                      </span>
                      <span>•</span>
                      <span>{entry.movesUsed} moves</span>
                      {entry.badge && (
                        <>
                          <span>•</span>
                          <span className="text-slate-400 hidden sm:inline">{entry.badge}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Score & Stars */}
                <div className="text-right shrink-0">
                  <div className="text-base sm:text-lg font-black font-mono text-white tabular-nums">
                    {entry.score.toLocaleString()}
                  </div>
                  <div className="flex items-center justify-end gap-0.5">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < entry.stars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600 fill-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-900/90 border-t border-white/10 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            {currentUserEntry ? (
              <span>
                Your Standing:{' '}
                <span className="font-extrabold text-amber-400">
                  #{currentUserEntry.rank || 1}
                </span>{' '}
                ({currentUserEntry.score.toLocaleString()} pts)
              </span>
            ) : (
              <span>Complete today's puzzle to rank on the leaderboard!</span>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
