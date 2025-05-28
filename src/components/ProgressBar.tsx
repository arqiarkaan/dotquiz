
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
      <div className="mt-2 text-center">
        <span className="text-sm text-gray-600">
          Question {current} of {total}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
