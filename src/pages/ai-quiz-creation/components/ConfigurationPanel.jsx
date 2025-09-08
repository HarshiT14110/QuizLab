import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ConfigurationPanel = ({ 
  config, 
  onConfigChange, 
  onGenerateQuiz, 
  isGenerating = false,
  generationProgress = 0,
  generationError = null
}) => {
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

  const isFormValid = () => {
    return config?.topic?.trim() && 
           config?.subject && 
           config?.difficulty && 
           config?.questionCount >= 5 && 
           config?.questionTypes?.length > 0;
  };

  const hasValidApiKey = () => {
    const apiKey = import.meta.env?.VITE_GEMINI_API_KEY;
    return apiKey && apiKey !== 'your-gemini-api-key-here';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Quiz Configuration</h2>
        <Icon name="Settings" size={20} className="text-muted-foreground" />
      </div>

      {/* API Key Warning */}
      {!hasValidApiKey() && (
        <div className="mb-6 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-warning">API Key Required</p>
              <p className="text-warning/80 mt-1">
                Please set your VITE_GEMINI_API_KEY in the environment file to use AI generation.
              </p>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-warning underline hover:text-warning/80 text-xs mt-1 inline-block"
              >
                Get your Gemini API Key →
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Topic Input */}
        <div>
          <Input
            label="Quiz Topic"
            type="text"
            placeholder="e.g., Photosynthesis, World War II, Algebra Basics"
            value={config?.topic}
            onChange={(e) => handleInputChange('topic', e?.target?.value)}
            required
            description="Describe the main topic or learning objective for your quiz"
          />
        </div>

        {/* Subject Selection */}
        <div>
          <Select
            label="Subject"
            options={subjectOptions}
            value={config?.subject}
            onChange={(value) => handleInputChange('subject', value)}
            placeholder="Select a subject"
            required
            searchable
          />
        </div>

        {/* Difficulty Level */}
        <div>
          <Select
            label="Difficulty Level"
            options={difficultyOptions}
            value={config?.difficulty}
            onChange={(value) => handleInputChange('difficulty', value)}
            placeholder="Choose difficulty"
            required
          />
        </div>

        {/* Question Count Slider */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Number of Questions: {config?.questionCount}
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="5"
              max="50"
              value={config?.questionCount}
              onChange={(e) => handleInputChange('questionCount', parseInt(e?.target?.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${((config?.questionCount - 5) / 45) * 100}%, var(--color-muted) ${((config?.questionCount - 5) / 45) * 100}%, var(--color-muted) 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5 questions</span>
              <span>50 questions</span>
            </div>
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <div>
          <Button
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
            iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            className="w-full justify-between p-3 border border-border rounded-lg"
          >
            Advanced Options
          </Button>
        </div>

        {/* Advanced Options Panel */}
        {showAdvanced && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg border border-border">
            {/* Question Types */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Question Types
              </label>
              <div className="space-y-2">
                <Checkbox
                  label="Multiple Choice"
                  description="4 answer options with one correct answer"
                  checked={config?.questionTypes?.includes('multiple-choice')}
                  onChange={(e) => handleQuestionTypeChange('multiple-choice', e?.target?.checked)}
                />
                <Checkbox
                  label="True/False"
                  description="Simple true or false questions"
                  checked={config?.questionTypes?.includes('true-false')}
                  onChange={(e) => handleQuestionTypeChange('true-false', e?.target?.checked)}
                />
                <Checkbox
                  label="Short Answer"
                  description="Brief text-based responses"
                  checked={config?.questionTypes?.includes('short-answer')}
                  onChange={(e) => handleQuestionTypeChange('short-answer', e?.target?.checked)}
                />
              </div>
            </div>

            {/* Time Limit */}
            <div>
              <Select
                label="Time Limit"
                options={timeLimitOptions}
                value={config?.timeLimit}
                onChange={(value) => handleInputChange('timeLimit', value)}
                placeholder="Select time limit"
              />
            </div>

            {/* Custom Instructions */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Custom Instructions for AI
              </label>
              <textarea
                className="w-full p-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                rows={3}
                placeholder="Additional context or specific requirements for question generation..."
                value={config?.customInstructions}
                onChange={(e) => handleInputChange('customInstructions', e?.target?.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Provide specific guidelines to help AI generate better questions
              </p>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="pt-4">
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
              <Button
                variant="outline"
                disabled
                iconName="Loader2"
                iconPosition="left"
                className="w-full animate-spin"
              >
                Generating Quiz...
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              onClick={onGenerateQuiz}
              disabled={!isFormValid() || !hasValidApiKey()}
              iconName="Sparkles"
              iconPosition="left"
              className="w-full"
            >
              Generate Quiz with Gemini AI
            </Button>
          )}
        </div>

        {/* Form Validation Message */}
        {!isFormValid() && !isGenerating && (
          <div className="flex items-start space-x-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-warning">Complete required fields</p>
              <p className="text-warning/80 mt-1">
                Please fill in topic, subject, difficulty, and select at least one question type.
              </p>
            </div>
          </div>
        )}

        {/* Generation Error Display */}
        {generationError && !isGenerating && (
          <div className="flex items-start space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <Icon name="AlertTriangle" size={16} className="text-destructive mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-destructive">Generation Failed</p>
              <p className="text-destructive/80 mt-1">{generationError}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigurationPanel;