'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BarChart3, BookOpen, BookMarked, Bookmark, GitBranch, HelpCircle, Home as HomeIcon, MapIcon, Moon, Scroll, Search, Settings, Star, Trophy } from 'lucide-react';
import { useStoryStore } from '@/store/story-store';
import { storyPages, firstPageId } from '@/data/story-data';
import type { Choice, MoodType } from '@/lib/story-types';
import ParticleBackground from '@/components/book/ParticleBackground';
import IslamicPattern from '@/components/book/IslamicPattern';
import VignetteOverlay from '@/components/book/VignetteOverlay';
import ProgressBar from '@/components/book/ProgressBar';
import BookCover from '@/components/book/BookCover';
import ChapterTitle from '@/components/book/ChapterTitle';
import BismillahHeader from '@/components/book/BismillahHeader';
import StoryPageView from '@/components/book/StoryPageView';
import ChoiceButtons from '@/components/book/ChoiceButtons';
import EndingScreen from '@/components/book/EndingScreen';
import ChoiceJournal from '@/components/book/ChoiceJournal';
import BackButton from '@/components/book/BackButton';
import SettingsPanel from '@/components/book/SettingsPanel';
import VirtueMeter from '@/components/book/VirtueMeter';
import SpiritualGlossary from '@/components/book/SpiritualGlossary';
import AmbientSound from '@/components/book/AmbientSound';
import BookmarkButton from '@/components/book/BookmarkButton';
import BookmarksPanel from '@/components/book/BookmarksPanel';
import MoodIndicator from '@/components/book/MoodIndicator';
import PageTurnSound from '@/components/book/PageTurnSound';
import ChoiceSound from '@/components/book/ChoiceSound';
import AchievementSound from '@/components/book/AchievementSound';
import ChapterTransitionSound from '@/components/book/ChapterTransitionSound';
import AchievementNotification from '@/components/book/AchievementNotification';
import AchievementsPanel from '@/components/book/AchievementsPanel';
import TTSNarration from '@/components/book/TTSNarration';
import ChapterMap from '@/components/book/ChapterMap';
import SpiritualQuiz from '@/components/book/SpiritualQuiz';
import StoryPathMap from '@/components/book/StoryPathMap';
import FocusModeToggle from '@/components/book/FocusModeToggle';
import StoryHint from '@/components/book/StoryHint';
import ReadingStats from '@/components/book/ReadingStats';
import ReadingTimer from '@/components/book/ReadingTimer';
import PageSearch from '@/components/book/PageSearch';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import type { PageTurnSoundHandle } from '@/components/book/PageTurnSound';
import type { ChoiceSoundHandle } from '@/components/book/ChoiceSound';
import type { AchievementSoundHandle } from '@/components/book/AchievementSound';
import type { ChapterTransitionSoundHandle } from '@/components/book/ChapterTransitionSound';

type AppView = 'cover' | 'reading' | 'chapter-transition' | 'ending';

