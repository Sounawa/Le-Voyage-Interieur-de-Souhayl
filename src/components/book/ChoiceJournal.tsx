'use client';

import { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, ChevronRight, Share2, Clock, Gauge, Compass, Flame } from 'lucide-react';
import { useStoryStore } from '@/store/story-store';

interface ChoiceJournalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tagLabels: Record<string, { label: string; emoji: string; chapter: string }> = {
  // Prologue
  reactive: { label: 'Répondre par l\'insulte', emoji: '😤', chapter: 'Prologue' },
  avoidance: { label: 'Éviter le conflit', emoji: '🚶', chapter: 'Prologue' },
  'seeking-help': { label: 'Demander de l\'aide', emoji: '🙋', chapter: 'Prologue' },
  obedience: { label: 'Obéir immédiatement', emoji: '🕌', chapter: 'Prologue' },
  negotiation: { label: 'Négocier un délai', emoji: '⚽', chapter: 'Prologue' },
  deceit: { label: 'Mentir pour se protéger', emoji: '🤥', chapter: 'Prologue' },
  honesty: { label: 'Dire la vérité malgré la peur', emoji: '💛', chapter: 'Prologue' },
  // Chapter 1
  courage: { label: 'Entrer avec courage', emoji: '🦁', chapter: 'Chapitre 1' },
  humility: { label: 'Entrer avec humilité', emoji: '🕯️', chapter: 'Chapitre 1' },
  sensitivity: { label: 'Toucher avec douceur', emoji: '✨', chapter: 'Chapitre 1' },
  boldness: { label: 'Visiter le marchand de Colère', emoji: '🔥', chapter: 'Chapitre 1' },
  impulse: { label: 'Accepter la colère', emoji: '🧤', chapter: 'Chapitre 1' },
  discernment: { label: 'Questionner les apparences', emoji: '🧐', chapter: 'Chapitre 1' },
  vulnerability: { label: 'Accepter la tristesse', emoji: '🧪', chapter: 'Chapitre 1' },
  resilience: { label: 'Refuser la tristesse', emoji: '🛡️', chapter: 'Chapitre 1' },
  empathy: { label: 'Demander à la marchande', emoji: '💙', chapter: 'Chapitre 1' },
  joy: { label: 'Visiter la tente de Joie', emoji: '☀️', chapter: 'Chapitre 1' },
  kindness: { label: 'Aider le marchand tombé', emoji: '🤝', chapter: 'Chapitre 1' },
  // Chapter 2
  gentleness: { label: 'Tendre la main au renard', emoji: '🤲', chapter: 'Chapitre 2' },
  patience: { label: 'Attendre en silence', emoji: '🧘', chapter: 'Chapitre 2' },
  generosity: { label: 'Accepter Zaki comme compagnon', emoji: '🦊', chapter: 'Chapitre 2' },
  pride: { label: 'La justice ou l\'ego ?', emoji: '⚖️', chapter: 'Chapitre 2' },
  awareness: { label: 'Reconnaître son ignorance', emoji: '💭', chapter: 'Chapitre 2' },
  confrontation: { label: 'Affronter le Nafs directement', emoji: '⚔️', chapter: 'Chapitre 2' },
  detachment: { label: 'Ignorer le Nafs', emoji: '👁️', chapter: 'Chapitre 2' },
  // Chapter 3
  perseverance: { label: 'Grimper par-dessus', emoji: '🧗', chapter: 'Chapitre 3' },
  caution: { label: 'Prendre le chemin sûr', emoji: '🌿', chapter: 'Chapitre 3' },
  efficiency: { label: 'Prendre le chemin rapide', emoji: '🍂', chapter: 'Chapitre 3' },
  forgiveness: { label: 'Pardonner à Yassine', emoji: '😤', chapter: 'Chapitre 3' },
  family: { label: 'Affronter le souvenir d\'Amina', emoji: '😢', chapter: 'Chapitre 3' },
  repentance: { label: 'Confesser au miroir', emoji: '💝', chapter: 'Chapitre 3' },
  resolve: { label: 'Faire une promesse', emoji: '🤞', chapter: 'Chapitre 3' },
  'self-compassion': { label: 'S\'accepter imparfait', emoji: '🌟', chapter: 'Chapitre 3' },
  firmness: { label: 'Rejeter Waswās fermement', emoji: '🛡️', chapter: 'Chapitre 3' },
  dhikr: { label: 'Se tourner vers le dhikr', emoji: '📿', chapter: 'Chapitre 3' },
  discipline: { label: 'Le chemin rocailleux', emoji: '⛰️', chapter: 'Chapitre 3' },
  mercy: { label: 'Le chemin verdoyant', emoji: '🌸', chapter: 'Chapitre 3' },
  passion: { label: 'Le chemin ardent', emoji: '🔥', chapter: 'Chapitre 3' },
  // Chapter 4
  tawakkul: { label: 'Avancer malgré la peur', emoji: '🎯', chapter: 'Chapitre 4' },
  surrender: { label: "L'abandon total à Allah", emoji: '🤲', chapter: 'Chapitre 4' },
  guidance: { label: 'La quête de guidance', emoji: '📖', chapter: 'Chapitre 4' },
  independence: { label: "L'affrontement solitaire", emoji: '🗡️', chapter: 'Chapitre 4' },
  integration: { label: 'Intégrer l\'enseignement', emoji: '🌍', chapter: 'Chapitre 4' },
};

