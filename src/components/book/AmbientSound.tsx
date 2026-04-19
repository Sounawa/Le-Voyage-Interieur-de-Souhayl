'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useStoryStore } from '@/store/story-store';
import type { MoodType } from '@/lib/story-types';

interface AmbientSoundProps {
  mood: MoodType;
}

interface MoodConfig {
  oscillators: { type: OscillatorType; frequency: number; detune: number; gain: number }[];
  filterFreq: number;
  filterQ: number;
  masterGain: number;
}

const moodConfigs: Record<string, MoodConfig> = {
  prologue: {
    oscillators: [
      { type: 'sine', frequency: 110, detune: 0, gain: 0.5 },
      { type: 'sine', frequency: 165, detune: 5, gain: 0.25 },
      { type: 'sine', frequency: 220, detune: -3, gain: 0.15 },
      { type: 'triangle', frequency: 82.5, detune: 0, gain: 0.2 },
    ],
    filterFreq: 400,
    filterQ: 0.7,
    masterGain: 0.035,
  },
  wonder: {
    oscillators: [
      { type: 'sine', frequency: 130.8, detune: 0, gain: 0.5 },
      { type: 'sine', frequency: 196, detune: 7, gain: 0.3 },
      { type: 'sine', frequency: 261.6, detune: -5, gain: 0.2 },
      { type: 'triangle', frequency: 98, detune: 3, gain: 0.2 },
      { type: 'sine', frequency: 329.6, detune: 8, gain: 0.1 },
    ],
    filterFreq: 600,
    filterQ: 0.5,
    masterGain: 0.03,
  },
  darkness: {
    oscillators: [
      { type: 'sine', frequency: 73.4, detune: 0, gain: 0.5 },
      { type: 'sine', frequency: 110, detune: -10, gain: 0.35 },
      { type: 'sawtooth', frequency: 55, detune: 0, gain: 0.08 },
      { type: 'sine', frequency: 138.6, detune: 15, gain: 0.15 },
    ],
    filterFreq: 250,
    filterQ: 1.2,
    masterGain: 0.03,
  },
  danger: {
    oscillators: [
      { type: 'sine', frequency: 65.4, detune: 0, gain: 0.45 },
      { type: 'sine', frequency: 98, detune: -15, gain: 0.3 },
      { type: 'sawtooth', frequency: 49, detune: 5, gain: 0.06 },
      { type: 'triangle', frequency: 123.5, detune: 20, gain: 0.15 },
      { type: 'sine', frequency: 82.4, detune: -8, gain: 0.2 },
    ],
    filterFreq: 300,
    filterQ: 1.5,
    masterGain: 0.03,
  },
  wisdom: {
    oscillators: [
      { type: 'sine', frequency: 261.6, detune: 0, gain: 0.4 },
      { type: 'sine', frequency: 329.6, detune: 3, gain: 0.3 },
      { type: 'sine', frequency: 392, detune: -2, gain: 0.25 },
      { type: 'triangle', frequency: 196, detune: 5, gain: 0.15 },
      { type: 'sine', frequency: 523.3, detune: 0, gain: 0.08 },
    ],
    filterFreq: 900,
    filterQ: 0.4,
    masterGain: 0.025,
  },
  peace: {
    oscillators: [
      { type: 'sine', frequency: 196, detune: 0, gain: 0.4 },
      { type: 'sine', frequency: 246.9, detune: 4, gain: 0.3 },
      { type: 'sine', frequency: 293.7, detune: -3, gain: 0.2 },
      { type: 'triangle', frequency: 146.8, detune: 2, gain: 0.2 },
    ],
    filterFreq: 700,
    filterQ: 0.5,
    masterGain: 0.03,
  },
  triumph: {
    oscillators: [
      { type: 'sine', frequency: 130.8, detune: 0, gain: 0.35 },
      { type: 'sine', frequency: 196, detune: 5, gain: 0.3 },
      { type: 'sine', frequency: 261.6, detune: -2, gain: 0.25 },
      { type: 'triangle', frequency: 98, detune: 3, gain: 0.2 },
      { type: 'sine', frequency: 329.6, detune: 7, gain: 0.15 },
      { type: 'sine', frequency: 392, detune: -4, gain: 0.1 },
    ],
    filterFreq: 800,
    filterQ: 0.5,
    masterGain: 0.035,
  },
  ending: {
    oscillators: [
      { type: 'sine', frequency: 146.8, detune: 0, gain: 0.4 },
      { type: 'sine', frequency: 220, detune: 3, gain: 0.3 },
      { type: 'sine', frequency: 293.7, detune: -2, gain: 0.2 },
      { type: 'triangle', frequency: 110, detune: 5, gain: 0.2 },
      { type: 'sine', frequency: 369.9, detune: 0, gain: 0.1 },
    ],
    filterFreq: 750,
    filterQ: 0.4,
    masterGain: 0.035,
  },
};

