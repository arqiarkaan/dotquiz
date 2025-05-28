import React, { useState, useEffect } from 'react';
import { QuizResult, QuizState } from '@/types/quiz';
import { storage } from '@/utils/storage';
import { toast } from '@/hooks/use-toast';
import LoginPage from '@/components/LoginPage';
import QuizPage from '@/components/QuizPage';
import ResultsPage from '@/components/ResultsPage';
import { Button } from '@/components/ui/button';
import DotquizLogo from '@/components/DotquizLogo';

type AppState = 'login' | 'quiz' | 'results' | 'resume';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('login');
  const [username, setUsername] = useState<string>('');
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [savedQuizState, setSavedQuizState] = useState<QuizState | null>(null);

  useEffect(() => {
    // Check for saved user and quiz state
    const savedUsername = storage.getUsername();
    const savedState = storage.getQuizState();

    if (savedUsername) {
      setUsername(savedUsername);

      if (
        savedState &&
        savedState.username === savedUsername &&
        !savedState.isCompleted
      ) {
        setSavedQuizState(savedState);
        setAppState('resume');
      }
    }
  }, []);

  const handleLogin = (newUsername: string) => {
    setUsername(newUsername);

    // Check if there's a saved quiz for this user
    const savedState = storage.getQuizState();
    if (
      savedState &&
      savedState.username === newUsername &&
      !savedState.isCompleted
    ) {
      setSavedQuizState(savedState);
      setAppState('resume');
    } else {
      setAppState('quiz');
    }
  };

  const handleQuizComplete = (result: QuizResult) => {
    setQuizResult(result);
    setAppState('results');
    toast({
      title: 'Quiz Complete!',
      description: `You scored ${result.score}% - ${result.correctAnswers} out of ${result.totalQuestions} correct!`,
    });
  };

  const handleNewQuiz = () => {
    storage.clearQuizState();
    setSavedQuizState(null);
    setQuizResult(null);
    setAppState('quiz');
  };

  const handleLogout = () => {
    storage.clearAll();
    setUsername('');
    setQuizResult(null);
    setSavedQuizState(null);
    setAppState('login');
  };

  const handleResumeQuiz = () => {
    setAppState('quiz');
  };

  const handleStartNewQuiz = () => {
    storage.clearQuizState();
    setSavedQuizState(null);
    setAppState('quiz');
  };

  if (appState === 'resume' && savedQuizState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-primary-100 text-center">
          <div className="flex justify-center mb-4">
            <DotquizLogo size={64} className="animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome back, {username}!
          </h2>
          <p className="text-gray-600 mb-6">
            You have an unfinished quiz. Would you like to continue where you
            left off?
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Question {savedQuizState.currentQuestionIndex + 1} of{' '}
            {savedQuizState.questions.length}
          </p>
          <div className="space-y-3">
            <Button
              onClick={handleResumeQuiz}
              className="w-full bg-primary-500 hover:bg-primary-600"
            >
              Resume Quiz
            </Button>
            <Button
              onClick={handleStartNewQuiz}
              variant="outline"
              className="w-full"
            >
              Start New Quiz
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full text-gray-500"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  switch (appState) {
    case 'login':
      return (
        <LoginPage
          onLogin={handleLogin}
          savedUsername={storage.getUsername() || undefined}
        />
      );

    case 'quiz':
      return (
        <QuizPage
          username={username}
          onLogout={handleLogout}
          onQuizComplete={handleQuizComplete}
          savedState={savedQuizState || undefined}
        />
      );

    case 'results':
      return quizResult ? (
        <ResultsPage
          username={username}
          result={quizResult}
          onNewQuiz={handleNewQuiz}
          onLogout={handleLogout}
        />
      ) : null;

    default:
      return null;
  }
};

export default Index;
