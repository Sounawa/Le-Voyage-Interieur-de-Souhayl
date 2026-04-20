'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  BookOpen,
  GitBranch,
  Layers,
  Star,
  Calendar,
  Compass,
  Gauge,
  BookMarked,
} from 'lucide-react';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useStoryStore } from '@/store/story-store';
import { storyPages } from '@/data/story-data';

interface ReadingStatsProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOTAL_ENDINGS = 4;
const TOTAL_CHAPTERS = 4;
const CHAPTER_NAMES: Record<number, string> = {
  0: 'Prologue',
  1: 'Chapitre 1',
  2: 'Chapitre 2',
  3: 'Chapitre 3',
  4: 'Chapitre 4',
};

function formatTime(ms: number): string {
  if (ms <= 0) return '0min';
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes}min`;
}

function AnimatedStatNumber({ value, duration = 800 }: { value: number; duration?: number }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const startTime = performance.now();

    if (value === 0) {
      const raf = requestAnimationFrame(() => setDisplayed(0));
      return () => cancelAnimationFrame(raf);
    }

    let rafId: number;
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * value));
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [value, duration]);

  return <>{displayed}</>;
}

function CircularProgress({
  percentage,
  size = 100,
  strokeWidth = 6,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [displayedPercent, setDisplayedPercent] = useState(0);

  useEffect(() => {
    if (percentage === 0) {
      const raf = requestAnimationFrame(() => setDisplayedPercent(0));
      return () => cancelAnimationFrame(raf);
    }
    const startTime = performance.now();
    let rafId: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / 1200, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayedPercent(Math.round(eased * percentage));
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [percentage]);

  const offset = circumference - (displayedPercent / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="circular-progress -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(212, 165, 116, 0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#amber-gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />
        <defs>
          <linearGradient id="amber-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8c87a" />
            <stop offset="50%" stopColor="#d4a574" />
            <stop offset="100%" stopColor="#b8860b" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-amber-100 font-serif font-bold text-lg">{displayedPercent}%</span>
      </div>
    </div>
  );
}

export default function ReadingStats({ isOpen, onClose }: ReadingStatsProps) {
  const {
    visitedPages,
    chosenTags,
    chaptersCompleted,
    endingsFound,
    totalReadingTime,
    sessionCount,
    addReadingTime,
  } = useStoryStore();

  const totalPages = useMemo(() => Object.keys(storyPages).length, []);

  // Track reading time every 30 seconds while panel is open
  const trackTime = useCallback(() => {
    addReadingTime(30000);
  }, [addReadingTime]);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(trackTime, 30000);
    // Immediately tick once to start tracking
    trackTime();
    return () => clearInterval(interval);
  }, [isOpen, trackTime]);

  // Compute pages per chapter
  const chapterData = useMemo(() => {
    const chapters = [0, 1, 2, 3, 4];
    return chapters.map((ch) => {
      const allPages = Object.values(storyPages).filter((p) => p.chapter === ch);
      const visited = allPages.filter((p) => visitedPages.includes(p.id)).length;
      return {
        chapter: ch,
        label: CHAPTER_NAMES[ch],
        total: allPages.length,
        visited,
      };
    });
  }, [visitedPages]);

  // Exploration percentage
  const explorationPct = useMemo(() => {
    if (totalPages === 0) return 0;
    return Math.round((visitedPages.length / totalPages) * 100);
  }, [visitedPages.length, totalPages]);

  // Average speed (pages per minute)
  const pagesPerMinute = useMemo(() => {
    const minutes = totalReadingTime / 60000;
    if (minutes < 0.5) return 0;
    return Math.round((visitedPages.length / minutes) * 10) / 10;
  }, [totalReadingTime, visitedPages.length]);

  // Computed stats for animated numbers
  const stats = useMemo(
    () => ({
      totalReadingTime,
      visitedPages: visitedPages.length,
      chosenTags: chosenTags.length,
      chaptersCompleted: chaptersCompleted.length,
      endingsFound: endingsFound.length,
      sessionCount,
      explorationPct,
    }),
    [totalReadingTime, visitedPages.length, chosenTags.length, chaptersCompleted.length, endingsFound.length, sessionCount, explorationPct]
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
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Reading Stats Panel — slides in from left */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="reading-stats-panel fixed left-0 top-0 bottom-0 z-50 w-full md:w-[420px] bg-[#0d0c14]/95 backdrop-blur-md border-r border-amber-800/20 overflow-y-auto islamic-bg-pattern"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#0d0c14]/90 backdrop-blur-md px-6 py-4 border-b border-amber-800/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">📊</span>
                <h2 className="font-serif text-lg text-amber-100 font-bold">
                  Statistiques de lecture
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-amber-900/20 transition-colors"
                aria-label="Fermer les statistiques"
              >
                <X className="w-4 h-4 text-amber-200/50" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Exploration Circular Progress — Hero stat */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="stat-card rounded-2xl p-5 flex items-center gap-5"
              >
                <CircularProgress percentage={explorationPct} size={90} strokeWidth={5} />
                <div>
                  <p className="text-amber-500/60 text-xs font-serif mb-1">Exploration totale</p>
                  <p className="text-amber-100 text-sm font-serif">
                    <AnimatedStatNumber value={stats.visitedPages} /> / {totalPages} pages
                  </p>
                  <p className="text-amber-500/40 text-xs font-serif mt-1">
                    Continue ton voyage, Souhayl !
                  </p>
                </div>
              </motion.div>

              {/* Stats Grid — 2 columns */}
              <div className="grid grid-cols-2 gap-3">
                {/* 1. Temps total de lecture */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="stat-card rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-amber-500/50" />
                    <span className="text-amber-500/50 text-[10px] font-serif uppercase tracking-wider">
                      Temps de lecture
                    </span>
                  </div>
                  <p className="text-amber-100 text-xl font-serif font-bold">
                    {formatTime(stats.totalReadingTime)}
                  </p>
                </motion.div>

                {/* 2. Pages visitées */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="stat-card rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-amber-500/50" />
                    <span className="text-amber-500/50 text-[10px] font-serif uppercase tracking-wider">
                      Pages visitées
                    </span>
                  </div>
                  <p className="text-amber-100 text-xl font-serif font-bold">
                    <AnimatedStatNumber value={stats.visitedPages} />{' '}
                    <span className="text-amber-500/40 text-sm">/ {totalPages}</span>
                  </p>
                  <div className="mt-2 h-1.5 rounded-full bg-amber-900/20 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${totalPages > 0 ? (stats.visitedPages / totalPages) * 100 : 0}%`,
                      }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                      className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400"
                    />
                  </div>
                </motion.div>

                {/* 3. Choix effectués */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="stat-card rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch className="w-4 h-4 text-amber-500/50" />
                    <span className="text-amber-500/50 text-[10px] font-serif uppercase tracking-wider">
                      Choix effectués
                    </span>
                  </div>
                  <p className="text-amber-100 text-xl font-serif font-bold">
                    <AnimatedStatNumber value={stats.chosenTags} />
                  </p>
                  <div className="flex gap-0.5 mt-1.5">
                    {Array.from({ length: Math.min(stats.chosenTags, 10) }).map((_, i) => (
                      <span
                        key={i}
                        className="text-[8px] leading-none"
                        style={{ color: `rgba(212, 165, 116, ${0.3 + i * 0.07})` }}
                      >
                        ◆
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* 4. Chapitres complétés */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="stat-card rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="w-4 h-4 text-amber-500/50" />
                    <span className="text-amber-500/50 text-[10px] font-serif uppercase tracking-wider">
                      Chapitres
                    </span>
                  </div>
                  <p className="text-amber-100 text-xl font-serif font-bold">
                    <AnimatedStatNumber value={stats.chaptersCompleted}>{' '}</AnimatedStatNumber>
                    <span className="text-amber-500/40 text-sm">/ {TOTAL_CHAPTERS}</span>
                  </p>
                  <div className="flex gap-1 mt-1.5">
                    {[1, 2, 3, 4].map((ch) => (
                      <div
                        key={ch}
                        className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-serif border transition-all duration-500 ${
                          chaptersCompleted.includes(ch)
                            ? 'bg-amber-700/30 border-amber-600/40 text-amber-300'
                            : 'bg-transparent border-amber-800/15 text-amber-800/30'
                        }`}
                        style={{ animationDelay: `${ch * 0.1}s` }}
                      >
                        {ch}
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* 5. Fins découvertes */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="stat-card rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-amber-500/50" />
                    <span className="text-amber-500/50 text-[10px] font-serif uppercase tracking-wider">
                      Fins découvertes
                    </span>
                  </div>
                  <p className="text-amber-100 text-xl font-serif font-bold">
                    <AnimatedStatNumber value={stats.endingsFound}>{' '}</AnimatedStatNumber>
                    <span className="text-amber-500/40 text-sm">/ {TOTAL_ENDINGS}</span>
                  </p>
                  <div className="flex gap-1 mt-1.5">
                    {[0, 1, 2, 3].map((i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 transition-all duration-500 ${
                          i < stats.endingsFound
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-amber-800/20'
                        }`}
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* 6. Sessions de lecture */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="stat-card rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-amber-500/50" />
                    <span className="text-amber-500/50 text-[10px] font-serif uppercase tracking-wider">
                      Sessions
                    </span>
                  </div>
                  <p className="text-amber-100 text-xl font-serif font-bold">
                    <AnimatedStatNumber value={stats.sessionCount} />
                  </p>
                </motion.div>
              </div>

              {/* Vitesse moyenne — full width */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="stat-card rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Gauge className="w-4 h-4 text-amber-500/50" />
                      <span className="text-amber-500/50 text-[10px] font-serif uppercase tracking-wider">
                        Vitesse moyenne
                      </span>
                    </div>
                    <p className="text-amber-100 text-xl font-serif font-bold">
                      {pagesPerMinute > 0
                        ? `${pagesPerMinute} pages/min`
                        : '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-amber-500/30">
                    <Compass className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>

              {/* Reading Time Chart — Pages per Chapter */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="stat-card rounded-xl p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <BookMarked className="w-4 h-4 text-amber-500/50" />
                  <span className="text-amber-500/60 text-xs font-serif">
                    Exploration par chapitre
                  </span>
                </div>

                {/* Bar chart */}
                <div className="flex items-end justify-between gap-2 h-32 px-1">
                  {chapterData.map((ch, i) => {
                    const heightPct = ch.total > 0 ? (ch.visited / ch.total) * 100 : 0;
                    const barHeight = Math.max(heightPct, 4); // Minimum 4% height
                    return (
                      <div
                        key={ch.chapter}
                        className="flex-1 flex flex-col items-center gap-1.5"
                      >
                        {/* Bar */}
                        <div className="w-full flex flex-col items-center justify-end" style={{ height: '100px' }}>
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${barHeight}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 + i * 0.1 }}
                            className="chapter-bar w-full max-w-[36px] rounded-t-md min-h-[4px]"
                            title={`${ch.visited}/${ch.total} pages visitées`}
                          />
                        </div>
                        {/* Label */}
                        <span className="text-amber-500/40 text-[9px] font-serif text-center leading-tight">
                          {ch.label === 'Prologue' ? 'Prol.' : `Ch.${ch.chapter}`}
                        </span>
                        {/* Count */}
                        <span className="text-amber-300/60 text-[10px] font-serif font-medium">
                          {ch.visited}/{ch.total}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Resume button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-800/40 to-amber-900/30 border border-amber-700/25 text-amber-100 font-serif text-sm hover:from-amber-700/50 hover:to-amber-800/40 hover:border-amber-600/35 transition-all duration-300 active:scale-[0.98]"
              >
                📖 Reprendre la lecture
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
