import React, { useState, useRef, useEffect } from 'react';
import { Question } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { triviaApi } from '@/services/triviaApi';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

const FEEDBACK_DELAY = 2500; // ms

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  questionNumber,
  totalQuestions,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const feedbackRef = useRef<HTMLDivElement | null>(null);

  const allAnswers = question.shuffled_answers || [
    ...question.incorrect_answers,
    question.correct_answer,
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelect = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      onAnswer(answer);
      setSelectedAnswer(null);
    }, FEEDBACK_DELAY);
  };

  useEffect(() => {
    if (showFeedback && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [showFeedback]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.question}
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 32 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="bg-white/60 backdrop-blur-md border border-white/30 shadow-lg rounded-2xl p-8 animate-slide-in"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-6">
          <div className="flex flex-row flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-500">
              Question {questionNumber} of {totalQuestions}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                question.difficulty
              )}`}
            >
              {question.difficulty}
            </span>
          </div>
          <span className="text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded mt-1 sm:mt-0">
            {triviaApi.decodeHtml(question.category)}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-8 leading-relaxed">
          {question.question}
        </h3>

        <div className="space-y-3 mb-6">
          {allAnswers.map((answer, index) => {
            const isSelected = selectedAnswer === answer;
            const isAnswered = !!selectedAnswer;
            const isCorrectAnswer = answer === question.correct_answer;
            let answerClass = '';
            if (isAnswered) {
              if (isCorrectAnswer) {
                answerClass = 'border-green-500 bg-green-50 text-green-700';
              } else if (isSelected) {
                answerClass = 'border-red-500 bg-red-50 text-red-700';
              } else {
                answerClass = 'border-gray-200 bg-white text-gray-700';
              }
            }
            return (
              <Button
                key={index}
                onClick={() => handleSelect(answer)}
                variant="outline"
                className={`w-full text-left p-6 h-auto justify-start transition-all duration-200 text-wrap flex items-center gap-2 ${answerClass} ${
                  isAnswered && isSelected
                    ? isCorrectAnswer
                      ? 'ring-2 ring-green-400'
                      : 'ring-2 ring-red-400'
                    : ''
                }`}
                disabled={isAnswered}
                style={{
                  opacity: 1,
                  filter: 'none',
                  cursor: isAnswered ? 'not-allowed' : 'pointer',
                }}
              >
                <span
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-4 font-semibold
                  ${
                    isAnswered
                      ? isCorrectAnswer
                        ? 'bg-green-500 text-white'
                        : isSelected
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                      : 'bg-primary-100 text-primary-600'
                  }
                `}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{answer}</span>
                {/* Icon benar/salah di kanan */}
                {isAnswered &&
                  (isCorrectAnswer ? (
                    <CheckCircle className="w-6 h-6 text-green-500 ml-2" />
                  ) : isSelected ? (
                    <XCircle className="w-6 h-6 text-red-500 ml-2" />
                  ) : null)}
              </Button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuestionCard;
