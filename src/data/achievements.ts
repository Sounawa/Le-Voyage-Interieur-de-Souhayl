export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  condition: string; // human-readable trigger description
}

export const achievements: Achievement[] = [
  { id: 'first_step', title: 'Premier Pas', description: 'Fais ton premier choix', emoji: '🚶', condition: 'Make first choice' },
  { id: 'curious_soul', title: 'Âme Curieuse', description: 'Visite 10 pages différentes', emoji: '🔍', condition: 'Visit 10 pages' },
  { id: 'seeker', title: 'Le Chercheur', description: 'Visite 25 pages différentes', emoji: '🔭', condition: 'Visit 25 pages' },
  { id: 'explorer', title: "L'Explorateur", description: 'Visite 50 pages différentes', emoji: '🧭', condition: 'Visit 50 pages' },
  { id: 'bookworm', title: 'Rat de Bibliothèque', description: 'Visite 100 pages', emoji: '📚', condition: 'Visit 100 pages' },
  { id: 'collector', title: 'Collectionneur', description: 'Découvre 1 fin', emoji: '⭐', condition: 'Find 1 ending' },
  { id: 'sage', title: 'Le Sage', description: 'Découvre les 4 fins', emoji: '👑', condition: 'Find all endings' },
  { id: 'patient', title: 'La Patience', description: 'Atteins le Chapitre 3', emoji: '🧘', condition: 'Reach Ch3' },
  { id: 'brave', title: 'Le Brave', description: 'Atteins le Chapitre 4', emoji: '🦁', condition: 'Reach Ch4' },
  { id: 'bookmark_fan', title: 'Ami des Favoris', description: 'Ajoute 3 favoris', emoji: '🔖', condition: 'Add 3 bookmarks' },
];
