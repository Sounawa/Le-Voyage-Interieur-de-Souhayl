'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapIcon, CheckCircle2, BookOpen, ChevronRight } from 'lucide-react';
import { useStoryStore } from '@/store/story-store';
import { storyPages } from '@/data/story-data';

interface ChapterMapProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (pageId: string) => void;
}

interface ChapterInfo {
  number: number;
  title: string;
  label: string;
  startPageId: string;
  totalPages: number;
  visitedCount: number;
  isCompleted: boolean;
  isCurrent: boolean;
  hasVisited: boolean;
}

const TOTAL_PAGES = 167;

const chapterStartPages: Record<number, string> = {
  0: 'prologue',
  1: 'ch1-start',
  2: 'ch2-start',
  3: 'ch3-start',
  4: 'ch4-start',
};

const chapterLabels: Record<number, string> = {
  0: 'Prologue',
  1: 'Chapitre 1',
  2: 'Chapitre 2',
  3: 'Chapitre 3',
  4: 'Chapitre 4',
};

export default function ChapterMap({ isOpen, onClose, onNavigate }: ChapterMapProps) {
  const { visitedPages, currentPageId, chaptersCompleted } = useStoryStore();

  // Compute chapter-level data
  const chapters = useMemo(() => {
    const allPages = Object.values(storyPages);

    // Group pages by chapter
    const pagesByChapter = new Map<number, string[]>();
    for (const page of allPages) {
      const list = pagesByChapter.get(page.chapter) || [];
      list.push(page.id);
      pagesByChapter.set(page.chapter, list);
    }

    // Determine current chapter from the current page
    const currentPage = storyPages[currentPageId];
    const currentChapter = currentPage?.chapter ?? 0;

    // Build visited set for fast lookup
    const visitedSet = new Set(visitedPages);

    const result: ChapterInfo[] = [];
    for (let ch = 0; ch <= 4; ch++) {
      const pageIds = pagesByChapter.get(ch) || [];
      const startPageId = chapterStartPages[ch];
      const chapterTitle = pageIds.length > 0
        ? storyPages[pageIds[0]].chapterTitle
        : `Chapitre ${ch}`;

      // Count visited pages in this chapter
      const visitedInChapter = pageIds.filter((id) => visitedSet.has(id)).length;

      result.push({
        number: ch,
        title: chapterTitle,
        label: chapterLabels[ch],
        startPageId,
        totalPages: pageIds.length,
        visitedCount: visitedInChapter,
        isCompleted: chaptersCompleted.includes(ch),
        isCurrent: ch === currentChapter,
        hasVisited: visitedInChapter > 0,
      });
    }

    return result;
  }, [visitedPages, currentPageId, chaptersCompleted]);

  // Global stats
  const totalVisited = visitedPages.length;
  const globalProgress = Math.min(100, Math.round((totalVisited / TOTAL_PAGES) * 100));

  const handleNavigate = (pageId: string) => {
    onNavigate(pageId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="chapter-map-overlay"
          />

          {/* Panel — slides in from the right */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="chapter-map-panel w-full max-w-sm"
          >
            <div className="p-6 flex flex-col min-h-full">
              {/* ── Header ── */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <MapIcon className="w-5 h-5 text-amber-500/70" />
                  <h2 className="font-serif text-lg text-amber-100 font-bold tracking-wide">
                    Carte du Voyage
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-amber-900/20 transition-colors"
                  aria-label="Fermer la carte du voyage"
                >
                  <X className="w-4 h-4 text-amber-200/50" />
                </button>
              </div>

              {/* Ornamental divider */}
              <div className="ornamental-divider mb-6">
                <span className="ornamental-diamond" />
              </div>

              {/* ── Chapter Cards ── */}
              <div className="space-y-3 flex-1">
                {chapters.map((ch, index) => {
                  const progressPct = ch.totalPages > 0
                    ? Math.round((ch.visitedCount / ch.totalPages) * 100)
                    : 0;

                  return (
                    <motion.button
                      key={ch.number}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.07, duration: 0.35 }}
                      onClick={() => handleNavigate(ch.startPageId)}
                      disabled={!ch.hasVisited}
                      className={`
                        chapter-card w-full text-left
                        ${ch.isCurrent ? 'current' : ''}
                        ${ch.isCompleted ? 'completed' : ''}
                        ${!ch.hasVisited ? 'opacity-40 cursor-not-allowed' : ''}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        {/* Chapter number circle */}
                        <div className="shrink-0 mt-0.5">
                          <div className="chapter-number-circle">
                            {ch.isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400/80" />
                            ) : (
                              <span>{ch.label === 'Prologue' ? 'I' : ch.number}</span>
                            )}
                          </div>
                        </div>

                        {/* Chapter info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="font-serif text-sm font-bold text-amber-100/90 truncate">
                              {ch.label === 'Prologue' ? 'Prologue' : ch.title}
                            </p>
                            {ch.isCurrent && (
                              <span className="shrink-0 text-[10px] font-serif text-amber-400/70 bg-amber-900/20 px-2 py-0.5 rounded-full border border-amber-700/20">
                                En cours
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-amber-200/35 font-serif mb-2">
                            {ch.visitedCount}/{ch.totalPages} pages visitées
                          </p>

                          {/* Progress bar */}
                          <div className="chapter-progress-bar">
                            <div
                              className="chapter-progress-fill"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>

                        {/* Chevron */}
                        {ch.hasVisited && (
                          <ChevronRight className="w-3.5 h-3.5 text-amber-500/25 mt-2.5 shrink-0" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* ── Bottom: Global Exploration ── */}
              <div className="mt-6 pt-5 border-t border-amber-800/10">
                {/* Total exploration */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-amber-500/40" />
                    <span className="text-xs font-serif text-amber-200/40">
                      Exploration totale
                    </span>
                  </div>
                  <span className="text-xs font-serif text-amber-200/50">
                    {totalVisited}/{TOTAL_PAGES} pages explorées
                    <span className="text-amber-400/50 ml-1">({globalProgress}%)</span>
                  </span>
                </div>

                {/* Global progress bar */}
                <div className="h-1 rounded-full overflow-hidden bg-amber-950/30 mb-5">
                  <motion.div
                    className="h-full rounded-full progress-bar-shimmer"
                    initial={{ width: 0 }}
                    animate={{ width: `${globalProgress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>

                {/* Continue reading button */}
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl font-serif text-sm font-bold tracking-wide
                    bg-gradient-to-r from-amber-900/30 to-amber-800/20
                    border border-amber-700/20
                    text-amber-100/70
                    hover:from-amber-800/40 hover:to-amber-700/30
                    hover:border-amber-600/30 hover:text-amber-100
                    active:scale-[0.98]
                    transition-all duration-300"
                >
                  Reprendre la lecture
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
