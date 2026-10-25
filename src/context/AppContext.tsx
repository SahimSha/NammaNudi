/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Phrase, UserProgress, QuizResult } from '../types';
import { PHRASES } from '../data/phrases';

interface ToastInfo {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface AppContextType {
  // Phrases data
  phrases: Phrase[];
  getPhraseById: (id: string) => Phrase | undefined;

  // Favourites & Recents
  savedPhraseIds: string[];
  recentPhraseIds: string[];
  toggleSavePhrase: (phraseId: string) => void;
  isPhraseSaved: (phraseId: string) => boolean;
  addRecentPhrase: (phraseId: string) => void;
  clearRecents: () => void;

  // Progress
  progress: UserProgress;
  recordQuizResult: (result: QuizResult) => void;
  resetAllProgress: () => void;

  // Modals & Show-to-Speak
  showToSpeakPhrase: Phrase | null;
  setShowToSpeakPhrase: (phrase: Phrase | null) => void;
  activeDetailPhrase: Phrase | null;
  setActiveDetailPhrase: (phrase: Phrase | null) => void;
  practicePhrase: Phrase | null;
  setPracticePhrase: (phrase: Phrase | null) => void;
  openNextPhrase: () => void;
  openPrevPhrase: () => void;

  // Toast notifications
  toast: ToastInfo | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const STORAGE_KEY_FAVOURITES = 'nammanudi_favourites_v1';
const STORAGE_KEY_RECENTS = 'nammanudi_recents_v1';
const STORAGE_KEY_PROGRESS = 'nammanudi_progress_v1';

const defaultProgress: UserProgress = {
  savedPhraseIds: [],
  recentPhraseIds: [],
  totalQuizzesTaken: 0,
  totalQuestionsAnswered: 0,
  correctAnswersCount: 0,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  categoryStats: {}
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedPhraseIds, setSavedPhraseIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_FAVOURITES);
      return stored ? JSON.parse(stored) : ['td-01', 'pt-05', 'fd-01', 'bs-01'];
    } catch {
      return ['td-01', 'pt-05', 'fd-01', 'bs-01'];
    }
  });

  const [recentPhraseIds, setRecentPhraseIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_RECENTS);
      return stored ? JSON.parse(stored) : ['td-01', 'pt-01', 'fd-01'];
    } catch {
      return ['td-01', 'pt-01', 'fd-01'];
    }
  });

  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load progress from localStorage', e);
    }
    return defaultProgress;
  });

  const [showToSpeakPhrase, setShowToSpeakPhrase] = useState<Phrase | null>(null);
  const [activeDetailPhrase, setActiveDetailPhrase] = useState<Phrase | null>(null);
  const [practicePhrase, setPracticePhrase] = useState<Phrase | null>(null);
  const [toast, setToast] = useState<ToastInfo | null>(null);

  // Sync favourites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FAVOURITES, JSON.stringify(savedPhraseIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedPhraseIds]);

  // Sync recents to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECENTS, JSON.stringify(recentPhraseIds));
    } catch (e) {
      console.error(e);
    }
  }, [recentPhraseIds]);

  // Sync progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_PROGRESS,
        JSON.stringify({
          ...progress,
          savedPhraseIds,
          recentPhraseIds
        })
      );
    } catch (e) {
      console.error(e);
    }
  }, [progress, savedPhraseIds, recentPhraseIds]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3200);
  };

  const toggleSavePhrase = (phraseId: string) => {
    setSavedPhraseIds((prev) => {
      const exists = prev.includes(phraseId);
      if (exists) {
        showToast('Removed from saved phrases', 'info');
        return prev.filter((id) => id !== phraseId);
      } else {
        showToast('Saved to your phrases ⭐', 'success');
        return [phraseId, ...prev];
      }
    });
  };

  const isPhraseSaved = (phraseId: string) => {
    return savedPhraseIds.includes(phraseId);
  };

  const addRecentPhrase = (phraseId: string) => {
    setRecentPhraseIds((prev) => {
      const filtered = prev.filter((id) => id !== phraseId);
      return [phraseId, ...filtered].slice(0, 20); // Keep last 20
    });
  };

  const clearRecents = () => {
    setRecentPhraseIds([]);
    showToast('Recent history cleared', 'info');
  };

  const getPhraseById = (id: string) => {
    return PHRASES.find((p) => p.id === id);
  };

  const recordQuizResult = (result: QuizResult) => {
    const today = new Date().toISOString().split('T')[0];

    setProgress((prev) => {
      const isNewDay = prev.lastActiveDate !== today;
      const newStreak = isNewDay ? prev.streakDays + 1 : prev.streakDays;

      const updatedCategoryStats = { ...prev.categoryStats };
      if (result.category) {
        const cat = updatedCategoryStats[result.category] || { attempted: 0, correct: 0 };
        updatedCategoryStats[result.category] = {
          attempted: cat.attempted + result.total,
          correct: cat.correct + result.score
        };
      }

      return {
        ...prev,
        totalQuizzesTaken: prev.totalQuizzesTaken + 1,
        totalQuestionsAnswered: prev.totalQuestionsAnswered + result.total,
        correctAnswersCount: prev.correctAnswersCount + result.score,
        streakDays: newStreak,
        lastActiveDate: today,
        categoryStats: updatedCategoryStats
      };
    });
  };

  const resetAllProgress = () => {
    setSavedPhraseIds([]);
    setRecentPhraseIds([]);
    setProgress(defaultProgress);
    try {
      localStorage.setItem(STORAGE_KEY_FAVOURITES, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEY_RECENTS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(defaultProgress));
    } catch {}
    showToast('All progress reset successfully', 'info');
  };

  // Navigate to Next / Prev phrase when detail modal is open
  const openNextPhrase = () => {
    if (!activeDetailPhrase) return;
    const currentIndex = PHRASES.findIndex((p) => p.id === activeDetailPhrase.id);
    if (currentIndex >= 0 && currentIndex < PHRASES.length - 1) {
      const nextPhrase = PHRASES[currentIndex + 1];
      setActiveDetailPhrase(nextPhrase);
      addRecentPhrase(nextPhrase.id);
    }
  };

  const openPrevPhrase = () => {
    if (!activeDetailPhrase) return;
    const currentIndex = PHRASES.findIndex((p) => p.id === activeDetailPhrase.id);
    if (currentIndex > 0) {
      const prevPhrase = PHRASES[currentIndex - 1];
      setActiveDetailPhrase(prevPhrase);
      addRecentPhrase(prevPhrase.id);
    }
  };

  return (
    <AppContext.Provider
      value={{
        phrases: PHRASES,
        getPhraseById,
        savedPhraseIds,
        recentPhraseIds,
        toggleSavePhrase,
        isPhraseSaved,
        addRecentPhrase,
        clearRecents,
        progress,
        recordQuizResult,
        resetAllProgress,
        showToSpeakPhrase,
        setShowToSpeakPhrase,
        activeDetailPhrase,
        setActiveDetailPhrase,
        practicePhrase,
        setPracticePhrase,
        openNextPhrase,
        openPrevPhrase,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
