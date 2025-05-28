import { useState, useEffect, useRef } from 'react';

interface UseTimerProps {
  duration: number; // in seconds
  onTimeUp?: () => void;
  autoStart?: boolean;
}

export const useTimer = ({
  duration,
  onTimeUp,
  autoStart = false,
}: UseTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const initialDurationRef = useRef<number>(duration);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current =
        Date.now() - (initialDurationRef.current - timeLeft) * 1000;

      intervalRef.current = setInterval(() => {
        const elapsedSeconds = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );
        const remainingTime = Math.max(
          0,
          initialDurationRef.current - elapsedSeconds
        );

        setTimeLeft(remainingTime);

        if (remainingTime <= 0) {
          setIsRunning(false);
          onTimeUp?.();
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, 100); // Update more frequently for smoother display
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onTimeUp]);

  const start = () => {
    startTimeRef.current =
      Date.now() - (initialDurationRef.current - timeLeft) * 1000;
    setIsRunning(true);
  };

  const pause = () => setIsRunning(false);

  const reset = () => {
    initialDurationRef.current = duration;
    setTimeLeft(duration);
    setIsRunning(false);
    startTimeRef.current = Date.now();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return {
    timeLeft,
    isRunning,
    start,
    pause,
    reset,
    formatTime: formatTime(timeLeft),
    setTimeLeft,
  };
};
