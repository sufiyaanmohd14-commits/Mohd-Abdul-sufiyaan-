import React from 'react';

interface CrownScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  labelText?: string;
  className?: string;
  isNewBest?: boolean;
}

export const CrownIcon: React.FC<{ className?: string; sizePx?: number }> = ({
  className = '',
  sizePx = 36,
}) => {
  const heightPx = Math.round(sizePx * 0.78);
  const idSuffix = React.useId().replace(/:/g, '');

  return (
    <svg
      width={sizePx}
      height={heightPx}
      viewBox="0 0 52 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none filter drop-shadow-[0_3px_3px_rgba(0,0,0,0.55)] ${className}`}
    >
      <defs>
        {/* Main Body Gradient: Radiant Gold to Rich Amber */}
        <linearGradient
          id={`crownBodyGrad_${idSuffix}`}
          x1="26"
          y1="9"
          x2="26"
          y2="38"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="28%" stopColor="#FACC15" />
          <stop offset="70%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>

        {/* Base Rim Gradient */}
        <linearGradient
          id={`crownRimGrad_${idSuffix}`}
          x1="26"
          y1="32"
          x2="26"
          y2="39"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#A16207" />
        </linearGradient>

        {/* Pearl Sphere Radial Gradients with 3D Specular Highlight */}
        <radialGradient
          id={`pearlCenter_${idSuffix}`}
          cx="24.5"
          cy="8.5"
          r="5"
          fx="23.5"
          fy="7"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#FDE047" />
          <stop offset="75%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#B45309" />
        </radialGradient>

        <radialGradient
          id={`pearlLeft_${idSuffix}`}
          cx="9.5"
          cy="15"
          r="4.5"
          fx="8.5"
          fy="13.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#FDE047" />
          <stop offset="75%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#B45309" />
        </radialGradient>

        <radialGradient
          id={`pearlRight_${idSuffix}`}
          cx="42.5"
          cy="15"
          r="4.5"
          fx="41.5"
          fy="13.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#FDE047" />
          <stop offset="75%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#B45309" />
        </radialGradient>
      </defs>

      {/* Main Crown Body */}
      <path
        d="M 9.5 33.5 
           L 9 20 
           Q 17 28 26 15 
           Q 35 28 43 20 
           L 42.5 33.5 
           Z"
        fill={`url(#crownBodyGrad_${idSuffix})`}
      />

      {/* Inner highlight sheen on body */}
      <path
        d="M 12 33 
           L 11.5 22.5 
           Q 17.5 28.5 26 18 
           Q 34.5 28.5 40.5 22.5 
           L 40 33 
           Z"
        fill="white"
        fillOpacity="0.18"
      />

      {/* Center Pearl */}
      <circle cx="26" cy="10" r="5" fill={`url(#pearlCenter_${idSuffix})`} />

      {/* Left Pearl */}
      <circle cx="10" cy="16.5" r="4.3" fill={`url(#pearlLeft_${idSuffix})`} />

      {/* Right Pearl */}
      <circle cx="42" cy="16.5" r="4.3" fill={`url(#pearlRight_${idSuffix})`} />

      {/* Crown Base Bar with rounded ends */}
      <rect
        x="7.5"
        y="32.5"
        width="37"
        height="6.5"
        rx="3.25"
        fill={`url(#crownRimGrad_${idSuffix})`}
        stroke="#A16207"
        strokeWidth="0.8"
      />

      {/* Top highlight line on base bar */}
      <line
        x1="11"
        y1="34"
        x2="41"
        y2="34"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.45"
      />
    </svg>
  );
};

export const CrownScore: React.FC<CrownScoreProps> = ({
  score,
  size = 'md',
  showLabel = false,
  labelText = 'BEST',
  className = '',
  isNewBest = false,
}) => {
  // Size configurations
  const config = {
    sm: {
      crownSize: 24,
      textSize: 'text-base sm:text-lg',
      gap: 'gap-1.5',
      shadowDepth: '0 2px 0 #92400E, 0 3px 4px rgba(0,0,0,0.6)',
    },
    md: {
      crownSize: 32,
      textSize: 'text-xl sm:text-2xl',
      gap: 'gap-2',
      shadowDepth: '0 2.5px 0 #92400E, 0 4px 6px rgba(0,0,0,0.65)',
    },
    lg: {
      crownSize: 42,
      textSize: 'text-3xl sm:text-4xl',
      gap: 'gap-2.5',
      shadowDepth: '0 3.5px 0 #92400E, 0 5px 8px rgba(0,0,0,0.7)',
    },
    xl: {
      crownSize: 52,
      textSize: 'text-4xl sm:text-5xl',
      gap: 'gap-3',
      shadowDepth: '0 4.5px 0 #92400E, 0 6px 10px rgba(0,0,0,0.75)',
    },
  }[size];

  return (
    <div
      className={`inline-flex items-center select-none ${config.gap} ${className} ${
        isNewBest ? 'animate-bounce' : ''
      }`}
    >
      {showLabel && (
        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-400/90 font-['Outfit'] mr-0.5">
          {labelText}
        </span>
      )}

      {/* 3D Golden Crown Icon */}
      <CrownIcon sizePx={config.crownSize} className="shrink-0" />

      {/* 3D Embossed Golden Numerals matching the screenshot */}
      <span
        className={`font-['Outfit'] font-black tracking-tight leading-none tabular-nums ${config.textSize}`}
        style={{
          color: '#FACC15',
          textShadow: config.shadowDepth,
          letterSpacing: '-0.02em',
        }}
      >
        {score.toLocaleString()}
      </span>
    </div>
  );
};
