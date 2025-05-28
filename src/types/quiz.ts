export interface Question {
  category: string;
  type: 'multiple' | 'boolean';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  shuffled_answers?: string[];
}

export interface QuizState {
  username: string;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<number, string>;
  startTime: number;
  duration: number; // in seconds
  isCompleted: boolean;
  pausedAt?: number; // timestamp saat quiz di-pause
  timeLeft?: number; // waktu tersisa saat quiz di-pause
}

export interface QuestionResult {
  question: string;
  userAnswer: string;
  isCorrect: boolean;
  correctAnswer: string;
  category: string;
  difficulty: string;
  allAnswers: string[];
}

export interface QuizResult {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  timeUsed: number;
  questionResults: QuestionResult[];
}
