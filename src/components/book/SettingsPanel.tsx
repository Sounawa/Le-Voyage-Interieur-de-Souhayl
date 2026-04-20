'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Volume2, VolumeX, Volume1, Type, Play, Trophy, AlignJustify, CaseSensitive } from 'lucide-react';
import { useStoryStore } from '@/store/story-store';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAchievements: () => void;
}

export default function SettingsPanel({ isOpen, onClose, onOpenAchievements }: SettingsPanelProps) {
  const {
    fontSize,
    lineHeight,
    fontFamily,
    soundEnabled,
    soundVolume,
    autoContinue,
    achievements,
    setFontSize,
    setLineHeight,
    setFontFamily,
    setSoundEnabled,
    setSoundVolume,
    setAutoContinue,
  } = useStoryStore();

  const fontSizeOptions: { value: 'sm' | 'md' | 'lg'; label: string }[] = [
    { value: 'sm', label: 'Petit' },
    { value: 'md', label: 'Moyen' },
    { value: 'lg', label: 'Grand' },
  ];

  const effectiveVolume = soundEnabled ? soundVolume : 0;
  const VolumeIcon = effectiveVolume === 0 ? VolumeX : soundVolume < 40 ? Volume1 : Volume2;

  // Volume bar visualization
  const volumeBars = 5;
  const activeBars = Math.ceil((effectiveVolume / 100) * volumeBars);

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
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Settings Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-xs bg-[#0d0c14]/95 backdrop-blur-md border-l border-amber-800/20 overflow-y-auto custom-scrollbar"
          >
            {/* Subtle edge glow on left edge */}
            <div className="edge-glow-left" />
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#0d0c14]/90 backdrop-blur-md px-6 py-4 border-b border-amber-800/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-amber-500/70" />
                <h2 className="font-serif text-lg text-amber-100 font-bold">Paramètres</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-amber-900/20 transition-colors" aria-label="Fermer les paramètres">
                <X className="w-4 h-4 text-amber-200/50" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Text Size */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-amber-500/60" />
                  <h3 className="text-amber-200/80 text-sm font-serif font-semibold">Taille du texte</h3>
                </div>
                <p className="text-amber-500/40 text-xs font-serif">
                  Ajuste la taille de l&apos;histoire
                </p>
                <div className="flex gap-2 mt-2">
                  {fontSizeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFontSize(option.value)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-serif transition-all duration-200 border ${
                        fontSize === option.value
                          ? 'bg-amber-700/30 border-amber-600/40 text-amber-200 shadow-sm shadow-amber-900/20'
                          : 'bg-amber-950/20 border-amber-800/10 text-amber-300/50 hover:bg-amber-900/20 hover:text-amber-200/70'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <Separator className="bg-amber-800/10" />

              {/* Sound Toggle */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <VolumeIcon className={`w-4 h-4 ${effectiveVolume === 0 ? 'text-amber-500/40' : 'text-amber-500/60'}`} />
                  <h3 className="text-amber-200/80 text-sm font-serif font-semibold">Son</h3>
                </div>
                <p className="text-amber-500/40 text-xs font-serif">
                  Activer les effets sonores
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xs font-serif ${soundEnabled ? 'text-amber-300/60' : 'text-amber-500/30'}`}>
                    Désactivé
                  </span>
                  <Switch
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                    className="data-[state=checked]:bg-amber-600/60"
                  />
                  <span className={`text-xs font-serif ${soundEnabled ? 'text-amber-300/60' : 'text-amber-500/30'}`}>
                    Activé
                  </span>
                </div>

                {/* Volume Slider — only shows when sound is enabled */}
                <AnimatePresence>
                  {soundEnabled && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-amber-400/50 text-xs font-serif">Volume</span>
                          <div className="flex items-center gap-1.5">
                            {/* Volume bars visualization */}
                            <div className="flex items-end gap-0.5 h-3.5">
                              {Array.from({ length: volumeBars }).map((_, i) => (
                                <div
                                  key={i}
                                  className="w-1 rounded-sm transition-all duration-150"
                                  style={{
                                    height: `${40 + (i + 1) * 12}%`,
                                    background:
                                      i < activeBars
                                        ? 'linear-gradient(180deg, #e8c87a, #d4a574)'
                                        : 'rgba(212, 165, 116, 0.15)',
                                    boxShadow:
                                      i < activeBars
                                        ? '0 0 4px rgba(212, 165, 116, 0.3)'
                                        : 'none',
                                  }}
                                />
                              ))}
                            </div>
                            <span className="text-amber-400/50 text-[10px] font-mono w-7 text-right">
                              {soundVolume}%
                            </span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={soundVolume}
                          onChange={(e) => setSoundVolume(Number(e.target.value))}
                          className="ambient-slider"
                          aria-label="Volume du son ambiant"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Separator className="bg-amber-800/10" />

              {/* Auto-Continue Toggle */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-amber-500/60" />
                  <h3 className="text-amber-200/80 text-sm font-serif font-semibold">Lecture automatique</h3>
                </div>
                <p className="text-amber-500/40 text-xs font-serif">
                  Avancer automatiquement après 4 secondes
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xs font-serif ${autoContinue ? 'text-amber-300/60' : 'text-amber-500/30'}`}>
                    Manuel
                  </span>
                  <Switch
                    checked={autoContinue}
                    onCheckedChange={setAutoContinue}
                    className="data-[state=checked]:bg-amber-600/60"
                  />
                  <span className={`text-xs font-serif ${autoContinue ? 'text-amber-300/60' : 'text-amber-500/30'}`}>
                    Auto
                  </span>
                </div>
              </div>

              <Separator className="bg-amber-800/10" />

              {/* Line Height */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlignJustify className="w-4 h-4 text-amber-500/60" />
                  <h3 className="text-amber-200/80 text-sm font-serif font-semibold">Espacement des lignes</h3>
                </div>
                <p className="text-amber-500/40 text-xs font-serif">
                  Ajuster l&apos;interligne de lecture
                </p>
                <div className="flex gap-2 mt-2">
                  {([
                    { value: 'compact' as const, label: 'Serré' },
                    { value: 'normal' as const, label: 'Normal' },
                    { value: 'relaxed' as const, label: 'Large' },
                  ]).map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setLineHeight(option.value)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-serif transition-all duration-200 border ${
                        lineHeight === option.value
                          ? 'bg-amber-700/30 border-amber-600/40 text-amber-200 shadow-sm shadow-amber-900/20'
                          : 'bg-amber-950/20 border-amber-800/10 text-amber-300/50 hover:bg-amber-900/20 hover:text-amber-200/70'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <Separator className="bg-amber-800/10" />

              {/* Font Family */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CaseSensitive className="w-4 h-4 text-amber-500/60" />
                  <h3 className="text-amber-200/80 text-sm font-serif font-semibold">Police de caractère</h3>
                </div>
                <p className="text-amber-500/40 text-xs font-serif">
                  Choisir le style typographique
                </p>
                <div className="flex gap-2 mt-2">
                  {([
                    { value: 'serif' as const, label: 'Classique' },
                    { value: 'sans' as const, label: 'Moderne' },
                  ]).map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFontFamily(option.value)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all duration-200 border ${
                        fontFamily === option.value
                          ? 'bg-amber-700/30 border-amber-600/40 text-amber-200 shadow-sm shadow-amber-900/20'
                          : 'bg-amber-950/20 border-amber-800/10 text-amber-300/50 hover:bg-amber-900/20 hover:text-amber-200/70'
                      } ${option.value === 'serif' ? 'font-serif' : 'font-sans'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <Separator className="bg-amber-800/10" />

              {/* Achievements Button */}
              <button
                onClick={() => {
                  onClose();
                  setTimeout(onOpenAchievements, 200);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-amber-950/20 border border-amber-800/10 hover:bg-amber-900/15 hover:border-amber-700/25 transition-all duration-300 group"
              >
                <div className="p-1.5 rounded-lg bg-amber-900/20 group-hover:bg-amber-800/30 transition-colors">
                  <Trophy className="w-4 h-4 text-amber-400/70 group-hover:text-amber-400/90 transition-colors" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-amber-200/80 text-sm font-serif font-semibold">Succès</h3>
                  <p className="text-amber-500/40 text-[11px] font-serif">
                    {achievements.length} / 12 débloqués
                  </p>
                </div>
                {achievements.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-700/20 text-amber-400/70 text-[10px] font-mono font-bold">
                    {achievements.length}
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
