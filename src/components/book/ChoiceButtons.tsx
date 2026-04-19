'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Choice } from '@/lib/story-types';

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface ChoiceButtonsProps {
  choices: Choice[];
  onChoose: (choice: Choice) => void;
}

export default function ChoiceButtons({ choices, onChoose }: ChoiceButtonsProps) {
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [ripples, setRipples] = useState<Record<number, Ripple[]>>({});
  const rippleIdCounter = useRef(0);

  // Keyboard support: press 1, 2, or 3 to choose
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const num = parseInt(e.key);
    if (num >= 1 && num <= choices.length) {
      onChoose(choices[num - 1]);
    }
  }, [choices, onChoose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Parallax effect: subtle Y movement based on mouse position
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(${y * -3}px)`;
  }, []);

  const handleMouseLeave = useCallback((index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;
    card.style.transform = 'translateY(0px)';
  }, []);

  // Ripple effect on click
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>, choice: Choice) => {
    const card = cardRefs.current[choices.indexOf(choice)];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height);

    const rippleId = rippleIdCounter.current++;
    const index = choices.indexOf(choice);

    setRipples(prev => ({
      ...prev,
      [index]: [...(prev[index] || []), { id: rippleId, x, y, size }],
    }));

    // Clean up ripple after animation
    setTimeout(() => {
      setRipples(prev => ({
        ...prev,
        [index]: (prev[index] || []).filter(r => r.id !== rippleId),
      }));
    }, 700);

    onChoose(choice);
  }, [choices, onChoose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mt-8 space-y-4"
    >
      {/* Child-friendly message with floating animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="flex items-center justify-center gap-2 mb-6 float-bob"
      >
        <span className="text-amber-500/50 text-xs font-serif italic tracking-wide">
          ✦ Choisir avec le cœur — ce moment est unique ✦
        </span>
      </motion.div>

      {/* Choice cards with glass-morphism */}
      <div className="space-y-3">
        {choices.map((choice, index) => (
          <motion.button
            key={choice.id}
            ref={(el) => { cardRefs.current[index] = el; }}
            initial={{ opacity: 0, y: 15, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.2, duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
            whileHover={{
              scale: 1.02,
              x: 4,
              transition: { duration: 0.25 },
            }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => handleClick(e, choice)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => {
              setHoveredIndex(null);
              handleMouseLeave(index);
            }}
            onMouseMove={(e) => handleMouseMove(e, index)}
            className={`group choice-hover-enhanced relative w-full text-left px-5 py-4 sm:px-6 sm:py-5 rounded-xl overflow-hidden transition-all duration-400 active:scale-[0.98]
              ${hoveredIndex === index ? 'glass-card gradient-border' : 'glass-card'}`}
          >
            {/* Initial shimmer reveal animation */}
            <motion.div
              className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: 1.2 + index * 0.3, duration: 1 }}
            >
              <motion.div
                className="absolute inset-0"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ delay: 0.8 + index * 0.2, duration: 0.8, ease: 'easeInOut' }}
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(212, 165, 116, 0.1), transparent)',
                }}
              />
            </motion.div>

            {/* Animated gradient shimmer sweep on hover */}
            {hoveredIndex === index && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    backgroundPosition: ['200% 0%', '-200% 0%'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(218, 165, 32, 0.08), transparent)',
                    backgroundSize: '200% 100%',
                  }}
                />
              </motion.div>
            )}

            {/* Ripple effects */}
            {(ripples[index] || []).map((ripple) => (
              <span
                key={ripple.id}
                className="ripple-effect"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: ripple.size,
                  height: ripple.size,
                }}
              />
            ))}

            {/* Inner glow effect */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
              style={{
                boxShadow: 'inset 0 1px 0 rgba(212, 165, 116, 0.08), inset 0 0 20px rgba(212, 165, 116, 0.03)',
              }}
            />

            {/* Outer glow on hover */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
              style={{
                boxShadow: '0 0 20px rgba(212, 165, 116, 0.08), 0 0 40px rgba(212, 165, 116, 0.04)',
              }}
            />

            <div className="relative flex items-start gap-4">
              {/* Number indicator with decorative badge */}
              <div className="choice-badge choice-badge-ring shrink-0 w-7 h-7 rounded-full border border-amber-700/30 bg-amber-950/40 flex items-center justify-center mt-0.5">
                <span className="text-amber-500/60 text-xs font-serif font-bold group-hover:text-amber-400/80 transition-colors duration-300">
                  {index + 1}
                </span>
              </div>

              {/* Emoji/icon with sound wave equalizer */}
              <div className="flex items-center gap-1 shrink-0 mt-0.5">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                  {choice.emoji || ['🌙', '⚡', '✨'][index]}
                </span>
                {/* Sound wave visualization (3 bars) */}
                <div className="flex items-center gap-[2px] ml-1 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="eq-bar eq-bar-1" style={{ height: '3px' }} />
                  <span className="eq-bar eq-bar-2" style={{ height: '6px' }} />
                  <span className="eq-bar eq-bar-3" style={{ height: '4px' }} />
                </div>
              </div>

              {/* Text */}
              <p className="font-serif text-amber-100/90 text-base leading-relaxed group-hover:text-amber-50 transition-colors duration-300">
                {choice.text}
              </p>
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-amber-600/0 via-amber-500/30 to-amber-600/0 transition-all duration-400"
              style={{
                opacity: hoveredIndex === index ? 1 : 0,
              }}
            />
          </motion.button>
        ))}
      </div>

      {/* Keyboard hint with styled kbd elements */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="text-center text-amber-700/30 text-[10px] font-serif mt-4"
      >
        Appuyez sur {choices.map((_, i) => (
          <kbd key={i} className="kbd-key mx-0.5">
            {i + 1}
          </kbd>
        ))} pour choisir
      </motion.p>
    </motion.div>
  );
}
