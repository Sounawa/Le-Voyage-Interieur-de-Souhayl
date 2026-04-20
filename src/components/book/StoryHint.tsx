'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface StoryHintProps {
  hasChoices: boolean;
  choiceCount?: number;
}

// Idle thresholds in milliseconds
const CHOICE_GLOW_DELAY = 15_000; // 15s — subtle glow
const CHOICE_TEXT_DELAY = 25_000; // 25s — visible text hint
const CONTINUE_HINT_DELAY = 8_000; // 8s — down arrow for continue pages

type HintStage = 'hidden' | 'glow' | 'text';

export default function StoryHint({ hasChoices, choiceCount }: StoryHintProps) {
  const [stage, setStage] = useState<HintStage>('hidden');
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasChoicesRef = useRef(hasChoices);
  const stageRef = useRef<HintStage>('hidden');

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  }, []);

  // Sync refs when props/state change
  useEffect(() => {
    hasChoicesRef.current = hasChoices;
  }, [hasChoices]);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  // Start idle timers based on current page type from ref
  const startIdleTimer = useCallback(() => {
    clearTimers();

    const isChoices = hasChoicesRef.current;
    if (isChoices) {
      // Phase 1: subtle glow after 15s
      timerRef.current = setTimeout(() => {
        setStage('glow');
        // Phase 2: text appears after 25s
        timerRef.current = setTimeout(() => {
          setStage('text');
        }, CHOICE_TEXT_DELAY - CHOICE_GLOW_DELAY);
      }, CHOICE_GLOW_DELAY);
    } else {
      // Continue page: down arrow after 8s
      timerRef.current = setTimeout(() => {
        setStage('glow');
      }, CONTINUE_HINT_DELAY);
    }
  }, [clearTimers]);

  // Handle visibility transition for smooth fade-in/out
  useEffect(() => {
    if (stage === 'hidden') {
      // Schedule fade-out (async setState via setTimeout)
      fadeTimerRef.current = setTimeout(() => {
        setVisible(false);
      }, 300);
      return () => {
        if (fadeTimerRef.current) {
          clearTimeout(fadeTimerRef.current);
          fadeTimerRef.current = null;
        }
      };
    }
    // For 'glow' or 'text', schedule show (async setState via setTimeout)
    fadeTimerRef.current = setTimeout(() => {
      setVisible(true);
    }, 0);
    return () => {
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current);
        fadeTimerRef.current = null;
      }
    };
  }, [stage]);

  // Reset and start timer when hasChoices changes (page change)
  useEffect(() => {
    clearTimers();
    // Schedule reset and start asynchronously
    const initTimer = setTimeout(() => {
      setStage('hidden');
      setVisible(false);
    }, 0);
    const startTimer = setTimeout(() => {
      startIdleTimer();
    }, 1500);
    return () => {
      clearTimeout(initTimer);
      clearTimeout(startTimer);
      clearTimers();
    };
  }, [hasChoices, startIdleTimer, clearTimers]);

  // Listen for user interaction to reset timer
  useEffect(() => {
    const handleInteraction = () => {
      if (stageRef.current !== 'hidden') {
        clearTimers();
        // Async state updates from event handler (allowed)
        setStage('hidden');
        // Restart the idle timer after interaction
        const restartTimer = setTimeout(() => {
          startIdleTimer();
        }, 500);
        // Store for cleanup — we use a single timer ref approach
        return () => clearTimeout(restartTimer);
      }
    };

    const events = ['click', 'keydown', 'touchstart', 'wheel', 'mousemove'] as const;
    events.forEach((event) => {
      window.addEventListener(event, handleInteraction, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleInteraction);
      });
    };
  }, [clearTimers, startIdleTimer]);

  // Don't render anything when hidden and not fading
  if (!visible && stage === 'hidden') {
    return null;
  }

  const isChoicePage = hasChoices;

  return (
    <div
      className={`story-hint-container ${visible ? 'story-hint-visible' : 'story-hint-fading'}`}
      aria-hidden="true"
    >
      {isChoicePage ? (
        <div className="story-hint-lantern">
          {/* Lantern glow orb */}
          <div className="story-hint-orb">
            <div className="story-hint-orb-core" />
            <div className="story-hint-orb-ring" />
          </div>
          {/* Hint text — only visible in 'text' stage */}
          {stage === 'text' && (
            <p className="story-hint-text story-hint-text-reveal">
              Que ferais-tu, Souhayl&nbsp;?
            </p>
          )}
          {/* Choice count indicator in glow stage */}
          {stage === 'glow' && choiceCount !== undefined && choiceCount > 0 && (
            <div className="story-hint-dots">
              {Array.from({ length: choiceCount }).map((_, i) => (
                <span
                  key={i}
                  className="story-hint-dot"
                  style={{ animationDelay: `${i * 0.4}s` }}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="story-hint-continue-arrow">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      )}
    </div>
  );
}
