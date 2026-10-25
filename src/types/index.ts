export type FormalityLevel = 'polite' | 'casual' | 'formal';

export interface Category {
  id: string;
  name: string;
  kannadaName: string;
  description: string;
  iconName: string;
  accentColor: string; // Tailwind color token or hex
  badgeBg: string;
  badgeText: string;
}

export interface PhraseVariant {
  id: string;
  formality: FormalityLevel;
  kannada: string;
  transliteration: string;
  english: string;
  usageContext: string;
  isRecommendedDefault?: boolean;
}

export interface Phrase {
  id: string;
  categoryId: string;
  kannada: string;
  transliteration: string;
  english: string;
  contextNote: string;
  pronunciationGuide: string;
  formality: FormalityLevel;
  situation: string;
  tags: string[];
  literalMeaning?: string;
  needsDialectReview?: boolean;
  needsSpeakerReview?: boolean;
  variants?: PhraseVariant[];
}

export interface QuizQuestion {
  id: string;
  phraseId: string;
  prompt: string;
  promptSubtext?: string;
  type: 'en-to-kn' | 'kn-to-en' | 'situation';
  options: {
    id: string;
    text: string;
    subtext?: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  categoryName: string;
}

export interface QuizResult {
  score: number;
  total: number;
  date: string;
  category?: string;
  answers: {
    questionId: string;
    userAnswerId: string;
    correctAnswerId: string;
    isCorrect: boolean;
  }[];
}

export interface UserProgress {
  savedPhraseIds: string[];
  recentPhraseIds: string[];
  totalQuizzesTaken: number;
  totalQuestionsAnswered: number;
  correctAnswersCount: number;
  streakDays: number;
  lastActiveDate: string;
  categoryStats: Record<string, { attempted: number; correct: number }>;
}

export type DailyTaskId = 'daily-phrase' | 'daily-convo' | 'daily-quiz';

export interface DailyTask {
  id: DailyTaskId;
  title: string;
  kannadaTitle: string;
  description: string;
  actionLabel: string;
  actionUrl: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface DailyMissionState {
  date: string; // YYYY-MM-DD
  tasks: DailyTask[];
  streakDays: number;
  lastCompletedDate?: string;
}

export type SRSReviewRating = 'again' | 'good' | 'easy';

export interface SRSItem {
  phraseId: string;
  box: number; // 1 to 5 (Leitner boxes)
  nextReviewDate: string; // YYYY-MM-DD
  lastReviewedDate?: string;
  intervalDays: number;
  repetitions: number;
}


