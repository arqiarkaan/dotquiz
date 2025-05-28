import React from 'react';
import DotquizLogo from './DotquizLogo';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-700 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-2 text-center">
        <span className="text-sm text-gray-600">
          Question {current} of {total}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
