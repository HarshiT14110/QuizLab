import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuizCompletionScreen = ({ 
  score = 0,
  totalQuestions = 0,
  correctAnswers = 0,
  timeSpent = 0,
  rank = null,
  totalParticipants = 0,
  onViewResults = () => {},
  onJoinNewQuiz = () => {},
  showLeaderboard = true
}) => {
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
  const getPerformanceConfig = () => {
    if (percentage >= 80) {
      return {
        icon: 'Trophy',
        title: 'Excellent!',
        message: 'Outstanding performance!',
        color: 'text-warning',
        bgColor: 'bg-warning/10'
      };
    } else if (percentage >= 60) {
      return {
        icon: 'CheckCircle',
        title: 'Well Done!',
        message: 'Good job on the quiz!',
        color: 'text-success',
        bgColor: 'bg-success/10'
      };
    } else if (percentage >= 40) {
      return {
        icon: 'Target',
        title: 'Not Bad!',
        message: 'Room for improvement!',
        color: 'text-primary',
        bgColor: 'bg-primary/10'
      };
    } else {
      return {
        icon: 'BookOpen',
        title: 'Keep Learning!',
        message: 'Practice makes perfect!',
        color: 'text-muted-foreground',
        bgColor: 'bg-muted/50'
      };
    }
  };

  const config = getPerformanceConfig();
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Completion Header */}
      <div className={`rounded-xl p-8 text-center mb-6 ${config?.bgColor} border border-border`}>
        <div className={`w-20 h-20 rounded-full ${config?.bgColor} flex items-center justify-center mx-auto mb-4`}>
          <Icon name={config?.icon} size={40} className={config?.color} />
        </div>
        
        <h2 className={`text-2xl font-bold mb-2 ${config?.color}`}>
          {config?.title}
        </h2>
        
        <p className="text-muted-foreground mb-4">
          {config?.message}
        </p>

        {/* Score Display */}
        <div className="text-center">
          <div className="text-4xl font-bold text-foreground mb-1">
            {percentage}%
          </div>
          <div className="text-sm text-muted-foreground">
            {correctAnswers} out of {totalQuestions} correct
          </div>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Score Card */}
        <div className="bg-card rounded-lg p-4 border border-border text-center">
          <Icon name="Award" size={24} className="text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground mb-1">
            {score}
          </div>
          <div className="text-xs text-muted-foreground">
            Total Score
          </div>
        </div>

        {/* Time Card */}
        <div className="bg-card rounded-lg p-4 border border-border text-center">
          <Icon name="Clock" size={24} className="text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground mb-1">
            {formatTime(timeSpent)}
          </div>
          <div className="text-xs text-muted-foreground">
            Time Spent
          </div>
        </div>
      </div>
      {/* Ranking */}
      {rank && totalParticipants > 1 && (
        <div className="bg-card rounded-lg p-4 border border-border mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="TrendingUp" size={20} className="text-primary" />
              <div>
                <div className="font-semibold text-foreground">
                  Rank #{rank}
                </div>
                <div className="text-sm text-muted-foreground">
                  out of {totalParticipants} participants
                </div>
              </div>
            </div>
            
            {rank <= 3 && (
              <div className="text-2xl">
                {rank === 1 && '🥇'}
                {rank === 2 && '🥈'}
                {rank === 3 && '🥉'}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="space-y-3">
        {showLeaderboard && (
          <Button
            variant="default"
            onClick={onViewResults}
            iconName="BarChart3"
            iconPosition="left"
            className="w-full"
          >
            View Full Results
          </Button>
        )}
        
        <Button
          variant="outline"
          onClick={onJoinNewQuiz}
          iconName="Plus"
          iconPosition="left"
          className="w-full"
        >
          Join Another Quiz
        </Button>
      </div>
      {/* Motivational Message */}
      <div className="text-center mt-6 p-4 bg-muted/30 rounded-lg">
        <p className="text-sm text-muted-foreground">
          {percentage >= 80 && "🎉 You're a quiz champion! Keep up the excellent work!"}
          {percentage >= 60 && percentage < 80 && "👏 Great effort! You're doing really well!"}
          {percentage >= 40 && percentage < 60 && "💪 Good try! Practice more to improve your score!"}
          {percentage < 40 && "📚 Don't give up! Every quiz is a learning opportunity!"}
        </p>
      </div>
    </div>
  );
};

export default QuizCompletionScreen;