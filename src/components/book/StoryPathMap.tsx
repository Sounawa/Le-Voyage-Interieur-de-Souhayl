'use client';

import { useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GitBranch, ChevronDown, ChevronRight, Sparkles, Lock } from 'lucide-react';
import { useStoryStore } from '@/store/story-store';
import { storyPages } from '@/data/story-data';

interface StoryPathMapProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Simplified story structure for visualization ───

interface ChapterNode {
  chapter: number;
  label: string;
  title: string;
  startPageId: string;
  totalPages: number;
  visitedCount: number;
  hasVisited: boolean;
  choicePoints: ChoicePoint[];
}

interface ChoicePoint {
  id: string;
  pageId: string;
  emoji: string;
  shortLabel: string;
  isExplored: boolean; // at least one choice from this point was visited
  totalChoices: number;
  exploredChoices: number;
}

interface EndingNode {
  type: 'light' | 'wisdom' | 'shadow' | 'pure';
  emoji: string;
  label: string;
  pageId: string;
  isFound: boolean;
}

const TOTAL_PAGES = 167;

const CHAPTER_META: Record<number, { label: string; icon: string }> = {
  0: { label: 'Prologue', icon: '📖' },
  1: { label: 'Chapitre 1', icon: '🌟' },
  2: { label: 'Chapitre 2', icon: '🏜️' },
  3: { label: 'Chapitre 3', icon: '🌲' },
  4: { label: 'Chapitre 4', icon: '⛰️' },
};

const ENDINGS: EndingNode[] = [
  { type: 'light', emoji: '🌟', label: 'Lumière', pageId: 'ending-light', isFound: false },
  { type: 'wisdom', emoji: '📖', label: 'Sagesse', pageId: 'ending-wisdom', isFound: false },
  { type: 'shadow', emoji: '🌙', label: 'Ombre', pageId: 'ending-shadow', isFound: false },
  { type: 'pure', emoji: '🪞', label: 'Pureté', pageId: 'ending-pure', isFound: false },
];

