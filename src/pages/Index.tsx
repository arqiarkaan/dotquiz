import { useState, useEffect } from 'react';
import { QuizResult, QuizState } from '@/types/quiz';
import { storage } from '@/utils/storage';
import { toast } from '@/hooks/use-toast';
import LoginPage from '@/components/LoginPage';
import QuizPage from '@/components/QuizPage';
import ResultsPage from '@/components/ResultsPage';
import { Button } from '@/components/ui/button';
import DotquizLogo from '@/components/DotquizLogo';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

type AppState = 'login' | 'quiz' | 'results' | 'resume';

const SESSION_FLAG = 'dotquiz_quiz_in_progress';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>('login');
  const [username, setUsername] = useState<string>('');
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [savedQuizState, setSavedQuizState] = useState<QuizState | null>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    const savedUsername = storage.getUsername();
    const savedState = storage.getQuizState();
    const sessionFlag = sessionStorage.getItem(SESSION_FLAG);

    if (savedUsername) {
      setUsername(savedUsername);

      if (
        savedState &&
        savedState.username === savedUsername &&
        !savedState.isCompleted
      ) {
        setSavedQuizState(savedState);
        if (sessionFlag) {
          setAppState('quiz');
        } else {
          setAppState('resume');
        }
      }
    }
  }, []);

  const handleLogin = (newUsername: string) => {
    setUsername(newUsername);

    const savedState = storage.getQuizState();
    if (
      savedState &&
      savedState.username === newUsername &&
      !savedState.isCompleted
    ) {
      setSavedQuizState(savedState);
      if (sessionStorage.getItem(SESSION_FLAG)) {
        setAppState('quiz');
      } else {
        setAppState('resume');
      }
    } else {
      setAppState('quiz');
    }
  };

  const handleQuizComplete = (result: QuizResult) => {
    setQuizResult(result);
    setAppState('results');
    sessionStorage.removeItem(SESSION_FLAG);
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
    sessionStorage.setItem(SESSION_FLAG, 'true');
  };

  const handleLogoutRequest = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    storage.clearAll();
    setUsername('');
    setQuizResult(null);
    setSavedQuizState(null);
    setAppState('login');
    sessionStorage.removeItem(SESSION_FLAG);
    setShowLogoutDialog(false);
  };

  const handleResumeQuiz = () => {
    setAppState('quiz');
    sessionStorage.setItem(SESSION_FLAG, 'true'); // Set flag saat lanjut quiz
  };

  const handleStartNewQuiz = () => {
    storage.clearQuizState();
    setSavedQuizState(null);
    setAppState('quiz');
    sessionStorage.setItem(SESSION_FLAG, 'true'); // Set flag saat mulai quiz baru
  };

  const logoutDialog = (
    <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Logout Confirmation</AlertDialogTitle>
          <AlertDialogDescription>
            If you logout, all your quiz progress will be lost. Are you sure you
            want to logout?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmLogout}>Logout</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  if (appState === 'resume' && savedQuizState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-100 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/60 backdrop-blur-md border border-white/30 shadow-lg rounded-2xl p-8 text-center">
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
          <p className="text-sm text-gray-500 mb-2">
            Question {savedQuizState.currentQuestionIndex + 1} of{' '}
            {savedQuizState.questions.length}
          </p>
          <p className="text-sm text-blue-600 font-semibold mb-6">
            Time remaining:{' '}
            {formatTime(
              savedQuizState.timeLeft ??
                savedQuizState.duration -
                  Math.floor(
                    ((savedQuizState.pausedAt ?? Date.now()) -
                      savedQuizState.startTime) /
                      1000
                  )
            )}
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
              onClick={handleLogoutRequest}
              variant="ghost"
              className="w-full text-gray-500"
            >
              Logout
            </Button>
          </div>
        </div>
        {logoutDialog}
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
        <>
          <QuizPage
            username={username}
            onLogout={handleLogoutRequest}
            onQuizComplete={handleQuizComplete}
            savedState={savedQuizState || undefined}
          />
          {logoutDialog}
        </>
      );

    case 'results':
      return quizResult ? (
        <>
          <ResultsPage
            username={username}
            result={quizResult}
            onNewQuiz={handleNewQuiz}
            onLogout={handleLogoutRequest}
          />
          {logoutDialog}
        </>
      ) : null;

    default:
      return null;
  }
};

export default Index;
