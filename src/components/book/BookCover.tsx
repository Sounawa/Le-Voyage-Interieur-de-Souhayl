'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { BookOpen, RotateCcw, Star } from 'lucide-react';
import { useStoryStore } from '@/store/story-store';

interface BookCoverProps {
  onStart: () => void;
}

// Ending type metadata
const ENDING_META: Record<string, { emoji: string; title: string }> = {
  light: { emoji: '🌅', title: 'La Lumière' },
  wisdom: { emoji: '📜', title: 'La Sagesse' },
  shadow: { emoji: '🌑', title: 'L\'Ombre' },
  pure: { emoji: '💎', title: 'La Pureté' },
};

// Floating star particle component
function FloatingStar({ delay, size, x, duration }: { delay: number; size: number; x: number; duration: number }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        bottom: '-5%',
        background: 'radial-gradient(circle, rgba(218, 165, 32, 0.6) 0%, rgba(218, 165, 32, 0) 70%)',
      }}
      initial={{ opacity: 0, y: 0 }}
      animate={{
        opacity: [0, 0.4, 0],
        y: [0, -100 - Math.random() * 200],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    />
  );
}

// 8-pointed star (Octagram) — Islamic geometric ornament
function IslamicOctagram({ size = 48, className = '' }: { size?: number; className?: string }) {
  const r = size / 2;
  const innerR = r * 0.45;
  const points: string[] = [];

  for (let i = 0; i < 8; i++) {
    const outerAngle = (Math.PI * 2 * i) / 8 - Math.PI / 2;
    const innerAngle = outerAngle + Math.PI / 8;
    points.push(`${r + r * Math.cos(outerAngle)},${r + r * Math.sin(outerAngle)}`);
    points.push(`${r + innerR * Math.cos(innerAngle)},${r + innerR * Math.sin(innerAngle)}`);
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className} fill="none">
      {/* Outer octagram */}
      <polygon points={points.join(' ')} stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
      {/* Inner rotated square */}
      <rect
        x={r * 0.55}
        y={r * 0.55}
        width={r * 0.9}
        height={r * 0.9}
        transform={`rotate(45, ${r}, ${r})`}
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
        opacity="0.3"
      />
      {/* Center diamond */}
      <polygon
        points={`${r},${r * 0.3} ${r * 1.7},${r} ${r},${r * 1.7} ${r * 0.3},${r}`}
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
        opacity="0.25"
      />
    </svg>
  );
}

// Sparkle effect for badges
function Sparkle({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <motion.span
      className="absolute text-[6px] pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        rotate: [0, 90, 180],
      }}
      transition={{
        duration: 1.8,
        delay,
        repeat: Infinity,
        repeatDelay: 2 + Math.random() * 2,
        ease: 'easeInOut',
      }}
    >
      ✦
    </motion.span>
  );
}

