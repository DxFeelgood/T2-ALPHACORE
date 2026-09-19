export interface Question {
  id: string;
  difficulty: 'base' | 'intermedio' | 'avanzato';
  question: string; // LaTeX enabled text
  options: string[];
  correctAnswerIndex: number;
  explanation: string; // LaTeX enabled detailed step-by-step solution
}

export interface ExampleStep {
  title: string;
  latex?: string;
  description: string;
}

export interface ModuleTheory {
  title: string;
  overview: string;
  keyConcepts: { title: string; latex?: string; description: string }[];
  formulas: { title: string; latex: string; notes?: string }[];
  workedExample: {
    problem: string;
    latexProblem?: string;
    steps: ExampleStep[];
  };
}

export interface ModuleData {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  theory: ModuleTheory;
  quiz: {
    base: Question[];
    intermedio: Question[];
    avanzato: Question[];
  };
}

export interface ModuleProgress {
  stars: number; // 0 to 3
  baseCompleted: boolean;
  intermedioCompleted: boolean;
  avanzatoCompleted: boolean;
  bestScorePercentage: number;
  unlocked: boolean;
  lastAttemptAt?: string;
}

export interface QuizAttempt {
  id: string;
  timestamp: string;
  moduleId: number;
  moduleTitle: string;
  difficulty: 'base' | 'intermedio' | 'avanzato';
  score: number; // out of total questions
  totalQuestions: number;
  starsEarned: number;
}

export interface DailyChallengeState {
  lastCompletedDate: string | null; // YYYY-MM-DD
  streakCount: number;
  bestStreak: number;
  todayCompleted: boolean;
  todayScore: number | null;
  history: {
    date: string;
    score: number;
    total: number;
  }[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'accuracy' | 'streak' | 'tools' | 'social';
  icon: string;
  xpReward: number;
  unlockedAt?: string;
}

export type GroupPrivacyPermission = 'public' | 'metrics_only' | 'anonymous';

export interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  stars: number;
  streak: number;
  privacy: GroupPrivacyPermission;
  lastActive: string;
  moduleMastery: Record<number, number>; // 0 to 100% per module ID
}

export interface SharedNote {
  id: string;
  authorName: string;
  authorAvatar: string;
  timestamp: string;
  title: string;
  content: string; // text or formula
  likes: number;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  code: string;
  createdAt: string;
  ownerId: string;
  members: GroupMember[];
  notes: SharedNote[];
}

export interface MathBattleState {
  id: string;
  opponentName: string;
  opponentAvatar: string;
  userScore: number;
  opponentScore: number;
  isCompleted: boolean;
  winner: 'user' | 'opponent' | 'draw' | null;
}

export interface UserProgressState {
  modules: Record<number, ModuleProgress>;
  attempts: QuizAttempt[];
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  dailyStreak: DailyChallengeState;
  calculatorHistory: {
    id: string;
    expression: string;
    result: string;
    timestamp: string;
  }[];
  // Gamification & Social additions
  xp: number;
  level: number;
  unlockedBadges: string[];
  equippedAvatar: string;
  selectedTheme: string;
  userName: string;
  privacySetting: GroupPrivacyPermission;
  joinedGroups: StudyGroup[];
}

export type ActiveTab = 'roadmap' | 'plotter' | 'calculator' | 'daily' | 'dashboard' | 'gamification' | 'groups';

