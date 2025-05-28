import React from 'react';
import { QuizResult } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Trophy, HelpCircle } from 'lucide-react';
import Header from './Header';
import { triviaApi } from '@/services/triviaApi';
import { motion, AnimatePresence } from 'framer-motion';

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
  onLogout,
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
    if (score >= 90) return 'Outstanding! 🏆';
    if (score >= 80) return 'Excellent work! 🌟';
    if (score >= 70) return 'Great job! 👏';
    if (score >= 60) return 'Good effort! 👍';
    return 'Keep practicing! 💪';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-100 to-white">
      <Header username={username} onLogout={onLogout} showLogout />

      <motion.div
        className="max-w-4xl mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.div
            className="w-20 h-20 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
          >
            <Trophy className="text-white" size={32} />
          </motion.div>
          <motion.h1
            className="text-4xl font-bold text-gray-800 mb-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Quiz Complete!
          </motion.h1>
          <motion.p
            className="text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {getScoreMessage(result.score)}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-6 mb-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15, delayChildren: 0.5 },
            },
          }}
        >
          <motion.div
            className="bg-white/60 backdrop-blur-md border border-white/30 shadow-lg rounded-2xl p-8 flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center justify-center h-full w-full">
              <div
                className={`text-6xl font-bold mb-2 ${getScoreColor(
                  result.score
                )}`}
              >
                {result.score}%
              </div>
              <p className="text-gray-600 text-lg">Your Score</p>
            </div>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-white/60 backdrop-blur-md border border-white/30 shadow-md rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-500" size={24} />
                <span className="text-gray-700 font-medium">
                  Correct Answers
                </span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {result.correctAnswers}
              </span>
            </div>

            <div className="bg-white/60 backdrop-blur-md border border-white/30 shadow-md rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <XCircle className="text-red-500" size={24} />
                <span className="text-gray-700 font-medium">
                  Incorrect Answers
                </span>
              </div>
              <span className="text-2xl font-bold text-red-600">
                {result.incorrectAnswers}
              </span>
            </div>

            <div className="bg-white/60 backdrop-blur-md border border-white/30 shadow-md rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="text-blue-500" size={24} />
                <span className="text-gray-700 font-medium">Time Used</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {formatTime(result.timeUsed)}
              </span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-white/60 backdrop-blur-md border border-white/30 shadow-lg rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Quiz Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-600">
                {result.totalQuestions}
              </div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {result.answeredQuestions}
              </div>
              <div className="text-sm text-gray-600">Answered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {result.correctAnswers}
              </div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-600">
                {result.score}%
              </div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Button
            onClick={onNewQuiz}
            className="w-full sm:w-auto sm:px-8 px-4 py-3 text-lg font-semibold bg-primary-500 hover:bg-primary-600 transition-colors"
          >
            Take Another Quiz
          </Button>
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full sm:w-auto sm:px-8 px-4 py-3 text-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Back to Login
          </Button>
        </motion.div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.1 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Answer Details
          </h3>
          <div className="space-y-8">
            <AnimatePresence>
              {result.questionResults.map((q, idx) => (
                <motion.div
                  key={idx}
                  className={`bg-white/60 backdrop-blur-md border border-white/30 shadow rounded-2xl p-6 transition-all duration-300
                    ${
                      q.userAnswer === ''
                        ? ''
                        : q.isCorrect
                        ? 'border-green-300'
                        : 'border-red-300'
                    }
                  `}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 32 }}
                  transition={{ duration: 0.4, delay: 1.2 + idx * 0.08 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      {q.userAnswer === '' ? (
                        <HelpCircle className="text-gray-400 w-7 h-7 animate-pop" />
                      ) : q.isCorrect ? (
                        <CheckCircle className="text-green-500 w-7 h-7 animate-pop" />
                      ) : (
                        <XCircle className="text-red-500 w-7 h-7 animate-pop" />
                      )}
                      <span
                        className={`font-semibold text-lg ${
                          q.userAnswer === ''
                            ? 'text-gray-600'
                            : q.isCorrect
                            ? 'text-green-700'
                            : 'text-red-700'
                        }`}
                      >
                        {q.userAnswer === ''
                          ? 'Not Answered'
                          : q.isCorrect
                          ? 'Correct'
                          : 'Incorrect'}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          q.difficulty === 'easy'
                            ? 'bg-green-100 text-green-700'
                            : q.difficulty === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                      <span className="text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded">
                        {triviaApi.decodeHtml(q.category)}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4 text-gray-800 font-medium text-base leading-relaxed">
                    {idx + 1}. {q.question}
                  </div>
                  {q.userAnswer === '' && (
                    <div className="mb-2 text-sm text-gray-500 italic">
                      You did not answer this question.
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                    {q.allAnswers.map((ans, i) => {
                      const isUser = ans === q.userAnswer;
                      const isCorrect = ans === q.correctAnswer;
                      return (
                        <div
                          key={i}
                          className={`flex items-center p-3 rounded-lg border transition-all duration-200 text-sm font-medium
                            ${
                              isCorrect
                                ? 'border-green-400 bg-green-50 text-green-800'
                                : isUser && !isCorrect
                                ? 'border-red-400 bg-red-50 text-red-800'
                                : 'border-gray-200 bg-gray-50 text-gray-700'
                            }
                            ${
                              isUser
                                ? isCorrect
                                  ? 'ring-2 ring-green-400'
                                  : 'ring-2 ring-red-400'
                                : ''
                            }`}
                        >
                          <span
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full mr-3 font-semibold
                            ${
                              isCorrect
                                ? 'bg-green-500 text-white'
                                : isUser && !isCorrect
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200 text-gray-500'
                            }
                          `}
                          >
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="flex-1">{ans}</span>
                          {isCorrect && (
                            <CheckCircle className="ml-2 text-green-500 w-5 h-5" />
                          )}
                          {isUser && !isCorrect && (
                            <XCircle className="ml-2 text-red-500 w-5 h-5" />
                          )}
                          {isUser && isCorrect && (
                            <span className="ml-2 text-green-600 font-bold">
                              (Your Answer)
                            </span>
                          )}
                          {isUser && !isCorrect && (
                            <span className="ml-2 text-red-600 font-bold">
                              (Your Answer)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResultsPage;
