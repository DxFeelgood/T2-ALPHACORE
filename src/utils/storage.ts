import { UserProgressState, ModuleProgress, QuizAttempt, DailyChallengeState } from '../types';

const STORAGE_KEY = 'matematica_funzioni_user_progress_v1';

export const INITIAL_MODULES_PROGRESS: Record<number, ModuleProgress> = {
  1: { stars: 0, baseCompleted: false, intermedioCompleted: false, avanzatoCompleted: false, bestScorePercentage: 0, unlocked: true },
  2: { stars: 0, baseCompleted: false, intermedioCompleted: false, avanzatoCompleted: false, bestScorePercentage: 0, unlocked: false },
  3: { stars: 0, baseCompleted: false, intermedioCompleted: false, avanzatoCompleted: false, bestScorePercentage: 0, unlocked: false },
  4: { stars: 0, baseCompleted: false, intermedioCompleted: false, avanzatoCompleted: false, bestScorePercentage: 0, unlocked: false },
  5: { stars: 0, baseCompleted: false, intermedioCompleted: false, avanzatoCompleted: false, bestScorePercentage: 0, unlocked: false },
  6: { stars: 0, baseCompleted: false, intermedioCompleted: false, avanzatoCompleted: false, bestScorePercentage: 0, unlocked: false },
  7: { stars: 0, baseCompleted: false, intermedioCompleted: false, avanzatoCompleted: false, bestScorePercentage: 0, unlocked: false },
};

export const INITIAL_DAILY_STATE: DailyChallengeState = {
  lastCompletedDate: null,
  streakCount: 0,
  bestStreak: 0,
  todayCompleted: false,
  todayScore: null,
  history: [],
};

export const DEFAULT_USER_PROGRESS: UserProgressState = {
  modules: INITIAL_MODULES_PROGRESS,
  attempts: [],
  totalQuestionsAnswered: 0,
  totalCorrectAnswers: 0,
  dailyStreak: INITIAL_DAILY_STATE,
  calculatorHistory: [],
  xp: 120, // default starter XP
  level: 1,
  unlockedBadges: ['first_step'],
  equippedAvatar: '👨‍🎓',
  selectedTheme: 'standard',
  userName: 'Studente Matematico',
  privacySetting: 'public',
  joinedGroups: [],
};

export function loadUserProgress(): UserProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_USER_PROGRESS;
    const parsed = JSON.parse(raw);
    
    // Ensure all 7 modules exist and unlock logic is intact
    const modules = { ...INITIAL_MODULES_PROGRESS, ...(parsed.modules || {}) };
    
    // Module 1 is always unlocked
    modules[1].unlocked = true;

    // Check unlocking rule: Module N is unlocked if Module N-1 has >= 2 stars
    for (let id = 2; id <= 7; id++) {
      const prevModule = modules[id - 1];
      if (prevModule && prevModule.stars >= 2) {
        modules[id].unlocked = true;
      }
    }

    // Check daily streak reset logic (if last completed was before yesterday)
    const daily = { ...INITIAL_DAILY_STATE, ...(parsed.dailyStreak || {}) };
    const todayStr = getTodayDateString();
    
    if (daily.lastCompletedDate) {
      if (daily.lastCompletedDate === todayStr) {
        daily.todayCompleted = true;
      } else {
        daily.todayCompleted = false;
        const lastDate = new Date(daily.lastCompletedDate);
        const todayDate = new Date(todayStr);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 1) {
          // Streak broken
          daily.streakCount = 0;
        }
      }
    }

    return {
      modules,
      attempts: parsed.attempts || [],
      totalQuestionsAnswered: parsed.totalQuestionsAnswered || 0,
      totalCorrectAnswers: parsed.totalCorrectAnswers || 0,
      dailyStreak: daily,
      calculatorHistory: parsed.calculatorHistory || [],
      xp: parsed.xp !== undefined ? parsed.xp : 120,
      level: parsed.level || Math.floor(Math.sqrt((parsed.xp || 120) / 50)) + 1,
      unlockedBadges: parsed.unlockedBadges || ['first_step'],
      equippedAvatar: parsed.equippedAvatar || '👨‍🎓',
      selectedTheme: parsed.selectedTheme || 'standard',
      userName: parsed.userName || 'Studente Matematico',
      privacySetting: parsed.privacySetting || 'public',
      joinedGroups: parsed.joinedGroups || [],
    };
  } catch (err) {
    console.error('Failed to load user progress:', err);
    return DEFAULT_USER_PROGRESS;
  }
}

export function saveUserProgress(state: UserProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save user progress:', err);
  }
}

export function resetAllUserProgress(): UserProgressState {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to reset user progress:', err);
  }
  return DEFAULT_USER_PROGRESS;
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getRankTitle(totalStars: number): { title: string; badgeColor: string } {
  if (totalStars >= 19) return { title: 'Maestro Matematico Supremo', badgeColor: 'bg-amber-500 text-white' };
  if (totalStars >= 16) return { title: 'Specialista dell\'Integrazione', badgeColor: 'bg-indigo-600 text-white' };
  if (totalStars >= 12) return { title: 'Maestro dei Limiti & Derivate', badgeColor: 'bg-blue-600 text-white' };
  if (totalStars >= 8) return { title: 'Esploratore delle Funzioni', badgeColor: 'bg-teal-600 text-white' };
  if (totalStars >= 4) return { title: 'Studente di Analisi', badgeColor: 'bg-emerald-600 text-white' };
  return { title: 'Novizio dell\'Algebra', badgeColor: 'bg-slate-700 text-white' };
}