export default function BookCover({ onStart }: BookCoverProps) {
  const endingsFound = useStoryStore((s) => s.endingsFound);
  const hasStarted = useStoryStore((s) => s.hasStarted);
  const restart = useStoryStore((s) => s.restart);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const titleX = useTransform(mouseX, [-0.5, 0.5], [-6, 6]);
  const titleY = useTransform(mouseY, [-0.5, 0.5], [-4, 4]);

  // Cover tilt state for parallax
  const [tiltStyle, setTiltStyle] = useState({ transform: 'rotateX(0deg) rotateY(0deg)' });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    // Apply subtle tilt
    const rotateY = x * 4;
    const rotateX = -y * 3;
    setTiltStyle({ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` });
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    setTiltStyle({ transform: 'rotateX(0deg) rotateY(0deg)' });
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const handleStart = () => {
    useStoryStore.setState({ hasStarted: true });
    onStart();
  };

  const handleRestart = () => {
    restart();
    onStart();
  };

  // Generate star particles data
  const starParticles = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      delay: Math.random() * 8,
      size: 2 + Math.random() * 4,
      x: Math.random() * 100,
      duration: 6 + Math.random() * 8,
    }));
  }, []);

  // Generate title sparkle particles
  const titleSparkles = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 15 + Math.random() * 70,
      y: -5 + Math.random() * 15,
      delay: Math.random() * 3,
      duration: 2.5 + Math.random() * 2,
      drift: (Math.random() - 0.5) * 30,
    }));
  }, []);

  // Generate sparkle positions for badges
  const badgeSparkles = useMemo(() => {
    return endingsFound.map(() => [
      { x: -10, y: -20, delay: 0 },
      { x: 110, y: -15, delay: 0.8 },
      { x: 50, y: 120, delay: 1.5 },
    ]);
  }, [endingsFound]);

  // Subtle animated star field using canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create stars
    const stars: Array<{
      x: number; y: number; size: number; speed: number; opacity: number; phase: number;
    }> = [];
    for (let i = 0; i < 60; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 0.5 + Math.random() * 1.5,
        speed: 0.2 + Math.random() * 0.5,
        opacity: 0.1 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.speed + star.phase) * 0.3 + 0.7;
        const alpha = star.opacity * twinkle;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(218, 165, 32, ${alpha})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Mouse move handler for parallax
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <div ref={containerRef} className="cover-tilt min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Pulsing vignette overlay */}
      <div className="cover-vignette" />
      {/* Animated star field canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.6 }}
      />

      {/* Floating particles */}
      {starParticles.map((particle) => (
        <FloatingStar key={particle.id} {...particle} />
      ))}

      {/* Decorative geometric pattern background */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a574' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* 1. Breathing/pulsing central glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-amber-900/15 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.18, 1],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ translateX: '-50%', translateY: '-50%' }}
      />

      <motion.div
        ref={tiltRef}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="cover-tilt-inner relative z-10 text-center px-6 max-w-lg mx-auto"
        style={tiltStyle}
      >
        {/* 3. Islamic geometric ornament — top */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1, ease: 'easeOut' }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-amber-600/40" />
          <IslamicOctagram size={36} className="text-amber-600/50" />
          <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-amber-600/40" />
        </motion.div>

        {/* 5. Title with parallax/float on mouse move */}
        <div className="relative inline-block">
          {/* Floating sparkles around title */}
          {titleSparkles.map((s) => (
            <span
              key={s.id}
              className="sparkle-float-twinkle absolute text-[8px] pointer-events-none"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                '--delay': `${s.delay}s`,
                '--duration': `${s.duration}s`,
                color: 'rgba(218, 165, 32, 0.6)',
              } as React.CSSProperties}
            >
              ✦
            </span>
          ))}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            style={{
              textShadow: '0 0 40px rgba(212, 165, 116, 0.3)',
              x: titleX,
              y: titleY,
            }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-amber-100 mb-4 leading-tight will-change-transform"
          >
            Le Voyage Intérieur
            <br />
            <span className="text-amber-400">de Souhayl</span>
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-amber-300/60 font-serif text-lg sm:text-xl italic mb-1"
        >
          Tome 1 : L&apos;Éveil
        </motion.p>

        {/* 6. Animated shimmer gradient line under subtitle */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8, ease: 'easeOut' }}
          className="mx-auto mb-2 overflow-hidden"
          style={{ width: '120px' }}
        >
          <motion.div
            className="h-px w-full"
            style={{
              background: 'linear-gradient(90deg, transparent, #d4a574 30%, #fbbf24 50%, #d4a574 70%, transparent)',
              backgroundSize: '200% 100%',
            }}
            animate={{
              backgroundPosition: ['100% 0%', '-100% 0%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 1 }}
          className="text-amber-200/40 text-sm mb-12"
        >
          Une histoire spirituelle interactive
        </motion.p>

        {/* Ornamental divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-700/40" />
          <div className="w-2 h-2 bg-amber-700/40 rotate-45" />
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-700/40" />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 1 }}
          className="text-amber-100/50 text-sm leading-relaxed mb-10 max-w-sm mx-auto font-serif"
        >
          Souhayl a dix ans. Il rêve de comprendre le Tassawuf, 
          le chemin de la purification du cœur. Pour cela, il devra 
          pénétrer dans son monde intérieur et affronter son plus 
          grand ennemi : son propre ego.
        </motion.p>

        {/* 2. Start button with shimmer sweep + outer glow */}
        {!hasStarted ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="breathing-glow group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-800 to-amber-700 hover:from-amber-700 hover:to-amber-600 text-amber-100 font-serif text-lg rounded-lg transition-all duration-300 overflow-hidden"
          >
            {/* Shimmer sweep overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)',
                backgroundSize: '250% 100%',
              }}
              animate={{
                backgroundPosition: ['100% 0%', '-100% 0%'],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'linear',
                repeatDelay: 1.5,
              }}
            />
            {/* Soft outer glow border */}
            <div className="absolute inset-0 rounded-lg border border-amber-500/20" />
            <div
              className="absolute inset-[-1px] rounded-lg pointer-events-none"
              style={{
                boxShadow: '0 0 12px rgba(217, 119, 6, 0.1), inset 0 0 12px rgba(217, 119, 6, 0.05)',
              }}
            />
            <BookOpen className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Commencer l&apos;aventure</span>
          </motion.button>
        ) : (
          /* 4. Recommencer button — glass-like, muted, visually distinct */
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRestart}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-lg font-serif text-lg transition-all duration-300 overflow-hidden backdrop-blur-md"
            style={{
              background: 'rgba(120, 80, 40, 0.12)',
              border: '1px solid rgba(217, 119, 6, 0.18)',
              color: 'rgba(251, 191, 36, 0.75)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
            }}
          >
            {/* Subtle glass shimmer */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
                backgroundSize: '250% 100%',
              }}
              animate={{
                backgroundPosition: ['100% 0%', '-100% 0%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
                repeatDelay: 3,
              }}
            />
            <RotateCcw className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Recommencer le voyage</span>
          </motion.button>
        )}

        {/* 7. Endings found badges — sparkle effect + staggered entrance */}
        {endingsFound.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3, duration: 0.8 }}
            className="mt-8"
          >
            <p className="text-amber-400/50 text-xs mb-3 font-serif flex items-center justify-center gap-1.5">
              <Star className="w-3 h-3" />
              Fins découvertes : {endingsFound.length}/4
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {endingsFound.map((endingType, index) => {
                const meta = ENDING_META[endingType];
                if (!meta) return null;
                const sparkles = badgeSparkles[index] || [];
                return (
                  <motion.div
                    key={endingType}
                    initial={{ opacity: 0, scale: 0.6, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: 2.5 + index * 0.2,
                      duration: 0.5,
                      type: 'spring',
                      stiffness: 200,
                      damping: 15,
                    }}
                    className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-700/30 bg-amber-950/40"
                  >
                    {/* Sparkle effects per badge */}
                    {sparkles.map((sparkle, si) => (
                      <Sparkle
                        key={si}
                        delay={sparkle.delay + index * 0.5}
                        x={sparkle.x}
                        y={sparkle.y}
                      />
                    ))}
                    {/* Subtle pulse glow on badge */}
                    <motion.div
                      className="absolute inset-0 rounded-full pointer-events-none"
                      animate={{
                        boxShadow: [
                          '0 0 0px rgba(217, 119, 6, 0)',
                          '0 0 8px rgba(217, 119, 6, 0.15)',
                          '0 0 0px rgba(217, 119, 6, 0)',
                        ],
                      }}
                      transition={{
                        duration: 3,
                        delay: index * 0.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                    <span className="text-sm">{meta.emoji}</span>
                    <span className="text-amber-300/70 text-[11px] font-serif">{meta.title}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* 3. Islamic geometric ornament — bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="mt-12 flex items-center justify-center gap-4"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-800/30" />
          <IslamicOctagram size={24} className="text-amber-800/30" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-800/30" />
        </motion.div>
      </motion.div>
    </div>
  );
}
