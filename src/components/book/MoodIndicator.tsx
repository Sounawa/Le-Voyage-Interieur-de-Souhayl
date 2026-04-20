'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { MoodType } from '@/lib/story-types';

const moodConfig: Record<MoodType, { emoji: string; label: string }> = {
  prologue: { emoji: '🌟', label: 'Prologue' },
  wonder: { emoji: '✨', label: 'Émerveillement' },
  darkness: { emoji: '🌑', label: 'Obscurité' },
  wisdom: { emoji: '📜', label: 'Sagesse' },
  danger: { emoji: '⚠️', label: 'Danger' },
  peace: { emoji: '🕊️', label: 'Paix' },
  triumph: { emoji: '🏆', label: 'Triomphe' },
  ending: { emoji: '🌅', label: 'Fin' },
};

interface MoodIndicatorProps {
  mood: MoodType;
}

export default function MoodIndicator({ mood }: MoodIndicatorProps) {
  const config = moodConfig[mood] || moodConfig.prologue;

  return (
    <div className="mood-indicator fixed bottom-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={mood}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
            bg-[#0d0c14]/50 backdrop-blur-md
            border border-amber-800/10
            shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
        >
          <span className="text-sm leading-none">{config.emoji}</span>
          <span className="text-amber-400/50 text-[10px] font-serif tracking-wide">
            {config.label}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
