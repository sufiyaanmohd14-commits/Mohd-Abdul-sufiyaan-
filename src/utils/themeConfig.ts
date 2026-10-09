export type GameTheme =
  | 'midnight'
  | 'cyber'
  | 'woodcraft'
  | 'cosmic'
  | 'lava'
  | 'ice'
  | 'emerald'
  | 'gold'
  | 'candy'
  | 'retro';

export interface ThemeMeta {
  id: GameTheme;
  name: string;
  subtitle: string;
  icon: string;
  accentColor: string;
  secondaryColor: string;
  boardBgClass: string;
  emptyCellClass: string;
  appBgClass: string;
  badgeClass: string;
  particleColors: string[];
  bannerGradient: string;
}

export const THEMES: Record<GameTheme, ThemeMeta> = {
  midnight: {
    id: 'midnight',
    name: 'Midnight Neon',
    subtitle: 'Deep obsidian with electric cyan & indigo aura',
    icon: '🌙',
    accentColor: '#38BDF8',
    secondaryColor: '#818CF8',
    boardBgClass:
      'bg-[#101422] border-[#222c44] shadow-[0_15px_35px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.06)]',
    emptyCellClass:
      'bg-[#192132]/80 border-[#28354f] shadow-[inset_0_2px_4px_rgba(0,0,0,0.55)]',
    appBgClass: 'bg-[#0b0e14] text-slate-100',
    badgeClass: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    particleColors: ['#38BDF8', '#818CF8', '#A78BFA', '#60A5FA', '#E0F2FE'],
    bannerGradient: 'from-sky-500 to-indigo-600',
  },
  cyber: {
    id: 'cyber',
    name: 'Cyberpunk 2099',
    subtitle: 'Hot laser pink, electric cyan & synthwave grid',
    icon: '⚡',
    accentColor: '#F43F5E',
    secondaryColor: '#06B6D4',
    boardBgClass:
      'bg-[#0a0c18] border-[#ff007f]/50 shadow-[0_0_30px_rgba(255,0,127,0.3),inset_0_0_15px_rgba(6,182,212,0.2)]',
    emptyCellClass:
      'bg-[#13172e] border-[#292e59] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]',
    appBgClass: 'bg-[#060814] text-pink-50',
    badgeClass: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    particleColors: ['#FF007F', '#00F0FF', '#FFE600', '#BD00FF', '#00FF66'],
    bannerGradient: 'from-fuchsia-500 to-cyan-500',
  },
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic Galaxy',
    subtitle: 'Interstellar nebula, violet starlight & cosmic dust',
    icon: '🌌',
    accentColor: '#C084FC',
    secondaryColor: '#38BDF8',
    boardBgClass:
      'bg-[#0b0920] border-[#8b5cf6]/50 shadow-[0_0_35px_rgba(139,92,246,0.35),inset_0_0_20px_rgba(192,132,252,0.18)]',
    emptyCellClass:
      'bg-[#17133f]/80 border-[#322975] shadow-[inset_0_2px_5px_rgba(0,0,0,0.65)]',
    appBgClass: 'bg-[#060417] text-purple-100',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    particleColors: ['#C084FC', '#A855F7', '#38BDF8', '#F472B6', '#E9D5FF'],
    bannerGradient: 'from-purple-500 to-indigo-500',
  },
  lava: {
    id: 'lava',
    name: 'Lava Magma',
    subtitle: 'Molten volcanic rock, fiery gold & fiery embers',
    icon: '🔥',
    accentColor: '#EF4444',
    secondaryColor: '#F97316',
    boardBgClass:
      'bg-[#190707] border-[#dc2626]/60 shadow-[0_0_35px_rgba(239,68,68,0.35),inset_0_0_20px_rgba(249,115,22,0.22)]',
    emptyCellClass:
      'bg-[#280c0c] border-[#521b1b] shadow-[inset_0_2px_5px_rgba(0,0,0,0.7)]',
    appBgClass: 'bg-[#0e0303] text-orange-100',
    badgeClass: 'bg-red-500/20 text-red-400 border-red-500/30',
    particleColors: ['#EF4444', '#F97316', '#FBBF24', '#FF4500', '#F87171'],
    bannerGradient: 'from-red-600 to-orange-500',
  },
  ice: {
    id: 'ice',
    name: 'Ice Crystal',
    subtitle: 'Sub-zero glacial frost, diamond ice & winter shine',
    icon: '💎',
    accentColor: '#38BDF8',
    secondaryColor: '#E0F2FE',
    boardBgClass:
      'bg-[#061524] border-[#38bdf8]/50 shadow-[0_0_35px_rgba(56,189,248,0.3),inset_0_0_20px_rgba(224,242,254,0.18)]',
    emptyCellClass:
      'bg-[#0c2438]/85 border-[#1b4466] shadow-[inset_0_2px_4px_rgba(0,0,0,0.55)]',
    appBgClass: 'bg-[#020b14] text-cyan-100',
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    particleColors: ['#38BDF8', '#7DD3FC', '#BAE6FD', '#E0F2FE', '#FFFFFF'],
    bannerGradient: 'from-cyan-400 to-blue-600',
  },
  gold: {
    id: 'gold',
    name: 'Golden Royale',
    subtitle: 'Liquid 24K pure gold with velvet onyx richness',
    icon: '👑',
    accentColor: '#F59E0B',
    secondaryColor: '#FDE047',
    boardBgClass:
      'bg-[#171206] border-[#eab308]/60 shadow-[0_0_35px_rgba(234,179,8,0.35),inset_0_0_20px_rgba(253,224,71,0.18)]',
    emptyCellClass:
      'bg-[#261d0a] border-[#4d3a14] shadow-[inset_0_2px_5px_rgba(0,0,0,0.65)]',
    appBgClass: 'bg-[#0b0802] text-amber-100',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    particleColors: ['#F59E0B', '#EAB308', '#FDE047', '#FEF08A', '#FFFFFF'],
    bannerGradient: 'from-amber-400 to-yellow-600',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Forest',
    subtitle: 'Lush rainforest jade with radiant bamboo shimmer',
    icon: '🌿',
    accentColor: '#10B981',
    secondaryColor: '#34D399',
    boardBgClass:
      'bg-[#051c12] border-[#059669]/50 shadow-[0_0_35px_rgba(16,185,129,0.3),inset_0_0_15px_rgba(52,211,153,0.18)]',
    emptyCellClass:
      'bg-[#0b2b1d] border-[#16563c] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]',
    appBgClass: 'bg-[#030f09] text-emerald-100',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    particleColors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#FBBF24'],
    bannerGradient: 'from-emerald-400 to-teal-600',
  },
  woodcraft: {
    id: 'woodcraft',
    name: 'Cozy Timber',
    subtitle: 'Polished handcrafted walnut & warm fireside glow',
    icon: '🪵',
    accentColor: '#F59E0B',
    secondaryColor: '#D97706',
    boardBgClass:
      'bg-[#28160e] border-[#5c3a21] shadow-[0_15px_35px_rgba(0,0,0,0.65),inset_0_2px_4px_rgba(255,255,255,0.08)]',
    emptyCellClass:
      'bg-[#1c0f0a] border-[#382013] shadow-[inset_0_2px_4px_rgba(0,0,0,0.65)]',
    appBgClass: 'bg-[#150b06] text-amber-100',
    badgeClass: 'bg-amber-600/20 text-amber-300 border-amber-600/30',
    particleColors: ['#F59E0B', '#D97706', '#B45309', '#FEF3C7', '#E2A962'],
    bannerGradient: 'from-amber-600 to-orange-700',
  },
  candy: {
    id: 'candy',
    name: 'Candy Pop',
    subtitle: 'Bubblegum sugar rush with rainbow sweet sprinkles',
    icon: '🍬',
    accentColor: '#EC4899',
    secondaryColor: '#8B5CF6',
    boardBgClass:
      'bg-[#1d0b1a] border-[#f472b6]/50 shadow-[0_0_35px_rgba(236,72,153,0.35),inset_0_0_15px_rgba(244,114,182,0.18)]',
    emptyCellClass:
      'bg-[#2d122a] border-[#54214e] shadow-[inset_0_2px_4px_rgba(0,0,0,0.55)]',
    appBgClass: 'bg-[#10050e] text-pink-100',
    badgeClass: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    particleColors: ['#EC4899', '#F472B6', '#A855F7', '#38BDF8', '#FDE047'],
    bannerGradient: 'from-pink-400 to-purple-500',
  },
  retro: {
    id: 'retro',
    name: 'Retro Arcade',
    subtitle: '1980s CRT phosphor screen with high-contrast scanlines',
    icon: '🕹️',
    accentColor: '#22C55E',
    secondaryColor: '#EAB308',
    boardBgClass:
      'bg-[#040904] border-[#22c55e]/50 shadow-[0_0_30px_rgba(34,197,94,0.3),inset_0_0_15px_rgba(34,197,94,0.15)]',
    emptyCellClass:
      'bg-[#081508] border-[#133213] shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)]',
    appBgClass: 'bg-[#020502] text-green-200 font-mono',
    badgeClass: 'bg-green-500/20 text-green-400 border-green-500/30',
    particleColors: ['#22C55E', '#4ADE80', '#86EFAC', '#EAB308', '#FFFFFF'],
    bannerGradient: 'from-green-500 to-emerald-600',
  },
};

