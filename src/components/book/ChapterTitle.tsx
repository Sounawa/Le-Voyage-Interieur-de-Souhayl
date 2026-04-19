'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

interface ChapterTitleProps {
  chapter: number;
  title: string;
  onComplete: () => void;
}

// Spiritual quotes per chapter
const spiritualQuotes: Record<number, string> = {
  0: '« Au commencement était la lumière du cœur »',
  1: '« Tel un voyageur, le cœur cherche sa demeure »',
  2: '« Dans le silence du désert, l\'âme parle »',
  3: '« Chaque épreuve est un miroir de l\'âme »',
  4: '« La vérité se révèle au sommet de soi »',
};

export default function ChapterTitle({ chapter, title, onComplete }: ChapterTitleProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 800);
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const chapterNames: Record<number, string> = {
    0: 'Prologue',
    1: 'Chapitre Premier',
    2: 'Chapitre Deux',
    3: 'Chapitre Trois',
    4: 'Chapitre Quatre',
  };

  // Generate burst particles as elongated streaks
  const burstParticles = useMemo(() => {
    const particles = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const distance = 60 + Math.random() * 80;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const duration = 0.8 + Math.random() * 0.6;
      const delay = 0.9 + Math.random() * 0.3;
      // Streak dimensions: elongated shape
      const width = 2 + Math.random() * 2;
      const height = 10 + Math.random() * 14;
      const rotation = angle * (180 / Math.PI) + (Math.random() - 0.5) * 30;
      particles.push({ tx, ty, duration, delay, width, height, rotation, angle: i });
    }
    return particles;
  }, []);

  const quote = spiritualQuotes[chapter];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-[#0a0a0f] cursor-pointer"
          onClick={() => {
            setShow(false);
            setTimeout(onComplete, 800);
          }}
        >
          {/* Vignette / gradient overlay around edges */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5,5,10,0.5) 70%, rgba(5,5,10,0.85) 100%)',
            }}
          />

          {/* Radial glow - circular behind chapter number */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-800/8 rounded-full blur-[100px]" />
          {/* Additional circular glow specifically behind chapter number area */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+30px)] w-[120px] h-[120px] bg-amber-700/10 rounded-full blur-[40px]" />

          <div className="relative z-10 text-center px-6">
            {/* Top ornament with Arabic decoration */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <div className="h-px w-16 sm:w-20 bg-gradient-to-r from-transparent to-amber-600/40" />
              <span className="text-amber-600/30 text-lg">&#10022;</span>
              <span className="text-amber-500/40 text-base">✶</span>
              <span className="text-amber-600/30 text-lg">&#10022;</span>
              <div className="h-px w-16 sm:w-20 bg-gradient-to-l from-transparent to-amber-600/40" />
            </motion.div>

            {/* Chapter number with spring overshoot */}
            <motion.p
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.5,
                duration: 0.9,
                type: 'spring',
                stiffness: 150,
                damping: 12,
              }}
              className="text-amber-600/70 text-sm uppercase tracking-[0.3em] font-serif mb-4 relative"
            >
              {/* Faint circular glow behind the chapter number */}
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-amber-700/6 blur-xl -z-10" />
              {chapterNames[chapter] || `Chapitre ${chapter}`}
            </motion.p>

            {/* Particle burst effect — elongated streaks with rotation */}
            {burstParticles.map((p) => (
              <motion.div
                key={p.angle}
                className="absolute top-1/2 left-1/2 pointer-events-none"
                style={{
                  width: p.width,
                  height: p.height,
                  background: `linear-gradient(to bottom, rgba(212, 165, 116, ${0.6 + Math.random() * 0.3}), transparent)`,
                  borderRadius: '2px',
                }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.5, rotate: 0 }}
                animate={{
                  x: p.tx,
                  y: p.ty,
                  opacity: [0, 0.9, 0],
                  scale: [0.5, 1.2, 0.3],
                  rotate: p.rotation,
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: 'easeOut',
                }}
              />
            ))}

            {/* Chapter title with spring animation */}
            <motion.h2
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.8,
                duration: 1,
                type: 'spring',
                stiffness: 120,
                damping: 14,
              }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl text-amber-100 font-bold"
              style={{ textShadow: '0 0 30px rgba(212, 165, 116, 0.2), 0 2px 4px rgba(0,0,0,0.3)' }}
            >
              {title}
            </motion.h2>

            {/* Spiritual quote in calligraphic style */}
            {quote && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 1.2 }}
                className="text-amber-600/45 text-sm sm:text-base font-serif italic mt-6 max-w-md mx-auto leading-relaxed"
                style={{ textShadow: '0 0 12px rgba(212, 165, 116, 0.08)' }}
              >
                {quote}
              </motion.p>
            )}

            {/* Bottom ornament */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex items-center justify-center gap-4 mt-8"
            >
              <div className="h-px w-16 sm:w-20 bg-gradient-to-r from-transparent to-amber-600/40" />
              <span className="text-amber-600/30 text-lg">&#10022;</span>
              <span className="text-amber-500/40 text-base">✶</span>
              <span className="text-amber-600/30 text-lg">&#10022;</span>
              <div className="h-px w-16 sm:w-20 bg-gradient-to-l from-transparent to-amber-600/40" />
            </motion.div>

            {/* Tap hint with bouncing hand emoji animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="mt-8 flex flex-col items-center gap-1"
            >
              <motion.span
                className="text-amber-600/35 text-lg"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                👆
              </motion.span>
              <motion.p
                className="text-amber-700/25 text-[10px] font-serif tracking-wide"
                animate={{ opacity: [0.25, 0.45, 0.25] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                Touchez pour continuer
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
