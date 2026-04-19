'use client';

import { AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { BookOpen, BookMarked, Bookmark, Moon, Scroll, Settings, Star } from 'lucide-react';
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

type AppView = 'cover' | 'reading' | 'chapter-transition' | 'ending';

export default function Home() {
  const { currentPageId, visitedPages, endingsFound, goToPage, makeChoice, markEndingFound, restart } = useStoryStore();
  const [savedView] = useState<AppView>(() => {
    if (typeof window === 'undefined') return 'cover';
    const hasSave = useStoryStore.getState().hasStarted;
    return hasSave ? 'reading' : 'cover';
  });
  const [view, setView] = useState<AppView>(savedView);
  const [transitioningChapter, setTransitioningChapter] = useState<{ chapter: number; title: string } | null>(null);
  const [previousChapter, setPreviousChapter] = useState<number>(-1);
  const [journalOpen, setJournalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [bookmarkOpen, setBookmarkOpen] = useState(false);

  const currentPage = storyPages[currentPageId];

  const handleStart = useCallback(() => {
    setView('reading');
    const startPage = storyPages[currentPageId] || storyPages[firstPageId];
    if (startPage?.isChapterStart && startPage.chapter >= 1) {
      setTransitioningChapter({ chapter: startPage.chapter, title: startPage.chapterTitle });
      setView('chapter-transition');
    }
  }, [currentPageId]);

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

    if (nextPage.isChapterStart && nextPage.chapter !== previousChapter) {
      setTransitioningChapter({ chapter: nextPage.chapter, title: nextPage.chapterTitle });
      setView('chapter-transition');
      setPreviousChapter(nextPage.chapter);
      goToPage(nextPage.id, nextPage.chapter);
      return;
    }

    goToPage(nextPage.id, nextPage.chapter);
  }, [currentPage, previousChapter, goToPage]);

  const handleChoice = useCallback((choice: Choice) => {
    const nextPage = storyPages[choice.nextPage];
    if (!nextPage) return;

    if (choice.tag) {
      if (nextPage.isChapterStart && nextPage.chapter !== previousChapter) {
        makeChoice(choice.id, nextPage.id, choice.tag, nextPage.chapter);
        setTransitioningChapter({ chapter: nextPage.chapter, title: nextPage.chapterTitle });
        setView('chapter-transition');
        setPreviousChapter(nextPage.chapter);
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

  const handleGoBack = useCallback(() => {
    // The goBack action in the store already updates currentPageId.
    // We need to set the view back to 'reading' if it was in chapter-transition.
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
      <main className="flex-1 text-amber-100/90 transition-colors duration-1000">
        {/* Background layers */}
        <div className="fixed inset-0 -z-10">
          <div className={`absolute inset-0 ${getMoodClasses()}`} style={{ transition: 'background 1.5s ease' }} />
          <div className="absolute inset-0 mood-overlay" style={{ ...getMoodOverlayStyle(), transition: 'background 1.5s ease' }} />
        </div>
        <ParticleBackground mood={currentMood} />
        <IslamicPattern />
        <VignetteOverlay />
        <AmbientSound mood={currentMood} />

        {view === 'cover' && (
          <BookCover onStart={handleStart} />
        )}

        {view !== 'cover' && view !== 'ending' && (
          <>
            <ProgressBar currentPageId={currentPageId} totalPages={Object.keys(storyPages).length} />

            {/* Top bar buttons: back, glossary, journal, settings */}
            <div className="fixed top-14 right-4 z-30 flex items-center gap-2">
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
            </div>
          </>
        )}

        {/* Back button */}
        {showBackButton && <BackButton onGoBack={handleGoBack} />}

        {/* Bookmarks panel button — next to back button */}
        {showBookmarkButton && (
          <button
            onClick={() => setBookmarkOpen(true)}
            className="fixed top-14 left-14 z-30 p-2.5 rounded-lg bg-transparent hover:bg-amber-900/20 border border-transparent hover:border-amber-800/15 transition-all duration-300 group"
            title="Favoris"
            aria-label="Ouvrir les favoris"
          >
            <Bookmark className="w-4 h-4 text-amber-500/40 group-hover:text-amber-400/70 transition-colors" />
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

        {/* Bookmark Button — bottom right */}
        {showReadingUI && <BookmarkButton pageId={currentPageId} />}

        {/* Virtue Meter */}
        {showVirtueMeter && <VirtueMeter />}

        {/* Choice Journal sidebar */}
        <ChoiceJournal isOpen={journalOpen} onClose={() => setJournalOpen(false)} />

        {/* Settings Panel */}
        <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

        {/* Spiritual Glossary */}
        <SpiritualGlossary isOpen={glossaryOpen} onClose={() => setGlossaryOpen(false)} />

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
      </main>

      {/* Sticky footer - only during reading */}
      {showFooter && (
        <footer className="relative z-20 mt-auto py-3 px-4 text-center bg-gradient-to-t from-[#0a0a0f]/80 to-transparent backdrop-blur-sm border-t border-amber-900/10">
          <div className="flex items-center justify-center gap-2">
            <Moon className="w-3 h-3 text-amber-700/30" />
            <span className="text-amber-700/30 text-[11px] font-serif tracking-wide">
              Le Voyage Intérieur de Souhayl — Tome 1
            </span>
            <Star className="w-2.5 h-2.5 text-amber-700/20" />
          </div>
        </footer>
      )}
    </div>
  );
}
