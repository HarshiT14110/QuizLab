import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PlatformHeader = () => {
  const navigate = useNavigate();

  const handleStudentAccess = () => {
    navigate('/student-quiz-join');
  };

  return (
    <header className="w-full">
      <div className="flex items-center justify-between mb-12">
        {/* Logo and Branding */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl shadow-card">
            <Icon name="Zap" size={24} color="white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">QuizMaster Live</h1>
            <p className="text-sm text-muted-foreground">AI-Powered Quiz Creation Platform</p>
          </div>
        </div>

        {/* Student Access Link */}
        <Button
          variant="ghost"
          onClick={handleStudentAccess}
          iconName="Users"
          iconPosition="left"
          className="text-muted-foreground hover:text-foreground"
        >
          Student Access
        </Button>
      </div>

      {/* Platform Features */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-foreground mb-4">
          Create Engaging Quizzes in Seconds
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Harness the power of AI to generate customized quizzes, host live sessions, 
          and track student performance with real-time analytics.
        </p>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
            <Icon name="Brain" size={24} className="text-primary" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">AI-Generated Content</h3>
          <p className="text-sm text-muted-foreground">
            Create quizzes instantly with our advanced AI that understands your curriculum
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mx-auto mb-4">
            <Icon name="Wifi" size={24} className="text-secondary" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Live Sessions</h3>
          <p className="text-sm text-muted-foreground">
            Host real-time quiz sessions with instant feedback and engagement
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mx-auto mb-4">
            <Icon name="BarChart3" size={24} className="text-accent" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Analytics Dashboard</h3>
          <p className="text-sm text-muted-foreground">
            Track performance with detailed insights and comprehensive leaderboards
          </p>
        </div>
      </div>
    </header>
  );
};

export default PlatformHeader;