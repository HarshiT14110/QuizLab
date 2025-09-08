import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const MobileWizard = ({
  config,
  onConfigChange,
  questions,
  onGenerateQuiz,
  onEditQuestion,
  onRegenerateQuestion,
  onSaveDraft,
  onSaveAndStartSession,
  onScheduleQuiz,
  isGenerating = false,
  generationProgress = 0,
  generationError = null
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const subjectOptions = [
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'english', label: 'English Language Arts' },
    { value: 'history', label: 'History' },
    { value: 'geography', label: 'Geography' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'art', label: 'Art & Design' },
    { value: 'music', label: 'Music' },
    { value: 'physical-education', label: 'Physical Education' },
    { value: 'business', label: 'Business Studies' },
    { value: 'economics', label: 'Economics' },
    { value: 'psychology', label: 'Psychology' },
    { value: 'other', label: 'Other' }
  ];

  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner', description: 'Basic concepts and simple questions' },
    { value: 'intermediate', label: 'Intermediate', description: 'Moderate complexity with some analysis' },
    { value: 'advanced', label: 'Advanced', description: 'Complex problems requiring critical thinking' },
    { value: 'mixed', label: 'Mixed Difficulty', description: 'Combination of all difficulty levels' }
  ];

  const timeLimitOptions = [
    { value: '30', label: '30 seconds per question' },
    { value: '60', label: '1 minute per question' },
    { value: '90', label: '1.5 minutes per question' },
    { value: '120', label: '2 minutes per question' },
    { value: '180', label: '3 minutes per question' },
    { value: 'unlimited', label: 'No time limit' }
  ];

  const handleInputChange = (field, value) => {
    onConfigChange({ ...config, [field]: value });
  };

  const handleQuestionTypeChange = (type, checked) => {
    const updatedTypes = checked 
      ? [...config?.questionTypes, type]
      : config?.questionTypes?.filter(t => t !== type);
    onConfigChange({ ...config, questionTypes: updatedTypes });
  };

  const isBasicStepValid = () => {
    return config?.topic?.trim() && config?.subject && config?.difficulty;
  };

  const isAdvancedStepValid = () => {
    return config?.questionCount >= 5 && config?.questionTypes?.length > 0;
  };

  const hasValidApiKey = () => {
    const apiKey = import.meta.env?.VITE_GEMINI_API_KEY;
    return apiKey && apiKey !== 'your-gemini-api-key-here';
  };

  const steps = [
    {
      title: 'Basic Setup',
      description: 'Configure your quiz basics',
      content: (
        <div className="space-y-4">
          {/* API Key Warning for mobile */}
          {!hasValidApiKey() && (
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-warning">API Key Required</p>
                  <p className="text-warning/80 mt-1">
                    Set your VITE_GEMINI_API_KEY to use AI generation.
                  </p>
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-warning underline text-xs mt-1 inline-block"
                  >
                    Get API Key →
                  </a>
                </div>
              </div>
            </div>
          )}
          
          <Input
            label="Quiz Topic"
            type="text"
            placeholder="e.g., Photosynthesis, World War II"
            value={config?.topic}
            onChange={(e) => handleInputChange('topic', e?.target?.value)}
            required
          />
          <Select
            label="Subject"
            options={subjectOptions}
            value={config?.subject}
            onChange={(value) => handleInputChange('subject', value)}
            placeholder="Select a subject"
            required
            searchable
          />
          <Select
            label="Difficulty Level"
            options={difficultyOptions}
            value={config?.difficulty}
            onChange={(value) => handleInputChange('difficulty', value)}
            placeholder="Choose difficulty"
            required
          />
        </div>
      )
    },
    {
      title: 'Advanced Options',
      description: 'Customize question types and settings',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Number of Questions: {config?.questionCount}
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={config?.questionCount}
              onChange={(e) => handleInputChange('questionCount', parseInt(e?.target?.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>5</span>
              <span>50</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Question Types
            </label>
            <div className="space-y-2">
              <Checkbox
                label="Multiple Choice"
                checked={config?.questionTypes?.includes('multiple-choice')}
                onChange={(e) => handleQuestionTypeChange('multiple-choice', e?.target?.checked)}
              />
              <Checkbox
                label="True/False"
                checked={config?.questionTypes?.includes('true-false')}
                onChange={(e) => handleQuestionTypeChange('true-false', e?.target?.checked)}
              />
              <Checkbox
                label="Short Answer"
                checked={config?.questionTypes?.includes('short-answer')}
                onChange={(e) => handleQuestionTypeChange('short-answer', e?.target?.checked)}
              />
            </div>
          </div>
          
          <Select
            label="Time Limit"
            options={timeLimitOptions}
            value={config?.timeLimit}
            onChange={(value) => handleInputChange('timeLimit', value)}
            placeholder="Select time limit"
          />
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Custom Instructions
            </label>
            <textarea
              className="w-full p-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
              placeholder="Additional context for AI generation..."
              value={config?.customInstructions}
              onChange={(e) => handleInputChange('customInstructions', e?.target?.value)}
            />
          </div>
        </div>
      )
    },
    {
      title: 'Generate Questions',
      description: 'Let AI create your quiz questions',
      content: (
        <div className="space-y-4">
          {/* Generation Error Display */}
          {generationError && !isGenerating && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-destructive mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-destructive">Generation Failed</p>
                  <p className="text-destructive/80 mt-1">{generationError}</p>
                </div>
              </div>
            </div>
          )}

          {isGenerating ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Generating with Gemini AI...</span>
                <span className="font-medium text-foreground">{Math.round(generationProgress)}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            </div>
          ) : questions?.length > 0 ? (
            <div className="space-y-3">
              <div className="text-center p-4 bg-success/10 border border-success/20 rounded-lg">
                <Icon name="CheckCircle" size={24} className="text-success mx-auto mb-2" />
                <p className="font-medium text-success">Quiz Generated!</p>
                <p className="text-success/80 text-sm">{questions?.length} questions ready</p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Button
                variant="default"
                onClick={onGenerateQuiz}
                disabled={!isBasicStepValid() || !isAdvancedStepValid() || !hasValidApiKey()}
                iconName="Sparkles"
                iconPosition="left"
                className="w-full"
              >
                Generate Quiz with Gemini AI
              </Button>
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Preview & Launch',
      description: 'Review questions and start your session',
      content: (
        <div className="space-y-4">
          {questions?.length > 0 ? (
            <>
              <div className="space-y-3">
                {questions?.slice(0, 2)?.map((question, index) => (
                  <div key={question?.id} className="p-3 bg-muted/50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                        {question?.type}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRegenerateQuestion(index)}
                        iconName="RefreshCw"
                        className="h-6 w-6 p-0"
                      />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-2">{question?.question}</p>
                    {question?.options && (
                      <div className="space-y-1">
                        {question?.options?.slice(0, 2)?.map((option, i) => (
                          <div key={i} className="text-xs text-muted-foreground flex items-center space-x-2">
                            <span className={`w-2 h-2 rounded-full ${option?.isCorrect ? 'bg-success' : 'bg-muted-foreground/30'}`} />
                            <span>{option?.text}</span>
                          </div>
                        ))}
                        <p className="text-xs text-muted-foreground">... and {question?.options?.length - 2} more options</p>
                      </div>
                    )}
                  </div>
                ))}
                {questions?.length > 2 && (
                  <p className="text-center text-sm text-muted-foreground">
                    ... and {questions?.length - 2} more questions
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Button
                  variant="default"
                  onClick={onSaveAndStartSession}
                  iconName="Play"
                  iconPosition="left"
                  className="w-full"
                >
                  Start Live Session
                </Button>
                <Button
                  variant="outline"
                  onClick={onSaveDraft}
                  iconName="Save"
                  iconPosition="left"
                  className="w-full"
                >
                  Save Draft
                </Button>
                <Button
                  variant="ghost"
                  onClick={onScheduleQuiz}
                  iconName="Calendar"
                  iconPosition="left"
                  className="w-full"
                >
                  Schedule Quiz
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Generate questions first to preview and launch</p>
            </div>
          )}
        </div>
      )
    }
  ];

  const canProceedToNext = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return isBasicStepValid();
      case 1:
        return isAdvancedStepValid();
      case 2:
        return questions?.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          {steps?.map((_, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= currentStep 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {index < currentStep ? <Icon name="Check" size={16} /> : index + 1}
              </div>
              {index < steps?.length - 1 && (
                <div className={`w-8 h-1 mx-2 ${
                  index < currentStep ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground">{steps?.[currentStep]?.title}</h2>
          <p className="text-sm text-muted-foreground">{steps?.[currentStep]?.description}</p>
        </div>
      </div>

      <div className="mb-6">
        {steps?.[currentStep]?.content}
      </div>

      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          iconName="ChevronLeft"
          iconPosition="left"
          className="flex-1"
        >
          Back
        </Button>
        <Button
          variant="default"
          onClick={() => setCurrentStep(Math.min(steps?.length - 1, currentStep + 1))}
          disabled={currentStep === steps?.length - 1 || !canProceedToNext(currentStep)}
          iconName="ChevronRight"
          iconPosition="right"
          className="flex-1"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default MobileWizard;