'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useStoryStore } from '@/store/story-store';

interface BookmarkButtonProps {
  pageId: string;
}

export default function BookmarkButton({ pageId }: BookmarkButtonProps) {
  const { toggleBookmark, isBookmarked } = useStoryStore();
  const [justToggled, setJustToggled] = useState(false);

  const bookmarked = isBookmarked(pageId);

  const handleToggle = () => {
    setJustToggled(true);
    toggleBookmark(pageId);
    setTimeout(() => setJustToggled(false), 300);
  };

  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        handleToggle();
      }}
      whileTap={{ scale: 0.85 }}
      animate={justToggled ? { scale: [1, 1.25, 1] } : { scale: 1 }}
      transition={justToggled ? { duration: 0.3, ease: 'easeOut' } : { duration: 0.15 }}
      className={`fixed bottom-16 right-4 z-20 p-2.5 rounded-lg transition-all duration-300 group ${
        bookmarked
          ? 'bg-amber-700/25 border border-amber-600/30 hover:bg-amber-700/35'
          : 'bg-[#0d0c14]/70 backdrop-blur-sm border border-amber-800/15 hover:bg-amber-900/20 hover:border-amber-700/25'
      }`}
      title={bookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      aria-label={bookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <AnimatePresence mode="wait">
        {bookmarked ? (
          <motion.div
            key="filled"
            initial={{ scale: 0.5, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, rotate: 15 }}
            transition={{ duration: 0.2 }}
          >
            <BookmarkCheck className="w-4 h-4 text-amber-400/80 group-hover:text-amber-400 transition-colors" />
          </motion.div>
        ) : (
          <motion.div
            key="outline"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <Bookmark className="w-4 h-4 text-amber-500/40 group-hover:text-amber-400/60 transition-colors" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
