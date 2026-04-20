'use client';

import { useCallback, useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import { useStoryStore } from '@/store/story-store';

export interface AchievementSoundHandle {
  playAchievementSound: () => void;
}

/**
 * Invisible component that plays a celebratory arpeggio sound when an achievement is unlocked.
 * Three ascending tones (C5 → E5 → G5: 523Hz → 659Hz → 784Hz), 120ms each with slight overlap.
 */
const AchievementSound = forwardRef<AchievementSoundHandle>(function AchievementSound(_props, ref) {
  const soundEnabled = useStoryStore((s) => s.soundEnabled);
  const soundVolume = useStoryStore((s) => s.soundVolume);
  const audioContextRef = useRef<AudioContext | null>(null);

  const ensureAudioContext = useCallback(() => {
    if (audioContextRef.current) return audioContextRef.current;
    try {
      const ctx = new (window.AudioContext || (window as unknown as Record<string, unknown>).webkitAudioContext as typeof AudioContext)();
      audioContextRef.current = ctx;
      return ctx;
    } catch {
      return null;
    }
  }, []);

  const playAchievementSound = useCallback(() => {
    if (!soundEnabled) return;

    const ctx = ensureAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const volume = (soundVolume / 100) * 0.2;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    const noteDuration = 0.12; // 120ms per note
    const gap = 0.07; // 70ms between note starts (50ms overlap)

    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    notes.forEach((freq, i) => {
      const startTime = now + i * gap;

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.01); // 10ms attack
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + noteDuration + 0.01);

      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };

      oscillators.push(osc);
      gains.push(gain);
    });
  }, [soundEnabled, soundVolume, ensureAudioContext]);

  useImperativeHandle(ref, () => ({ playAchievementSound }), [playAchievementSound]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch {
          // already closed
        }
      }
    };
  }, []);

  return null;
});

export default AchievementSound;
