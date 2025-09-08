import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const QuizTimer = ({ 
  timeLimit = 30,
  isActive = false,
  onTimeUp = () => {},
  isPaused = false
}) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    setTimeLeft(timeLimit);
  }, [timeLimit]);

  useEffect(() => {
    if (!isActive || isPaused || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, isPaused, timeLeft, onTimeUp]);

  const getTimerColor = () => {
    const percentage = (timeLeft / timeLimit) * 100;
    if (percentage > 50) return 'text-success';
    if (percentage > 20) return 'text-warning';
    return 'text-error';
  };

  const getProgressColor = () => {
    const percentage = (timeLeft / timeLimit) * 100;
    if (percentage > 50) return 'bg-success';
    if (percentage > 20) return 'bg-warning';
    return 'bg-error';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const progressPercentage = (timeLeft / timeLimit) * 100;

  return (
    <div className="bg-card rounded-lg p-4 border border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon 
            name={isPaused ? "Pause" : "Clock"} 
            size={18} 
            className={getTimerColor()}
          />
          <span className="text-sm font-medium text-muted-foreground">
            {isPaused ? 'Paused' : 'Time Remaining'}
          </span>
        </div>
        
        <div className={`text-2xl font-bold ${getTimerColor()}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-linear ${getProgressColor()}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Timer Status */}
      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
        <span>
          {timeLeft === 0 ? 'Time\'s up!' : isPaused ? 'Timer paused' : 'Timer active'}
        </span>
        <span>
          {timeLimit}s total
        </span>
      </div>
    </div>
  );
};

export default QuizTimer;