export default function Home() {
  const { currentPageId, visitedPages, endingsFound, goToPage, makeChoice, markEndingFound, restart, focusMode } = useStoryStore();
  const [view, setView] = useState<AppView>('cover');
  const [transitioningChapter, setTransitioningChapter] = useState<{ chapter: number; title: string } | null>(null);
  const [previousChapter, setPreviousChapter] = useState<number>(-1);
  const [journalOpen, setJournalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [bookmarkOpen, setBookmarkOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [chapterMapOpen, setChapterMapOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [storyPathOpen, setStoryPathOpen] = useState(false);
  const [readingStatsOpen, setReadingStatsOpen] = useState(false);
  const [pageSearchOpen, setPageSearchOpen] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);
  const pageTurnSoundRef = useRef<PageTurnSoundHandle>(null);
  const choiceSoundRef = useRef<ChoiceSoundHandle>(null);
  const achievementSoundRef = useRef<AchievementSoundHandle>(null);
  const chapterTransitionSoundRef = useRef<ChapterTransitionSoundHandle>(null);

  // Refs for swipe navigation (initialized as no-ops, updated after handler definitions)
  const handleContinueRef = useRef<() => void>(() => {});
  const handleGoBackRef = useRef<() => void>(() => {});

  // Hydrate view from persisted store after mount (avoids SSR mismatch)
  useEffect(() => {
    const hasSave = useStoryStore.getState().hasStarted;
    if (hasSave) {
      const raf = requestAnimationFrame(() => setView('reading'));
      return () => cancelAnimationFrame(raf);
    }
  }, []);

  const currentPage = storyPages[currentPageId];
  useEffect(() => {
    const timer = setTimeout(() => setIsAppReady(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = useCallback(() => {
    setView('reading');
    const startPage = storyPages[currentPageId] || storyPages[firstPageId];
    if (startPage?.isChapterStart && startPage.chapter >= 1) {
      setTransitioningChapter({ chapter: startPage.chapter, title: startPage.chapterTitle });
      setView('chapter-transition');
      chapterTransitionSoundRef.current?.playChapterTransition();
    }
  }, [currentPageId]);

  const handleGoHome = useCallback(() => {
    setView('cover');
    setTransitioningChapter(null);
  }, []);

  const handleRestart = useCallback(() => {
    restart();
    setView('cover');
    setTransitioningChapter(null);
    setPreviousChapter(-1);
  }, [restart]);

  const handleContinue = useCallback(() => {
    if (!currentPage?.next) return;
    const nextPage = storyPages[currentPage.next];
    if (!nextPage) return;

    pageTurnSoundRef.current?.playPageTurn();

    if (nextPage.isChapterStart && nextPage.chapter !== previousChapter) {
      setTransitioningChapter({ chapter: nextPage.chapter, title: nextPage.chapterTitle });
      setView('chapter-transition');
      setPreviousChapter(nextPage.chapter);
      chapterTransitionSoundRef.current?.playChapterTransition();
      goToPage(nextPage.id, nextPage.chapter);
      return;
    }

    goToPage(nextPage.id, nextPage.chapter);
  }, [currentPage, previousChapter, goToPage]);

  const handleGoBack = useCallback(() => {
    setView('reading');
    setTransitioningChapter(null);
    pageTurnSoundRef.current?.playPageTurn();
  }, []);

  // Keep refs in sync for swipe navigation
  useEffect(() => {
    handleContinueRef.current = handleContinue;
    handleGoBackRef.current = handleGoBack;
  }, [handleContinue, handleGoBack]);

  // Swipe navigation for touch devices (uses refs to avoid stale closures)
  const swipeHandlers = useSwipeNavigation({
    onSwipeLeft: () => {
      const page = storyPages[currentPageId];
      if (page?.choices && page.choices.length > 0) return;
      if (page?.next) handleContinueRef.current();
    },
    onSwipeRight: () => {
      handleGoBackRef.current();
    },
  });

  // Simulate asset loading with a brief delay
  useEffect(() => {
    const timer = setTimeout(() => setIsAppReady(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChoice = useCallback((choice: Choice) => {
    const nextPage = storyPages[choice.nextPage];
    if (!nextPage) return;

    pageTurnSoundRef.current?.playPageTurn();
    choiceSoundRef.current?.playChoiceSound();

    if (choice.tag) {
      if (nextPage.isChapterStart && nextPage.chapter !== previousChapter) {
        makeChoice(choice.id, nextPage.id, choice.tag, nextPage.chapter);
        setTransitioningChapter({ chapter: nextPage.chapter, title: nextPage.chapterTitle });
        setView('chapter-transition');
        setPreviousChapter(nextPage.chapter);
        chapterTransitionSoundRef.current?.playChapterTransition();
        return;
      }
      makeChoice(choice.id, nextPage.id, choice.tag, nextPage.chapter);
    } else {
      goToPage(nextPage.id, nextPage.chapter);
    }
  }, [previousChapter, makeChoice, goToPage]);

  const handleChapterTransitionComplete = useCallback(() => {
    setView('reading');
    setTransitioningChapter(null);
  }, []);

  useEffect(() => {
    if (currentPage?.isEnding && currentPage.endingType) {
      markEndingFound(currentPage.endingType);
      const timer = setTimeout(() => setView('ending'), 1500);
      return () => clearTimeout(timer);
    }
  }, [currentPageId, currentPage, markEndingFound]);

  const currentMood: MoodType = currentPage?.mood || 'prologue';

  const getMoodClasses = () => {
    switch (currentMood) {
      case 'wonder': return 'mood-wonder';
      case 'darkness': return 'mood-darkness';
      case 'wisdom': return 'mood-wisdom';
      case 'danger': return 'mood-danger';
      case 'peace': return 'mood-peace';
      case 'triumph': return 'mood-triumph';
      case 'prologue': return 'mood-prologue';
      case 'ending': return 'mood-ending';
      default: return 'mood-prologue';
    }
  };

  const getMoodOverlayStyle = (): React.CSSProperties => {
    switch (currentMood) {
      case 'wonder':
        return { background: 'radial-gradient(ellipse at 50% 30%, rgba(180, 140, 40, 0.08) 0%, transparent 70%)' };
      case 'darkness':
        return { background: 'radial-gradient(ellipse at 50% 60%, rgba(40, 40, 120, 0.12) 0%, transparent 70%)' };
      case 'wisdom':
        return { background: 'radial-gradient(ellipse at 50% 40%, rgba(140, 160, 60, 0.08) 0%, transparent 70%)' };
      case 'danger':
        return { background: 'radial-gradient(ellipse at 50% 50%, rgba(160, 50, 20, 0.1) 0%, transparent 60%)' };
      case 'peace':
        return { background: 'radial-gradient(ellipse at 50% 40%, rgba(60, 160, 130, 0.08) 0%, transparent 70%)' };
      case 'triumph':
        return { background: 'radial-gradient(ellipse at 50% 30%, rgba(200, 160, 50, 0.12) 0%, transparent 60%)' };
      case 'prologue':
        return { background: 'radial-gradient(ellipse at 50% 50%, rgba(180, 150, 80, 0.06) 0%, transparent 70%)' };
      case 'ending':
        return { background: 'radial-gradient(ellipse at 50% 40%, rgba(220, 200, 160, 0.1) 0%, transparent 60%)' };
      default:
        return {};
    }
  };

  // Determine when to show buttons
  const showReadingUI = view === 'reading' && !currentPage?.isEnding;
  const isOnCover = view === 'cover';
  const isOnChapterTransition = view === 'chapter-transition';
  const isOnPrologueFirst = currentPageId === 'prologue' && view === 'reading';
  const showBackButton = showReadingUI && !isOnPrologueFirst;
  const showJournalButton = showReadingUI;
  const showSettingsButton = showReadingUI;
  const showGlossaryButton = showReadingUI;
  const showBookmarkButton = showReadingUI;
  const showVirtueMeter = showReadingUI;
  const showFooter = view === 'reading' || view === 'chapter-transition';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Loading / Splash Screen */}
      {!isAppReady && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0f]">
          {/* Rotating Islamic octagram */}
          <svg className="loading-octagram" width="64" height="64" viewBox="0 0 100 100" fill="none">
            <polygon
              points="50,2 61.8,22.7 88.9,22.7 67.7,38.2 76.4,60.2 50,47.5 23.6,60.2 32.3,38.2 11.1,22.7 38.2,22.7"
              stroke="rgba(212, 165, 116, 0.6)"
              strokeWidth="1.5"
              fill="none"
            />
            <polygon
              points="50,15 57.3,28.6 73.6,28.6 61.2,38.2 65.9,52.3 50,43.5 34.1,52.3 38.8,38.2 26.4,28.6 42.7,28.6"
              stroke="rgba(212, 165, 116, 0.3)"
              strokeWidth="1"
              fill="none"
            />
          </svg>
          <p className="mt-6 text-amber-500/60 text-sm font-serif tracking-widest animate-pulse">
            Chargement...
          </p>
        </div>
      )}
      <main className={`flex-1 text-amber-100/90 transition-colors duration-1000 ${focusMode ? 'focus-mode-active' : ''}`} {...swipeHandlers.handlers}>
        {/* Background layers */}
        <div className="fixed inset-0 -z-10">
          <div className={`absolute inset-0 ${getMoodClasses()}`} style={{ transition: 'background 1.5s ease' }} />
          <div className="absolute inset-0 mood-overlay" style={{ ...getMoodOverlayStyle(), transition: 'background 1.5s ease' }} />
        </div>
        <ParticleBackground mood={currentMood} />
        <IslamicPattern />
        <VignetteOverlay />
        <AmbientSound mood={currentMood} />
        <PageTurnSound ref={pageTurnSoundRef} />
        <ChoiceSound ref={choiceSoundRef} />
        <AchievementSound ref={achievementSoundRef} />
        <ChapterTransitionSound ref={chapterTransitionSoundRef} />

        {isAppReady && view === 'cover' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <BookCover onStart={handleStart} />
          </motion.div>
        )}

        {view !== 'cover' && view !== 'ending' && (
          <>
            {/* Progress bar — hidden in focus mode */}
            {!focusMode && <ProgressBar currentPageId={currentPageId} totalPages={Object.keys(storyPages).length} />}

            {/* Top bar buttons — hidden in focus mode */}
            {!focusMode && <div className="fixed top-14 right-4 z-30 flex items-center gap-2">
              {/* Settings gear button */}
              {showSettingsButton && (
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="p-2.5 rounded-lg bg-[#0d0c14]/80 backdrop-blur-sm border border-amber-800/15 hover:bg-amber-900/20 hover:border-amber-700/30 transition-all duration-300 group"
                  title="Paramètres"
                  aria-label="Ouvrir les paramètres"
                >
                  <Settings className="w-4 h-4 text-amber-500/50 group-hover:text-amber-400/70 transition-colors" />
                </button>
              )}

              {/* Page Search button */}
              {showSettingsButton && (
                <button
                  onClick={() => setPageSearchOpen(true)}
                  className="p-2.5 rounded-lg bg-[#0d0c14]/80 backdrop-blur-sm border border-amber-800/15 hover:bg-amber-900/20 hover:border-amber-700/30 transition-all duration-300 group"
                  title="Rechercher"
                  aria-label="Rechercher dans l'histoire"
                >
                  <Search className="w-4 h-4 text-amber-500/50 group-hover:text-amber-400/70 transition-colors" />
                </button>
              )}

              {/* Journal button */}
              {showJournalButton && (
                <button
                  onClick={() => setJournalOpen(true)}
                  className="p-2.5 rounded-lg bg-[#0d0c14]/80 backdrop-blur-sm border border-amber-800/15 hover:bg-amber-900/20 hover:border-amber-700/30 transition-all duration-300 group"
                  title="Journal de Souhayl"
                  aria-label="Ouvrir le journal"
                >
                  <Scroll className="w-4 h-4 text-amber-500/50 group-hover:text-amber-400/70 transition-colors" />
                </button>
              )}

              {/* Glossary button */}
              {showGlossaryButton && (
                <button
                  onClick={() => setGlossaryOpen(true)}
                  className="p-2.5 rounded-lg bg-[#0d0c14]/80 backdrop-blur-sm border border-amber-800/15 hover:bg-amber-900/20 hover:border-amber-700/30 transition-all duration-300 group"
                  title="Abécédaire spirituel"
                  aria-label="Ouvrir l'abécédaire spirituel"
                >
                  <BookMarked className="w-4 h-4 text-amber-500/50 group-hover:text-amber-400/70 transition-colors" />
                </button>
              )}

              {/* Quiz button */}
              {showGlossaryButton && (
                <button
                  onClick={() => setQuizOpen(true)}
                  className="p-2.5 rounded-lg bg-[#0d0c14]/80 backdrop-blur-sm border border-amber-800/15 hover:bg-amber-900/20 hover:border-amber-700/30 transition-all duration-300 group"
                  title="Quiz Spirituel"
                  aria-label="Ouvrir le quiz spirituel"
                >
                  <HelpCircle className="w-4 h-4 text-amber-500/50 group-hover:text-amber-400/70 transition-colors" />
                </button>
              )}

              {/* Chapter Map button */}
              {showSettingsButton && (
                <button
                  onClick={() => setChapterMapOpen(true)}
                  className="p-2.5 rounded-lg bg-[#0d0c14]/80 backdrop-blur-sm border border-amber-800/15 hover:bg-amber-900/20 hover:border-amber-700/30 transition-all duration-300 group"
                  title="Carte du Voyage"
                  aria-label="Ouvrir la carte du voyage"
                >
                  <MapIcon className="w-4 h-4 text-amber-500/50 group-hover:text-amber-400/70 transition-colors" />
                </button>
              )}

              {/* Achievements / Trophy button */}
              {showSettingsButton && (
                <button
                  onClick={() => setAchievementsOpen(true)}
                  className="p-2.5 rounded-lg bg-[#0d0c14]/80 backdrop-blur-sm border border-amber-800/15 hover:bg-amber-900/20 hover:border-amber-700/30 transition-all duration-300 group"
                  title="Succès"
                  aria-label="Ouvrir les succès"
                >
                  <Trophy className="w-4 h-4 text-amber-500/50 group-hover:text-amber-400/70 transition-colors" />
                </button>
              )}

              {/* Reading Stats button */}
              {showSettingsButton && (
                <button onClick={() => setReadingStatsOpen(true)} className="p-2.5 rounded-lg bg-[#0d0c14]/80 backdrop-blur-sm border border-amber-800/15 hover:bg-amber-900/20 hover:border-amber-700/30 transition-all duration-300 group" title="Statistiques" aria-label="Statistiques de lecture">
                  <BarChart3 className="w-4 h-4 text-amber-500/50 group-hover:text-amber-400/70 transition-colors" />
                </button>
              )}

              {/* Story Path Map button */}
              {showSettingsButton && (
                <button
                  onClick={() => setStoryPathOpen(true)}
                  className="p-2.5 rounded-lg bg-[#0d0c14]/80 backdrop-blur-sm border border-amber-800/15 hover:bg-amber-900/20 hover:border-amber-700/30 transition-all duration-300 group"
                  title="Carte des chemins"
                  aria-label="Ouvrir la carte des chemins"
                >
                  <GitBranch className="w-4 h-4 text-amber-500/50 group-hover:text-amber-400/70 transition-colors" />
                </button>
              )}
            </div>}
          </>
        )}

        {/* Back button — hidden in focus mode */}
        {showBackButton && !focusMode && <BackButton onGoBack={handleGoBack} />}

        {/* Home button — hidden in focus mode */}
        {showReadingUI && !focusMode && (
          <button
            onClick={handleGoHome}
            className="fixed top-14 left-4 z-30 p-2.5 rounded-lg bg-[#0d0c14]/80 backdrop-blur-sm border border-amber-800/15 hover:bg-amber-900/20 hover:border-amber-700/30 transition-all duration-300 group"
            title="Accueil"
            aria-label="Retourner à l'accueil"
          >
            <HomeIcon className="w-4 h-4 text-amber-500/50 group-hover:text-amber-400/70 transition-colors" />
          </button>
        )}

        {/* Bookmarks panel button — hidden in focus mode */}
        {showBookmarkButton && !focusMode && (
          <button
            onClick={() => setBookmarkOpen(true)}
            className="fixed top-14 left-14 z-30 p-2.5 rounded-lg bg-[#0d0c14]/80 backdrop-blur-sm border border-amber-800/15 hover:bg-amber-900/20 hover:border-amber-700/30 transition-all duration-300 group"
            title="Favoris"
            aria-label="Ouvrir les favoris"
          >
            <Bookmark className="w-4 h-4 text-amber-500/50 group-hover:text-amber-400/70 transition-colors" />
          </button>
        )}

        {/* Bismillah at chapter starts */}
        {view === 'reading' && currentPage?.isChapterStart && currentPage.chapter >= 1 && (
          <div className="pt-14">
            <BismillahHeader />
          </div>
        )}

        <AnimatePresence mode="wait">
          {view === 'reading' && currentPage && !currentPage.isEnding && (
            <div key={currentPageId}>
              <StoryPageView page={currentPage} onContinue={handleContinue} />
              {currentPage.choices && (
                <div className="max-w-2xl mx-auto px-4 pb-20">
                  <ChoiceButtons choices={currentPage.choices} onChoose={handleChoice} />
                </div>
              )}
            </div>
          )}

          {showReadingUI && currentPage && (
            <StoryHint
              hasChoices={!!currentPage.choices && currentPage.choices.length > 0}
              choiceCount={currentPage.choices?.length}
            />
          )}

          {view === 'chapter-transition' && transitioningChapter && (
            <ChapterTitle
              key={`chapter-${transitioningChapter.chapter}`}
              chapter={transitioningChapter.chapter}
              title={transitioningChapter.title}
              onComplete={handleChapterTransitionComplete}
            />
          )}

          {view === 'ending' && currentPage?.isEnding && (
            <EndingScreen
              page={currentPage}
              endingsFound={endingsFound}
              onRestart={handleRestart}
            />
          )}
        </AnimatePresence>

        {/* TTS Narration — only in reading mode */}
        {showReadingUI && currentPage && (
          <TTSNarration paragraphs={currentPage.paragraphs} />
        )}

        {/* Focus Mode Toggle — always shown in reading mode (handles own visibility) */}
        {showReadingUI && <FocusModeToggle />}

        {/* Bookmark Button — hidden in focus mode */}
        {showReadingUI && !focusMode && <BookmarkButton pageId={currentPageId} />}

        {/* Mood Indicator Widget — hidden in focus mode */}
        {showReadingUI && !focusMode && <MoodIndicator mood={currentMood} />}

        {/* Virtue Meter — hidden in focus mode */}
        {showVirtueMeter && !focusMode && <VirtueMeter />}

        {/* Choice Journal sidebar */}
        <ChoiceJournal isOpen={journalOpen} onClose={() => setJournalOpen(false)} />

        {/* Settings Panel */}
        <SettingsPanel
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          onOpenAchievements={() => setAchievementsOpen(true)}
        />

        {/* Achievement Notification Toast — wired with sound */}
        <AchievementNotification soundRef={achievementSoundRef} />

        {/* Achievements Panel */}
        <AchievementsPanel isOpen={achievementsOpen} onClose={() => setAchievementsOpen(false)} />

        {/* Spiritual Glossary */}
        <SpiritualGlossary isOpen={glossaryOpen} onClose={() => setGlossaryOpen(false)} />

        {/* Chapter Map Panel */}
        <ChapterMap
          isOpen={chapterMapOpen}
          onClose={() => setChapterMapOpen(false)}
          onNavigate={(pageId) => {
            setView('reading');
            setTransitioningChapter(null);
            const page = storyPages[pageId];
            if (page) {
              goToPage(pageId, page.chapter);
            }
          }}
        />

        {/* Spiritual Quiz Panel */}
        <SpiritualQuiz isOpen={quizOpen} onClose={() => setQuizOpen(false)} />

        {/* Reading Stats Panel */}
        <ReadingStats isOpen={readingStatsOpen} onClose={() => setReadingStatsOpen(false)} />

        {/* Page Search Panel */}
        <PageSearch
          isOpen={pageSearchOpen}
          onClose={() => setPageSearchOpen(false)}
          onNavigate={(pageId) => {
            setView('reading');
            setTransitioningChapter(null);
            const page = storyPages[pageId];
            if (page) {
              goToPage(pageId, page.chapter);
            }
          }}
        />

        {/* Story Path Map */}
        <StoryPathMap isOpen={storyPathOpen} onClose={() => setStoryPathOpen(false)} />

        {/* Bookmarks Panel */}
        <BookmarksPanel
          isOpen={bookmarkOpen}
          onClose={() => setBookmarkOpen(false)}
          onNavigate={(pageId) => {
            setView('reading');
            setTransitioningChapter(null);
            const page = storyPages[pageId];
            if (page) {
              goToPage(pageId, page.chapter);
            }
          }}
        />

        {/* Reading Timer — visible during reading */}
        {showReadingUI && <ReadingTimer />}
      </main>

      {/* Sticky footer — only during reading, hidden in focus mode */}
      {showFooter && !focusMode && (
        <footer className="enhanced-footer footer-bottom-fade relative z-20 mt-auto py-3 px-4 text-center bg-gradient-to-t from-[#0a0a0f]/80 to-transparent backdrop-blur-sm border-t border-amber-900/10">
          {/* Shimmer line above footer text */}
          <div className="footer-shimmer-line" />
          <div className="flex items-center justify-center gap-2">
            <span className="icon-breathe text-amber-700/25" style={{ fontSize: '12px', '--delay': '0s' } as React.CSSProperties}>✦</span>
            <Moon className="icon-breathe footer-icon w-3 h-3 text-amber-700/30" style={{ '--delay': '0.5s' } as React.CSSProperties} />
            <span className="text-amber-700/30 text-[11px] font-serif tracking-wide">
              Le Voyage Intérieur de Souhayl — Tome 1
            </span>
            <Star className="icon-breathe footer-icon w-2.5 h-2.5 text-amber-700/20" style={{ '--delay': '1.2s' } as React.CSSProperties} />
          </div>
          {/* Keyboard shortcut hint — desktop only */}
          <div className="hidden md:flex items-center justify-center gap-1.5 mt-1">
            <span className="text-amber-700/20 text-[9px] font-serif">
              ⌨️ Espace pour continuer • 1-2-3 pour choisir • Échap pour revenir
            </span>
          </div>
        </footer>
      )}
    </div>
  );
}
