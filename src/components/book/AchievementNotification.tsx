'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '@/store/story-store';
import { ACHIEVEMENTS } from '@/lib/achievement-definitions';
import { Award } from 'lucide-react';
import type { AchievementSoundHandle } from './AchievementSound';

interface ToastItem {
  id: string;
  timestamp: number;
}

interface AchievementNotificationProps {
  soundRef?: React.RefObject<AchievementSoundHandle | null>;
}

export default function AchievementNotification({ soundRef }: AchievementNotificationProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timerRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const addToast = useCallback((id: string) => {
    const achievement = ACHIEVEMENTS[id];
    if (!achievement) return;

    // Play achievement sound
    soundRef?.current?.playAchievementSound();

    // Skip duplicates
    setToasts((prev) => {
      if (prev.some((t) => t.id === id)) return prev;
      return [...prev, { id, timestamp: Date.now() }];
    });

    // Auto-dismiss after 3.5 seconds
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timerRef.current.delete(id);
    }, 3500);

    timerRef.current.set(id, timer);
  }, [soundRef]);

  // Subscribe to store for pending achievement unlocks (external system subscription)
  useEffect(() => {
    const unsub = useStoryStore.subscribe((state, prevState) => {
      const pending = state._pendingUnlock;
      if (pending && pending !== prevState._pendingUnlock) {
        addToast(pending);
        useStoryStore.getState()._clearPendingUnlock();
      }
    });
    return unsub;
  }, [addToast]);

  // Cleanup timers on unmount
  useEffect(() => {
    const timers = timerRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const achievement = ACHIEVEMENTS[toast.id];
          if (!achievement) return null;

          return (
            <motion.div
              key={`${toast.id}-${toast.timestamp}`}
              initial={{ y: -80, scale: 0.85, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: -40, scale: 0.92, opacity: 0 }}
              transition={{
                type: 'spring',
                damping: 18,
                stiffness: 280,
                mass: 0.8,
              }}
              className="relative pointer-events-auto achievement-toast-glow overflow-hidden"
              style={{
                background: 'rgba(30, 25, 40, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(218, 165, 32, 0.4)',
                borderRadius: '12px',
                padding: '14px 20px',
                minWidth: '280px',
                maxWidth: '360px',
              }}
            >
              {/* Shimmer overlay */}
              <div className="absolute inset-0 achievement-toast-shimmer pointer-events-none" style={{ borderRadius: '12px' }} />

              <div className="relative flex items-center gap-3">
                {/* Emoji */}
                <span className="text-2xl flex-shrink-0">{achievement.emoji}</span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Award className="w-3.5 h-3.5 text-amber-400/80 flex-shrink-0" />
                    <span className="text-[11px] font-serif text-amber-400/60 uppercase tracking-widest">
                      Succès débloqué
                    </span>
                  </div>
                  <h4 className="text-amber-100 font-serif font-bold text-sm leading-tight truncate">
                    {achievement.title}
                  </h4>
                  <p className="text-amber-300/50 text-xs font-serif mt-0.5 truncate">
                    {achievement.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
