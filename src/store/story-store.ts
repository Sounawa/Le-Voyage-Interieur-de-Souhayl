import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storyPages } from '@/data/story-data';

interface StoryStore {
  // Story state
  currentPageId: string;
  visitedPages: string[];
  pageVisitCounts: Record<string, number>;
  chosenTags: string[];
  chaptersCompleted: number[];
  endingsFound: string[];
  startedAt: number;
  isComplete: boolean;
  hasStarted: boolean;
  history: string[];

  // Settings (persisted separately from story state)
  fontSize: 'sm' | 'md' | 'lg';
  lineHeight: 'compact' | 'normal' | 'relaxed';
  fontFamily: 'serif' | 'sans';
  soundEnabled: boolean;
  soundVolume: number; // 0-100, default 50
  autoContinue: boolean;
  ttsEnabled: boolean;
  ttsRate: number;
  ttsAutoPlay: boolean;
  focusMode: boolean;

  // Bookmarks
  bookmarks: string[];

  // Reading stats
  readingStartTime: number | null;
  totalReadingTime: number;
  sessionCount: number;
  lastSessionDate: string | null;

  // Achievements
  achievements: string[];

  // Story actions
  goToPage: (pageId: string, chapter?: number) => void;
  makeChoice: (choiceId: string, nextPage: string, tag?: string, chapter?: number) => void;
  markChapterComplete: (chapter: number) => void;
  markEndingFound: (endingType: string) => void;
  restart: () => void;
  goBack: () => string | null;

  // Settings actions
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  setLineHeight: (h: 'compact' | 'normal' | 'relaxed') => void;
  setFontFamily: (f: 'serif' | 'sans') => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (vol: number) => void;
  setAutoContinue: (enabled: boolean) => void;
  setTTSEnabled: (enabled: boolean) => void;
  setTTSRate: (rate: number) => void;
  setTTSAutoPlay: (auto: boolean) => void;
  setFocusMode: (enabled: boolean) => void;
  toggleFocusMode: () => void;

  // Bookmark actions
  toggleBookmark: (pageId: string) => void;
  isBookmarked: (pageId: string) => boolean;
  getBookmarkTitle: (pageId: string) => string;

  // Reading stats actions
  addReadingTime: (ms: number) => void;

  // Achievement actions
  unlockAchievement: (id: string) => void;
  hasAchievement: (id: string) => boolean;

  // Internal: pending achievement unlocks (for notification)
  _pendingUnlock: string | null;
  _clearPendingUnlock: () => void;
}

const MAX_HISTORY = 50;

const storyInitialState = {
  currentPageId: 'prologue',
  visitedPages: ['prologue'] as string[],
  pageVisitCounts: { prologue: 1 } as Record<string, number>,
  chosenTags: [] as string[],
  chaptersCompleted: [] as number[],
  endingsFound: [] as string[],
  startedAt: Date.now(),
  isComplete: false,
  hasStarted: false,
  history: [] as string[],
};

const settingsInitialState = {
  fontSize: 'md' as 'sm' | 'md' | 'lg',
  lineHeight: 'normal' as const,
  fontFamily: 'serif' as const,
  soundEnabled: true,
  soundVolume: 50 as number,
  autoContinue: false,
  ttsEnabled: false,
  ttsRate: 1,
  ttsAutoPlay: false,
  focusMode: false,
  bookmarks: [] as string[],
  readingStartTime: null as number | null,
  totalReadingTime: 0,
  sessionCount: 0,
  lastSessionDate: null as string | null,
  achievements: [] as string[],
};

