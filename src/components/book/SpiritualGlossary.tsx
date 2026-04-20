'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, BookMarked } from 'lucide-react';

export interface GlossaryTerm {
  term: string;
  arabic: string;
  definition: string;
  emoji: string;
}

export const glossaryTerms: GlossaryTerm[] = [
  { term: 'Tassawuf', arabic: 'التصوف', definition: "Le chemin spirituel en islam, aussi appelé soufisme. C'est la quête de la purification du cœur pour se rapprocher d'Allah.", emoji: '💫' },
  { term: 'Qalb', arabic: 'القلب', definition: "Le cœur spirituel. En islam, le cœur n'est pas juste un organe, c'est le siège de la foi, de l'amour et de la conscience.", emoji: '❤️' },
  { term: 'Nafs', arabic: 'النفس', definition: "L'ego, le moi inférieur. C'est la partie de nous qui nous pousse à être égoïste, orgueilleux et esclave de nos désirs.", emoji: '🎭' },
  { term: 'Waswās', arabic: 'الوسواس', definition: "Les chuchotements du shaytan (Satan). Ce sont les pensées négatives qui nous égarent et nous font douter.", emoji: '🐍' },
  { term: 'Dhikr', arabic: 'الذكر', definition: "Le rappel d'Allah. C'est la pratique de répéter les noms de Dieu ou des prières pour garder le cœur éveillé.", emoji: '📿' },
  { term: 'Tawakkul', arabic: 'التوكل', definition: "La confiance en Allah. C'est remettre ses affaires à Dieu tout en faisant de son mieux.", emoji: '🕊️' },
  { term: 'Sabr', arabic: 'الصبر', definition: "La patience. En islam, c'est la capacité à supporter les épreuves avec calme et espoir.", emoji: '⏳' },
  { term: 'Tawba', arabic: 'التوبة', definition: "Le repentir. Revenir vers Allah après une erreur, avec sincérité et ferme intention de changer.", emoji: '🔄' },
  { term: 'Ikhlas', arabic: 'الإخلاص', definition: "La sincérité. Faire les choses uniquement pour plaire à Allah, sans chercher la reconnaissance des autres.", emoji: '✨' },
  { term: 'Shaykh', arabic: 'الشيخ', definition: "Un maître spirituel. C'est un guide expérimenté qui accompagne les disciples sur le chemin du Tassawuf.", emoji: '🧔' },
  { term: 'Murshid', arabic: 'المرشد', definition: "Le guide spirituel. Un autre nom pour le maître qui montre le chemin vers Allah.", emoji: '🌟' },
  { term: 'Suluk', arabic: 'السلوك', definition: "Le voyage spirituel intérieur. Le parcours du cœur à travers les différentes étapes de la purification.", emoji: '🛤️' },
  { term: 'Fana', arabic: 'الفناء', definition: "L'anéantissement de l'ego. C'est l'état où le soi disparaît pour laisser place à la présence divine.", emoji: '🌊' },
  { term: 'Baqa', arabic: 'البقاء', definition: "La subsistance en Dieu. Après l'anéantissement de l'ego, c'est vivre dans la conscience permanente d'Allah.", emoji: '🌅' },
  { term: 'Muraqaba', arabic: 'المراقبة', definition: "La méditation contemplative. Observer silencieusement son cœur et la présence d'Allah en soi.", emoji: '👁️' },
  { term: 'Hilm', arabic: 'الحلم', definition: "La douceur et la sagesse dans le comportement. Ne pas réagir sous le coup de la colère.", emoji: '🕊️' },
  { term: 'Adab', arabic: 'الأدب', definition: "La bonne éducation spirituelle. Le respect, la politesse et les bonnes manières dans tout ce qu'on fait.", emoji: '📜' },
  { term: 'Sadaqah', arabic: 'الصدقة', definition: "La charité. Donner avec générosité, que ce soit de l'argent, du temps ou un sourire.", emoji: '🤝' },
  { term: 'Shukr', arabic: 'الشكر', definition: "La gratitude. Remercier Allah pour toutes Ses bénédictions, même les plus petites.", emoji: '🙏' },
  { term: 'Khalwa', arabic: 'الخلوة', definition: "La retraite spirituelle. Se retirer du bruit du monde pour se concentrer sur Allah.", emoji: '🌙' },
  { term: 'Nur', arabic: 'النور', definition: "La lumière divine. La lumière qu'Allah place dans le cœur des croyants.", emoji: '💡' },
  { term: 'Sirat', arabic: 'الصراط', definition: "Le chemin droit. La voie de la vérité et de la justice en islam.", emoji: '🛤️' },
  { term: 'Ihsan', arabic: 'الإحسان', definition: "L'excellence spirituelle. Adorer Allah comme si on Le voyait, car Lui nous voit.", emoji: '💎' },
  { term: 'Rida', arabic: 'الرضا', definition: "La satisfaction divine. Accepter avec joie tout ce qu'Allah nous donne, le bien comme l'épreuve.", emoji: '😊' },
  { term: 'Wird', arabic: 'الورد', definition: "Les litanies quotidiennes. Des prières et invocations répétées régulièrement pour nourrir le cœur.", emoji: '📖' },
];