function getVirtueProfile(tags: string[]): { virtues: string[]; challenges: string[] } {
  const virtues: string[] = [];
  const challenges: string[] = [];
  
  if (tags.includes('humility') || tags.includes('obedience')) virtues.push('Humilité');
  if (tags.includes('patience') || tags.includes('caution')) virtues.push('Patience');
  if (tags.includes('dhikr')) virtues.push('Dévotion');
  if (tags.includes('mercy') || tags.includes('kindness') || tags.includes('generosity')) virtues.push('Miséricorde');
  if (tags.includes('courage') || tags.includes('boldness') || tags.includes('perseverance')) virtues.push('Bravoure');
  if (tags.includes('discernment') || tags.includes('wisdom')) virtues.push('Sagesse');
  if (tags.includes('detachment')) virtues.push('Détachement');
  if (tags.includes('discipline') || tags.includes('resolve')) virtues.push('Discipline');
  if (tags.includes('surrender')) virtues.push('Abandon');
  if (tags.includes('passion')) virtues.push('Passion');
  if (tags.includes('honesty') || tags.includes('repentance')) virtues.push('Honnêteté');
  if (tags.includes('empathy') || tags.includes('vulnerability')) virtues.push('Empathie');
  if (tags.includes('integration')) virtues.push('Intégration');
  if (tags.includes('gentleness') || tags.includes('sensitivity')) virtues.push('Douceur');
  if (tags.includes('self-compassion')) virtues.push('Bienveillance envers soi');

  if (tags.includes('confrontation') || tags.includes('reactive')) challenges.push('Impulsivité');
  if (tags.includes('independence')) challenges.push('Indépendance excessive');
  if (tags.includes('firmness') && !tags.includes('dhikr')) challenges.push('Rigueur sans compassion');
  if (tags.includes('deceit')) challenges.push('Tendance au mensonge');
  if (tags.includes('avoidance') && !tags.includes('honesty')) challenges.push('Évitement');
  if (tags.includes('impulse')) challenges.push('Impulsivité émotionnelle');
  if (tags.includes('efficiency') && !tags.includes('caution')) challenges.push('Précipitation');
  
  if (virtues.length === 0) virtues.push('Courage initial');
  if (challenges.length === 0) challenges.push('À découvrir');

  return { virtues, challenges };
}

const TOTAL_PAGES = 167;
const SECONDS_PER_PAGE = 30;

function formatReadingTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.ceil((totalSeconds % 3600) / 60);
  if (hours > 0 && minutes > 0) return `${hours} h ${minutes} min`;
  if (hours > 0) return `${hours} h`;
  return `${Math.max(1, minutes)} min`;
}

