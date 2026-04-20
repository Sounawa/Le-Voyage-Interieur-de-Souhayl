export interface AchievementDef {
  id: string;
  title: string;
  emoji: string;
  description: string;
}

export const ACHIEVEMENTS: Record<string, AchievementDef> = {
  first_step: {
    id: 'first_step',
    title: 'Premier Pas',
    emoji: '🚶',
    description: 'Fais ton premier choix',
  },
  curious_soul: {
    id: 'curious_soul',
    title: 'Âme Curieuse',
    emoji: '🔍',
    description: 'Visite 10 pages différentes',
  },
  seeker: {
    id: 'seeker',
    title: 'Le Chercheur',
    emoji: '🔭',
    description: 'Visite 25 pages différentes',
  },
  explorer: {
    id: 'explorer',
    title: "L'Explorateur",
    emoji: '🧭',
    description: 'Visite 50 pages différentes',
  },
  collector: {
    id: 'collector',
    title: 'Collectionneur',
    emoji: '⭐',
    description: 'Découvre 1 fin',
  },
  sage: {
    id: 'sage',
    title: 'Le Sage',
    emoji: '👑',
    description: 'Découvre les 4 fins',
  },
  patient: {
    id: 'patient',
    title: 'La Patience',
    emoji: '🧘',
    description: 'Atteins le Chapitre 3',
  },
  brave: {
    id: 'brave',
    title: 'Le Brave',
    emoji: '🦁',
    description: 'Atteins le Chapitre 4',
  },
  bookworm: {
    id: 'bookworm',
    title: 'Rat de Bibliothèque',
    emoji: '📚',
    description: 'Visite 100 pages',
  },
  bookmark_fan: {
    id: 'bookmark_fan',
    title: 'Ami des Favoris',
    emoji: '🔖',
    description: 'Ajoute 3 favoris',
  },
  glossary_reader: {
    id: 'glossary_reader',
    title: 'Érudit',
    emoji: '📖',
    description: 'Ouvre le glossaire',
  },
  persistent: {
    id: 'persistent',
    title: 'Persévérant',
    emoji: '🔄',
    description: 'Visite la même page 2 fois ou plus',
  },
};

export const ACHIEVEMENT_IDS = Object.keys(ACHIEVEMENTS);
export const TOTAL_ACHIEVEMENTS = ACHIEVEMENT_IDS.length;
