'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronRight, FileText, BookOpen } from 'lucide-react';
import { storyPages } from '@/data/story-data';
import type { StoryPage } from '@/lib/story-types';

interface PageSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (pageId: string) => void;
}

interface SearchResult {
  pageId: string;
  page: StoryPage;
  snippet: string;
  matchField: 'paragraph' | 'title' | 'chapterTitle' | 'choice';
}

const MAX_RESULTS = 20;
const DEBOUNCE_MS = 300;

const chapterLabels: Record<number, { label: string; emoji: string }> = {
  0: { label: 'Prologue', emoji: '🌙' },
  1: { label: 'La Découverte', emoji: '✨' },
  2: { label: 'Le Désert de l\'Âme', emoji: '🏜️' },
  3: { label: 'La Forêt des Épreuves', emoji: '🌲' },
  4: { label: 'La Montagne de la Vérité', emoji: '⛰️' },
};

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (regex.test(part)) {
      regex.lastIndex = 0;
      return (
        <span key={i} className="search-highlight">
          {part}
        </span>
      );
    }
    regex.lastIndex = 0;
    return part;
  });
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSnippet(text: string, query: string, radius = 50): string {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const idx = lowerText.indexOf(lowerQuery);

  if (idx === -1) return text.slice(0, 100) + (text.length > 100 ? '…' : '');

  const start = Math.max(0, idx - radius);
  const end = Math.min(text.length, idx + query.length + radius);

  let snippet = '';
  if (start > 0) snippet += '…';
  snippet += text.slice(start, end);
  if (end < text.length) snippet += '…';

  return snippet;
}

function searchPages(query: string): SearchResult[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];
  const seenPageIds = new Set<string>();

  const allPages = Object.values(storyPages);

  for (const page of allPages) {
    if (seenPageIds.size >= MAX_RESULTS * 2) break;

    // Search page title
    if (page.title && page.title.toLowerCase().includes(lowerQuery)) {
      seenPageIds.add(page.id);
      results.push({
        pageId: page.id,
        page,
        snippet: page.title,
        matchField: 'title',
      });
    }

    // Search chapter title
    if (page.chapterTitle.toLowerCase().includes(lowerQuery)) {
      if (!seenPageIds.has(page.id)) {
        seenPageIds.add(page.id);
        results.push({
          pageId: page.id,
          page,
          snippet: page.chapterTitle,
          matchField: 'chapterTitle',
        });
      }
    }

    // Search paragraphs
    for (const para of page.paragraphs) {
      if (para.toLowerCase().includes(lowerQuery)) {
        if (!seenPageIds.has(page.id)) {
          seenPageIds.add(page.id);
          results.push({
            pageId: page.id,
            page,
            snippet: getSnippet(para, query),
            matchField: 'paragraph',
          });
        }
        break;
      }
    }

    // Search choices text
    if (page.choices) {
      for (const choice of page.choices) {
        if (choice.text.toLowerCase().includes(lowerQuery)) {
          if (!seenPageIds.has(page.id)) {
            seenPageIds.add(page.id);
            results.push({
              pageId: page.id,
              page,
              snippet: getSnippet(choice.text, query),
              matchField: 'choice',
            });
          }
          break;
        }
      }
    }

    // Search shaykh speaks
    if (page.shaykhSpeaks && page.shaykhSpeaks.toLowerCase().includes(lowerQuery)) {
      if (!seenPageIds.has(page.id)) {
        seenPageIds.add(page.id);
        results.push({
          pageId: page.id,
          page,
          snippet: getSnippet(page.shaykhSpeaks, query),
          matchField: 'paragraph',
        });
      }
    }

    // Search zaki speaks
    if (page.zakiSpeaks && page.zakiSpeaks.toLowerCase().includes(lowerQuery)) {
      if (!seenPageIds.has(page.id)) {
        seenPageIds.add(page.id);
        results.push({
          pageId: page.id,
          page,
          snippet: getSnippet(page.zakiSpeaks, query),
          matchField: 'paragraph',
        });
      }
    }
  }

  return results.slice(0, MAX_RESULTS);
}