function checkAndUnlockAchievements(
  state: {
    visitedPages: string[];
    pageVisitCounts: Record<string, number>;
    endingsFound: string[];
    chaptersCompleted: number[];
    bookmarks: string[];
    achievements: string[];
    chosenTags: string[];
  },
  set: (fn: (s: StoryStore) => Partial<StoryStore>) => void,
  triggers: string[]
) {
  const newAchievements: string[] = [];

  if (triggers.includes('page_visit')) {
    // first_step: make first choice (has any chosenTags)
    if (state.chosenTags.length > 0 && !state.achievements.includes('first_step')) {
      newAchievements.push('first_step');
    }
    // curious_soul: visit 10 different pages
    if (state.visitedPages.length >= 10 && !state.achievements.includes('curious_soul')) {
      newAchievements.push('curious_soul');
    }
    // seeker: visit 25 different pages
    if (state.visitedPages.length >= 25 && !state.achievements.includes('seeker')) {
      newAchievements.push('seeker');
    }
    // explorer: visit 50 different pages
    if (state.visitedPages.length >= 50 && !state.achievements.includes('explorer')) {
      newAchievements.push('explorer');
    }
    // bookworm: visit 100 pages
    if (state.visitedPages.length >= 100 && !state.achievements.includes('bookworm')) {
      newAchievements.push('bookworm');
    }
    // persistent: visit the same page 2+ times
    const hasRepeated = Object.values(state.pageVisitCounts).some((c) => c >= 2);
    if (hasRepeated && !state.achievements.includes('persistent')) {
      newAchievements.push('persistent');
    }
  }

  if (triggers.includes('ending')) {
    // collector: find 1 ending
    if (state.endingsFound.length >= 1 && !state.achievements.includes('collector')) {
      newAchievements.push('collector');
    }
    // sage: find all 4 endings
    if (state.endingsFound.length >= 4 && !state.achievements.includes('sage')) {
      newAchievements.push('sage');
    }
  }

  if (triggers.includes('chapter')) {
    // patient: reach chapter 3
    if (state.chaptersCompleted.includes(3) && !state.achievements.includes('patient')) {
      newAchievements.push('patient');
    }
    // brave: reach chapter 4
    if (state.chaptersCompleted.includes(4) && !state.achievements.includes('brave')) {
      newAchievements.push('brave');
    }
  }

  if (triggers.includes('bookmark')) {
    // bookmark_fan: add 3 bookmarks
    if (state.bookmarks.length >= 3 && !state.achievements.includes('bookmark_fan')) {
      newAchievements.push('bookmark_fan');
    }
  }

  if (newAchievements.length > 0) {
    set((s) => ({
      achievements: [...new Set([...s.achievements, ...newAchievements])],
      _pendingUnlock: newAchievements[0],
    }));
  }
}

