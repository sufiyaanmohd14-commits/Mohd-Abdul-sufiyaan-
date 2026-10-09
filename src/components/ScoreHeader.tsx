import React from 'react';
import { Volume2, VolumeX, RotateCcw, HelpCircle, Palette } from 'lucide-react';
import { GameTheme, THEMES } from '../utils/themeConfig';
import { CrownScore } from './CrownScore';

interface ScoreHeaderProps {
  score: number;
  highScore: number;
  comboStreak: number;
  isMuted: boolean;
  theme: GameTheme;
  onToggleMute: () => void;
  onNewGame: () => void;
  onOpenRules: () => void;
  onOpenSkinModal: () => void;
  onCycleTheme: () => void;
}

export const ScoreHeader: React.FC<ScoreHeaderProps> = ({
  score,
  highScore,
  comboStreak,
  isMuted,
  theme,
  onToggleMute,
  onNewGame,
  onOpenRules,
  onOpenSkinModal,
  onCycleTheme: _onCycleTheme,
}) => {
  const currentThemeMeta = THEMES[theme] || THEMES.midnight;

  return (
    <header className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3 border-b border-white/10 select-none">
      {/* Zone 1: Wordmark & current theme badge */}
      <div className="flex items-center gap-2 sm:gap-3">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Outfit'] whitespace-nowrap shrink-0">
          Block<span className="text-amber-400">Blast</span>
        </h1>

        <button
          onClick={onOpenSkinModal}
          className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs cursor-pointer group"
          title="Click to change skin and configure Multi-Morph"
        >
          <span className="text-sm">{currentThemeMeta.icon}</span>
          <span className="text-[11px] font-bold text-slate-300 group-hover:text-amber-400 hidden sm:inline font-['Outfit']">
            {currentThemeMeta.name}
          </span>
        </button>

        {comboStreak > 1 && (
          <div className="hidden md:flex items-center gap-1.5 text-xs font-bold text-amber-400 animate-pulse">
            <span aria-hidden="true">·</span>
            <span>{comboStreak}x Streak</span>
          </div>
        )}
      </div>

      {/* Zone 2: Scores - Featuring Crown Best Score badge from screenshot */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        {/* Current Score */}
        <div className="flex flex-col items-center sm:items-end justify-center">
          <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase font-['Outfit']">
            SCORE
          </span>
          <span
            className="text-xl sm:text-2xl font-black font-['Outfit'] text-white tabular-nums leading-none tracking-tight"
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {score.toLocaleString()}
          </span>
        </div>

        <div className="h-6 w-px bg-white/15" aria-hidden="true" />

        {/* Best Score with Crown & 3D Gold Numerals */}
        <div className="flex flex-col items-center sm:items-start justify-center">
          <span className="text-[10px] font-black tracking-wider text-amber-400/90 uppercase font-['Outfit']">
            BEST
          </span>
          <CrownScore score={highScore} size="md" />
        </div>
      </div>

      {/* Zone 3: Functional interactive control buttons */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        <button
          onClick={onOpenSkinModal}
          title={`Skin Wardrobe (${currentThemeMeta.name})`}
          className="p-1.5 sm:p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Open Skin Wardrobe"
        >
          <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
        </button>

        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="p-1.5 sm:p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
          ) : (
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
          )}
        </button>

        <button
          onClick={onOpenRules}
          title="How to Play"
          className="p-1.5 sm:p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="How to Play Rules"
        >
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={onNewGame}
          className="px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Game</span>
        </button>
      </div>
    </header>
  );
};
