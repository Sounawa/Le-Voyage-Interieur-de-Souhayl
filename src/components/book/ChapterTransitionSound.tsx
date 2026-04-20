'use client';

import { useCallback, useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import { useStoryStore } from '@/store/story-store';

export interface ChapterTransitionSoundHandle {
  playChapterTransition: () => void;
}

/**
 * Invisible component that plays a mystical chapter transition sound.
 *
 * Sound design (Web Audio API synthesis):
 * 1. Soft low drone (150Hz sine, 600ms fade-in, 1.5s duration)
 * 2. Ascending shimmer: 3 notes rising C4→E4→G4, each 200ms with 100ms overlap
 * 3. Final soft chime at C5=523Hz, 400ms, gentle sine with long decay
 */
const ChapterTransitionSound = forwardRef<ChapterTransitionSoundHandle>(function ChapterTransitionSound(_props, ref) {
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

  const playChapterTransition = useCallback(() => {
    if (!soundEnabled) return;

    const ctx = ensureAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const volume = (soundVolume / 100) * 0.18;

    // === Layer 1: Soft low drone (150Hz, sine, 600ms fade-in, 1.5s duration) ===
    const droneOsc = ctx.createOscillator();
    droneOsc.type = 'sine';
    droneOsc.frequency.value = 150;

    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0, now);
    droneGain.gain.linearRampToValueAtTime(volume * 0.6, now + 0.6); // 600ms fade-in
    droneGain.gain.setValueAtTime(volume * 0.6, now + 1.0); // sustain
    droneGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5); // decay out

    droneOsc.connect(droneGain);
    droneGain.connect(ctx.destination);
    droneOsc.start(now);
    droneOsc.stop(now + 1.5);

    droneOsc.onended = () => {
      droneOsc.disconnect();
      droneGain.disconnect();
    };

    // === Layer 2: Ascending shimmer (C4=261Hz → E4=329Hz → G4=392Hz) ===
    const shimmerNotes = [261.63, 329.63, 392.0]; // C4, E4, G4
    const noteDuration = 0.2; // 200ms per note
    const noteGap = 0.1; // 100ms between note starts (100ms overlap)

    shimmerNotes.forEach((freq, i) => {
      const startTime = now + 0.2 + i * noteGap;

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(volume * 0.4, startTime + 0.03); // 30ms soft attack
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration); // decay

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + noteDuration + 0.01);

      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
    });

    // === Layer 3: Final soft chime (C5=523Hz, 400ms, long decay) ===
    const chimeStart = now + 0.6;

    const chimeOsc = ctx.createOscillator();
    chimeOsc.type = 'sine';
    chimeOsc.frequency.value = 523.25; // C5

    const chimeGain = ctx.createGain();
    chimeGain.gain.setValueAtTime(0, chimeStart);
    chimeGain.gain.linearRampToValueAtTime(volume * 0.5, chimeStart + 0.04); // 40ms gentle attack
    chimeGain.gain.exponentialRampToValueAtTime(0.001, chimeStart + 0.4); // 400ms long decay

    chimeOsc.connect(chimeGain);
    chimeGain.connect(ctx.destination);
    chimeOsc.start(chimeStart);
    chimeOsc.stop(chimeStart + 0.42);

    chimeOsc.onended = () => {
      chimeOsc.disconnect();
      chimeGain.disconnect();
    };
  }, [soundEnabled, soundVolume, ensureAudioContext]);

  useImperativeHandle(ref, () => ({ playChapterTransition }), [playChapterTransition]);

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

export default ChapterTransitionSound;
