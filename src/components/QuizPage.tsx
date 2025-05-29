import React, { useState, useEffect, useRef } from 'react';
import { Question, QuizState, QuizResult } from '@/types/quiz';
import { triviaApi } from '@/services/triviaApi';
import { useTimer } from '@/hooks/useTimer';
import { storage } from '@/utils/storage';
import { toast } from '@/hooks/use-toast';
import Header from './Header';
import Timer from './Timer';
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';
import { Button } from '@/components/ui/button';
import DotquizLogo from './DotquizLogo';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface QuizPageProps {
  username: string;
  onLogout: () => void;
  onQuizComplete: (result: QuizResult) => void;
  savedState?: QuizState;
}

const QuizPage: React.FC<QuizPageProps> = ({
  username,
  onLogout,
  onQuizComplete,
  savedState,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [startTime, setStartTime] = useState(
    savedState?.startTime || Date.now()
  );
  const [isPaused, setIsPaused] = useState(!!savedState?.pausedAt);

  const QUIZ_DURATION = 300; // 5 minutes

  function handleTimeUp() {
    const result = calculateResult();
    storage.clearQuizState();
    onQuizComplete(result);
  }

  const timer = useTimer({
    duration:
      savedState?.timeLeft ??
      (savedState
        ? Math.max(
            0,
            savedState.duration -
              Math.floor(
                ((savedState.pausedAt ?? Date.now()) - savedState.startTime) /
                  1000
              )
          )
        : QUIZ_DURATION),
    onTimeUp: handleTimeUp,
    autoStart: false,
  });

  const unmounted = useRef(false);

  useEffect(() => {
    if (savedState) {
      setQuestions(savedState.questions);
      setCurrentQuestionIndex(savedState.currentQuestionIndex);
      setAnswers(savedState.answers);
      setIsLoading(false);
      setStartTime(savedState.startTime);
      setIsPaused(!!savedState.pausedAt);
      if (!savedState.pausedAt) {
        timer.start();
      }
    } else {
      // Start new quiz
      loadQuestions();
    }
    return () => {
      unmounted.current = true;
      if (questions.length > 0 && !timer.isRunning) {
        const state: QuizState = {
          username,
          questions,
          currentQuestionIndex,
          answers,
          startTime,
          duration: QUIZ_DURATION,
          isCompleted: false,
          pausedAt: Date.now(),
          timeLeft: timer.timeLeft,
        };
        storage.saveQuizState(state);
      }
    };
  }, []);

  useEffect(() => {
    if (questions.length > 0 && !isLoading && !unmounted.current) {
      const state: QuizState = {
        username,
        questions,
        currentQuestionIndex,
        answers,
        startTime,
        duration: QUIZ_DURATION,
        isCompleted: false,
        pausedAt: isPaused ? Date.now() : undefined,
        timeLeft: timer.timeLeft,
      };
      storage.saveQuizState(state);
    }
  }, [
    timer.timeLeft,
    username,
    questions,
    currentQuestionIndex,
    answers,
    startTime,
    isPaused,
    isLoading,
  ]);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      const fetchedQuestions = await triviaApi.fetchQuestions({ amount: 10 });
      setQuestions(fetchedQuestions);
      sessionStorage.setItem('dotquiz_quiz_in_progress', 'true');
      // Simpan state quiz segera setelah pertanyaan di-load
      const state: QuizState = {
        username,
        questions: fetchedQuestions,
        currentQuestionIndex: 0,
        answers: {},
        startTime: Date.now(),
        duration: QUIZ_DURATION,
        isCompleted: false,
        pausedAt: undefined,
        timeLeft: QUIZ_DURATION,
      };
      storage.saveQuizState(state);
      timer.start();
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to load questions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestionIndex]: answer };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      const result = calculateResult(newAnswers);
      storage.clearQuizState();
      onQuizComplete(result);
    }
  };

  const handleResume = () => {
    setIsPaused(false);
    timer.start();
  };

  const handlePause = () => {
    setIsPaused(true);
    timer.pause();
    const state: QuizState = {
      username,
      questions,
      currentQuestionIndex,
      answers,
      startTime,
      duration: QUIZ_DURATION,
      isCompleted: false,
      pausedAt: Date.now(),
      timeLeft: timer.timeLeft,
    };
    storage.saveQuizState(state);
  };

  const calculateResult = (finalAnswers = answers): QuizResult => {
    const answeredQuestions = Object.keys(finalAnswers).length;
    const correctAnswers = questions.reduce((count, question, index) => {
      return finalAnswers[index] === question.correct_answer
        ? count + 1
        : count;
    }, 0);

    const timeUsed = QUIZ_DURATION - timer.timeLeft;
    const score = Math.round((correctAnswers / questions.length) * 100);

    const questionResults = questions.map((question, index) => {
      const userAnswer = finalAnswers[index] || '';
      const allAnswers = question.shuffled_answers || [
        ...question.incorrect_answers,
        question.correct_answer,
      ];
      return {
        question: question.question,
        userAnswer,
        isCorrect: userAnswer === question.correct_answer,
        correctAnswer: question.correct_answer,
        category: question.category,
        difficulty: question.difficulty,
        allAnswers,
      };
    });

    return {
      totalQuestions: questions.length,
      answeredQuestions,
      correctAnswers,
      incorrectAnswers: answeredQuestions - correctAnswers,
      score,
      timeUsed,
      questionResults,
    };
  };

  const unansweredCount = questions.length - Object.keys(answers).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-100 to-white">
        <Header username={username} onLogout={onLogout} showLogout />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <DotquizLogo size={64} className="animate-pulse" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Loading Quiz...
            </h2>
            <p className="text-gray-600">Preparing your questions</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-100 to-white">
      <Header username={username} onLogout={onLogout} showLogout />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Timer
            timeLeft={timer.timeLeft}
            formatTime={timer.formatTime}
            isRunning={timer.isRunning}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="text-gray-600 hover:text-primary-600"
              >
                End Quiz
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>End Quiz?</AlertDialogTitle>
                <AlertDialogDescription>
                  {unansweredCount > 0 ? (
                    <>
                      You still have {unansweredCount} unanswered{' '}
                      {unansweredCount === 1 ? 'question' : 'questions'}. Are
                      you sure you want to end the quiz now?{' '}
                      <span className="text-red-600 font-semibold">
                        This will submit your answers and end the quiz
                        immediately.
                      </span>
                    </>
                  ) : (
                    <>
                      Are you sure you want to end the quiz now?{' '}
                      <span className="text-red-600 font-semibold">
                        This will submit your answers and end the quiz
                        immediately.
                      </span>
                    </>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    const result = calculateResult();
                    storage.clearQuizState();
                    onQuizComplete(result);
                  }}
                >
                  End Quiz
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="mb-8">
          <ProgressBar
            current={currentQuestionIndex + 1}
            total={questions.length}
          />
        </div>

        {!isPaused && questions[currentQuestionIndex] && (
          <QuestionCard
            question={questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
          />
        )}
      </div>
    </div>
  );
};

export default QuizPage;
