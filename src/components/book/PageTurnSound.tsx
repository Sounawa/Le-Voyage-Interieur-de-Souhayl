'use client';

import { useCallback, useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import { useStoryStore } from '@/store/story-store';

export interface PageTurnSoundHandle {
  playPageTurn: () => void;
}

/**
 * Invisible component that generates a subtle page-turn sound using Web Audio API.
 * Uses a white noise burst filtered through a bandpass filter (2000–4000Hz)
 * with a quick gain envelope (attack 5ms, decay 300ms) to simulate paper.
 */
const PageTurnSound = forwardRef<PageTurnSoundHandle>(function PageTurnSound(_props, ref) {
  const soundEnabled = useStoryStore((s) => s.soundEnabled);
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseBufferRef = useRef<AudioBuffer | null>(null);

  // Lazily create the AudioContext and pre-generate the white noise buffer
  const ensureAudioContext = useCallback(() => {
    if (audioContextRef.current) return audioContextRef.current;
    try {
      const ctx = new (window.AudioContext || (window as unknown as Record<string, unknown>).webkitAudioContext as typeof AudioContext)();
      audioContextRef.current = ctx;

      // Pre-generate a 0.5s white noise buffer (reuse across plays)
      const sampleRate = ctx.sampleRate;
      const length = Math.ceil(sampleRate * 0.5);
      const buffer = ctx.createBuffer(1, length, sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      noiseBufferRef.current = buffer;

      return ctx;
    } catch {
      // Web Audio API not supported
      return null;
    }
  }, []);

  const playPageTurn = useCallback(() => {
    if (!soundEnabled) return;

    const ctx = ensureAudioContext();
    if (!ctx || !noiseBufferRef.current) return;

    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // --- Source: noise buffer ---
    const source = ctx.createBufferSource();
    source.buffer = noiseBufferRef.current;

    // --- Bandpass filter (2000–4000Hz) to simulate paper texture ---
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 3000;
    bandpass.Q.value = 0.7;

    // --- Gain envelope: attack 5ms, decay 300ms ---
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.005); // quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3); // decay

    // --- Optional highpass to remove rumble ---
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 800;
    highpass.Q.value = 0.5;

    // Connect: source → highpass → bandpass → gain → destination
    source.connect(highpass);
    highpass.connect(bandpass);
    bandpass.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Play and auto-cleanup
    source.start(now);
    source.stop(now + 0.35);

    source.onended = () => {
      source.disconnect();
      highpass.disconnect();
      bandpass.disconnect();
      gainNode.disconnect();
    };
  }, [soundEnabled, ensureAudioContext]);

  // Expose playPageTurn to parent via ref
  useImperativeHandle(ref, () => ({ playPageTurn }), [playPageTurn]);

  // Cleanup on unmount
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

  // This component renders nothing visible
  return null;
});

export default PageTurnSound;
