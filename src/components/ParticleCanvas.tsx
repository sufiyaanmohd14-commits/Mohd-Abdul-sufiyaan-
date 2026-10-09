import React, { useEffect, useRef } from 'react';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
  shape: 'circle' | 'square' | 'spark';
  rotation: number;
  rotationSpeed: number;
}

export interface FloatingNotification {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
  scale: number;
}

interface ParticleCanvasProps {
  triggerBlast?: {
    x: number;
    y: number;
    color: string;
    count?: number;
  } | null;
}

export interface ParticleCanvasHandle {
  burstAt: (x: number, y: number, color: string, count?: number) => void;
  floatingText: (x: number, y: number, text: string, color?: string) => void;
  celebrate: () => void;
  megaBlast: (points: { x: number; y: number; color: string }[]) => void;
  themeShower: (colors: string[]) => void;
}

export const ParticleCanvas = React.forwardRef<ParticleCanvasHandle, ParticleCanvasProps>(
  (_, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const notificationsRef = useRef<FloatingNotification[]>([]);
    const animFrameRef = useRef<number | null>(null);

    // Expose imperative API for fast real-time bursts
    React.useImperativeHandle(ref, () => ({
      burstAt: (x: number, y: number, color: string, count = 18) => {
        const newParticles: Particle[] = [];
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 5 + 2;
          newParticles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.5,
            size: Math.random() * 4 + 3,
            color,
            alpha: 1,
            decay: Math.random() * 0.02 + 0.015,
            gravity: 0.15,
            shape: Math.random() > 0.4 ? 'square' : 'spark',
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.2,
          });
        }
        particlesRef.current.push(...newParticles);
      },

      floatingText: (x: number, y: number, text: string, color = '#FDE047') => {
        notificationsRef.current.push({
          id: Math.random().toString(),
          x,
          y,
          text,
          color,
          alpha: 1,
          vy: -2.2,
          scale: 1.4,
        });
      },

      celebrate: () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const colors = ['#38BDF8', '#34D399', '#FBBF24', '#F43F5E', '#A855F7', '#EC4899'];
        for (let i = 0; i < 60; i++) {
          const x = Math.random() * rect.width;
          const y = Math.random() * rect.height * 0.5;
          const color = colors[Math.floor(Math.random() * colors.length)];
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 6 + 3;
          particlesRef.current.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2,
            size: Math.random() * 6 + 3,
            color,
            alpha: 1,
            decay: Math.random() * 0.012 + 0.008,
            gravity: 0.12,
            shape: 'square',
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.3,
          });
        }
      },

      // Mega blast over all cells
      megaBlast: (points: { x: number; y: number; color: string }[]) => {
        const newParticles: Particle[] = [];
        points.forEach((pt) => {
          for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 7 + 3;
            newParticles.push({
              x: pt.x,
              y: pt.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - 2,
              size: Math.random() * 5 + 4,
              color: pt.color,
              alpha: 1,
              decay: Math.random() * 0.02 + 0.01,
              gravity: 0.16,
              shape: Math.random() > 0.5 ? 'square' : 'spark',
              rotation: Math.random() * Math.PI * 2,
              rotationSpeed: (Math.random() - 0.5) * 0.3,
            });
          }
        });
        particlesRef.current.push(...newParticles);
      },

      // Thematic particle shower when skin morphs
      themeShower: (colors: string[]) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const newParticles: Particle[] = [];
        for (let i = 0; i < 45; i++) {
          const x = Math.random() * rect.width;
          const y = Math.random() * rect.height * 0.6;
          const color = colors[Math.floor(Math.random() * colors.length)] || '#38BDF8';
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 5 + 2.5;
          newParticles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.5,
            size: Math.random() * 5 + 3,
            color,
            alpha: 1,
            decay: Math.random() * 0.016 + 0.012,
            gravity: 0.1,
            shape: Math.random() > 0.4 ? 'square' : 'spark',
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.25,
          });
        }
        particlesRef.current.push(...newParticles);
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const handleResize = () => {
        if (!canvas) return;
        canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      const render = () => {
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        const particles = particlesRef.current;
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.alpha -= p.decay;
          p.rotation += p.rotationSpeed;

          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;

          if (p.shape === 'square') {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          } else if (p.shape === 'spark') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        // Update and draw floating texts
        const texts = notificationsRef.current;
        for (let i = texts.length - 1; i >= 0; i--) {
          const t = texts[i];
          t.y += t.vy;
          t.alpha -= 0.018;
          t.scale = Math.max(1, t.scale - 0.01);

          if (t.alpha <= 0) {
            texts.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = Math.max(0, t.alpha);
          ctx.font = `bold ${Math.round(20 * t.scale)}px "Outfit", system-ui, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Text shadow
          ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
          ctx.shadowBlur = 6;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 2;

          ctx.fillStyle = t.color;
          ctx.fillText(t.text, t.x, t.y);
          ctx.restore();
        }

        animFrameRef.current = requestAnimationFrame(render);
      };

      animFrameRef.current = requestAnimationFrame(render);

      return () => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-40 w-full h-full"
      />
    );
  }
);

ParticleCanvas.displayName = 'ParticleCanvas';
