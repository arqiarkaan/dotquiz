import React, { useState } from 'react';
import { Question } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

const FEEDBACK_DELAY = 2000; // ms

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  questionNumber,
  totalQuestions,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

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

  const isCorrect = selectedAnswer === question.correct_answer;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-primary-100 animate-slide-in">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-3">
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
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
          {question.category}
        </span>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-8 leading-relaxed">
        {question.question}
      </h3>

      <div className="space-y-3 mb-6">
        {allAnswers.map((answer, index) => (
          <Button
            key={index}
            onClick={() => handleSelect(answer)}
            variant="outline"
            className={`w-full text-left p-6 h-auto justify-start transition-all duration-200 text-wrap ${
              selectedAnswer
                ? answer === question.correct_answer
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : answer === selectedAnswer
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : ''
                : ''
            } ${
              selectedAnswer && answer === selectedAnswer
                ? 'ring-2 ring-primary-400'
                : ''
            }`}
            disabled={!!selectedAnswer}
          >
            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full mr-4 font-semibold">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="flex-1">{answer}</span>
          </Button>
        ))}
      </div>

      {showFeedback && selectedAnswer && (
        <div
          className={`flex items-center justify-center gap-3 p-5 rounded-xl shadow-md text-lg font-semibold animate-fade-in mb-2
            ${
              isCorrect
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
        >
          {isCorrect ? (
            <CheckCircle className="w-7 h-7 text-green-500 animate-pop" />
          ) : (
            <XCircle className="w-7 h-7 text-red-500 animate-pop" />
          )}
          <span>
            {isCorrect ? (
              'Correct!'
            ) : (
              <>
                Incorrect. The correct answer is:{' '}
                <b>{question.correct_answer}</b>
              </>
            )}
          </span>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
