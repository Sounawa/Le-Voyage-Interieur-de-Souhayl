'use client';

import { motion } from 'framer-motion';

export default function BismillahHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2 }}
      className="text-center py-4 select-none"
    >
      <p
        className="text-2xl sm:text-3xl text-amber-600/30 font-serif tracking-wider"
        style={{ textShadow: '0 0 20px rgba(212, 165, 116, 0.1)' }}
        dir="rtl"
      >
        بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </p>
      <p className="text-amber-600/20 text-xs font-serif mt-2 italic">
        Au nom d&apos;Allah, le Tout Miséricordieux, le Très Miséricordieux
      </p>
    </motion.div>
  );
}
