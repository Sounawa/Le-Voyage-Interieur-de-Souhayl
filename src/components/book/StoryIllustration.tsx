'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

// Map of page IDs to their illustration images
const PAGE_ILLUSTRATIONS: Record<string, string> = {
  'prologue-book': '/images/book-cover.png',
  'ch1-choice-enter': '/images/heart-door.png',
  'ch1-bazaar': '/images/bazaar-emotions.png',
  'ch2-start': '/images/desert-soul.png',
  'ch3-start': '/images/enchanted-forest.png',
  'ch4-start': '/images/mountain-truth.png',
};

interface StoryIllustrationProps {
  pageId: string;
}

export default function StoryIllustration({ pageId }: StoryIllustrationProps) {
  const [imgError, setImgError] = useState(false);
  const imagePath = PAGE_ILLUSTRATIONS[pageId];

  if (!imagePath || imgError) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="w-full max-w-[400px] mx-auto mb-8"
    >
      {/* Golden ornamental frame */}
      <div className="relative p-1">
        {/* Outer ornamental border - Islamic-inspired golden frame */}
        <div className="absolute -inset-1 rounded-sm"
          style={{
            background: 'linear-gradient(135deg, #c9952a 0%, #f5d78e 15%, #b8860b 30%, #daa520 50%, #b8860b 70%, #f5d78e 85%, #c9952a 100%)',
          }}
        />

        {/* Inner decorative line */}
        <div className="absolute inset-[3px] rounded-sm border border-amber-700/40" />

        {/* Corner ornaments */}
        <div className="absolute -top-1 -left-1 w-4 h-4">
          <svg viewBox="0 0 16 16" className="w-full h-full text-amber-500">
            <path d="M0 0 L16 0 L16 4 L4 4 L4 16 L0 16 Z" fill="currentColor" opacity="0.6" />
            <circle cx="0" cy="0" r="2" fill="#f5d78e" />
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4">
          <svg viewBox="0 0 16 16" className="w-full h-full text-amber-500">
            <path d="M16 0 L0 0 L0 4 L12 4 L12 16 L16 16 Z" fill="currentColor" opacity="0.6" />
            <circle cx="16" cy="0" r="2" fill="#f5d78e" />
          </svg>
        </div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4">
          <svg viewBox="0 0 16 16" className="w-full h-full text-amber-500">
            <path d="M0 16 L16 16 L16 12 L4 12 L4 0 L0 0 Z" fill="currentColor" opacity="0.6" />
            <circle cx="0" cy="16" r="2" fill="#f5d78e" />
          </svg>
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4">
          <svg viewBox="0 0 16 16" className="w-full h-full text-amber-500">
            <path d="M16 16 L0 16 L0 12 L12 12 L12 0 L16 0 Z" fill="currentColor" opacity="0.6" />
            <circle cx="16" cy="16" r="2" fill="#f5d78e" />
          </svg>
        </div>

        {/* Inner dark background for the image */}
        <div className="relative bg-[#0a0a0f] rounded-sm overflow-hidden">
          <Image
            src={imagePath}
            alt={`Illustration - ${pageId}`}
            width={400}
            height={533}
            className="w-full h-auto object-cover"
            onError={() => setImgError(true)}
            priority={false}
          />
        </div>
      </div>

      {/* Bottom ornamental divider */}
      <div className="flex items-center justify-center gap-2 mt-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-600/30" />
        <span className="text-amber-600/40 text-[10px]">✦</span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-600/30" />
      </div>
    </motion.div>
  );
}
