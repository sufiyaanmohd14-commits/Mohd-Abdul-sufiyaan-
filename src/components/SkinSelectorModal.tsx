import React from 'react';
import { X, Sparkles, Check, Wand2, Palette, Compass } from 'lucide-react';
import { GameTheme, THEME_LIST, THEMES } from '../utils/themeConfig';

interface SkinSelectorModalProps {
  isOpen: boolean;
  currentTheme: GameTheme;
  morphTimes: number;
  autoMorphOnClears: boolean;
  autoBgColorOnBlast: boolean;
  parallaxEnabled: boolean;
  onSelectTheme: (theme: GameTheme) => void;
  onChangeMorphTimes: (times: number) => void;
  onToggleAutoMorphOnClears: () => void;
  onToggleAutoBgColorOnBlast: () => void;
  onToggleParallax: () => void;
  onTriggerMorphPreview: () => void;
  onClose: () => void;
}

export const SkinSelectorModal: React.FC<SkinSelectorModalProps> = ({
  isOpen,
  currentTheme,
  morphTimes,
  autoMorphOnClears,
  autoBgColorOnBlast,
  parallaxEnabled,
  onSelectTheme,
  onChangeMorphTimes,
  onToggleAutoMorphOnClears,
  onToggleAutoBgColorOnBlast,
  onToggleParallax,
  onTriggerMorphPreview,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl relative overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white font-['Outfit']">
                Block Skins & Dynamic Background
              </h3>
              <p className="text-xs text-slate-400">
                Choose themes, auto-change background on blast & enable interactive parallax!
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

        {/* Morph & Blast Reactive Options Toolbar */}
        <div className="p-3 sm:p-4 bg-slate-950/70 border-b border-white/10 shrink-0 space-y-2.5">
          {/* Morph count */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5 text-amber-400" />
              Morph Times on All-Block Blast:
            </span>
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/10">
              {[3, 5, 7, 10].map((count) => (
                <button
                  key={count}
                  onClick={() => onChangeMorphTimes(count)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    morphTimes === count
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {count}x Times
                </button>
              ))}
            </div>
          </div>

          {/* Background blast behavior toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/10">
            <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer select-none bg-slate-900/80 p-2 rounded-xl border border-white/5 hover:border-white/15 transition-colors">
              <input
                type="checkbox"
                checked={autoBgColorOnBlast}
                onChange={onToggleAutoBgColorOnBlast}
                className="rounded border-slate-700 text-amber-400 focus:ring-amber-400 w-4 h-4 bg-slate-900"
              />
              <div className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="font-semibold text-white">Auto Change BG on Blast</span>
              </div>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer select-none bg-slate-900/80 p-2 rounded-xl border border-white/5 hover:border-white/15 transition-colors">
              <input
                type="checkbox"
                checked={parallaxEnabled}
                onChange={onToggleParallax}
                className="rounded border-slate-700 text-amber-400 focus:ring-amber-400 w-4 h-4 bg-slate-900"
              />
              <div className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">Interactive Parallax Tilt</span>
              </div>
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoMorphOnClears}
                onChange={onToggleAutoMorphOnClears}
                className="rounded border-slate-700 text-amber-400 focus:ring-amber-400 w-4 h-4 bg-slate-900"
              />
              <span>Also trigger multi-morph on streak combos</span>
            </label>

            <button
              onClick={() => {
                onClose();
                setTimeout(() => onTriggerMorphPreview(), 150);
              }}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 text-xs font-extrabold rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>💥 Test Blast & BG Change</span>
            </button>
          </div>
        </div>


        {/* Scrollable Skins Grid */}
        <div className="p-3 sm:p-5 overflow-y-auto space-y-2.5 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {THEME_LIST.map((theme) => {
              const isSelected = currentTheme === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => onSelectTheme(theme.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_20px_rgba(251,191,36,0.2)] scale-[1.02]'
                      : 'border-white/10 bg-slate-800/40 hover:bg-slate-800/80 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{theme.icon}</span>
                      <div>
                        <div className="font-bold text-sm text-white flex items-center gap-1.5 font-['Outfit']">
                          {theme.name}
                          {isSelected && (
                            <span className="text-[10px] bg-amber-400 text-slate-900 font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                              Equipped
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">
                          {theme.subtitle}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Palette Swatches */}
                  <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider mr-1">
                      Palette:
                    </span>
                    {theme.particleColors.slice(0, 4).map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full border border-black/30 shadow-inner"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-900 border-t border-white/10 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            Active: <span className="font-bold text-white">{THEMES[currentTheme].name}</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
