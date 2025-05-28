
import React from 'react';
import { Question } from '@/types/quiz';
import { Button } from '@/components/ui/button';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  onAnswer, 
  questionNumber, 
  totalQuestions 
}) => {
  const allAnswers = [...question.incorrect_answers, question.correct_answer]
    .sort(() => Math.random() - 0.5);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-primary-100 animate-slide-in">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-500">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
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

      <div className="space-y-3">
        {allAnswers.map((answer, index) => (
          <Button
            key={index}
            onClick={() => onAnswer(answer)}
            variant="outline"
            className="w-full text-left p-6 h-auto justify-start hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-all duration-200 text-wrap"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full mr-4 font-semibold">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="flex-1">{answer}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
