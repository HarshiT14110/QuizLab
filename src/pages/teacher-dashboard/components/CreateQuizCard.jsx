import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CreateQuizCard = () => {
  const navigate = useNavigate();

  const quickTemplates = [
    {
      title: 'Math Quiz',
      description: 'Numbers, equations, and problem solving',
      icon: 'Calculator',
      subject: 'Mathematics'
    },
    {
      title: 'Science Quiz',
      description: 'Biology, chemistry, and physics',
      icon: 'Atom',
      subject: 'Science'
    },
    {
      title: 'History Quiz',
      description: 'Historical events and figures',
      icon: 'BookOpen',
      subject: 'History'
    }
  ];

  const handleCreateQuiz = () => {
    navigate('/ai-quiz-creation');
  };

  const handleQuickTemplate = (template) => {
    navigate('/ai-quiz-creation', { 
      state: { 
        template: template?.subject,
        quickStart: true 
      } 
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 h-full">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Sparkles" size={32} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Create New Quiz</h2>
        <p className="text-sm text-muted-foreground">
          Generate AI-powered quizzes in seconds
        </p>
      </div>
      {/* Main Create Button */}
      <div className="mb-6">
        <Button
          variant="default"
          onClick={handleCreateQuiz}
          iconName="Plus"
          iconPosition="left"
          className="w-full py-3"
        >
          Create with AI
        </Button>
      </div>
      {/* Quick Templates */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Quick Templates</h3>
        <div className="space-y-2">
          {quickTemplates?.map((template, index) => (
            <button
              key={index}
              onClick={() => handleQuickTemplate(template)}
              className="w-full p-3 text-left bg-muted/50 hover:bg-muted rounded-lg transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-background rounded-lg group-hover:bg-primary/10 transition-colors">
                  <Icon name={template?.icon} size={16} className="text-muted-foreground group-hover:text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground">{template?.title}</h4>
                  <p className="text-xs text-muted-foreground truncate">{template?.description}</p>
                </div>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-primary" />
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Alternative Options */}
      <div className="mt-6 pt-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={() => navigate('/ai-quiz-creation', { state: { manualMode: true } })}
          iconName="Edit"
          iconPosition="left"
          className="w-full text-sm"
        >
          Create Manually
        </Button>
      </div>
    </div>
  );
};

export default CreateQuizCard;