export default function StoryPathMap({ isOpen, onClose }: StoryPathMapProps) {
  const { visitedPages, endingsFound, currentPageId, goToPage } = useStoryStore();

  // ─── Compute chapter data ───
  const { chapters, endings, globalProgress } = useMemo(() => {
    const allPages = Object.values(storyPages);
    const visitedSet = new Set(visitedPages);
    const endingsFoundSet = new Set(endingsFound);

    // Group pages by chapter
    const pagesByChapter = new Map<number, string[]>();
    for (const page of allPages) {
      const list = pagesByChapter.get(page.chapter) || [];
      list.push(page.id);
      pagesByChapter.set(page.chapter, list);
    }

    // Build choice points per chapter (pick key choices, max 3 per chapter)
    const chapterNodes: ChapterNode[] = [];
    for (let ch = 0; ch <= 4; ch++) {
      const pageIds = pagesByChapter.get(ch) || [];
      const meta = CHAPTER_META[ch];
      const chapterTitle = pageIds.length > 0
        ? storyPages[pageIds[0]].chapterTitle
        : `Chapitre ${ch}`;

      // Get first page id (chapter start)
      const startPageId = pageIds[0] || '';
      const visitedInChapter = pageIds.filter((id) => visitedSet.has(id)).length;

      // Find choice points (pages with choices)
      const choicePoints: ChoicePoint[] = [];
      let choiceCount = 0;
      for (const pid of pageIds) {
        const page = storyPages[pid];
        if (page?.choices && page.choices.length > 0 && choiceCount < 3) {
          const choiceEmojis = page.choices.map((c) => c.emoji || '❓');
          const exploredCount = page.choices.filter(
            (c) => visitedSet.has(c.nextPage)
          ).length;
          const isExplored = exploredCount > 0;

          // Create a short label from the choice emojis
          const shortLabel = choiceEmojis.join(' ');

          choicePoints.push({
            id: pid,
            pageId: pid,
            emoji: choiceEmojis[0] || '❓',
            shortLabel,
            isExplored,
            totalChoices: page.choices.length,
            exploredChoices: exploredCount,
          });
          choiceCount++;
        }
      }

      chapterNodes.push({
        chapter: ch,
        label: meta.label,
        title: chapterTitle,
        startPageId,
        totalPages: pageIds.length,
        visitedCount: visitedInChapter,
        hasVisited: visitedInChapter > 0,
        choicePoints,
      });
    }

    // Mark endings
    const resolvedEndings: EndingNode[] = ENDINGS.map((e) => ({
      ...e,
      isFound: endingsFoundSet.has(e.type),
    }));

    const totalVisited = visitedPages.length;
    const progress = Math.min(100, Math.round((totalVisited / TOTAL_PAGES) * 100));

    return { chapters: chapterNodes, endings: resolvedEndings, globalProgress: progress };
  }, [visitedPages, endingsFound]);

  // ─── Navigation handler ───
  const handleNavigate = useCallback(
    (pageId: string, chapter?: number) => {
      goToPage(pageId, chapter);
      onClose();
    },
    [goToPage, onClose]
  );

  // ─── Count total explored choices across all chapters ───
  const totalChoices = useMemo(
    () =>
      chapters.reduce(
        (acc, ch) => acc + ch.choicePoints.reduce((a, cp) => a + cp.totalChoices, 0),
        0
      ),
    [chapters]
  );
  const exploredChoices = useMemo(
    () =>
      chapters.reduce(
        (acc, ch) => acc + ch.choicePoints.reduce((a, cp) => a + cp.exploredChoices, 0),
        0
      ),
    [chapters]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="story-path-overlay"
          />

          {/* Main panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="story-path-container"
          >
            <div className="p-5 sm:p-6 flex flex-col h-full max-h-[90vh] sm:max-h-[85vh]">
              {/* ── Header ── */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-900/30 border border-amber-700/25 flex items-center justify-center">
                    <GitBranch className="w-4 h-4 text-amber-500/70" />
                  </div>
                  <div>
                    <h2 className="font-serif text-base sm:text-lg text-amber-100 font-bold tracking-wide leading-tight">
                      Carte des Chemins
                    </h2>
                    <p className="text-[10px] text-amber-200/30 font-serif mt-0.5">
                      Visualisation des parcours
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-amber-900/20 transition-colors"
                  aria-label="Fermer la carte des chemins"
                >
                  <X className="w-4 h-4 text-amber-200/50" />
                </button>
              </div>

              {/* ── Completion bar ── */}
              <div className="mb-4 p-3 rounded-xl bg-amber-950/20 border border-amber-800/10">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400/60" />
                    <span className="text-[11px] font-serif text-amber-200/40">
                      Exploration globale
                    </span>
                  </div>
                  <span className="text-[11px] font-serif text-amber-300/60 font-bold">
                    {globalProgress}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden bg-amber-950/40">
                  <motion.div
                    className="h-full rounded-full progress-bar-shimmer"
                    initial={{ width: 0 }}
                    animate={{ width: `${globalProgress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[9px] text-amber-200/25 font-serif">
                    {visitedPages.length}/{TOTAL_PAGES} pages
                  </span>
                  <span className="text-[9px] text-amber-200/25 font-serif">
                    {exploredChoices}/{totalChoices} choix explorés
                  </span>
                </div>
              </div>

              {/* ── Tree visualization ── */}
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-0">
                {/* Prologue node */}
                {chapters.map((ch, index) => (
                  <div key={ch.chapter}>
                    {/* Chapter row */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.06, duration: 0.3 }}
                    >
                      <button
                        onClick={() => ch.hasVisited && handleNavigate(ch.startPageId, ch.chapter)}
                        disabled={!ch.hasVisited}
                        className={`path-chapter-row w-full text-left group ${
                          !ch.hasVisited ? 'cursor-not-allowed' : 'cursor-pointer'
                        }`}
                        aria-label={`${
                          ch.label === 'Prologue' ? 'Prologue' : ch.title
                        } — ${ch.visitedCount} sur ${ch.totalPages} pages visitées`}
                      >
                        {/* Connection line from above */}
                        {index > 0 && (
                          <div className="path-connection ml-5" />
                        )}

                        <div className="flex items-center gap-3">
                          {/* Node circle */}
                          <div className={`path-node ${ch.hasVisited ? 'explored' : 'unexplored'}`}>
                            {ch.hasVisited ? (
                              <span className="text-sm">{CHAPTER_META[ch.chapter].icon}</span>
                            ) : (
                              <Lock className="w-3 h-3 text-amber-200/20" />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-serif text-xs sm:text-sm font-bold truncate ${
                                  ch.hasVisited
                                    ? 'text-amber-100/90'
                                    : 'text-amber-200/25'
                                }`}
                              >
                                {ch.label === 'Prologue' ? 'Prologue' : ch.title}
                              </span>
                              {ch.chapter > 0 && ch.hasVisited && (
                                <span className="shrink-0 text-[9px] font-serif text-amber-400/60 bg-amber-900/25 px-1.5 py-0.5 rounded-full border border-amber-700/15">
                                  {CHAPTER_META[ch.chapter].icon} {ch.label}
                                </span>
                              )}
                            </div>

                            {/* Progress mini-bar */}
                            {ch.hasVisited && (
                              <div className="mt-1 flex items-center gap-2">
                                <div className="flex-1 h-1 rounded-full overflow-hidden bg-amber-950/30">
                                  <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{
                                      width: `${Math.round((ch.visitedCount / ch.totalPages) * 100)}%`,
                                      background: ch.visitedCount === ch.totalPages
                                        ? 'linear-gradient(90deg, #daa520, #ffd700)'
                                        : 'linear-gradient(90deg, rgba(212,165,116,0.4), rgba(212,165,116,0.6))',
                                    }}
                                  />
                                </div>
                                <span className="text-[9px] text-amber-200/30 font-serif shrink-0">
                                  {ch.visitedCount}/{ch.totalPages}
                                </span>
                              </div>
                            )}
                            {!ch.hasVisited && (
                              <p className="text-[9px] text-amber-200/15 font-serif mt-0.5 italic">
                                Non découvert
                              </p>
                            )}
                          </div>

                          {/* Chevron */}
                          {ch.hasVisited && (
                            <ChevronRight className="w-3.5 h-3.5 text-amber-500/20 group-hover:text-amber-400/40 transition-colors shrink-0" />
                          )}
                        </div>
                      </button>

                      {/* Choice points (branching diamonds) */}
                      {ch.hasVisited && ch.choicePoints.length > 0 && (
                        <div className="ml-5 pl-5 border-l border-amber-800/10 py-1 space-y-1.5">
                          {ch.choicePoints.map((cp, cpIndex) => (
                            <motion.div
                              key={cp.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: index * 0.06 + cpIndex * 0.04 + 0.15,
                                duration: 0.25,
                              }}
                              className="flex items-center gap-2"
                            >
                              {/* Diamond node */}
                              <div
                                className={`shrink-0 w-3 h-3 rotate-45 rounded-[2px] transition-all duration-500 ${
                                  cp.isExplored
                                    ? 'bg-amber-500/60 shadow-[0_0_8px_rgba(212,165,116,0.3)]'
                                    : 'bg-amber-900/20 border border-amber-800/15'
                                }`}
                              />
                              {/* Choice label */}
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span
                                  className={`text-[11px] truncate transition-colors duration-500 ${
                                    cp.isExplored
                                      ? 'text-amber-200/50'
                                      : 'text-amber-200/15'
                                  }`}
                                >
                                  {cp.shortLabel}
                                </span>
                                {cp.isExplored && (
                                  <span className="text-[8px] text-amber-400/40 font-serif shrink-0">
                                    {cp.exploredChoices}/{cp.totalChoices}
                                  </span>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>

                    {/* Connection to next chapter (vertical line) */}
                    {index < chapters.length - 1 && (
                      <div className="path-connection ml-5" />
                    )}
                  </div>
                ))}

                {/* ── Separator before endings ── */}
                <div className="ornamental-divider my-3">
                  <span className="ornamental-diamond" />
                </div>

                {/* ── Endings section ── */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <p className="text-[10px] font-serif text-amber-200/30 text-center mb-3 uppercase tracking-[0.2em]">
                    Finales
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {endings.map((ending, i) => (
                      <motion.div
                        key={ending.type}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.08, duration: 0.3 }}
                        className={`path-ending-node flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-500 ${
                          ending.isFound
                            ? 'ending-found'
                            : 'ending-locked'
                        }`}
                      >
                        <span
                          className={`text-xl sm:text-2xl transition-all duration-500 ${
                            ending.isFound ? 'ending-found-emoji' : 'ending-locked-emoji'
                          }`}
                        >
                          {ending.isFound ? ending.emoji : '🔒'}
                        </span>
                        <span
                          className={`text-[9px] sm:text-[10px] font-serif text-center leading-tight transition-colors duration-500 ${
                            ending.isFound
                              ? 'text-amber-200/60'
                              : 'text-amber-200/15'
                          }`}
                        >
                          {ending.isFound ? ending.label : '???'}
                        </span>
                        {ending.isFound && (
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400/50" />
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Endings found counter */}
                  <div className="mt-3 text-center">
                    <span className="text-[10px] font-serif text-amber-200/30">
                      {endingsFound.length} / 4 finales découvertes
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* ── Footer ── */}
              <div className="mt-4 pt-3 border-t border-amber-800/10">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl font-serif text-xs font-bold tracking-wide
                    bg-gradient-to-r from-amber-900/25 to-amber-800/15
                    border border-amber-700/15
                    text-amber-100/60
                    hover:from-amber-800/35 hover:to-amber-700/25
                    hover:border-amber-600/25 hover:text-amber-100
                    active:scale-[0.98]
                    transition-all duration-300"
                >
                  Fermer la carte
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