export default function PageSearch({ isOpen, onClose, onNavigate }: PageSearchProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search input
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  // Clear search when panel closes (via handler, not effect)
  const handleClose = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    onClose();
  }, [onClose]);

  const handleNavigate = useCallback((pageId: string) => {
    onNavigate(pageId);
    setQuery('');
    setDebouncedQuery('');
    onClose();
  }, [onNavigate, onClose]);

  const handleClear = useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
  }, []);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  const getMatchLabel = (field: SearchResult['matchField']) => {
    switch (field) {
      case 'title': return 'Titre';
      case 'chapterTitle': return 'Chapitre';
      case 'choice': return 'Choix';
      case 'paragraph': return 'Texte';
    }
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

          {/* Search Panel — slides in from left */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-full max-w-sm bg-[#0d0c14]/95 backdrop-blur-md border-r border-amber-800/20 flex flex-col islamic-bg-pattern"
          >
            {/* Header */}
            <div className="shrink-0 bg-[#0d0c14]/90 backdrop-blur-md px-6 py-4 border-b border-amber-800/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-amber-500/70" />
                <h2 className="font-serif text-lg text-amber-100 font-bold">Rechercher</h2>
              </div>
              <button onClick={handleClose} className="p-2 rounded-lg hover:bg-amber-900/20 transition-colors" aria-label="Fermer la recherche">
                <X className="w-4 h-4 text-amber-200/50" />
              </button>
            </div>

            {/* Search Input */}
            <div className="shrink-0 px-6 py-4 border-b border-amber-800/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/40 pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Chercher dans l'histoire..."
                  className="search-input w-full pl-10 pr-10 py-3 rounded-lg bg-amber-950/20 border border-amber-800/15 text-amber-100 text-sm font-serif placeholder:text-amber-500/30 focus:outline-none focus:border-amber-700/30 focus:ring-1 focus:ring-amber-700/20 transition-all duration-300"
                  aria-label="Rechercher dans le texte de l'histoire"
                />
                {query && (
                  <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-amber-900/30 transition-colors"
                    aria-label="Effacer la recherche"
                  >
                    <X className="w-3.5 h-3.5 text-amber-400/50" />
                  </button>
                )}
              </div>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* Results Count */}
              {debouncedQuery.trim() && (
                <div className="px-6 py-3 border-b border-amber-800/8">
                  <p className="text-amber-500/50 text-xs font-serif">
                    {results.length === 0
                      ? 'Aucun résultat trouvé'
                      : `${results.length} résultat${results.length > 1 ? 's' : ''} trouvé${results.length > 1 ? 's' : ''}`
                    }
                  </p>
                </div>
              )}

              {/* Empty State — No query */}
              {!debouncedQuery.trim() && (
                <div className="py-16 text-center px-6">
                  <div className="relative inline-block mb-4">
                    <Search className="w-12 h-12 text-amber-800/20 mx-auto" />
                  </div>
                  <p className="text-amber-200/30 text-sm font-serif italic">
                    Tapez un mot pour chercher dans l&apos;histoire...
                  </p>
                  <p className="text-amber-200/20 text-xs font-serif mt-2">
                    Recherche dans les paragraphes, titres, choix et dialogues
                  </p>
                </div>
              )}

              {/* Empty State — No results */}
              {debouncedQuery.trim() && results.length === 0 && (
                <div className="py-16 text-center px-6">
                  <div className="relative inline-block mb-4">
                    <FileText className="w-12 h-12 text-amber-800/20 mx-auto" />
                  </div>
                  <p className="text-amber-200/30 text-sm font-serif italic">
                    Aucune page ne contient ce texte
                  </p>
                  <p className="text-amber-200/20 text-xs font-serif mt-2">
                    Essayez un autre mot ou une expression plus courte
                  </p>
                </div>
              )}

              {/* Results List */}
              <div className="p-4 space-y-2">
                {results.map((result, index) => {
                  const chapterInfo = chapterLabels[result.page.chapter] || { label: `Chapitre ${result.page.chapter}`, emoji: '📖' };
                  const displayTitle = result.page.title || result.page.chapterTitle || result.pageId;

                  return (
                    <motion.button
                      key={result.pageId}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.03, 0.5) }}
                      onClick={() => handleNavigate(result.pageId)}
                      className="w-full text-left px-4 py-3 rounded-lg glass-card group search-result-card"
                    >
                      {/* Title row */}
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 w-8 h-8 rounded-lg bg-amber-900/25 border border-amber-800/20 flex items-center justify-center text-sm group-hover:bg-amber-800/30 group-hover:border-amber-700/30 transition-all duration-300 group-hover:scale-105 mt-0.5">
                          {chapterInfo.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-amber-100/80 text-sm font-serif truncate group-hover:text-amber-100 transition-colors duration-300">
                            {result.matchField === 'title' || result.matchField === 'chapterTitle'
                              ? highlightMatch(displayTitle, debouncedQuery)
                              : displayTitle
                            }
                          </p>
                          {/* Chapter badge + match type */}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="search-chapter-badge text-[10px] font-serif px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-500/50 border border-amber-800/10">
                              {chapterInfo.label}
                            </span>
                            <span className="text-amber-500/30 text-[10px] font-serif">
                              {getMatchLabel(result.matchField)}
                            </span>
                          </div>
                          {/* Snippet */}
                          <p className="text-amber-200/40 text-xs font-serif mt-2 leading-relaxed line-clamp-2 group-hover:text-amber-200/50 transition-colors duration-300">
                            {highlightMatch(result.snippet, debouncedQuery)}
                          </p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-500/30 group-hover:text-amber-500/50 shrink-0 mt-2 transition-colors duration-300" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Footer hint */}
            {results.length > 0 && (
              <div className="shrink-0 px-6 py-3 border-t border-amber-800/10 bg-[#0d0c14]/80 backdrop-blur-md">
                <p className="text-amber-500/25 text-[10px] font-serif text-center">
                  <BookOpen className="w-3 h-3 inline-block mr-1 opacity-50" />
                  Recherche limitée à {MAX_RESULTS} résultats
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
