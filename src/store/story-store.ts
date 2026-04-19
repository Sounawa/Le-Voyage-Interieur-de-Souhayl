import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storyPages } from '@/data/story-data';

interface StoryStore {
  // Story state
  currentPageId: string;
  visitedPages: string[];
  chosenTags: string[];
  chaptersCompleted: number[];
  endingsFound: string[];
  startedAt: number;
  isComplete: boolean;
  hasStarted: boolean;
  history: string[];

  // Settings (persisted separately from story state)
  fontSize: 'sm' | 'md' | 'lg';
  soundEnabled: boolean;
  autoContinue: boolean;

  // Bookmarks
  bookmarks: string[];

  // Reading stats
  readingStartTime: number | null;

  // Story actions
  goToPage: (pageId: string, chapter?: number) => void;
  makeChoice: (choiceId: string, nextPage: string, tag?: string, chapter?: number) => void;
  markChapterComplete: (chapter: number) => void;
  markEndingFound: (endingType: string) => void;
  restart: () => void;
  goBack: () => string | null;

  // Settings actions
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  setSoundEnabled: (enabled: boolean) => void;
  setAutoContinue: (enabled: boolean) => void;

  // Bookmark actions
  toggleBookmark: (pageId: string) => void;
  isBookmarked: (pageId: string) => boolean;
  getBookmarkTitle: (pageId: string) => string;
}

const MAX_HISTORY = 50;

const storyInitialState = {
  currentPageId: 'prologue',
  visitedPages: ['prologue'] as string[],
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
  soundEnabled: true,
  autoContinue: false,
  bookmarks: [] as string[],
  readingStartTime: null as number | null,
};

export const useStoryStore = create<StoryStore>()(
  persist(
    (set, get) => ({
      ...storyInitialState,
      ...settingsInitialState,

      goToPage: (pageId, chapter) => {
        set((state) => {
          const newHistory = [...state.history, state.currentPageId].slice(-MAX_HISTORY);
          const newVisited = [...new Set([...state.visitedPages, pageId])];
          const newChapters = chapter && !state.chaptersCompleted.includes(chapter)
            ? [...state.chaptersCompleted, chapter]
            : state.chaptersCompleted;
          return {
            currentPageId: pageId,
            visitedPages: newVisited,
            chaptersCompleted: newChapters,
            history: newHistory,
            readingStartTime: state.readingStartTime ?? Date.now(),
          };
        });
      },

      makeChoice: (choiceId, nextPage, tag, chapter) => {
        set((state) => {
          const newHistory = [...state.history, state.currentPageId].slice(-MAX_HISTORY);
          const newTags = tag ? [...state.chosenTags, tag] : state.chosenTags;
          const newVisited = [...new Set([...state.visitedPages, nextPage])];
          const newChapters = chapter && !state.chaptersCompleted.includes(chapter)
            ? [...state.chaptersCompleted, chapter]
            : state.chaptersCompleted;
          return {
            currentPageId: nextPage,
            visitedPages: newVisited,
            chosenTags: newTags,
            chaptersCompleted: newChapters,
            history: newHistory,
            readingStartTime: state.readingStartTime ?? Date.now(),
          };
        });
      },

      markChapterComplete: (chapter) => {
        set((state) => ({
          chaptersCompleted: state.chaptersCompleted.includes(chapter)
            ? state.chaptersCompleted
            : [...state.chaptersCompleted, chapter],
        }));
      },

      markEndingFound: (endingType) => {
        set((state) => ({
          endingsFound: state.endingsFound.includes(endingType)
            ? state.endingsFound
            : [...state.endingsFound, endingType],
          isComplete: true,
        }));
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
          readingStartTime: null,
        });
      },

      setFontSize: (size) => set({ fontSize: size }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setAutoContinue: (enabled) => set({ autoContinue: enabled }),

      toggleBookmark: (pageId) => {
        set((state) => {
          const isBookmarked = state.bookmarks.includes(pageId);
          return {
            bookmarks: isBookmarked
              ? state.bookmarks.filter((id) => id !== pageId)
              : [...state.bookmarks, pageId],
          };
        });
      },

      isBookmarked: (pageId) => {
        return get().bookmarks.includes(pageId);
      },

      getBookmarkTitle: (pageId) => {
        const page = storyPages[pageId];
        if (!page) return pageId;
        return page.title || page.chapterTitle || pageId;
      },
    }),
    {
      name: 'souhayl-journey-v1',
    }
  )
);
