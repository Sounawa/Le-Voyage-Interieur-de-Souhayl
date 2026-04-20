'use client';

import { useCallback, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useStoryStore } from '@/store/story-store';

interface BackButtonProps {
  onGoBack: () => void;
}

export default function BackButton({ onGoBack }: BackButtonProps) {
  const { history, goBack } = useStoryStore();

  const canGoBack = history.length > 0;

  const handleGoBack = useCallback(() => {
    if (!canGoBack) return;
    const previousPageId = goBack();
    if (previousPageId) {
      onGoBack();
    }
  }, [canGoBack, goBack, onGoBack]);

  // Keyboard shortcut: Escape or Backspace to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        // Don't trigger if user is typing in an input
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        handleGoBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGoBack]);

  if (!canGoBack) return null;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleGoBack();
      }}
      className="fixed top-14 left-4 z-30 p-2.5 rounded-lg bg-transparent hover:bg-amber-900/20 border border-transparent hover:border-amber-800/15 transition-all duration-300 group"
      title="Retour"
      aria-label="Retour à la page précédente"
    >
      <ArrowLeft className="w-4 h-4 text-amber-500/40 group-hover:text-amber-400/70 transition-colors" />
    </button>
  );
}
