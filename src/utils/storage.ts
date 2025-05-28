
import { QuizState } from '@/types/quiz';

const STORAGE_KEYS = {
  USERNAME: 'dotquiz_username',
  QUIZ_STATE: 'dotquiz_state',
} as const;

export const storage = {
  saveUsername: (username: string): void => {
    localStorage.setItem(STORAGE_KEYS.USERNAME, username);
  },

  getUsername: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.USERNAME);
  },

  saveQuizState: (state: QuizState): void => {
    localStorage.setItem(STORAGE_KEYS.QUIZ_STATE, JSON.stringify(state));
  },

  getQuizState: (): QuizState | null => {
    const saved = localStorage.getItem(STORAGE_KEYS.QUIZ_STATE);
    if (!saved) return null;
    
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  },

  clearQuizState: (): void => {
    localStorage.removeItem(STORAGE_KEYS.QUIZ_STATE);
  },

  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USERNAME);
    localStorage.removeItem(STORAGE_KEYS.QUIZ_STATE);
  }
};