export const useStoryStore = create<StoryStore>()(
  persist(
    (set, get) => ({
      ...storyInitialState,
      ...settingsInitialState,
      _pendingUnlock: null,

      goToPage: (pageId, chapter) => {
        set((state) => {
          const newHistory = [...state.history, state.currentPageId].slice(-MAX_HISTORY);
          const newVisited = [...new Set([...state.visitedPages, pageId])];
          const newVisitCounts = { ...state.pageVisitCounts };
          newVisitCounts[pageId] = (newVisitCounts[pageId] || 0) + 1;
          const newChapters = chapter && !state.chaptersCompleted.includes(chapter)
            ? [...state.chaptersCompleted, chapter]
            : state.chaptersCompleted;
          return {
            currentPageId: pageId,
            visitedPages: newVisited,
            pageVisitCounts: newVisitCounts,
            chaptersCompleted: newChapters,
            history: newHistory,
            readingStartTime: state.readingStartTime ?? Date.now(),
          };
        });
        // Achievement checks
        const s = get();
        checkAndUnlockAchievements(
          { ...s, ...get() },
          set,
          ['page_visit', ...(chapter ? ['chapter'] : [])]
        );
      },

      makeChoice: (choiceId, nextPage, tag, chapter) => {
        set((state) => {
          const newHistory = [...state.history, state.currentPageId].slice(-MAX_HISTORY);
          const newTags = tag ? [...state.chosenTags, tag] : state.chosenTags;
          const newVisited = [...new Set([...state.visitedPages, nextPage])];
          const newVisitCounts = { ...state.pageVisitCounts };
          newVisitCounts[nextPage] = (newVisitCounts[nextPage] || 0) + 1;
          const newChapters = chapter && !state.chaptersCompleted.includes(chapter)
            ? [...state.chaptersCompleted, chapter]
            : state.chaptersCompleted;
          return {
            currentPageId: nextPage,
            visitedPages: newVisited,
            pageVisitCounts: newVisitCounts,
            chosenTags: newTags,
            chaptersCompleted: newChapters,
            history: newHistory,
            readingStartTime: state.readingStartTime ?? Date.now(),
          };
        });
        // Achievement checks
        const s = get();
        checkAndUnlockAchievements(
          { ...s, ...get() },
          set,
          ['page_visit', ...(chapter ? ['chapter'] : [])]
        );
      },

      markChapterComplete: (chapter) => {
        set((state) => ({
          chaptersCompleted: state.chaptersCompleted.includes(chapter)
            ? state.chaptersCompleted
            : [...state.chaptersCompleted, chapter],
        }));
        // Achievement checks
        const s = get();
        checkAndUnlockAchievements(s, set, ['chapter']);
      },

      markEndingFound: (endingType) => {
        set((state) => ({
          endingsFound: state.endingsFound.includes(endingType)
            ? state.endingsFound
            : [...state.endingsFound, endingType],
          isComplete: true,
        }));
        // Achievement checks
        const s = get();
        checkAndUnlockAchievements(s, set, ['ending']);
      },

      goBack: () => {
        const state = get();
        if (state.history.length === 0) return null;
        const newHistory = [...state.history];
        const previousPageId = newHistory.pop()!;
        set({
          currentPageId: previousPageId,
          history: newHistory,
        });
        return previousPageId;
      },

      restart: () => {
        set({
          ...storyInitialState,
          startedAt: Date.now(),
          visitedPages: ['prologue'],
          pageVisitCounts: { prologue: 1 },
          readingStartTime: null,
        });
      },

      setFontSize: (size) => set({ fontSize: size }),
      setLineHeight: (h) => set({ lineHeight: h }),
      setFontFamily: (f) => set({ fontFamily: f }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setSoundVolume: (vol) => set({ soundVolume: Math.max(0, Math.min(100, vol)) }),
      setAutoContinue: (enabled) => set({ autoContinue: enabled }),
      setTTSEnabled: (enabled) => set({ ttsEnabled: enabled }),
      setTTSRate: (r) => set({ ttsRate: Math.max(0.5, Math.min(2, r)) }),
      setTTSAutoPlay: (auto) => set({ ttsAutoPlay: auto }),
      setFocusMode: (enabled) => set({ focusMode: enabled }),
      toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),

      toggleBookmark: (pageId) => {
        set((state) => {
          const isBookmarked = state.bookmarks.includes(pageId);
          return {
            bookmarks: isBookmarked
              ? state.bookmarks.filter((id) => id !== pageId)
              : [...state.bookmarks, pageId],
          };
        });
        // Achievement checks
        const s = get();
        checkAndUnlockAchievements(s, set, ['bookmark']);
      },

      isBookmarked: (pageId) => {
        return get().bookmarks.includes(pageId);
      },

      getBookmarkTitle: (pageId) => {
        const page = storyPages[pageId];
        if (!page) return pageId;
        return page.title || page.chapterTitle || pageId;
      },

      addReadingTime: (ms) => {
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          const isNewSession = state.lastSessionDate !== today;
          return {
            totalReadingTime: state.totalReadingTime + ms,
            sessionCount: isNewSession ? state.sessionCount + 1 : state.sessionCount,
            lastSessionDate: today,
          };
        });
      },

      unlockAchievement: (id) => {
        set((state) => {
          if (state.achievements.includes(id)) return state;
          return {
            achievements: [...state.achievements, id],
            _pendingUnlock: id,
          };
        });
      },

      hasAchievement: (id) => {
        return get().achievements.includes(id);
      },

      _clearPendingUnlock: () => set({ _pendingUnlock: null }),
    }),
    {
      name: 'souhayl-journey-v1',
    }
  )
);