export const THEME_LIST = Object.values(THEMES);

/**
 * Returns a distinct sequence of themes for the Multi-Skin Morph.
 * Cycles across distinct contrasting themes.
 */
export function getMorphThemeSequence(currentTheme: GameTheme, stepsCount: number = 5): GameTheme[] {
  const allIds: GameTheme[] = [
    'cyber',
    'cosmic',
    'lava',
    'ice',
    'gold',
    'emerald',
    'candy',
    'retro',
    'woodcraft',
    'midnight',
  ];

  // Filter out current theme from immediate next to ensure strong visual shift
  const pool = allIds.filter((t) => t !== currentTheme);
  // Shuffle pool deterministically or randomly
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  
  // Pick stepsCount items
  const sequence: GameTheme[] = [];
  for (let i = 0; i < stepsCount; i++) {
    sequence.push(shuffled[i % shuffled.length]);
  }
  return sequence;
}

/**
 * Automatically cycles to the next distinct theme when blocks blast
 */
export function getNextBlastTheme(currentTheme: GameTheme): GameTheme {
  const blastThemeOrder: GameTheme[] = [
    'midnight',
    'cyber',
    'cosmic',
    'lava',
    'ice',
    'gold',
    'emerald',
    'candy',
    'retro',
    'woodcraft',
  ];
  const idx = blastThemeOrder.indexOf(currentTheme);
  return blastThemeOrder[(idx + 1) % blastThemeOrder.length];
}
