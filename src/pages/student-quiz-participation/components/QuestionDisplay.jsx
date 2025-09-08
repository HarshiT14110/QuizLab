import React from 'react';

const QuestionDisplay = ({ 
  question = {},
  currentQuestionIndex = 0,
  totalQuestions = 0
}) => {
  const { text = '', type = 'multiple-choice', image = null } = question;

  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-primary-foreground">
              {currentQuestionIndex + 1}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            of {totalQuestions}
          </span>
        </div>
        
        {type && (
          <div className="px-3 py-1 bg-muted rounded-full">
            <span className="text-xs font-medium text-muted-foreground capitalize">
              {type?.replace('-', ' ')}
            </span>
          </div>
        )}
      </div>
      {/* Question Image */}
      {image && (
        <div className="mb-6 rounded-lg overflow-hidden">
          <img
            src={image}
            alt="Question illustration"
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.src = '/assets/images/no_image.png';
            }}
          />
        </div>
      )}
      {/* Question Text */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground leading-relaxed">
          {text || 'Loading question...'}
        </h2>
      </div>
      {/* Question Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: totalQuestions > 0 ? `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` : '0%' 
          }}
        />
      </div>
    </div>
  );
};

export default QuestionDisplay;