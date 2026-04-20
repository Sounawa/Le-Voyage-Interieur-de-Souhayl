'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseTTSReturn {
  isPlaying: boolean;
  isPaused: boolean;
  currentParagraph: number;
  rate: number;
  voice: SpeechSynthesisVoice | null;
  availableVoices: SpeechSynthesisVoice[];
  play: (paragraphs: string[]) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setRate: (rate: number) => void;
  setVoice: (voice: SpeechSynthesisVoice) => void;
}

export function useTTS(): UseTTSReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentParagraph, setCurrentParagraph] = useState(-1);
  const [rate, setRateState] = useState(1);
  const [voice, setVoiceState] = useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const paragraphsRef = useRef<string[]>([]);
  const currentIndexRef = useRef(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speakFnRef = useRef<(text: string, index: number) => void>(() => {});

  // Load available voices via event listener (avoids sync setState in effect)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const syncVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
        // Try to find a French voice
        const frenchVoice =
          voices.find((v) => v.lang === 'fr-FR') ||
          voices.find((v) => v.lang.startsWith('fr')) ||
          null;
        if (frenchVoice) {
          setVoiceState(frenchVoice);
        }
      }
    };

    window.speechSynthesis.addEventListener('voiceschanged', syncVoices);
    // Some browsers fire voiceschanged asynchronously; others have voices ready immediately
    const timer = window.setTimeout(syncVoices, 100);

    return () => {
      window.clearTimeout(timer);
      window.speechSynthesis.removeEventListener('voiceschanged', syncVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  // Speak a single paragraph
  const speakParagraph = useCallback(
    (text: string, index: number) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = rate;

      if (voice) {
        utterance.voice = voice;
      }

      utterance.onboundary = (_event: SpeechSynthesisEvent) => {
        // Word-level tracking available via _event.charIndex, _event.charLength
        // Currently we just track paragraph level
      };

      utterance.onend = () => {
        const nextIndex = index + 1;
        if (nextIndex < paragraphsRef.current.length) {
          currentIndexRef.current = nextIndex;
          setCurrentParagraph(nextIndex);
          speakFnRef.current(paragraphsRef.current[nextIndex], nextIndex);
        } else {
          // All paragraphs done
          setIsPlaying(false);
          setIsPaused(false);
          setCurrentParagraph(-1);
          currentIndexRef.current = 0;
        }
      };

      utterance.onerror = (event) => {
        // 'canceled' is expected when we call stop()
        if (event.error === 'canceled' || event.error === 'interrupted') return;
        console.warn('TTS error:', event.error);
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentParagraph(-1);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [rate, voice]
  );

  // Keep ref in sync for recursive calls
  useEffect(() => {
    speakFnRef.current = speakParagraph;
  }, [speakParagraph]);

  const play = useCallback(
    (paragraphs: string[]) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      if (paragraphs.length === 0) return;

      // Cancel any existing speech
      window.speechSynthesis.cancel();

      paragraphsRef.current = paragraphs.filter((p) => p.trim().length > 0);
      currentIndexRef.current = 0;
      setCurrentParagraph(0);
      setIsPlaying(true);
      setIsPaused(false);

      speakParagraph(paragraphsRef.current[0], 0);
    },
    [speakParagraph]
  );

  const pause = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentParagraph(-1);
    currentIndexRef.current = 0;
    paragraphsRef.current = [];
  }, []);

  const setRate = useCallback((newRate: number) => {
    setRateState(newRate);
  }, []);

  const setVoice = useCallback((newVoice: SpeechSynthesisVoice) => {
    setVoiceState(newVoice);
  }, []);

  // Chrome bug workaround: speechSynthesis can get stuck after ~15s
  // Resume periodically if playing and not paused
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    const interval = setInterval(() => {
      if (
        typeof window !== 'undefined' &&
        window.speechSynthesis &&
        window.speechSynthesis.speaking &&
        !window.speechSynthesis.paused
      ) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 14000);

    return () => clearInterval(interval);
  }, [isPlaying, isPaused]);

  // Update rate on active utterance when it changes
  useEffect(() => {
    if (utteranceRef.current) {
      utteranceRef.current.rate = rate;
    }
  }, [rate]);

  return {
    isPlaying,
    isPaused,
    currentParagraph,
    rate,
    voice,
    availableVoices,
    play,
    pause,
    resume,
    stop,
    setRate,
    setVoice,
  };
}
