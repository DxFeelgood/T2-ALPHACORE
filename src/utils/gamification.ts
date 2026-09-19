import { Achievement, UserProgressState, StudyGroup, GroupMember } from '../types';

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    title: 'Primo Passo Matematico',
    description: 'Inizia il tuo percorso didattico esplorando il primo modulo.',
    category: 'learning',
    icon: '🌱',
    xpReward: 50,
  },
  {
    id: 'star_collector_5',
    title: 'Collezionista di Stelle',
    description: 'Ottieni almeno 5 stelle totali nei quiz di analisi.',
    category: 'learning',
    icon: '⭐',
    xpReward: 100,
  },
  {
    id: 'star_collector_15',
    title: 'Campione di Valutazione',
    description: 'Raggiungi 15 stelle totali tra tutti i moduli.',
    category: 'learning',
    icon: '🌟',
    xpReward: 250,
  },
  {
    id: 'master_all_modules',
    title: 'Pioniere dell\'Analisi',
    description: 'Sblocca e completa tutti e 7 i moduli del percorso didattico.',
    category: 'learning',
    icon: '🏆',
    xpReward: 500,
  },
  {
    id: 'streak_3',
    title: 'Costanza Iniziale',
    description: 'Mantieni attiva la serie giornaliera per 3 giorni di fila.',
    category: 'streak',
    icon: '🔥',
    xpReward: 100,
  },
  {
    id: 'streak_7',
    title: 'Custode della Fiammella',
    description: 'Completa la Sfida del Giorno per 7 giorni consecutivi.',
    category: 'streak',
    icon: '⚡',
    xpReward: 300,
  },
  {
    id: 'accuracy_perfect',
    title: 'Precisione Chirurgica',
    description: 'Completa un quiz ottenendo il 100% di risposte corrette.',
    category: 'accuracy',
    icon: '🎯',
    xpReward: 150,
  },
  {
    id: 'calculator_wizard',
    title: 'Risolutore Seriale',
    description: 'Esegui almeno 5 calcoli o risoluzioni con la Calcolatrice Scientifica.',
    category: 'tools',
    icon: '🧮',
    xpReward: 80,
  },
  {
    id: 'graph_explorer',
    title: 'Grafico Seriale',
    description: 'Utilizza il Graficatore 2D per analizzare funzioni e trovare i punti critici.',
    category: 'tools',
    icon: '📈',
    xpReward: 80,
  },
  {
    id: 'social_pioneer',
    title: 'Studente Collaborativo',
    description: 'Unisciti o crea un Gruppo di Studio per condividere i tuoi progressi.',
    category: 'social',
    icon: '👥',
    xpReward: 120,
  },
  {
    id: 'math_battle_champ',
    title: 'Gladiatore dell\'Algebra',
    description: 'Vinci la tua prima Math Battle 1v1 contro un compagno di studio.',
    category: 'social',
    icon: '⚔️',
    xpReward: 200,
  },
];

export function calculateLevelFromXP(xp: number): { level: number; currentLevelXp: number; nextLevelXp: number; progressPercent: number } {
  // Level formula: L = floor(sqrt(XP / 50)) + 1
  const level = Math.floor(Math.sqrt(Math.max(0, xp) / 50)) + 1;
  const currentLevelMinXp = 50 * Math.pow(level - 1, 2);
  const nextLevelMinXp = 50 * Math.pow(level, 2);
  
  const xpInCurrentLevel = xp - currentLevelMinXp;
  const xpNeededForLevel = nextLevelMinXp - currentLevelMinXp;
  
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpNeededForLevel) * 100)));

  return {
    level,
    currentLevelXp: xpInCurrentLevel,
    nextLevelXp: xpNeededForLevel,
    progressPercent,
  };
}

export function checkAndUnlockAchievements(userProgress: UserProgressState): string[] {
  const currentlyUnlocked = new Set(userProgress.unlockedBadges || []);
  const newlyUnlocked: string[] = [];

  let totalStars = 0;
  let unlockedCount = 0;
  Object.values(userProgress.modules).forEach((mod) => {
    totalStars += mod.stars;
    if (mod.stars >= 2) unlockedCount++;
  });

  // Check conditions
  if (!currentlyUnlocked.has('first_step')) {
    currentlyUnlocked.add('first_step');
    newlyUnlocked.push('first_step');
  }

  if (totalStars >= 5 && !currentlyUnlocked.has('star_collector_5')) {
    currentlyUnlocked.add('star_collector_5');
    newlyUnlocked.push('star_collector_5');
  }

  if (totalStars >= 15 && !currentlyUnlocked.has('star_collector_15')) {
    currentlyUnlocked.add('star_collector_15');
    newlyUnlocked.push('star_collector_15');
  }

  if (unlockedCount >= 7 && !currentlyUnlocked.has('master_all_modules')) {
    currentlyUnlocked.add('master_all_modules');
    newlyUnlocked.push('master_all_modules');
  }

  if (userProgress.dailyStreak.streakCount >= 3 && !currentlyUnlocked.has('streak_3')) {
    currentlyUnlocked.add('streak_3');
    newlyUnlocked.push('streak_3');
  }

  if (userProgress.dailyStreak.streakCount >= 7 && !currentlyUnlocked.has('streak_7')) {
    currentlyUnlocked.add('streak_7');
    newlyUnlocked.push('streak_7');
  }

  const hasPerfectAttempt = userProgress.attempts.some((att) => att.score === att.totalQuestions && att.totalQuestions > 0);
  if (hasPerfectAttempt && !currentlyUnlocked.has('accuracy_perfect')) {
    currentlyUnlocked.add('accuracy_perfect');
    newlyUnlocked.push('accuracy_perfect');
  }

  if (userProgress.calculatorHistory.length >= 5 && !currentlyUnlocked.has('calculator_wizard')) {
    currentlyUnlocked.add('calculator_wizard');
    newlyUnlocked.push('calculator_wizard');
  }

  if (userProgress.joinedGroups.length > 0 && !currentlyUnlocked.has('social_pioneer')) {
    currentlyUnlocked.add('social_pioneer');
    newlyUnlocked.push('social_pioneer');
  }

  return Array.from(currentlyUnlocked);
}

