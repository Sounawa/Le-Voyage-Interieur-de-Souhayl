'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useStoryStore } from '@/store/story-store';

export default function FocusModeToggle() {
  const focusMode = useStoryStore((s) => s.focusMode);
  const toggleFocusMode = useStoryStore((s) => s.toggleFocusMode);

  return (
    <motion.button
      onClick={toggleFocusMode}
      className={`
        focus-toggle-btn
        fixed bottom-20 right-4 z-20
        w-9 h-9
        ${focusMode ? 'active opacity-30 hover:opacity-100' : ''}
        transition-opacity duration-300
      `}
      title="Mode lecture immersive"
      aria-label={focusMode ? 'Désactiver le mode immersif' : 'Activer le mode immersif'}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={focusMode ? 'off' : 'on'}
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 90 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {focusMode ? (
            <EyeOff className="w-3.5 h-3.5 text-amber-400/70" />
          ) : (
            <Eye className="w-3.5 h-3.5 text-amber-400/70" />
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
