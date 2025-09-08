import React from 'react';
import Icon from '../AppIcon';

const LiveSessionStatusBar = ({
  sessionId = '',
  participantCount = 0,
  currentQuestion = 0,
  totalQuestions = 0,
  sessionStatus = 'active',
  connectionHealth = 'good',
  isTeacher = false
}) => {
  const getStatusColor = () => {
    switch (sessionStatus) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'paused':
        return 'bg-warning text-warning-foreground';
      case 'ended':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getConnectionHealthIcon = () => {
    switch (connectionHealth) {
      case 'good':
        return 'Wifi';
      case 'fair':
        return 'Wifi';
      case 'poor':
        return 'WifiOff';
      default:
        return 'Wifi';
    }
  };

  const getConnectionHealthColor = () => {
    switch (connectionHealth) {
      case 'good':
        return 'text-success';
      case 'fair':
        return 'text-warning';
      case 'poor':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  if (sessionStatus === 'ended') {
    return null;
  }

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-muted/95 backdrop-blur-sm border-b border-border/50">
      <div className="flex items-center justify-between px-4 py-2 text-sm">
        {/* Left Section - Session Info */}
        <div className="flex items-center space-x-4">
          {/* Session Status */}
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              <div className="w-2 h-2 rounded-full bg-current animate-pulse-gentle" />
              <span className="capitalize">{sessionStatus}</span>
            </div>
            
            {/* Session ID for Teachers */}
            {isTeacher && sessionId && (
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Icon name="Hash" size={14} />
                <span className="font-mono text-xs">{sessionId}</span>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          {totalQuestions > 0 && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Icon name="FileText" size={14} />
              <span className="text-xs">
                Question {currentQuestion} of {totalQuestions}
              </span>
              <div className="w-16 h-1 bg-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Section - Participants & Connection */}
        <div className="flex items-center space-x-4">
          {/* Participant Count */}
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Icon name="Users" size={14} />
            <span className="text-xs font-medium">
              {participantCount} {participantCount === 1 ? 'participant' : 'participants'}
            </span>
          </div>

          {/* Connection Health */}
          <div className="flex items-center space-x-1">
            <Icon 
              name={getConnectionHealthIcon()} 
              size={14} 
              className={getConnectionHealthColor()}
            />
            <span className={`text-xs font-medium ${getConnectionHealthColor()}`}>
              {connectionHealth}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSessionStatusBar;