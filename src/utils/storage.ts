import { QuizState } from '@/types/quiz';

const STORAGE_KEYS = {
  USERNAME: 'dotquiz_username',
  QUIZ_STATE: 'dotquiz_state',
} as const;

// Base64 helpers
function encodeBase64(str: string): string {
  return typeof window !== 'undefined'
    ? window.btoa(unescape(encodeURIComponent(str)))
    : Buffer.from(str, 'utf-8').toString('base64');
}
function decodeBase64(str: string): string {
  return typeof window !== 'undefined'
    ? decodeURIComponent(escape(window.atob(str)))
    : Buffer.from(str, 'base64').toString('utf-8');
}

export const storage = {
  saveUsername: (username: string): void => {
    localStorage.setItem(STORAGE_KEYS.USERNAME, username);
  },

  getUsername: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.USERNAME);
  },

  saveQuizState: (state: QuizState): void => {
    // Encrypt questions array
    const { questions, ...rest } = state;
    const encryptedQuestions = encodeBase64(JSON.stringify(questions));
    const stateToSave = { ...rest, questions: encryptedQuestions };
    localStorage.setItem(STORAGE_KEYS.QUIZ_STATE, JSON.stringify(stateToSave));
  },

  getQuizState: (): QuizState | null => {
    const saved = localStorage.getItem(STORAGE_KEYS.QUIZ_STATE);
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (typeof parsed.questions === 'string') {
        // Decrypt questions
        parsed.questions = JSON.parse(decodeBase64(parsed.questions));
      }
      // Pastikan pausedAt dan timeLeft tetap ada jika disimpan
      return parsed;
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
  },
};
