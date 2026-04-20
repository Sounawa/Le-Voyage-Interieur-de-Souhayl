'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '@/store/story-store';

interface Virtue {
  emoji: string;
  label: string;
  tags: string[];
  color: string;
  bgColor: string;
}

const virtues: Virtue[] = [
  {
    emoji: '🧡',
    label: 'Courage',
    tags: ['courage', 'boldness', 'perseverance'],
    color: 'text-orange-400/70',
    bgColor: 'bg-orange-500/40',
  },
  {
    emoji: '💜',
    label: 'Patience',
    tags: ['patience', 'caution'],
    color: 'text-purple-400/70',
    bgColor: 'bg-purple-500/40',
  },
  {
    emoji: '💚',
    label: 'Sagesse',
    tags: ['wisdom', 'discernment', 'awareness'],
    color: 'text-emerald-400/70',
    bgColor: 'bg-emerald-500/40',
  },
  {
    emoji: '💙',
    label: 'Douceur',
    tags: ['gentleness', 'sensitivity', 'empathy', 'kindness'],
    color: 'text-sky-400/70',
    bgColor: 'bg-sky-500/40',
  },
];

export default function VirtueMeter() {
  const chosenTags = useStoryStore((s) => s.chosenTags);

  const activeVirtues = useMemo(() => {
    return virtues
      .map((v) => {
        const points = v.tags.filter((tag) => chosenTags.includes(tag)).length;
        const maxPoints = v.tags.length;
        return { ...v, points, maxPoints };
      })
      .filter((v) => v.points > 0);
  }, [chosenTags]);

  if (activeVirtues.length === 0) return null;

  return (
    <div className="fixed bottom-16 left-4 z-20 virtue-glow">
      <AnimatePresence mode="popLayout">
        <div className="flex flex-col gap-1.5">
          {activeVirtues.map((virtue) => (
            <motion.div
              key={virtue.label}
              layout
              initial={{ opacity: 0, x: -10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.9 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
              className="virtue-card flex items-center gap-2 px-2 py-1 rounded-lg bg-black/30 backdrop-blur-sm border border-amber-900/10"
            >
              <span className="text-[10px] leading-none virtue-emoji-pulse">{virtue.emoji}</span>
              <span className={`text-[10px] font-serif ${virtue.color} opacity-70`}>
                {virtue.label}
              </span>
              {/* Progress dots */}
              <div className="flex gap-0.5 ml-0.5">
                {Array.from({ length: virtue.maxPoints }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={i < virtue.points ? { scale: 0 } : false}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
                    className={`w-2 h-2 rounded-full ${
                      i < virtue.points ? virtue.bgColor : 'bg-amber-900/20'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
