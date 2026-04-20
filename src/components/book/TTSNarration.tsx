'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, Square, Gauge } from 'lucide-react';
import { useTTS } from '@/hooks/useTTS';
import { useStoryStore } from '@/store/story-store';

interface TTSNarrationProps {
  paragraphs: string[];
}

const SPEEDS = [0.5, 0.75, 1, 1.25] as const;

export default function TTSNarration({ paragraphs }: TTSNarrationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const ttsAutoPlay = useStoryStore((s) => s.ttsAutoPlay);
  const ttsRate = useStoryStore((s) => s.ttsRate);
  const prevParagraphsRef = useRef<string>('');
  const ttsReadyRef = useRef(false);

  const {
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
  } = useTTS();

  // Filter voices to prefer French ones
  const frenchVoices = useMemo(() => {
    return availableVoices.filter(
      (v) => v.lang === 'fr-FR' || v.lang.startsWith('fr')
    );
  }, [availableVoices]);

  // When voice list loads, if current voice is null but we have French voices, pick the first
  useEffect(() => {
    if (!voice && frenchVoices.length > 0) {
      setVoice(frenchVoices[0]);
      ttsReadyRef.current = true;
    }
  }, [voice, frenchVoices, setVoice]);

  // Auto-play when paragraphs change and ttsAutoPlay is enabled
  const paragraphsKey = paragraphs.join('|||');
  useEffect(() => {
    if (ttsAutoPlay && paragraphs.length > 0 && paragraphsKey !== prevParagraphsRef.current && ttsReadyRef.current) {
      prevParagraphsRef.current = paragraphsKey;
      // Small delay to ensure voices are loaded
      const timer = setTimeout(() => {
        stop();
        play(paragraphs);
      }, 100);
      return () => clearTimeout(timer);
    }
    prevParagraphsRef.current = paragraphsKey;
  }, [paragraphsKey, ttsAutoPlay]);

  const handleTogglePlayPause = () => {
    if (isPlaying && !isPaused) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      play(paragraphs);
      // Auto-expand panel on manual play
      setIsExpanded(true);
    }
  };

  const handleStop = () => {
    stop();
    setIsExpanded(false);
  };

  const handleExpandToggle = () => {
    if (isPlaying) {
      // If playing, toggle expand/collapse
      setIsExpanded((prev) => !prev);
    } else {
      setIsExpanded((prev) => !prev);
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={handleExpandToggle}
        className="tts-btn bottom-6 right-6 flex items-center justify-center w-11 h-11 rounded-full"
        style={{
          background: isPlaying
            ? 'rgba(212, 165, 116, 0.15)'
            : 'rgba(18, 17, 26, 0.8)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${
            isPlaying
              ? 'rgba(212, 165, 116, 0.4)'
              : 'rgba(212, 165, 116, 0.15)'
          }`,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isPlaying ? (isPaused ? 'Reprendre la lecture' : 'Mettre en pause') : 'Lire à haute voix'}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 text-amber-400" />
        ) : (
          <Volume2 className="w-5 h-5 text-amber-600/60" />
        )}

        {/* Pulsing glow when playing */}
        {isPlaying && (
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: '0 0 15px rgba(212, 165, 116, 0.3), 0 0 30px rgba(212, 165, 116, 0.1)',
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Sound wave bars when playing */}
        {isPlaying && (
          <div className="absolute -right-1 -top-1 flex items-end gap-[1px]">
            <span className="tts-wave-bar" />
            <span className="tts-wave-bar" />
            <span className="tts-wave-bar" />
            <span className="tts-wave-bar" />
          </div>
        )}
      </motion.button>

      {/* Control panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="tts-panel bottom-20 right-6 p-4"
            style={{ minWidth: '220px' }}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Play/Pause + Stop row */}
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={handleTogglePlayPause}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-amber-600/20 hover:bg-amber-600/30 transition-colors duration-200"
                aria-label={
                  isPlaying
                    ? isPaused
                      ? 'Reprendre'
                      : 'Pause'
                    : 'Lecture'
                }
              >
                {isPlaying && !isPaused ? (
                  <Pause className="w-4 h-4 text-amber-400" />
                ) : (
                  <Play className="w-4 h-4 text-amber-400 ml-0.5" />
                )}
              </button>

              <button
                onClick={handleStop}
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-amber-800/10 transition-colors duration-200"
                aria-label="Arrêter"
                disabled={!isPlaying}
              >
                <Square
                  className={`w-4 h-4 ${
                    isPlaying ? 'text-amber-500/70' : 'text-amber-800/30'
                  }`}
                />
              </button>

              {/* Status label */}
              <span className="ml-auto text-[10px] font-serif text-amber-600/50">
                {isPlaying
                  ? isPaused
                    ? 'En pause'
                    : `${Math.min(currentParagraph + 1, paragraphs.length)}/${paragraphs.length}`
                  : 'Prêt'}
              </span>
            </div>

            {/* Voice selector */}
            {frenchVoices.length > 0 && (
              <div className="mb-3">
                <label className="block text-[10px] font-serif text-amber-700/50 mb-1">
                  Voix
                </label>
                <select
                  value={voice?.name ?? ''}
                  onChange={(e) => {
                    const selected = frenchVoices.find(
                      (v) => v.name === e.target.value
                    );
                    if (selected) setVoice(selected);
                  }}
                  className="w-full text-[11px] font-serif bg-[#0a0a0f]/60 border border-amber-800/15 rounded-lg px-2 py-1.5 text-amber-300/70 focus:outline-none focus:border-amber-600/30 transition-colors duration-200 appearance-none cursor-pointer"
                >
                  {frenchVoices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name.replace(/Microsoft |Google |Apple /, '')}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Speed control */}
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Gauge className="w-3 h-3 text-amber-700/40" />
                <span className="text-[10px] font-serif text-amber-700/50">
                  Vitesse
                </span>
              </div>
              <div className="flex items-center gap-1">
                {SPEEDS.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setRate(speed)}
                    className={`tts-speed-btn ${
                      rate === speed ? 'active' : ''
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
