'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, XCircle, RotateCcw, HelpCircle, ChevronRight } from 'lucide-react';

interface SpiritualQuizProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const quizQuestions: QuizQuestion[] = [
  {
    question: "Que signifie le mot « Qalb » ?",
    options: ["Le corps", "Le cœur", "L'esprit", "L'âme"],
    correct: 1,
    explanation: "Qalb signifie « le cœur » en arabe. Dans le Tassawuf, c'est le siège de la spiritualité.",
    difficulty: 'easy',
  },
  {
    question: "Comment s'appelle le petit renard qui accompagne Souhayl ?",
    options: ["Moulay", "Zaki", "Nafs", "Waswās"],
    correct: 1,
    explanation: "Zaki est un renard de sagesse qui guide Souhayl dans son voyage intérieur.",
    difficulty: 'easy',
  },
  {
    question: "Qu'est-ce que le « Nafs » ?",
    options: ["L'ange gardien", "L'ego / le moi inférieur", "La prière", "La lumière divine"],
    correct: 1,
    explanation: "Le Nafs est l'ego, la partie de nous qui nous éloigne de Dieu. Le combattre est un grand djihad.",
    difficulty: 'medium',
  },
  {
    question: "Que signifie « Sabr » ?",
    options: ["La prière du matin", "La patience", "Le jeûne", "La gratitude"],
    correct: 1,
    explanation: "Sabr signifie la patience persévérante. C'est une des plus grandes vertus dans le chemin spirituel.",
    difficulty: 'easy',
  },
  {
    question: "Dans quel pays l'histoire de Souhayl se déroule-t-elle ?",
    options: ["L'Égypte", "La Turquie", "Le Maroc", "L'Arabie Saoudite"],
    correct: 2,
    explanation: "L'histoire se déroule au Maroc, un pays riche en spiritualité soufie.",
    difficulty: 'medium',
  },
  {
    question: "Qu'est-ce que « Tawakkul » ?",
    options: ["Le jeûne", "La confiance en Dieu", "Le pèlerinage", "La charité"],
    correct: 1,
    explanation: "Tawakkul est la confiance totale en Dieu. C'est croire que Dieu pourvoit à tout.",
    difficulty: 'medium',
  },
  {
    question: "Combien de fins différentes peut-on découvrir ?",
    options: ["2", "3", "4", "5"],
    correct: 2,
    explanation: "Il y a 4 fins : La Lumière de l'Âme, La Sagesse du Chemin, L'Ombre Révélée, et Le Miroir Pur.",
    difficulty: 'easy',
  },
  {
    question: "Que signifie « Dhikr » ?",
    options: ["Le silence", "L'évocation de Dieu", "Le sommeil spirituel", "Le voyage"],
    correct: 1,
    explanation: "Dhikr est l'évocation de Dieu, souvent répétée comme « Subhan Allah » ou « La ilaha illa Allah ».",
    difficulty: 'hard',
  },
  {
    question: "Quel est le vrai combat (djihad) selon le Tassawuf ?",
    options: ["Le combat physique", "Le combat contre son propre ego", "Le combat contre les ennemis", "Le combat pour la richesse"],
    correct: 1,
    explanation: "Le Prophète (paix sur lui) a dit : « Le plus grand djihad est le combat contre soi-même. »",
    difficulty: 'hard',
  },
  {
    question: "Comment s'appelle le monstre des doutes qui murmure à Souhayl ?",
    options: ["Zaki", "Nafs", "Waswās", "Moulay"],
    correct: 2,
    explanation: "Waswās est le murmureur, celui qui insuffle les doutes dans le cœur du croyant.",
    difficulty: 'medium',
  },
];

const difficultyConfig = {
  easy: { label: 'Facile', emoji: '🟢' },
  medium: { label: 'Moyen', emoji: '🟡' },
  hard: { label: 'Difficile', emoji: '🔴' },
} as const;

const optionLabels = ['a', 'b', 'c', 'd'];

