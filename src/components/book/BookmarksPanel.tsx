'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, X, ChevronRight, BookOpen } from 'lucide-react';
import { useStoryStore } from '@/store/story-store';
import { storyPages } from '@/data/story-data';
import type { MoodType } from '@/lib/story-types';

interface BookmarksPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (pageId: string) => void;
}

const moodLabels: Record<string, { label: string; emoji: string }> = {
  prologue: { label: 'Prologue', emoji: '🌙' },
  wonder: { label: 'Merveille', emoji: '✨' },
  darkness: { label: 'Obscurité', emoji: '🌑' },
  wisdom: { label: 'Sagesse', emoji: '📖' },
  danger: { label: 'Danger', emoji: '⚠️' },
  peace: { label: 'Paix', emoji: '🕊️' },
  triumph: { label: 'Triomphe', emoji: '🌟' },
  ending: { label: 'Fin', emoji: '⭐' },
};

const chapterLabels: Record<number, string> = {
  0: 'Prologue',
  1: 'Chapitre 1',
  2: 'Chapitre 2',
  3: 'Chapitre 3',
  4: 'Chapitre 4',
};

export default function BookmarksPanel({ isOpen, onClose, onNavigate }: BookmarksPanelProps) {
  const { bookmarks } = useStoryStore();

  const handleNavigate = (pageId: string) => {
    onNavigate(pageId);
    onClose();
  };

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

          {/* Bookmarks Panel — slides in from left */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-full max-w-sm bg-[#0d0c14]/95 backdrop-blur-md border-r border-amber-800/20 overflow-y-auto islamic-bg-pattern"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#0d0c14]/90 backdrop-blur-md px-6 py-4 border-b border-amber-800/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bookmark className="w-5 h-5 text-amber-500/70" />
                <h2 className="font-serif text-lg text-amber-100 font-bold">Favoris</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-amber-900/20 transition-colors" aria-label="Fermer les favoris">
                <X className="w-4 h-4 text-amber-200/50" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Stats */}
              <div className="bg-amber-950/20 rounded-lg p-3 border border-amber-800/10">
                <p className="text-amber-500/50 text-xs font-serif mb-1">Pages enregistrées</p>
                <p className="text-amber-100 text-2xl font-bold font-serif">{bookmarks.length}</p>
              </div>

              {/* Bookmarks List */}
              <div className="space-y-2">
                {bookmarks.length === 0 && (
                  <div className="py-12 text-center">
                    <BookOpen className="w-10 h-10 text-amber-800/20 mx-auto mb-3" />
                    <p className="text-amber-200/30 text-sm font-serif italic">
                      Aucun favori pour le moment...
                    </p>
                    <p className="text-amber-200/20 text-xs font-serif mt-2">
                      Appuyez sur l&apos;icône marque-page pour sauvegarder une page
                    </p>
                  </div>
                )}

                {bookmarks.map((pageId, index) => {
                  const page = storyPages[pageId];
                  if (!page) return null;

                  const moodInfo = moodLabels[page.mood as MoodType] || moodLabels.prologue;
                  const chapterLabel = chapterLabels[page.chapter] || `Chapitre ${page.chapter}`;
                  const displayTitle = page.title || page.chapterTitle || pageId;

                  return (
                    <motion.button
                      key={pageId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.06 }}
                      onClick={() => handleNavigate(pageId)}
                      className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-950/15 border border-amber-800/10 hover:border-amber-700/25 hover:bg-amber-950/25 transition-all duration-300 group"
                    >
                      <div className="shrink-0 w-9 h-9 rounded-lg bg-amber-900/25 border border-amber-800/20 flex items-center justify-center text-sm group-hover:bg-amber-800/30 group-hover:border-amber-700/30 transition-all duration-300 group-hover:scale-105">
                        {moodInfo.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-amber-100/80 text-sm font-serif truncate group-hover:text-amber-100 transition-colors duration-300">
                          {displayTitle}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-amber-500/40 text-xs font-serif">{chapterLabel}</span>
                          <span className="text-amber-800/30 text-xs">·</span>
                          <span className="text-amber-500/30 text-xs font-serif">{moodInfo.label}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-500/30 group-hover:text-amber-500/50 shrink-0 transition-colors duration-300" />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