const endingEmoji: Record<string, string> = {
  light: '🌟',
  wisdom: '📖',
  shadow: '🌙',
  pure: '🪞',
};

const endingTitleMap: Record<string, string> = {
  light: "La Lumière de l'Âme",
  wisdom: 'La Sagesse du Chemin',
  shadow: "L'Ombre Révélée",
  pure: 'Le Miroir Pur',
};

async function copyToClipboard(text: string): Promise<boolean> {
  // Modern Clipboard API
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to fallback
    }
  }
  // Fallback: textarea + execCommand
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

interface ShareJourneyButtonProps {
  visitedCount: number;
  choicesCount: number;
  chaptersCount: number;
  endingsCount: number;
  virtues: string[];
  endingsFound: string[];
}

function ShareJourneyButton({ visitedCount, choicesCount, chaptersCount, endingsCount, virtues, endingsFound }: ShareJourneyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const topVirtues = virtues.slice(0, 3);
    const virtuesStr = topVirtues.map((v) => `  ✦ ${v}`).join('\n');

    let endingStr = '';
    if (endingsFound.length > 0) {
      const lastEnding = endingsFound[endingsFound.length - 1];
      const emoji = endingEmoji[lastEnding] || '⭐';
      const title = endingTitleMap[lastEnding] || lastEnding;
      endingStr = `\n✦ Fin atteinte: ${emoji} ${title}`;
    }

    const text = [
      `📖 Le Voyage Intérieur de Souhayl — Mon Voyage`,
      ``,
      `✦ Pages visitées: ${visitedCount}/${TOTAL_PAGES}`,
      `✦ Choix effectués: ${choicesCount}`,
      `✦ Chapitres complétés: ${chaptersCount}/4`,
      `✦ Fins découvertes: ${endingsCount}/4`,
      ``,
      `Mes vertus:`,
      virtuesStr,
      `${endingStr}`,
      ``,
      `Découvrez votre propre voyage spirituel!`,
    ].join('\n');

    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [visitedCount, choicesCount, chaptersCount, endingsCount, virtues, endingsFound]);

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      onClick={handleShare}
      className="share-button w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-950/20 border border-amber-800/15 text-amber-500/50 hover:text-amber-400/70 hover:border-amber-700/25 transition-all duration-300 font-serif text-sm cursor-pointer"
    >
      <Share2 className="w-4 h-4" />
      <span>{copied ? '✓ Copié !' : 'Partager le voyage'}</span>
    </motion.button>
  );
}

