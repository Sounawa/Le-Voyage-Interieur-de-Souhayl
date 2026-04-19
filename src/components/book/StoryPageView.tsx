'use client';

import { useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles, Hand } from 'lucide-react';
import { useStoryStore } from '@/store/story-store';
import type { StoryPage } from '@/lib/story-types';
import StoryIllustration from '@/components/book/StoryIllustration';
import { findGlossaryTermsInText } from '@/components/book/SpiritualGlossary';

interface StoryPageViewProps {
  page: StoryPage;
  onContinue: () => void;
}

const fontSizeClasses: Record<string, string> = {
  sm: 'text-sm sm:text-base',
  md: 'text-base sm:text-lg',
  lg: 'text-lg sm:text-xl',
};

const AUTO_CONTINUE_DELAY = 4000;

export default function StoryPageView({ page, onContinue }: StoryPageViewProps) {
  const fontSize = useStoryStore((s) => s.fontSize);
  const autoContinue = useStoryStore((s) => s.autoContinue);
  const baseDelay = page.paragraphs.length * 0.15 + 0.3;
  const isLinear = !page.choices && !!page.next;
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Font size class for paragraphs
  const paragraphFontClass = fontSizeClasses[fontSize] || fontSizeClasses.md;

  // Keyboard listener for spacebar/enter to continue
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isLinear && (e.key === ' ' || e.key === 'Enter')) {
      e.preventDefault();
      onContinue();
    }
  }, [isLinear, onContinue]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Auto-continue timer
  useEffect(() => {
    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }

    if (autoContinue && isLinear) {
      // Wait for animations to complete, then start the auto-continue delay
      const animDelay = (baseDelay + 1.5) * 1000;
      autoTimerRef.current = setTimeout(() => {
        onContinue();
      }, animDelay + AUTO_CONTINUE_DELAY);
    }

    return () => {
      if (autoTimerRef.current) {
        clearTimeout(autoTimerRef.current);
      }
    };
  }, [autoContinue, isLinear, onContinue, page.id]);

  // For linear pages, make the entire page clickable
  const handlePageClick = useCallback(() => {
    if (isLinear) {
      onContinue();
    }
  }, [isLinear, onContinue]);

  // Compute delay offsets for Zaki and Shaykh
  const zakiDelay = useMemo(() => baseDelay + 0.3, [baseDelay]);
  const shaykhDelay = useMemo(
    () => baseDelay + (page.zakiSpeaks ? 0.6 : 0),
    [baseDelay, page.zakiSpeaks]
  );

  // Whether to show the ornamental divider (only when title exists and paragraphs exist)
  const showOrnamentalDivider = !!page.title && page.paragraphs.length > 0;

  // Pre-compute glossary terms for all paragraphs (once per page render)
  const paragraphGlossaryTerms = useMemo(
    () => page.paragraphs.map((p) => findGlossaryTermsInText(p)),
    [page.paragraphs]
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={page.id}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        onClick={handlePageClick}
        className={`page-enter flex items-start justify-center min-h-screen px-4 py-20 sm:py-24 relative ${isLinear ? 'cursor-pointer active:scale-[0.99]' : ''}`}
      >
        {/* Atmospheric ambient glow */}
        <div className="page-ambient-glow" />

        {/* Ornamental manuscript border */}
        <div className="manuscript-border">
          <div className="max-w-2xl w-full relative">
            {/* Illustration (if available) */}
            <StoryIllustration pageId={page.id} />

            {/* Page title */}
            {page.title && (
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="font-serif text-2xl sm:text-3xl text-amber-100 font-bold mb-4 text-center"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
              >
                {page.title}
              </motion.h3>
            )}

            {/* Ornamental divider between title and first paragraph */}
            {showOrnamentalDivider && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="ornamental-divider my-6"
              >
                <span className="ornamental-diamond" />
              </motion.div>
            )}

            {/* Narrative paragraphs */}
            <div className="space-y-5 story-paragraphs-container">
              {page.paragraphs.map((paragraph, index) => {
                const paragraphTerms = paragraphGlossaryTerms[index];
                const hasTerms = paragraphTerms.length > 0;
                return (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: showOrnamentalDivider ? 0.4 + index * 0.15 : 0.3 + index * 0.15, duration: 0.8 }}
                    className={`font-serif ${paragraphFontClass} text-amber-100/80 leading-relaxed text-justify sm:text-left relative ${
                      index === 0 ? 'story-drop-cap-enhanced' : ''
                    }`}
                    style={{ textShadow: '0 1px 4px rgba(0,0,0,0.35), 0 0 12px rgba(0,0,0,0.08)' }}
                  >
                    {paragraph}
                    {hasTerms && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: showOrnamentalDivider ? 0.4 + index * 0.15 + 0.6 : 0.3 + index * 0.15 + 0.6, duration: 0.4 }}
                        className="inline-flex items-center ml-1 align-super"
                        title={`Termes spirituels : ${paragraphTerms.map(t => t.term).join(', ')}`}
                      >
                        <span className="glossary-indicator text-[10px] leading-none cursor-help">📖</span>
                      </motion.span>
                    )}
                  </motion.p>
                );
              })}
            </div>

            {/* Zaki's speech bubble */}
            {page.zakiSpeaks && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: zakiDelay, duration: 0.8 }}
                className="mt-6 relative ml-8 sm:ml-16"
              >
                {/* Fox avatar with warm glow */}
                <div className="absolute -left-10 sm:-left-12 top-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-sm border border-amber-700/30 zaki-avatar-glow">
                  🦊
                </div>
                {/* Speech bubble with tail */}
                <div className="zaki-bubble-tail bg-gradient-to-br from-amber-900/30 to-amber-950/40 border border-amber-700/20 rounded-2xl px-5 py-3.5">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: zakiDelay + 0.2, duration: 0.6 }}
                    className="text-amber-200/80 text-sm sm:text-base italic leading-relaxed font-serif"
                  >
                    {page.zakiSpeaks}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: zakiDelay + 0.5, duration: 0.4 }}
                    className="text-amber-600/50 text-[10px] mt-1.5 tracking-wider uppercase"
                  >
                    — Zaki
                  </motion.p>
                </div>
              </motion.div>
            )}

            {/* Shaykh's wisdom quote */}
            {page.shaykhSpeaks && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: shaykhDelay, duration: 0.8 }}
                className="mt-8 relative"
              >
                {/* Pulsing gradient border on left side */}
                <div className="absolute -left-1 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500/60 via-amber-400/80 to-amber-500/60 rounded-full shaykh-border-pulse" />
                {/* Quote block with amber glow */}
                <div className="ml-4 pl-5 py-5 px-6 bg-amber-950/20 rounded-r-lg shaykh-quote-glow relative">
                  {/* Opening quotation mark */}
                  <span className="shaykh-quote-mark absolute -top-2 left-2">&ldquo;</span>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-500/70" />
                    <span className="text-amber-500/70 text-xs uppercase tracking-wider font-serif">
                      Paroles du Shaykh
                    </span>
                  </div>
                  <p className="font-serif text-amber-200/90 italic leading-relaxed text-base pl-4">
                    {page.shaykhSpeaks}
                  </p>
                  {/* Closing quotation mark */}
                  <span className="shaykh-quote-mark absolute -bottom-5 right-2">&rdquo;</span>
                </div>
              </motion.div>
            )}

            {/* Decorative bottom ornament separator */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: baseDelay + 0.5, duration: 0.6 }}
              className="ornament-bottom"
            >
              <span className="ornament-bottom-diamond" />
            </motion.div>

            {/* Continue section (for linear pages) */}
            {isLinear && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: baseDelay + 0.8, duration: 0.6 }}
                className="mt-10 flex flex-col items-center gap-3 py-4"
              >
                {/* Continue button with underline animation and bouncing arrow */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onContinue();
                  }}
                  className="continue-underline group inline-flex items-center gap-2 px-6 py-3 text-amber-400/70 hover:text-amber-300 font-serif text-sm transition-all duration-300 active:scale-[0.98]"
                >
                  <span>Continuer</span>
                  <ChevronRight className="w-4 h-4 bounce-arrow" />
                </button>

                {/* Tap-to-continue hint with smoother fade */}
                {!autoContinue && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: baseDelay + 1.4, duration: 1.2 }}
                    className="flex items-center gap-1.5 text-amber-600/40 text-[11px] font-serif select-none"
                  >
                    <Hand className="w-3 h-3" />
                    <span>Touchez n&apos;importe où pour continuer</span>
                  </motion.p>
                )}

                {/* Auto-continue indicator */}
                {autoContinue && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: baseDelay + 1.4, duration: 1.2 }}
                    className="flex items-center gap-1.5 text-amber-600/30 text-[11px] font-serif select-none"
                  >
                    <span>📖 Lecture automatique...</span>
                  </motion.p>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
