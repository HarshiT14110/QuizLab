import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeHeader = () => {
  return (
    <div className="text-center space-y-4 mb-8">
      {/* Logo */}
      <div className="flex items-center justify-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl shadow-lg">
          <Icon name="Zap" size={28} color="white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">QuizMaster Live</h1>
          <p className="text-sm text-muted-foreground">Student Portal</p>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Join a Live Quiz
        </h2>
        <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
          Enter your room code to participate in an interactive quiz session with your classmates
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-4 mt-6 max-w-sm mx-auto">
        <div className="text-center">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Icon name="Users" size={20} className="text-success" />
          </div>
          <p className="text-xs text-muted-foreground">Real-time</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Icon name="Smartphone" size={20} className="text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">Mobile Ready</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Icon name="Trophy" size={20} className="text-warning" />
          </div>
          <p className="text-xs text-muted-foreground">Leaderboard</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;