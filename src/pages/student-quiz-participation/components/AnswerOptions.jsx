import React from 'react';
import Button from '../../../components/ui/Button';

const AnswerOptions = ({ 
  options = [],
  selectedAnswer = null,
  onAnswerSelect = () => {},
  isSubmitted = false,
  isDisabled = false,
  correctAnswer = null,
  showResults = false
}) => {
  const getOptionVariant = (option, index) => {
    if (!isSubmitted && !showResults) {
      return selectedAnswer === index ? 'default' : 'outline';
    }
    
    if (showResults) {
      if (index === correctAnswer) {
        return 'success';
      }
      if (selectedAnswer === index && index !== correctAnswer) {
        return 'destructive';
      }
    }
    
    if (isSubmitted && selectedAnswer === index) {
      return 'default';
    }
    
    return 'outline';
  };

  const getOptionIcon = (option, index) => {
    if (showResults) {
      if (index === correctAnswer) {
        return 'Check';
      }
      if (selectedAnswer === index && index !== correctAnswer) {
        return 'X';
      }
    }
    
    if (isSubmitted && selectedAnswer === index) {
      return 'Check';
    }
    
    return null;
  };

  if (!options || options?.length === 0) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4]?.map((i) => (
          <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {options?.map((option, index) => {
        const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
        const variant = getOptionVariant(option, index);
        const iconName = getOptionIcon(option, index);
        
        return (
          <Button
            key={index}
            variant={variant}
            onClick={() => !isDisabled && !isSubmitted && onAnswerSelect(index)}
            disabled={isDisabled || isSubmitted}
            className="w-full h-auto p-4 text-left justify-start min-h-touch"
            iconName={iconName}
            iconPosition="right"
          >
            <div className="flex items-center space-x-3 w-full">
              <div className="flex-shrink-0 w-8 h-8 bg-current/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">
                  {optionLetter}
                </span>
              </div>
              <span className="text-base font-medium flex-1 text-left">
                {option?.text || option}
              </span>
            </div>
          </Button>
        );
      })}
    </div>
  );
};

export default AnswerOptions;