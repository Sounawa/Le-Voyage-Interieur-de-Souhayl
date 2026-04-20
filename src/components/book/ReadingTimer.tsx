'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Clock } from 'lucide-react';
import { useStoryStore } from '@/store/story-store';

/**
 * ReadingTimer — tracks session reading time and persists total to Zustand store.
 * Shows a subtle clock pill in the bottom-right corner during reading.
 * Saves accumulated time every 30 seconds to the store.
 */
export default function ReadingTimer() {
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSaveRef = useRef<number>(Date.now());
  const totalReadingTime = useStoryStore((s) => s.totalReadingTime);
  const addReadingTime = useStoryStore((s) => s.addReadingTime);
  const sessionCount = useStoryStore((s) => s.sessionCount);

  // Track reading time when the component is mounted (i.e., user is reading)
  useEffect(() => {
    // Small delay to avoid immediate start on mount
    const startDelay = setTimeout(() => {
      setIsTimerActive(true);
    }, 2000);

    intervalRef.current = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);

      // Save to store every 30 seconds
      const now = Date.now();
      if (now - lastSaveRef.current >= 30000) {
        addReadingTime(now - lastSaveRef.current);
        lastSaveRef.current = now;
      }
    }, 1000);

    return () => {
      clearTimeout(startDelay);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Save remaining time on unmount
      const remaining = Date.now() - lastSaveRef.current;
      if (remaining > 1000) {
        addReadingTime(remaining);
      }
    };
  }, [addReadingTime]);

  const formatTime = useCallback((seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}h ${String(m).padStart(2, '0')}m`;
    }
    return `${m}m ${String(s).padStart(2, '0')}s`;
  }, []);

  const formatTotalTime = useCallback((ms: number): string => {
    const totalSec = Math.floor(ms / 1000);
    return formatTime(totalSec);
  }, [formatTime]);

  // Don't show until we have at least 5 seconds of reading
  if (!isTimerActive || sessionSeconds < 5) return null;

  return (
    <div className="fixed bottom-16 right-4 z-20 reading-timer-pill">
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-serif
          bg-[#0d0c14]/70 backdrop-blur-md border border-amber-800/12
          hover:border-amber-700/25 transition-all duration-500 cursor-default select-none"
        title={`Session: ${formatTime(sessionSeconds)} · Total: ${formatTotalTime(totalReadingTime)} · ${sessionCount} session${sessionCount !== 1 ? 's' : ''}`}
      >
        <Clock className="w-3 h-3 text-amber-500/40" />
        <span className="text-amber-400/60 tabular-nums tracking-wide">
          {formatTime(sessionSeconds)}
        </span>
        <span className="text-amber-800/30">·</span>
        <span className="text-amber-600/35 tabular-nums">
          {formatTotalTime(totalReadingTime)}
        </span>
      </div>
    </div>
  );
}
