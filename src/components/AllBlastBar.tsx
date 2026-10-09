import React from 'react';
import { Bomb, Sparkles, Palette } from 'lucide-react';
import { GameTheme, THEMES } from '../utils/themeConfig';

interface AllBlastBarProps {
  charge: number; // 0 to 100
  isBlasting: boolean;
  isMorphing: boolean;
  morphStep: number;
  totalMorphSteps: number;
  currentTheme: GameTheme;
  onTriggerAllBlast: () => void;
  onOpenSkinModal: () => void;
}

export const AllBlastBar: React.FC<AllBlastBarProps> = ({
  charge,
  isBlasting,
  isMorphing,
  morphStep,
  totalMorphSteps,
  currentTheme,
  onTriggerAllBlast,
  onOpenSkinModal,
}) => {
  const isCharged = charge >= 100;
  const currentMeta = THEMES[currentTheme] || THEMES.midnight;

  return (
    <div className="w-full max-w-[420px] mx-auto px-2 sm:px-3 py-1.5 select-none">
      <div className="flex items-center justify-between gap-2 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-2 sm:p-2.5 shadow-lg relative overflow-hidden">
        {/* Ambient background glow when charged or morphing */}
        {(isCharged || isMorphing) && (
          <div
            className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-300 animate-pulse"
            style={{ backgroundColor: currentMeta.accentColor }}
          />
        )}

        {/* Left: Blast Button & Charge Gauge */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold flex items-center gap-1.5 font-['Outfit'] tracking-wide text-slate-200">
              <Bomb className={`w-3.5 h-3.5 ${isCharged ? 'text-amber-400 animate-bounce' : 'text-slate-400'}`} />
              <span className="uppercase text-[11px]">All-Block Blast</span>
            </span>

            <span className="text-[11px] font-mono font-bold tabular-nums text-slate-400">
              {isCharged ? (
                <span className="text-amber-400 animate-pulse font-extrabold">READY!</span>
              ) : (
                `${Math.round(charge)}%`
              )}
            </span>
          </div>

          {/* Progress Track */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/5 relative">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isCharged
                  ? 'bg-gradient-to-r from-amber-400 via-rose-500 to-amber-300 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                  : 'bg-gradient-to-r from-sky-500 to-indigo-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(8, charge))}%` }}
            />
          </div>
        </div>

        {/* Center: Blast Trigger Button */}
        <button
          onClick={onTriggerAllBlast}
          disabled={isBlasting || isMorphing}
          className={`relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold font-['Outfit'] flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer ${
            isBlasting || isMorphing
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed scale-95'
              : isCharged
              ? 'bg-gradient-to-r from-amber-400 to-rose-500 hover:from-amber-300 hover:to-rose-400 text-slate-950 scale-105 shadow-[0_0_15px_rgba(251,191,36,0.5)] animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white border border-amber-400/30 hover:border-amber-400'
          }`}
          title="Blast all blocks on the board & trigger multi-skin morph!"
        >
          <span className="text-base sm:text-lg">💣</span>
          <span className="tracking-wide">
            {isBlasting
              ? 'BLASTING!'
              : isMorphing
              ? `MORPHING (${morphStep}/${totalMorphSteps})`
              : 'ALL BLAST!'}
          </span>
        </button>

        {/* Right: Skin Wardrobe Quick Button */}
        <button
          onClick={onOpenSkinModal}
          className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-white/10 hover:border-white/20 transition-all flex items-center gap-1 text-slate-200 shrink-0 cursor-pointer"
          title="Open Skin Wardrobe & Multi-Morph Settings"
        >
          <span className="text-base sm:text-lg">{currentMeta.icon}</span>
          <Palette className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
        </button>
      </div>

      {/* Morph Progress Notification Banner */}
      {isMorphing && (
        <div className="mt-1 text-center animate-bounce">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-amber-400/50 shadow-lg text-xs font-black font-['Outfit'] text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>
              ⚡ SKIN MORPH #{morphStep}/{totalMorphSteps}: {currentMeta.name.toUpperCase()} {currentMeta.icon}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
