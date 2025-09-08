import React from 'react';
import Icon from '../../../components/AppIcon';

const QuestionDisplay = ({ 
  currentQuestion = null,
  questionNumber = 1,
  totalQuestions = 10,
  timeRemaining = 30,
  totalTime = 30,
  answerDistribution = [],
  showResults = false 
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    const percentage = (timeRemaining / totalTime) * 100;
    if (percentage > 50) return 'text-success';
    if (percentage > 20) return 'text-warning';
    return 'text-error';
  };

  const getProgressPercentage = () => {
    return ((questionNumber - 1) / totalQuestions) * 100;
  };

  if (!currentQuestion) {
    return (
      <div className="bg-card border border-border rounded-lg h-full flex items-center justify-center">
        <div className="text-center">
          <Icon name="FileQuestion" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">No question loaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header with Progress */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-primary">
                Question {questionNumber} of {totalQuestions}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className={getTimerColor()} />
              <span className={`text-lg font-mono font-bold ${getTimerColor()}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
          
          {/* Timer Progress Ring */}
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - timeRemaining / totalTime)}`}
                className={getTimerColor()}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xs font-bold ${getTimerColor()}`}>
                {timeRemaining}
              </span>
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>
      {/* Question Content */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-foreground mb-6 leading-relaxed">
            {currentQuestion?.question}
          </h2>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion?.options?.map((option, index) => {
              const optionLabel = String.fromCharCode(65 + index); // A, B, C, D
              const distribution = answerDistribution?.find(d => d?.option === optionLabel);
              const percentage = distribution ? distribution?.percentage : 0;
              const isCorrect = option?.isCorrect;

              return (
                <div
                  key={index}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                    showResults && isCorrect
                      ? 'border-success bg-success/10' :'border-border bg-muted/30'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      showResults && isCorrect
                        ? 'bg-success text-success-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}>
                      {optionLabel}
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground font-medium">{option?.text}</p>
                      
                      {/* Answer Distribution Bar */}
                      {showResults && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">
                              {distribution?.count || 0} responses
                            </span>
                            <span className="text-xs font-medium text-foreground">
                              {percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                isCorrect ? 'bg-success' : 'bg-primary'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {showResults && isCorrect && (
                    <div className="absolute top-2 right-2">
                      <Icon name="CheckCircle" size={20} className="text-success" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Response Indicator */}
        {!showResults && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse-gentle" />
                <span className="text-sm text-muted-foreground">Live responses</span>
              </div>
              <div className="flex items-center space-x-4">
                {answerDistribution?.map((dist, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    <span className="text-xs font-medium text-foreground">{dist?.option}:</span>
                    <span className="text-xs text-primary font-bold">{dist?.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDisplay;