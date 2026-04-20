'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Lock } from 'lucide-react';
import { useStoryStore } from '@/store/story-store';
import { ACHIEVEMENTS, TOTAL_ACHIEVEMENTS, ACHIEVEMENT_IDS } from '@/lib/achievement-definitions';

interface AchievementsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AchievementsPanel({ isOpen, onClose }: AchievementsPanelProps) {
  const achievements = useStoryStore((s) => s.achievements);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const unlockedCount = achievements.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 sm:w-full sm:max-w-lg bg-[#0d0c14]/95 backdrop-blur-md border border-amber-800/20 rounded-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#0d0c14]/90 backdrop-blur-md px-6 py-4 border-b border-amber-800/15 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-amber-900/20">
                  <Trophy className="w-4 h-4 text-amber-400/80" />
                </div>
                <div>
                  <h2 className="font-serif text-lg text-amber-100 font-bold">Succès</h2>
                  <p className="text-amber-500/40 text-xs font-serif">
                    {unlockedCount} / {TOTAL_ACHIEVEMENTS} débloqués
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-amber-900/20 transition-colors"
                aria-label="Fermer les succès"
              >
                <X className="w-4 h-4 text-amber-200/50" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="px-6 pt-3 flex-shrink-0">
              <div className="w-full h-1.5 rounded-full bg-amber-950/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-700/60 via-amber-500/70 to-amber-400/80 transition-all duration-700 ease-out"
                  style={{ width: `${(unlockedCount / TOTAL_ACHIEVEMENTS) * 100}%` }}
                />
              </div>
            </div>

            {/* Achievement Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ACHIEVEMENT_IDS.map((id) => {
                  const achievement = ACHIEVEMENTS[id];
                  const isUnlocked = achievements.includes(id);

                  return (
                    <div
                      key={id}
                      className={`relative rounded-xl p-3 text-center transition-all duration-300 ${
                        isUnlocked
                          ? 'achievement-card-unlocked'
                          : 'achievement-card-locked'
                      }`}
                    >
                      {/* Emoji */}
                      <div className="text-3xl mb-2">
                        {isUnlocked ? (
                          achievement.emoji
                        ) : (
                          <span className="grayscale opacity-40">{achievement.emoji}</span>
                        )}
                      </div>

                      {/* Title */}
                      <h4
                        className={`font-serif text-xs font-bold leading-tight mb-1 ${
                          isUnlocked ? 'text-amber-200' : 'text-amber-500/30'
                        }`}
                      >
                        {isUnlocked ? achievement.title : '???'}
                      </h4>

                      {/* Description */}
                      <p
                        className={`text-[10px] font-serif leading-snug ${
                          isUnlocked ? 'text-amber-400/50' : 'text-amber-600/20'
                        }`}
                      >
                        {isUnlocked ? achievement.description : 'Non découvert'}
                      </p>

                      {/* Lock icon for locked */}
                      {!isUnlocked && (
                        <div className="absolute top-2 right-2">
                          <Lock className="w-3 h-3 text-amber-700/20" />
                        </div>
                      )}

                      {/* Glow effect for unlocked */}
                      {isUnlocked && (
                        <div
                          className="absolute inset-0 rounded-xl pointer-events-none"
                          style={{
                            boxShadow:
                              'inset 0 0 20px rgba(212, 165, 116, 0.05)',
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer hint */}
            <div className="px-6 py-3 border-t border-amber-800/10 flex-shrink-0">
              <p className="text-amber-600/25 text-[10px] font-serif text-center">
                Explore l&apos;histoire pour débloquer tous les succès
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