export default function SpiritualQuiz({ isOpen, onClose }: SpiritualQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(10).fill(null));
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);

  const currentQ = quizQuestions[currentQuestion];
  const isAnswered = selectedOption !== null;
  const handleNextRef = useRef<() => void>(() => {});

  const handleNext = useCallback(() => {
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  }, [currentQuestion]);

  // Keep ref in sync
  useEffect(() => {
    handleNextRef.current = handleNext;
  }, [handleNext]);

  const handleSelectOption = useCallback((index: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(index);
    const isCorrect = index === currentQ.correct;
    setScore(prev => isCorrect ? prev + 1 : prev);
    setAnswers(prev => {
      const next = [...prev];
      next[currentQuestion] = isCorrect;
      return next;
    });
    setShowExplanation(true);

    // Auto-advance after 2.5 seconds
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    autoAdvanceRef.current = setTimeout(() => {
      handleNextRef.current();
    }, 2500);
  }, [selectedOption, currentQ.correct, currentQuestion]);

  const handleReplay = useCallback(() => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setAnswers(Array(10).fill(null));
    setShowExplanation(false);
    setIsFinished(false);
  }, []);

  const handleClose = useCallback(() => {
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }
    onClose();
  }, [onClose]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, []);

  const getResultMessage = () => {
    if (score === 10) return { emoji: '🌟', message: 'Parfait ! Tu es un vrai sage !' };
    if (score >= 7) return { emoji: '📖', message: 'Très bien ! Tu connais bien le chemin !' };
    if (score >= 4) return { emoji: '🌱', message: 'Pas mal ! Continue d\'apprendre !' };
    return { emoji: '🌙', message: 'Courage ! Relis l\'histoire et réessaie !' };
  };

  const getOptionClass = (index: number) => {
    const base = 'quiz-option';
    if (!isAnswered) return base;
    if (index === currentQ.correct) return `${base} correct`;
    if (index === selectedOption && index !== currentQ.correct) return `${base} wrong`;
    return `${base} disabled`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Quiz Panel — slides in from left */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="quiz-panel fixed left-0 top-0 bottom-0 z-50 w-full max-w-md overflow-y-auto custom-scrollbar"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 px-6 py-4 border-b border-amber-800/15 flex items-center justify-between"
              style={{ background: 'rgba(18, 17, 26, 0.9)', backdropFilter: 'blur(12px)' }}>
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-amber-500/70" />
                <div>
                  <h2 className="font-serif text-lg text-amber-100 font-bold">📝 Quiz Spirituel</h2>
                  <p className="text-amber-500/50 text-xs font-serif">Teste tes connaissances !</p>
                </div>
              </div>
              <button onClick={handleClose} className="p-2 rounded-lg hover:bg-amber-900/20 transition-colors" aria-label="Fermer le quiz">
                <X className="w-4 h-4 text-amber-200/50" />
              </button>
            </div>

            {!isFinished ? (
              <div className="p-6">
                {/* Progress dots */}
                <div className="flex items-center gap-1.5 mb-6">
                  {quizQuestions.map((_, i) => (
                    <div
                      key={i}
                      className={`quiz-progress-dot ${
                        i === currentQuestion ? 'active' :
                        answers[i] === true ? 'correct-dot' :
                        answers[i] === false ? 'wrong-dot' : ''
                      }`}
                    />
                  ))}
                </div>

                {/* Question counter + difficulty */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-amber-500/50 text-sm font-serif">
                    Question {currentQuestion + 1} / {quizQuestions.length}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-serif px-2.5 py-1 rounded-full bg-amber-950/20 border border-amber-800/10">
                    {difficultyConfig[currentQ.difficulty].emoji} {difficultyConfig[currentQ.difficulty].label}
                  </span>
                </div>

                {/* Question */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-amber-100 text-base font-serif leading-relaxed mb-6" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
                      {currentQ.question}
                    </h3>

                    {/* Options */}
                    <div className="space-y-3 mb-6">
                      {currentQ.options.map((option, index) => (
                        <motion.button
                          key={`${currentQuestion}-${index}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.08 }}
                          onClick={() => handleSelectOption(index)}
                          className={getOptionClass(index)}
                          disabled={isAnswered}
                        >
                          <div className="flex items-center gap-3">
                            <span className="shrink-0 w-6 h-6 rounded-full border border-amber-800/25 flex items-center justify-center text-xs font-serif text-amber-500/60 bg-amber-950/20">
                              {optionLabels[index]}
                            </span>
                            <span className="text-sm font-serif text-amber-100/80">
                              {option}
                            </span>
                            {isAnswered && index === currentQ.correct && (
                              <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto shrink-0" />
                            )}
                            {isAnswered && index === selectedOption && index !== currentQ.correct && (
                              <XCircle className="w-4 h-4 text-red-400 ml-auto shrink-0" />
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Explanation */}
                    <AnimatePresence>
                      {showExplanation && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="rounded-xl p-4 mb-4" style={{
                            background: selectedOption === currentQ.correct
                              ? 'rgba(34, 197, 94, 0.06)'
                              : 'rgba(239, 68, 68, 0.06)',
                            border: `1px solid ${
                              selectedOption === currentQ.correct
                                ? 'rgba(34, 197, 94, 0.15)'
                                : 'rgba(239, 68, 68, 0.15)'
                            }`,
                          }}>
                            <div className="flex items-start gap-2.5">
                              <span className="text-lg shrink-0 mt-0.5">
                                {selectedOption === currentQ.correct ? '✅' : '❌'}
                              </span>
                              <p className="text-sm font-serif text-amber-100/70 leading-relaxed">
                                {currentQ.explanation}
                              </p>
                            </div>
                          </div>

                          {/* Next button */}
                          {currentQuestion < quizQuestions.length - 1 && (
                            <motion.button
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              onClick={handleNext}
                              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-serif text-amber-100/80 transition-all duration-300 hover:bg-amber-900/25"
                              style={{
                                background: 'rgba(212, 165, 116, 0.06)',
                                border: '1px solid rgba(212, 165, 116, 0.15)',
                              }}
                            >
                              Question suivante
                              <ChevronRight className="w-4 h-4" />
                            </motion.button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              /* Results Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="p-6 flex flex-col items-center text-center"
              >
                {/* Score circle */}
                <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full golden-halo" />
                  <div className="relative w-28 h-28 rounded-full flex flex-col items-center justify-center"
                    style={{
                      background: 'rgba(212, 165, 116, 0.08)',
                      border: '2px solid rgba(212, 165, 116, 0.25)',
                    }}>
                    <span className="text-3xl font-bold font-serif text-amber-100">{score}</span>
                    <span className="text-sm font-serif text-amber-500/60">/ {quizQuestions.length}</span>
                  </div>
                </div>

                {/* Result message */}
                <div className="mb-6">
                  <p className="text-3xl mb-2">{getResultMessage().emoji}</p>
                  <p className="text-lg font-serif text-amber-100" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
                    {getResultMessage().message}
                  </p>
                </div>

                {/* Answer summary */}
                <div className="w-full space-y-2 mb-6">
                  {quizQuestions.map((q, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left"
                      style={{
                        background: answers[i]
                          ? 'rgba(34, 197, 94, 0.06)'
                          : 'rgba(239, 68, 68, 0.06)',
                        border: `1px solid ${answers[i] ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'}`,
                      }}
                    >
                      <span className="text-sm shrink-0">{answers[i] ? '✅' : '❌'}</span>
                      <span className="text-xs font-serif text-amber-100/60 truncate">
                        {q.question}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Replay button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReplay}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-serif text-amber-100 transition-all duration-300 hover:bg-amber-900/25"
                  style={{
                    background: 'rgba(212, 165, 116, 0.08)',
                    border: '1px solid rgba(212, 165, 116, 0.2)',
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                  Rejouer
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