// Sample initial Study Group for rich collaboration experience
export const INITIAL_DEMO_GROUPS: StudyGroup[] = [
  {
    id: 'group_polimi_2026',
    name: 'Analisi 1 - PoliMi 2026',
    description: 'Gruppo di studio per la preparazione dell\'esame di Analisi Matematica 1. Esercitazioni e confronti quotidiani.',
    code: 'POLI26',
    createdAt: '2026-09-01',
    ownerId: 'user_alex',
    members: [
      {
        id: 'user_alex',
        name: 'Alessandro M.',
        avatar: '👨‍🔬',
        xp: 1450,
        level: 6,
        stars: 18,
        streak: 12,
        privacy: 'public',
        lastActive: '5m fa',
        moduleMastery: { 1: 100, 2: 90, 3: 85, 4: 80, 5: 75, 6: 60, 7: 40 },
      },
      {
        id: 'user_chiara',
        name: 'Chiara V.',
        avatar: '👩‍💻',
        xp: 1280,
        level: 5,
        stars: 16,
        streak: 9,
        privacy: 'public',
        lastActive: '1h fa',
        moduleMastery: { 1: 100, 2: 95, 3: 90, 4: 70, 5: 60, 6: 50, 7: 30 },
      },
      {
        id: 'user_marco',
        name: 'Marco B.',
        avatar: '🧑‍🎓',
        xp: 940,
        level: 4,
        stars: 12,
        streak: 5,
        privacy: 'metrics_only',
        lastActive: '3h fa',
        moduleMastery: { 1: 90, 2: 80, 3: 65, 4: 50, 5: 40, 6: 20, 7: 10 },
      },
      {
        id: 'user_giulia',
        name: 'Giulia R.',
        avatar: '👩‍🎨',
        xp: 620,
        level: 3,
        stars: 8,
        streak: 2,
        privacy: 'anonymous',
        lastActive: 'Ieri',
        moduleMastery: { 1: 80, 2: 70, 3: 50, 4: 30, 5: 20, 6: 10, 7: 0 },
      },
    ],
    notes: [
      {
        id: 'note_1',
        authorName: 'Alessandro M.',
        authorAvatar: '👨‍🔬',
        timestamp: 'Ieri alle 16:30',
        title: 'Trucco pratico per i limiti con Forma Indeterminata [0/0]',
        content: 'Quando avete $lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1$, ricordate che vale anche per argomenti composti: $lim_{x \\to 0} \\frac{\\sin(kx)}{kx} = 1$. Utilissimo per i quiz del Modulo 3!',
        likes: 5,
      },
      {
        id: 'note_2',
        authorName: 'Chiara V.',
        authorAvatar: '👩‍💻',
        timestamp: 'Oggi alle 09:15',
        title: 'Grafico e asintoti obliqui',
        content: 'Per trovare $m$ dell\'asintoto obliquo $y = mx + q$, fate sempre $m = lim_{x \\to \\infty} \\frac{f(x)}{x}$. Se $m$ esiste ed è finito, poi trovate $q = lim_{x \\to \\infty} [f(x) - mx]$.',
        likes: 3,
      },
    ],
  },
];

export const DEMO_LEADERBOARD_USERS = [
  { id: '1', name: 'Sofia B.', avatar: '👩‍🔬', xpThisWeek: 420, stars: 19, streak: 14, league: 'Lega Pitagora (Oro)' },
  { id: '2', name: 'Luca T.', avatar: '👨‍🎓', xpThisWeek: 380, stars: 17, streak: 11, league: 'Lega Pitagora (Oro)' },
  { id: '3', name: 'Elena G.', avatar: '👩‍💻', xpThisWeek: 340, stars: 16, streak: 8, league: 'Lega Archimede (Argento)' },
  { id: '4', name: 'Matteo K.', avatar: '🧑‍🏫', xpThisWeek: 290, stars: 14, streak: 6, league: 'Lega Archimede (Argento)' },
  { id: '5', name: 'Davide P.', avatar: '👨‍🚀', xpThisWeek: 210, stars: 11, streak: 4, league: 'Lega Euclide (Bronzo)' },
];
