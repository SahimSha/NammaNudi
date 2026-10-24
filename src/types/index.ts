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

