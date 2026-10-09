import React from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 p-6 sm:p-7 shadow-2xl relative text-left">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit'] mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-400" />
          How to Play
        </h3>

        <div className="space-y-3.5 text-xs sm:text-sm text-slate-300">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-white/5">
            <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">1. Drag & Drop Blocks</span>
              Pick any of the 3 polyomino shapes from the tray below and place them anywhere on the 8x8 grid. You can also tap a piece to select it, then tap a cell on the grid!
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-white/5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">2. Clear Rows & Columns</span>
              Completely fill entire horizontal rows or vertical columns to blast them away. Rows and columns clear simultaneously!
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-white/5">
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">3. Multi-Line & Streak Combos</span>
              Clearing multiple lines at once earns massive score bonuses. Clearing lines on consecutive turns maintains your Combo Streak multiplier!
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-white/5">
            <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">4. Refill & Game Over</span>
              When all 3 shapes in your tray are placed, 3 brand new shapes arrive. If none of the remaining pieces can fit on the board, the game ends.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-400/30">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 block">5. All-Block Blast, Auto BG Shifts & Parallax</span>
              Every time blocks blast, the background dynamically pulses and automatically shifts colors! Tap the 💣 <b>All-Block Blast</b> button or achieve a board-wide All-Clear to trigger a multi-skin morph. Enjoy subtle 3D parallax background depth as you tilt your device or move your cursor!
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-sm shadow transition-all cursor-pointer"
        >
          Got It, Let's Play!
        </button>
      </div>
    </div>
  );
};
