import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingQuizzesWidget = ({ upcomingQuizzes = [] }) => {
  const navigate = useNavigate();

  const mockUpcomingQuizzes = [
    {
      id: 1,
      title: 'Algebra Fundamentals',
      subject: 'Mathematics',
      scheduledTime: '2025-01-20 10:00 AM',
      duration: '45 min',
      participants: 28,
      status: 'scheduled'
    },
    {
      id: 2,
      title: 'World War II History',
      subject: 'History',
      scheduledTime: '2025-01-20 2:30 PM',
      duration: '30 min',
      participants: 22,
      status: 'scheduled'
    },
    {
      id: 3,
      title: 'Chemical Reactions',
      subject: 'Chemistry',
      scheduledTime: '2025-01-21 9:15 AM',
      duration: '60 min',
      participants: 31,
      status: 'scheduled'
    }
  ];

  const quizzesToShow = upcomingQuizzes?.length > 0 ? upcomingQuizzes : mockUpcomingQuizzes;

  const getSubjectIcon = (subject) => {
    const iconMap = {
      'Mathematics': 'Calculator',
      'History': 'BookOpen',
      'Chemistry': 'Atom',
      'Science': 'Microscope',
      'English': 'Book',
      'Physics': 'Zap'
    };
    return iconMap?.[subject] || 'FileText';
  };

  const getTimeUntil = (scheduledTime) => {
    const now = new Date();
    const scheduled = new Date(scheduledTime);
    const diffHours = Math.ceil((scheduled - now) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Starting soon';
    if (diffHours < 24) return `In ${diffHours}h`;
    const diffDays = Math.ceil(diffHours / 24);
    return `In ${diffDays}d`;
  };

  const handleStartQuiz = (quiz) => {
    navigate('/live-quiz-host-control', { 
      state: { 
        quizId: quiz?.id,
        quizTitle: quiz?.title,
        startImmediate: true 
      } 
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Upcoming Quizzes</h2>
          <p className="text-sm text-muted-foreground">Scheduled sessions</p>
        </div>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon name="Calendar" size={20} className="text-primary" />
        </div>
      </div>
      {/* Quiz List */}
      <div className="space-y-4">
        {quizzesToShow?.length > 0 ? (
          quizzesToShow?.slice(0, 3)?.map((quiz) => (
            <div key={quiz?.id} className="p-4 bg-muted/50 rounded-lg border border-border/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-background rounded-lg">
                    <Icon name={getSubjectIcon(quiz?.subject)} size={16} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">{quiz?.title}</h3>
                    <p className="text-xs text-muted-foreground">{quiz?.subject}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                  {getTimeUntil(quiz?.scheduledTime)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>{quiz?.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Users" size={12} />
                    <span>{quiz?.participants} students</span>
                  </div>
                </div>
                <span className="text-xs">{quiz?.scheduledTime}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStartQuiz(quiz)}
                iconName="Play"
                iconPosition="left"
                className="w-full"
              >
                Start Now
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Icon name="Calendar" size={32} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-2">No upcoming quizzes</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/ai-quiz-creation')}
              iconName="Plus"
              iconPosition="left"
            >
              Schedule a Quiz
            </Button>
          </div>
        )}
      </div>
      {/* View All Link */}
      {quizzesToShow?.length > 3 && (
        <div className="mt-4 pt-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-primary"
            iconName="ArrowRight"
            iconPosition="right"
          >
            View All Scheduled
          </Button>
        </div>
      )}
    </div>
  );
};

export default UpcomingQuizzesWidget;