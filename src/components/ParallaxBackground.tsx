import React, { useEffect, useRef, useState, useMemo } from 'react';
import { GameTheme, THEMES } from '../utils/themeConfig';

export interface BlastEvent {
  id: number;
  color: string;
  x?: number; // Screen coordinate of blast origin
  y?: number;
  count?: number; // Number of lines or blocks cleared
}

interface ParallaxBackgroundProps {
  theme: GameTheme;
  enabled?: boolean;
  blastEvent: BlastEvent | null;
}

export const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  theme,
  enabled = true,
  blastEvent,
}) => {
  // Parallax smooth position state
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const targetCoords = useRef({ x: 0, y: 0 });
  const currentCoords = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  // Active blast ripples
  const [activeRipples, setActiveRipples] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      color: string;
      scale: number;
      opacity: number;
    }>
  >([]);

  // Flash illumination state on blast
  const [flashIntensity, setFlashIntensity] = useState<number>(0);
  const [flashColor, setFlashColor] = useState<string>('#38BDF8');

  const themeMeta = useMemo(() => THEMES[theme] || THEMES.midnight, [theme]);

  // Track blast events to trigger background color flash and shockwave ripples
  useEffect(() => {
    if (!blastEvent) return;

    setFlashColor(blastEvent.color || themeMeta.accentColor);
    setFlashIntensity(0.7);

    // Fade out background flash
    const timer = setTimeout(() => {
      setFlashIntensity(0);
    }, 450);

    // Create expanding shockwave ripple
    const originX = blastEvent.x ?? (typeof window !== 'undefined' ? window.innerWidth / 2 : 200);
    const originY = blastEvent.y ?? (typeof window !== 'undefined' ? window.innerHeight / 2 : 400);

    const newRipple = {
      id: blastEvent.id,
      x: originX,
      y: originY,
      color: blastEvent.color || themeMeta.accentColor,
      scale: 0.2,
      opacity: 0.85,
    };

    setActiveRipples((prev) => [...prev.slice(-3), newRipple]);

    // Clean up ripple after animation
    const rippleTimer = setTimeout(() => {
      setActiveRipples((prev) => prev.filter((r) => r.id !== blastEvent.id));
    }, 900);

    return () => {
      clearTimeout(timer);
      clearTimeout(rippleTimer);
    };
  }, [blastEvent, themeMeta]);

  // Mouse move and mobile orientation listeners
  useEffect(() => {
    if (!enabled) {
      targetCoords.current = { x: 0, y: 0 };
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      // Range: -1 to 1
      const nx = ((e.clientX / w) - 0.5) * 2;
      const ny = ((e.clientY / h) - 0.5) * 2;
      targetCoords.current = { x: nx, y: ny };
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      // gamma is left-to-right tilt in degrees [-90, 90]
      // beta is front-to-back tilt in degrees [-180, 180], normal hold angle is ~40-50 deg
      const nx = Math.max(-1, Math.min(1, e.gamma / 35));
      const ny = Math.max(-1, Math.min(1, (e.beta - 45) / 35));
      targetCoords.current = { x: nx, y: ny };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('deviceorientation', handleOrientation, { passive: true });

    // Smooth lerp loop
    const updateLerp = () => {
      const lerpFactor = 0.06;
      currentCoords.current.x += (targetCoords.current.x - currentCoords.current.x) * lerpFactor;
      currentCoords.current.y += (targetCoords.current.y - currentCoords.current.y) * lerpFactor;

      setCoords({
        x: currentCoords.current.x,
        y: currentCoords.current.y,
      });

      rafId.current = requestAnimationFrame(updateLerp);
    };

    rafId.current = requestAnimationFrame(updateLerp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [enabled]);

  // Generate deterministic floating dust/sparkle particles based on theme
  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: ((i * 37) % 95) + 2.5, // 2.5% to 97.5%
      y: ((i * 53) % 92) + 4,
      size: (i % 3 === 0 ? 4 : i % 2 === 0 ? 3 : 2),
      delay: (i * 0.4) % 4,
      duration: 3 + (i % 4),
      opacity: 0.2 + ((i % 5) * 0.1),
    }));
  }, []);

  // Parallax offsets for different layers (in pixels)
  const layer1X = coords.x * -18;
  const layer1Y = coords.y * -18;

  const layer2X = coords.x * 32;
  const layer2Y = coords.y * 32;

  const layer3X = coords.x * 48;
  const layer3Y = coords.y * 48;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* 1. Deep Ambient Blast Flash Illumination */}
      <div
        className="absolute inset-0 transition-opacity duration-500 ease-out"
        style={{
          backgroundColor: flashColor,
          opacity: flashIntensity * 0.22,
          mixBlendMode: 'screen',
        }}
      />

      {/* 2. Layer 1: Deep Distant Gradient Orbs (Smooth Parallax Shift) */}
      <div
        className="absolute inset-0 transition-transform duration-100 ease-out will-change-transform"
        style={{
          transform: `translate3d(${layer1X}px, ${layer1Y}px, 0)`,
        }}
      >
        {/* Top-left radiant atmospheric orb */}
        <div
          className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full blur-[90px] transition-colors duration-1000 ease-out"
          style={{
            backgroundColor: themeMeta.accentColor,
            opacity: 0.18,
          }}
        />

        {/* Bottom-right dynamic orb */}
        <div
          className="absolute -bottom-36 -right-36 w-[38rem] h-[38rem] rounded-full blur-[100px] transition-colors duration-1000 ease-out"
          style={{
            backgroundColor: themeMeta.secondaryColor,
            opacity: 0.16,
          }}
        />

        {/* Center ambient glow that pulses on blast */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full blur-[80px] transition-all duration-700 ease-out"
          style={{
            backgroundColor: flashIntensity > 0 ? flashColor : themeMeta.accentColor,
            opacity: flashIntensity > 0 ? 0.3 : 0.09,
            transform: `translate(-50%, -50%) scale(${flashIntensity > 0 ? 1.35 : 1})`,
          }}
        />
      </div>

      {/* 3. Layer 2: Geometric Dot Grid with 3D Parallax Tilt */}
      <div
        className="absolute inset-0 transition-transform duration-150 ease-out opacity-[0.06] will-change-transform"
        style={{
          transform: `translate3d(${layer2X * 0.4}px, ${layer2Y * 0.4}px, 0)`,
          backgroundImage: `radial-gradient(circle at 1px 1px, ${themeMeta.accentColor} 1px, transparent 0)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* 4. Layer 3: Midground Theme-Responsive Floating Particles / Stars */}
      <div
        className="absolute inset-0 transition-transform duration-150 ease-out will-change-transform"
        style={{
          transform: `translate3d(${layer2X}px, ${layer2Y}px, 0)`,
        }}
      >
        {particles.map((p) => {
          const color = themeMeta.particleColors[p.id % themeMeta.particleColors.length];
          return (
            <div
              key={p.id}
              className="absolute rounded-full transition-colors duration-700 ease-out animate-pulse"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: color,
                opacity: p.opacity,
                boxShadow: `0 0 8px ${color}`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          );
        })}
      </div>

      {/* 5. Expanding Blast Shockwave Ripples (Expanding outward across the background) */}
      {activeRipples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Shockwave Glow Wave 1 */}
          <div
            className="rounded-full border border-current animate-ping"
            style={{
              width: '160px',
              height: '160px',
              borderColor: ripple.color,
              boxShadow: `0 0 35px ${ripple.color}, inset 0 0 25px ${ripple.color}`,
              animationDuration: '0.8s',
              animationIterationCount: '1',
            }}
          />
          {/* Shockwave Radial Burst Ring */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-sm"
            style={{
              width: '320px',
              height: '320px',
              background: `radial-gradient(circle, transparent 40%, ${ripple.color}40 70%, transparent 90%)`,
              animation: 'spin 4s linear infinite',
            }}
          />
        </div>
      ))}

      {/* 6. Foreground Ambient Sheen & Vignette */}
      <div
        className="absolute inset-0 transition-transform duration-200 ease-out pointer-events-none"
        style={{
          transform: `translate3d(${layer3X * 0.25}px, ${layer3Y * 0.25}px, 0)`,
          background: 'radial-gradient(circle at 50% 50%, transparent 60%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  );
};
