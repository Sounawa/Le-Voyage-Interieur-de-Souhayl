'use client';

import { useCallback, useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import { useStoryStore } from '@/store/story-store';

export interface ChoiceSoundHandle {
  playChoiceSound: () => void;
}

/**
 * Invisible component that plays a brief "chime" sound when the user makes a choice.
 * Two quick sine tones (880Hz + 1320Hz) in sequence, each 60ms, with smooth decay.
 */
const ChoiceSound = forwardRef<ChoiceSoundHandle>(function ChoiceSound(_props, ref) {
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

  const playChoiceSound = useCallback(() => {
    if (!soundEnabled) return;

    const ctx = ensureAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const volume = (soundVolume / 100) * 0.15;

    // First tone: 880Hz
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 880;

    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(volume, now + 0.005);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.07);

    osc1.onended = () => {
      osc1.disconnect();
      gain1.disconnect();
    };

    // Second tone: 1320Hz, starts 60ms after the first
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 1320;

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, now + 0.06);
    gain2.gain.linearRampToValueAtTime(volume, now + 0.065);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.06);
    osc2.stop(now + 0.13);

    osc2.onended = () => {
      osc2.disconnect();
      gain2.disconnect();
    };
  }, [soundEnabled, soundVolume, ensureAudioContext]);

  useImperativeHandle(ref, () => ({ playChoiceSound }), [playChoiceSound]);

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

export default ChoiceSound;
