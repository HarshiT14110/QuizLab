import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SubmissionStatus = ({ 
  status = 'waiting', // 'waiting', 'submitted', 'correct', 'incorrect', 'timeout'
  selectedAnswer = null,
  correctAnswer = null,
  options = [],
  onNextQuestion = () => {},
  showNextButton = false,
  participantsSubmitted = 0,
  totalParticipants = 1
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'submitted':
        return {
          icon: 'Check',
          title: 'Answer Submitted!',
          message: 'Waiting for other participants...',
          color: 'text-primary',
          bgColor: 'bg-primary/10'
        };
      case 'correct':
        return {
          icon: 'CheckCircle',
          title: 'Correct!',
          message: 'Great job! You got it right.',
          color: 'text-success',
          bgColor: 'bg-success/10'
        };
      case 'incorrect':
        return {
          icon: 'XCircle',
          title: 'Incorrect',
          message: 'Don\'t worry, keep trying!',
          color: 'text-error',
          bgColor: 'bg-error/10'
        };
      case 'timeout':
        return {
          icon: 'Clock',
          title: 'Time\'s Up!',
          message: 'You didn\'t submit an answer in time.',
          color: 'text-warning',
          bgColor: 'bg-warning/10'
        };
      default:
        return {
          icon: 'Clock',
          title: 'Waiting...',
          message: 'Select your answer above',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/50'
        };
    }
  };

  const config = getStatusConfig();
  const submissionPercentage = totalParticipants > 0 ? (participantsSubmitted / totalParticipants) * 100 : 0;

  return (
    <div className={`rounded-xl p-6 border ${config?.bgColor} border-border`}>
      {/* Status Header */}
      <div className="flex items-center justify-center mb-4">
        <div className={`w-16 h-16 rounded-full ${config?.bgColor} flex items-center justify-center mb-2`}>
          <Icon name={config?.icon} size={32} className={config?.color} />
        </div>
      </div>
      {/* Status Content */}
      <div className="text-center mb-6">
        <h3 className={`text-xl font-semibold mb-2 ${config?.color}`}>
          {config?.title}
        </h3>
        <p className="text-muted-foreground">
          {config?.message}
        </p>
      </div>
      {/* Selected Answer Display */}
      {selectedAnswer !== null && options?.[selectedAnswer] && (
        <div className="mb-6 p-4 bg-card rounded-lg border border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {String.fromCharCode(65 + selectedAnswer)}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Your answer:</p>
              <p className="font-medium text-foreground">
                {options?.[selectedAnswer]?.text || options?.[selectedAnswer]}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Correct Answer Display (for incorrect/timeout status) */}
      {(status === 'incorrect' || status === 'timeout') && correctAnswer !== null && options?.[correctAnswer] && (
        <div className="mb-6 p-4 bg-success/10 rounded-lg border border-success/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-success">
                {String.fromCharCode(65 + correctAnswer)}
              </span>
            </div>
            <div>
              <p className="text-sm text-success/80 mb-1">Correct answer:</p>
              <p className="font-medium text-success">
                {options?.[correctAnswer]?.text || options?.[correctAnswer]}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Participation Progress */}
      {status === 'submitted' && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Participants submitted
            </span>
            <span className="text-sm font-medium">
              {participantsSubmitted} of {totalParticipants}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${submissionPercentage}%` }}
            />
          </div>
        </div>
      )}
      {/* Next Question Button */}
      {showNextButton && (
        <div className="text-center">
          <Button
            variant="default"
            onClick={onNextQuestion}
            iconName="ArrowRight"
            iconPosition="right"
            className="px-8"
          >
            Next Question
          </Button>
        </div>
      )}
    </div>
  );
};

export default SubmissionStatus;