import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PreviewPanel = ({ 
  questions = [], 
  isGenerating = false, 
  onEditQuestion, 
  onRegenerateQuestion,
  onSaveDraft,
  onSaveAndStartSession,
  onScheduleQuiz 
}) => {
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  const handleEditStart = (questionIndex) => {
    setEditingQuestion(questionIndex);
    setEditedContent(questions?.[questionIndex]?.question);
  };

  const handleEditSave = (questionIndex) => {
    onEditQuestion(questionIndex, { ...questions?.[questionIndex], question: editedContent });
    setEditingQuestion(null);
    setEditedContent('');
  };

  const handleEditCancel = () => {
    setEditingQuestion(null);
    setEditedContent('');
  };

  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case 'multiple-choice':
        return 'List';
      case 'true-false':
        return 'ToggleLeft';
      case 'short-answer':
        return 'Type';
      default:
        return 'HelpCircle';
    }
  };

  const getQuestionTypeLabel = (type) => {
    switch (type) {
      case 'multiple-choice':
        return 'Multiple Choice';
      case 'true-false':
        return 'True/False';
      case 'short-answer':
        return 'Short Answer';
      default:
        return 'Unknown';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-success bg-success/10';
      case 'intermediate':
        return 'text-warning bg-warning/10';
      case 'advanced':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold text-foreground">Quiz Preview</h2>
          {questions?.length > 0 && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
              {questions?.length} questions
            </span>
          )}
        </div>
        <Icon name="Eye" size={20} className="text-muted-foreground" />
      </div>
      {/* Empty State */}
      {questions?.length === 0 && !isGenerating && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="FileText" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No Questions Yet</h3>
          <p className="text-muted-foreground mb-6">
            Configure your quiz settings and click "Generate Quiz with AI" to create questions.
          </p>
        </div>
      )}
      {/* Generating State */}
      {isGenerating && (
        <div className="space-y-4">
          {[...Array(3)]?.map((_, index) => (
            <div key={index} className="border border-border rounded-lg p-4 animate-pulse-gentle">
              <div className="flex items-center justify-between mb-3">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-6 bg-muted rounded-full w-20"></div>
              </div>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
                <div className="h-3 bg-muted rounded w-1/3"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Questions List */}
      {questions?.length > 0 && (
        <div className="space-y-4 mb-6">
          {questions?.map((question, index) => (
            <div key={index} className="border border-border rounded-lg p-4 hover:border-primary/20 transition-colors">
              {/* Question Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground text-sm font-medium rounded">
                    {index + 1}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Icon name={getQuestionTypeIcon(question?.type)} size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {getQuestionTypeLabel(question?.type)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getDifficultyColor(question?.difficulty)}`}>
                    {question?.difficulty}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditStart(index)}
                      className="w-8 h-8"
                    >
                      <Icon name="Edit2" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRegenerateQuestion(index)}
                      className="w-8 h-8"
                    >
                      <Icon name="RefreshCw" size={14} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Question Content */}
              <div className="mb-4">
                {editingQuestion === index ? (
                  <div className="space-y-3">
                    <textarea
                      className="w-full p-3 border border-border rounded-lg bg-input text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                      rows={3}
                      value={editedContent}
                      onChange={(e) => setEditedContent(e?.target?.value)}
                    />
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleEditSave(index)}
                        iconName="Check"
                        iconPosition="left"
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEditCancel}
                        iconName="X"
                        iconPosition="left"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-foreground font-medium leading-relaxed">
                    {question?.question}
                  </p>
                )}
              </div>

              {/* Answer Options */}
              {question?.type === 'multiple-choice' && (
                <div className="space-y-2">
                  {question?.options?.map((option, optionIndex) => (
                    <div 
                      key={optionIndex} 
                      className={`flex items-center space-x-3 p-2 rounded-lg ${
                        option?.isCorrect 
                          ? 'bg-success/10 border border-success/20' :'bg-muted/50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        option?.isCorrect 
                          ? 'border-success bg-success text-success-foreground' 
                          : 'border-muted-foreground'
                      }`}>
                        <span className="text-xs font-medium">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                      </div>
                      <span className={`text-sm ${option?.isCorrect ? 'text-success font-medium' : 'text-foreground'}`}>
                        {option?.text}
                      </span>
                      {option?.isCorrect && (
                        <Icon name="Check" size={14} className="text-success ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {question?.type === 'true-false' && (
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                    question?.correctAnswer === 'true' ?'bg-success/10 border border-success/20' :'bg-muted/50'
                  }`}>
                    <Icon name="Check" size={16} className={question?.correctAnswer === 'true' ? 'text-success' : 'text-muted-foreground'} />
                    <span className={`text-sm ${question?.correctAnswer === 'true' ? 'text-success font-medium' : 'text-foreground'}`}>
                      True
                    </span>
                  </div>
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                    question?.correctAnswer === 'false' ?'bg-success/10 border border-success/20' :'bg-muted/50'
                  }`}>
                    <Icon name="X" size={16} className={question?.correctAnswer === 'false' ? 'text-success' : 'text-muted-foreground'} />
                    <span className={`text-sm ${question?.correctAnswer === 'false' ? 'text-success font-medium' : 'text-foreground'}`}>
                      False
                    </span>
                  </div>
                </div>
              )}

              {question?.type === 'short-answer' && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Key" size={14} className="text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Sample Answer
                    </span>
                  </div>
                  <p className="text-sm text-foreground">
                    {question?.sampleAnswer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Action Buttons */}
      {questions?.length > 0 && (
        <div className="border-t border-border pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              variant="default"
              onClick={onSaveAndStartSession}
              iconName="Play"
              iconPosition="left"
              className="w-full"
            >
              Start Live Session
            </Button>
            <Button
              variant="secondary"
              onClick={onScheduleQuiz}
              iconName="Calendar"
              iconPosition="left"
              className="w-full"
            >
              Schedule Quiz
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewPanel;