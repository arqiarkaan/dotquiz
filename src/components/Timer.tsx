
import React from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  timeLeft: number;
  formatTime: string;
  isRunning: boolean;
}

const Timer: React.FC<TimerProps> = ({ timeLeft, formatTime, isRunning }) => {
  const getTimerColor = () => {
    if (timeLeft <= 60) return 'text-red-600 bg-red-50 border-red-200';
    if (timeLeft <= 180) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-primary-600 bg-primary-50 border-primary-200';
  };

  return (
    <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-300 ${getTimerColor()}`}>
      <Clock size={20} className={isRunning ? 'animate-pulse' : ''} />
      <span className="font-mono text-lg font-semibold">{formatTime}</span>
    </div>
  );
};

export default Timer;
