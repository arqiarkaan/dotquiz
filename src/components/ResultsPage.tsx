
import React from 'react';
import { QuizResult } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Trophy } from 'lucide-react';
import Header from './Header';

interface ResultsPageProps {
  username: string;
  result: QuizResult;
  onNewQuiz: () => void;
  onLogout: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({
  username,
  result,
  onNewQuiz,
  onLogout
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Outstanding! 🏆";
    if (score >= 80) return "Excellent work! 🌟";
    if (score >= 70) return "Great job! 👏";
    if (score >= 60) return "Good effort! 👍";
    return "Keep practicing! 💪";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <Header username={username} onLogout={onLogout} showLogout />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Quiz Complete!</h1>
          <p className="text-gray-600 text-lg">{getScoreMessage(result.score)}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-primary-100">
            <div className="text-center">
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.score)}`}>
                {result.score}%
              </div>
              <p className="text-gray-600 text-lg">Your Score</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-md p-4 border border-primary-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-500" size={24} />
                <span className="text-gray-700 font-medium">Correct Answers</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{result.correctAnswers}</span>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4 border border-primary-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <XCircle className="text-red-500" size={24} />
                <span className="text-gray-700 font-medium">Incorrect Answers</span>
              </div>
              <span className="text-2xl font-bold text-red-600">{result.incorrectAnswers}</span>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4 border border-primary-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="text-blue-500" size={24} />
                <span className="text-gray-700 font-medium">Time Used</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">{formatTime(result.timeUsed)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-primary-100 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quiz Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-600">{result.totalQuestions}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{result.answeredQuestions}</div>
              <div className="text-sm text-gray-600">Answered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{result.correctAnswers}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-600">{result.score}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={onNewQuiz}
            className="px-8 py-3 text-lg font-semibold bg-primary-500 hover:bg-primary-600 transition-colors"
          >
            Take Another Quiz
          </Button>
          <Button
            onClick={onLogout}
            variant="outline"
            className="px-8 py-3 text-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