export default function AmbientSound({ mood }: AmbientSoundProps) {
  const soundEnabled = useStoryStore((s) => s.soundEnabled);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{
    oscillators: OscillatorNode[];
    gains: GainNode[];
    masterGain: GainNode;
    filter: BiquadFilterNode;
  } | null>(null);
  const currentMoodRef = useRef<string>(mood);
  const hasInteracted = useRef(false);
  const fadeInRef = useRef<number | null>(null);
  const fadeOutRef = useRef<number | null>(null);

  const initAudio = useCallback(() => {
    if (audioContextRef.current) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as Record<string, unknown>).webkitAudioContext as typeof AudioContext)();
      audioContextRef.current = ctx;
    } catch {
      // Web Audio API not supported
    }
  }, []);

  const createMoodNodes = useCallback((moodKey: string) => {
    const ctx = audioContextRef.current;
    if (!ctx) return null;

    const config = moodConfigs[moodKey] || moodConfigs.prologue;

    // Clean up existing nodes
    if (nodesRef.current) {
      nodesRef.current.oscillators.forEach((osc) => {
        try { osc.stop(); } catch { /* already stopped */ }
      });
      nodesRef.current.gains.forEach((g) => g.disconnect());
      nodesRef.current.filter.disconnect();
      nodesRef.current.masterGain.disconnect();
    }

    // Create filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = config.filterFreq;
    filter.Q.value = config.filterQ;

    // Create master gain
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0; // Start at 0 for fade in
    masterGain.connect(ctx.destination);

    // Connect filter to master
    filter.connect(masterGain);

    // Create oscillators
    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    config.oscillators.forEach((oscConfig) => {
      const osc = ctx.createOscillator();
      osc.type = oscConfig.type;
      osc.frequency.value = oscConfig.frequency;
      osc.detune.value = oscConfig.detune;

      const gain = ctx.createGain();
      gain.gain.value = oscConfig.gain;

      osc.connect(gain);
      gain.connect(filter);
      osc.start();

      oscillators.push(osc);
      gains.push(gain);
    });

    nodesRef.current = { oscillators, gains, masterGain, filter };

    // Fade in
    if (fadeInRef.current) cancelAnimationFrame(fadeInRef.current);
    if (fadeOutRef.current) cancelAnimationFrame(fadeOutRef.current);

    const targetGain = config.masterGain;
    const fadeStart = ctx.currentTime;
    const fadeDuration = 2; // 2 seconds
    masterGain.gain.setValueAtTime(0, fadeStart);
    masterGain.gain.linearRampToValueAtTime(targetGain, fadeStart + fadeDuration);

    return nodesRef.current;
  }, []);

  // Crossfade to new mood
  const crossfadeToMood = useCallback((newMood: string) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const oldNodes = nodesRef.current;
    const oldConfig = moodConfigs[currentMoodRef.current] || moodConfigs.prologue;
    const newConfig = moodConfigs[newMood] || moodConfigs.prologue;

    if (oldNodes) {
      // Fade out old
      const fadeOutStart = ctx.currentTime;
      oldNodes.masterGain.gain.setValueAtTime(
        oldNodes.masterGain.gain.value,
        fadeOutStart
      );
      oldNodes.masterGain.gain.linearRampToValueAtTime(0, fadeOutStart + 2);

      // Stop old oscillators after fade out
      setTimeout(() => {
        oldNodes.oscillators.forEach((osc) => {
          try { osc.stop(); } catch { /* already stopped */ }
        });
        oldNodes.gains.forEach((g) => g.disconnect());
        oldNodes.filter.disconnect();
        oldNodes.masterGain.disconnect();
      }, 2200);
    }

    // Create new mood nodes
    createMoodNodes(newMood);
    currentMoodRef.current = newMood;
  }, [createMoodNodes]);

  // Handle first user interaction to start audio
  useEffect(() => {
    const handleInteraction = () => {
      if (hasInteracted.current) return;
      hasInteracted.current = true;

      initAudio();

      // Start playing if sound is enabled
      if (soundEnabled) {
        const ctx = audioContextRef.current;
        if (ctx && ctx.state === 'suspended') {
          ctx.resume();
        }
        createMoodNodes(mood);
        currentMoodRef.current = mood;
      }

      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [initAudio, soundEnabled, createMoodNodes, mood]);

  // Handle mood changes
  useEffect(() => {
    if (!hasInteracted.current || !audioContextRef.current) return;

    if (mood !== currentMoodRef.current) {
      if (nodesRef.current) {
        crossfadeToMood(mood);
      } else if (soundEnabled) {
        createMoodNodes(mood);
        currentMoodRef.current = mood;
      }
    }
  }, [mood, soundEnabled, crossfadeToMood, createMoodNodes]);

  // Handle sound toggle
  useEffect(() => {
    if (!hasInteracted.current || !audioContextRef.current) return;

    const ctx = audioContextRef.current;

    if (soundEnabled) {
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      if (!nodesRef.current) {
        createMoodNodes(mood);
        currentMoodRef.current = mood;
      } else {
        // Fade in
        const config = moodConfigs[currentMoodRef.current] || moodConfigs.prologue;
        nodesRef.current.masterGain.gain.setValueAtTime(
          nodesRef.current.masterGain.gain.value,
          ctx.currentTime
        );
        nodesRef.current.masterGain.gain.linearRampToValueAtTime(
          config.masterGain,
          ctx.currentTime + 2
        );
      }
    } else {
      // Fade out
      if (nodesRef.current) {
        nodesRef.current.masterGain.gain.setValueAtTime(
          nodesRef.current.masterGain.gain.value,
          ctx.currentTime
        );
        nodesRef.current.masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      }
    }
  }, [soundEnabled, mood, createMoodNodes, crossfadeToMood]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (nodesRef.current) {
        nodesRef.current.oscillators.forEach((osc) => {
          try { osc.stop(); } catch { /* already stopped */ }
        });
        nodesRef.current.gains.forEach((g) => g.disconnect());
        nodesRef.current.filter.disconnect();
        nodesRef.current.masterGain.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (fadeInRef.current) cancelAnimationFrame(fadeInRef.current);
      if (fadeOutRef.current) cancelAnimationFrame(fadeOutRef.current);
    };
  }, []);

  // This component renders nothing visible
  return null;
}
