
import React, { useState, useEffect } from 'react';
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
  savedState 
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [startTime] = useState(savedState?.startTime || Date.now());

  const QUIZ_DURATION = 600; // 10 minutes

  const timer = useTimer({
    duration: savedState ? Math.max(0, savedState.duration - Math.floor((Date.now() - savedState.startTime) / 1000)) : QUIZ_DURATION,
    onTimeUp: handleTimeUp,
    autoStart: !savedState
  });

  useEffect(() => {
    if (savedState) {
      // Resume saved quiz
      setQuestions(savedState.questions);
      setCurrentQuestionIndex(savedState.currentQuestionIndex);
      setAnswers(savedState.answers);
      setIsLoading(false);
      timer.start();
    } else {
      // Start new quiz
      loadQuestions();
    }
  }, []);

  useEffect(() => {
    // Save quiz state to localStorage
    if (questions.length > 0 && !isLoading) {
      const state: QuizState = {
        username,
        questions,
        currentQuestionIndex,
        answers,
        startTime,
        duration: QUIZ_DURATION,
        isCompleted: false
      };
      storage.saveQuizState(state);
    }
  }, [username, questions, currentQuestionIndex, answers, startTime]);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      const fetchedQuestions = await triviaApi.fetchQuestions({ amount: 10 });
      setQuestions(fetchedQuestions);
      timer.start();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load questions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  function handleTimeUp() {
    const result = calculateResult();
    storage.clearQuizState();
    onQuizComplete(result);
  }

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestionIndex]: answer };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      // Move to next question
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 500);
    } else {
      // Quiz completed
      setTimeout(() => {
        const result = calculateResult(newAnswers);
        storage.clearQuizState();
        onQuizComplete(result);
      }, 500);
    }
  };

  const calculateResult = (finalAnswers = answers): QuizResult => {
    const answeredQuestions = Object.keys(finalAnswers).length;
    const correctAnswers = questions.reduce((count, question, index) => {
      return finalAnswers[index] === question.correct_answer ? count + 1 : count;
    }, 0);

    const timeUsed = Math.floor((Date.now() - startTime) / 1000);
    const score = Math.round((correctAnswers / questions.length) * 100);

    return {
      totalQuestions: questions.length,
      answeredQuestions,
      correctAnswers,
      incorrectAnswers: answeredQuestions - correctAnswers,
      score,
      timeUsed
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
        <Header username={username} onLogout={onLogout} showLogout />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-white font-bold text-2xl">•</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Loading Quiz...</h2>
            <p className="text-gray-600">Preparing your questions</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <Header username={username} onLogout={onLogout} showLogout />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Timer 
            timeLeft={timer.timeLeft}
            formatTime={timer.formatTime}
            isRunning={timer.isRunning}
          />
          <Button
            onClick={() => {
              const result = calculateResult();
              storage.clearQuizState();
              onQuizComplete(result);
            }}
            variant="outline"
            className="text-gray-600 hover:text-primary-600"
          >
            End Quiz
          </Button>
        </div>

        <div className="mb-8">
          <ProgressBar 
            current={currentQuestionIndex + 1} 
            total={questions.length} 
          />
        </div>

        {questions[currentQuestionIndex] && (
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