// Alphabetically sorted terms (cached)
const sortedTerms = [...glossaryTerms].sort((a, b) => a.term.localeCompare(b.term, 'fr'));

// Helper: find glossary terms present in a text string
export function findGlossaryTermsInText(text: string): GlossaryTerm[] {
  return glossaryTerms.filter((gt) => {
    const termLower = gt.term.toLowerCase();
    const textLower = text.toLowerCase();
    return textLower.includes(termLower);
  });
}

interface SpiritualGlossaryProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SpiritualGlossary({ isOpen, onClose }: SpiritualGlossaryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredTerms = useMemo(() => {
    if (!searchQuery.trim()) return sortedTerms;
    const q = searchQuery.toLowerCase().trim();
    return sortedTerms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.arabic.includes(q) ||
        t.definition.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Glossary Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-4 sm:inset-8 md:inset-12 lg:inset-x-auto lg:top-8 lg:bottom-8 lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-2xl z-50 flex flex-col bg-[#0d0c14]/95 backdrop-blur-xl rounded-2xl border border-amber-800/20 shadow-2xl shadow-black/50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-amber-800/15 bg-[#0d0c14]/90 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3">
                <BookMarked className="w-5 h-5 text-amber-500/70" />
                <h2 className="font-serif text-lg text-amber-100 font-bold">
                  Abécédaire spirituel
                </h2>
                <span className="text-amber-600/40 text-xs font-serif">
                  {filteredTerms.length} terme{filteredTerms.length !== 1 ? 's' : ''}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-amber-900/20 transition-colors"
                aria-label="Fermer l'abécédaire"
              >
                <X className="w-4 h-4 text-amber-200/50" />
              </button>
            </div>

            {/* Search Input */}
            <div className="px-5 py-3 border-b border-amber-800/10 bg-[#0d0c14]/60 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/40" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un terme..."
                  className="w-full pl-9 pr-4 py-2.5 bg-amber-950/20 border border-amber-800/15 rounded-xl text-sm font-serif text-amber-100 placeholder:text-amber-600/30 focus:outline-none focus:border-amber-700/30 focus:bg-amber-950/30 transition-all duration-200"
                />
              </div>
            </div>

            {/* Terms List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {filteredTerms.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-amber-500/30">
                  <Search className="w-8 h-8 mb-3 opacity-50" />
                  <p className="font-serif text-sm">Aucun terme trouvé</p>
                  <p className="font-serif text-xs mt-1 text-amber-600/20">
                    Essayez un autre mot-clé
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredTerms.map((item, index) => (
                    <motion.div
                      key={item.term}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ delay: index * 0.03, duration: 0.25 }}
                      className="glossary-term-card group relative rounded-xl p-4 bg-amber-950/15 border border-amber-800/10 hover:border-amber-700/25 hover:bg-amber-950/25 transition-all duration-300 cursor-default"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                          {item.emoji}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-3 flex-wrap">
                            <h3 className="font-serif text-base sm:text-lg font-bold text-amber-400 group-hover:text-amber-300 transition-colors duration-300">
                              {item.term}
                            </h3>
                            <span className="text-amber-300/40 text-sm font-arabic" dir="rtl">
                              {item.arabic}
                            </span>
                          </div>
                          <p className="font-serif text-sm text-amber-200/50 leading-relaxed mt-1.5">
                            {item.definition}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer hint */}
            <div className="px-5 py-3 border-t border-amber-800/10 bg-[#0d0c14]/60 shrink-0">
              <p className="text-center text-amber-600/25 text-[10px] font-serif tracking-wide">
                📖 Les termes soulignés dans l&apos;histoire renvoient à cet abécédaire
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
