'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useStoryStore } from '@/store/story-store';

interface ProgressBarProps {
  currentPageId: string;
  totalPages: number;
}

const chapterOrder = [
  { id: 'prologue', label: 'Prologue', progress: 0.02, icon: '🌙' },
  { id: 'ch1', label: 'Chapitre 1 : La Découverte', progress: 0.18, icon: '🚪' },
  { id: 'ch2', label: 'Chapitre 2 : Le Désert de l\'Âme', progress: 0.38, icon: '🏜️' },
  { id: 'ch3', label: 'Chapitre 3 : La Forêt des Épreuves', progress: 0.60, icon: '🌲' },
  { id: 'ch4', label: 'Chapitre 4 : La Montagne de la Vérité', progress: 0.82, icon: '⛰️' },
  { id: 'ending', label: 'Fin', progress: 1.0, icon: '⭐' },
];

function getProgress(currentId: string): number {
  const lower = currentId.toLowerCase();
  for (const ch of chapterOrder) {
    if (lower.includes(ch.id)) return ch.progress;
  }
  return 0.01;
}

function getChapterInfo(currentId: string): { label: string; index: number } {
  const lower = currentId.toLowerCase();
  for (let i = 0; i < chapterOrder.length; i++) {
    if (lower.includes(chapterOrder[i].id)) {
      return { label: chapterOrder[i].label, index: i };
    }
  }
  return { label: '', index: -1 };
}

export default function ProgressBar({ currentPageId, totalPages }: ProgressBarProps) {
  const progress = getProgress(currentPageId);
  const { label, index: currentChapterIndex } = getChapterInfo(currentPageId);
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);
  const visitedPages = useStoryStore((s) => s.visitedPages);
  // Derive glow key from progress — animation restarts when progress changes
  const glowKey = Math.round(progress * 100);

  const pageCount = visitedPages.length;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Progress bar with shimmer */}
      <div className="h-1 w-full bg-black/30 backdrop-blur-sm relative overflow-hidden">
        <motion.div
          className="h-full progress-bar-shimmer relative"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          {/* Pulse glow effect when progress changes */}
          <motion.div
            key={glowKey}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-full rounded-full"
            initial={{ opacity: 0.9, scale: 1 }}
            animate={{ opacity: 0, scale: 3 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.6), transparent)',
            }}
          />
        </motion.div>
      </div>

      {/* Chapter label + milestone dots + page count */}
      <div className="bg-black/40 backdrop-blur-sm px-4 py-2">
        <div className="flex items-center justify-between">
          <span className="text-amber-200/70 text-xs font-serif tracking-wider uppercase">
            {label}
          </span>
          {/* Page count display */}
          <span className="text-amber-500/40 text-[10px] font-serif tracking-wide">
            Page {pageCount} / {totalPages}
          </span>
        </div>

        {/* Milestone dots row */}
        <div className="flex items-center justify-center gap-0 mt-1.5 relative">
          {/* Connecting line behind dots */}
          <div className="absolute top-1/2 left-[calc(12.5%-4px)] right-[calc(12.5%-4px)] h-px bg-amber-800/15 -translate-y-1/2" />

          {chapterOrder.map((ch, i) => {
            const isCompleted = currentChapterIndex > i;
            const isCurrent = currentChapterIndex === i;
            const isFuture = !isCompleted && !isCurrent;
            const isHovered = hoveredDot === i;

            return (
              <div
                key={ch.id}
                className="relative px-1.5 sm:px-2.5"
                onMouseEnter={() => setHoveredDot(i)}
                onMouseLeave={() => setHoveredDot(null)}
              >
                {/* Dot — larger on hover */}
                <motion.div
                  className={`rounded-full transition-colors duration-500 relative
                    ${isCompleted
                      ? 'bg-amber-500'
                      : isCurrent
                        ? 'bg-amber-400 milestone-dot-current'
                        : 'bg-amber-900/30 border border-amber-800/20'
                    }
                  `}
                  animate={{
                    width: isHovered ? 10 : 8,
                    height: isHovered ? 10 : 8,
                  }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  style={isCompleted ? { boxShadow: '0 0 4px rgba(251, 191, 36, 0.4)' } :
                    isCurrent ? { boxShadow: '0 0 6px rgba(251, 191, 36, 0.5)' } : undefined}
                />

                {/* Hover label tooltip with chapter icon */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-md bg-[#12111a]/95 backdrop-blur-md border border-amber-800/20 shadow-lg z-50 flex items-center gap-1.5"
                    >
                      <span className="text-sm">{ch.icon}</span>
                      <span className="text-amber-300/70 text-[10px] font-serif tracking-wide">
                        {ch.label}
                      </span>
                      {/* Tooltip arrow pointing down */}
                      <div
                        className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-[#12111a]/95"
                        style={{ borderTop: '1px solid rgba(139, 92, 42, 0.2)', borderLeft: '1px solid rgba(139, 92, 42, 0.2)' }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