export default function ChoiceJournal({ isOpen, onClose }: ChoiceJournalProps) {
  const { chosenTags, visitedPages, chaptersCompleted, endingsFound, readingStartTime } = useStoryStore();
  const { virtues, challenges } = getVirtueProfile(chosenTags);

  // Reading time estimate (30s per page)
  const estimatedReadingTime = useMemo(
    () => visitedPages.length * SECONDS_PER_PAGE,
    [visitedPages.length]
  );

  // Exploration percentage
  const explorationPct = useMemo(
    () => Math.round((visitedPages.length / TOTAL_PAGES) * 100),
    [visitedPages.length]
  );

  // Reading speed (pages per minute, based on real elapsed time)
  const readingSpeed = useMemo(() => {
    if (!readingStartTime) return null;
    const elapsedMs = Date.now() - readingStartTime;
    const elapsedMin = Math.max(elapsedMs / 60000, 0.5);
    const pagesPerMin = visitedPages.length / elapsedMin;
    return Math.round(pagesPerMin * 10) / 10; // one decimal
  }, [readingStartTime, visitedPages.length]);

  // Current streak (consecutive pages in visited order, counting from latest going back)
  const currentStreak = useMemo(() => {
    if (visitedPages.length <= 1) return visitedPages.length;
    // We can't perfectly determine "going back" from visitedPages alone,
    // so we use the history array from the store to compute it.
    const history = useStoryStore.getState().history;
    // The streak is the number of recent pages in history without repeats
    let streak = 1;
    for (let i = history.length - 1; i >= 0; i--) {
      streak++;
    }
    return streak;
  }, [visitedPages.length]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Journal Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-[#0d0c14]/95 backdrop-blur-md border-l border-amber-800/20 overflow-y-auto animated-border-left islamic-bg-pattern"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#0d0c14]/90 backdrop-blur-md px-6 py-4 border-b border-amber-800/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-amber-500/70" />
                <h2 className="font-serif text-lg text-amber-100 font-bold">Journal de Souhayl</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-amber-900/20 transition-colors">
                <X className="w-4 h-4 text-amber-200/50" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* 📊 Reading Stats Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-3"
              >
                <h3 className="text-amber-500/60 text-xs uppercase tracking-wider font-serif flex items-center gap-2">
                  <span>📊</span> Statistiques de lecture
                </h3>
                <div className="bg-amber-950/15 rounded-xl border border-amber-800/10 p-4 space-y-3">
                  {/* Reading time estimate */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-500/40" />
                      <span className="text-amber-200/50 text-xs font-serif">Temps de lecture estimé</span>
                    </div>
                    <span className="text-amber-100 text-sm font-serif font-bold">{formatReadingTime(estimatedReadingTime)}</span>
                  </div>
                  {/* Reading speed */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-3.5 h-3.5 text-amber-500/40" />
                      <span className="text-amber-200/50 text-xs font-serif">Vitesse de lecture</span>
                    </div>
                    <span className="text-amber-100 text-sm font-serif font-bold">
                      {readingSpeed !== null ? `${readingSpeed} p/min` : '—'}
                    </span>
                  </div>
                  {/* Exploration percentage */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Compass className="w-3.5 h-3.5 text-amber-500/40" />
                      <span className="text-amber-200/50 text-xs font-serif">Exploration</span>
                    </div>
                    <span className="text-amber-100 text-sm font-serif font-bold">{explorationPct}%</span>
                  </div>
                  {/* Exploration progress bar */}
                  <div className="w-full h-1.5 bg-amber-950/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${explorationPct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-amber-700/60 to-amber-500/80 rounded-full"
                    />
                  </div>
                  {/* Current streak */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="w-3.5 h-3.5 text-amber-500/40" />
                      <span className="text-amber-200/50 text-xs font-serif">Pages consécutives</span>
                    </div>
                    <span className="text-amber-100 text-sm font-serif font-bold">{currentStreak}</span>
                  </div>
                </div>
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-amber-950/20 rounded-lg p-3 border border-amber-800/10 hover:border-amber-700/20 transition-colors duration-300">
                  <p className="text-amber-500/50 text-xs font-serif mb-1">Pages visitées</p>
                  <p className="text-amber-100 text-2xl font-bold font-serif">{visitedPages.length}</p>
                </div>
                <div className="bg-amber-950/20 rounded-lg p-3 border border-amber-800/10 hover:border-amber-700/20 transition-colors duration-300">
                  <p className="text-amber-500/50 text-xs font-serif mb-1">Choix effectués</p>
                  <p className="text-amber-100 text-2xl font-bold font-serif">{chosenTags.length}</p>
                </div>
                <div className="bg-amber-950/20 rounded-lg p-3 border border-amber-800/10 hover:border-amber-700/20 transition-colors duration-300">
                  <p className="text-amber-500/50 text-xs font-serif mb-1">Chapitres</p>
                  <p className="text-amber-100 text-2xl font-bold font-serif">{chaptersCompleted.length}/4</p>
                </div>
                <div className="bg-amber-950/20 rounded-lg p-3 border border-amber-800/10 hover:border-amber-700/20 transition-colors duration-300">
                  <p className="text-amber-500/50 text-xs font-serif mb-1">Fins trouvées</p>
                  <p className="text-amber-100 text-2xl font-bold font-serif">{endingsFound.length}/4</p>
                </div>
              </div>

              {/* Virtue Profile */}
              {chosenTags.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-amber-500/60 text-xs uppercase tracking-wider font-serif">Profil spirituel</h3>
                  <div>
                    <p className="text-amber-300/40 text-xs mb-2 font-serif">Vertus développées</p>
                    <div className="flex flex-wrap gap-2">
                      {virtues.map((v, i) => (
                        <span
                          key={v}
                          className="virtue-badge px-2.5 py-1 text-xs bg-emerald-900/20 text-emerald-400/70 rounded-full border border-emerald-700/20 font-serif transition-all duration-300 hover:bg-emerald-900/30 hover:border-emerald-600/30 hover:scale-105 hover:text-emerald-300/80"
                          style={{ '--delay': `${i * 0.5}s` } as React.CSSProperties}
                        >
                          ✦ {v}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-amber-300/40 text-xs mb-2 font-serif">Défis à surmonter</p>
                    <div className="flex flex-wrap gap-2">
                      {challenges.map((c, i) => (
                        <span
                          key={c}
                          className="virtue-badge px-2.5 py-1 text-xs bg-orange-900/20 text-orange-400/70 rounded-full border border-orange-700/20 font-serif transition-all duration-300 hover:bg-orange-900/30 hover:border-orange-600/30 hover:scale-105 hover:text-orange-300/80"
                          style={{ '--delay': `${(i + virtues.length) * 0.5}s` } as React.CSSProperties}
                        >
                          ⚡ {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Choices Timeline */}
              <div className="space-y-3">
                <h3 className="text-amber-500/60 text-xs uppercase tracking-wider font-serif">Chronologie des choix</h3>
                <div className="space-y-3">
                  {chosenTags.map((tag, index) => {
                    const info = tagLabels[tag];
                    if (!info) return null;
                    return (
                      <motion.div
                        key={`${tag}-${index}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 group cursor-default"
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-amber-900/30 border border-amber-700/30 flex items-center justify-center text-sm shrink-0 group-hover:bg-amber-800/40 group-hover:border-amber-600/40 transition-all duration-300 group-hover:scale-110">
                            {info.emoji}
                          </div>
                          {index < chosenTags.length - 1 && (
                            <div className="w-px h-6 bg-amber-800/20 mt-1 group-hover:bg-amber-700/30 transition-colors duration-300" />
                          )}
                        </div>
                        <div className="pt-1 group-hover:translate-x-1 transition-transform duration-300">
                          <p className="text-amber-100/80 text-sm font-serif group-hover:text-amber-100 transition-colors duration-300">{info.label}</p>
                          <p className="text-amber-500/40 text-xs font-serif group-hover:text-amber-500/60 transition-colors duration-300">{info.chapter}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                  {chosenTags.length === 0 && (
                    <p className="text-amber-200/30 text-sm font-serif italic">
                      Aucun choix encore effectué...
                    </p>
                  )}
                </div>
              </div>

              {/* Endings Gallery */}
              {endingsFound.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-amber-500/60 text-xs uppercase tracking-wider font-serif">Fins découvertes</h3>
                  <div className="space-y-2">
                    {endingsFound.map((ending) => (
                      <div
                        key={ending}
                        className="flex items-center gap-2 px-3 py-2 bg-amber-950/20 rounded-lg border border-amber-800/10 hover:border-amber-700/20 hover:bg-amber-950/30 transition-all duration-300"
                      >
                        <ChevronRight className="w-3 h-3 text-amber-500/50" />
                        <span className="text-amber-100/70 text-sm font-serif capitalize">
                          {ending === 'light' && '🌟 La Lumière de l\'Âme'}
                          {ending === 'wisdom' && '📖 La Sagesse du Chemin'}
                          {ending === 'shadow' && '🌙 L\'Ombre Révélée'}
                          {ending === 'pure' && '🪞 Le Miroir Pur'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Share button */}
              {chosenTags.length > 0 && (
                <ShareJourneyButton
                  visitedCount={visitedPages.length}
                  choicesCount={chosenTags.length}
                  chaptersCount={chaptersCompleted.length}
                  endingsCount={endingsFound.length}
                  virtues={virtues}
                  endingsFound={endingsFound}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
