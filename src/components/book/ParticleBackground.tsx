'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { MoodType } from '@/lib/story-types';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  fadeSpeed: number;
  phase: number;
}

interface ParticleBackgroundProps {
  mood?: MoodType;
}

const moodConfigs: Record<string, {
  color: [number, number, number];
  coreColor: [number, number, number];
  density: number;
  glowIntensity: number;
}> = {
  wonder: {
    color: [232, 190, 100],
    coreColor: [255, 240, 180],
    density: 80,
    glowIntensity: 1.2,
  },
  darkness: {
    color: [100, 120, 200],
    coreColor: [150, 170, 255],
    density: 50,
    glowIntensity: 0.8,
  },
  wisdom: {
    color: [200, 180, 90],
    coreColor: [240, 230, 170],
    density: 60,
    glowIntensity: 1.0,
  },
  danger: {
    color: [200, 100, 60],
    coreColor: [255, 160, 120],
    density: 70,
    glowIntensity: 1.1,
  },
  peace: {
    color: [100, 200, 170],
    coreColor: [180, 240, 220],
    density: 55,
    glowIntensity: 0.9,
  },
  triumph: {
    color: [220, 180, 80],
    coreColor: [255, 230, 150],
    density: 90,
    glowIntensity: 1.3,
  },
  prologue: {
    color: [200, 165, 100],
    coreColor: [240, 220, 180],
    density: 65,
    glowIntensity: 1.0,
  },
  ending: {
    color: [230, 210, 170],
    coreColor: [255, 245, 230],
    density: 85,
    glowIntensity: 1.4,
  },
};

const defaultMoodConfig = {
  color: [212, 165, 116] as [number, number, number],
  coreColor: [255, 230, 200] as [number, number, number],
  density: 65,
  glowIntensity: 1.0,
};

export default function ParticleBackground({ mood }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const moodRef = useRef(mood);

  const createParticle = useCallback((width: number, height: number, startY?: number): Particle => ({
    x: Math.random() * width,
    y: startY !== undefined ? startY : Math.random() * height,
    size: Math.random() * 2 + 0.3,
    speedX: (Math.random() - 0.5) * 0.15,
    speedY: -Math.random() * 0.35 - 0.08,
    opacity: Math.random() * 0.4 + 0.05,
    fadeSpeed: Math.random() * 0.003 + 0.001,
    phase: Math.random() * Math.PI * 2,
  }), []);

  useEffect(() => {
    moodRef.current = mood;
  }, [mood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const config = moodConfigs[mood || ''] || defaultMoodConfig;
    const count = Math.min(config.density, Math.floor((canvas.width * canvas.height) / 18000));
    for (let i = 0; i < count; i++) {
      particlesRef.current.push(createParticle(canvas.width, canvas.height));
    }

    // Smooth color transition tracking
    let currentColor: [number, number, number] = [...config.color];
    let currentCore: [number, number, number] = [...config.coreColor];
    let targetColor: [number, number, number] = [...config.color];
    let targetCore: [number, number, number] = [...config.coreColor];

    // Watch for mood changes
    const intervalId = setInterval(() => {
      const newConfig = moodConfigs[moodRef.current || ''] || defaultMoodConfig;
      targetColor = [...newConfig.color];
      targetCore = [...newConfig.coreColor];
    }, 500);

    let time = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smoothly transition colors
      currentColor[0] = lerp(currentColor[0], targetColor[0], 0.02);
      currentColor[1] = lerp(currentColor[1], targetColor[1], 0.02);
      currentColor[2] = lerp(currentColor[2], targetColor[2], 0.02);
      currentCore[0] = lerp(currentCore[0], targetCore[0], 0.02);
      currentCore[1] = lerp(currentCore[1], targetCore[1], 0.02);
      currentCore[2] = lerp(currentCore[2], targetCore[2], 0.02);

      const [cr, cg, cb] = currentColor;
      const [rr, rg, rb] = currentCore;

      particlesRef.current.forEach((p, i) => {
        p.x += p.speedX + Math.sin(time + p.phase) * 0.08;
        p.y += p.speedY;

        const breathOpacity = p.opacity + Math.sin(time * 0.5 + p.phase) * 0.08;
        const finalOpacity = Math.max(0.02, Math.min(0.5, breathOpacity));

        if (p.y < -20 || p.x < -20 || p.x > canvas.width + 20) {
          particlesRef.current[i] = createParticle(canvas.width, canvas.height, canvas.height + 20);
        }

        // Main particle - soft glow
        const glowSize = p.size * 4;
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
        gradient.addColorStop(0, `rgba(${Math.round(cr)}, ${Math.round(cg)}, ${Math.round(cb)}, ${finalOpacity})`);
        gradient.addColorStop(0.3, `rgba(${Math.round(cr)}, ${Math.round(cg)}, ${Math.round(cb)}, ${finalOpacity * 0.4})`);
        gradient.addColorStop(1, `rgba(${Math.round(cr)}, ${Math.round(cg)}, ${Math.round(cb)}, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Bright core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.round(rr)}, ${Math.round(rg)}, ${Math.round(rb)}, ${finalOpacity * 0.8})`;
        ctx.fill();
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
      clearInterval(intervalId);
    };
  }, [createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7, transition: 'opacity 1s ease' }}
    />
  );
}
