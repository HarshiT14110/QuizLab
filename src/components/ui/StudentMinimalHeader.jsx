import React from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const StudentMinimalHeader = ({ 
  connectionStatus = 'connected', 
  onExit = null,
  showExitButton = true 
}) => {
  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-success';
      case 'connecting':
        return 'text-warning';
      case 'disconnected':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Wifi';
      case 'connecting':
        return 'Loader2';
      case 'disconnected':
        return 'WifiOff';
      default:
        return 'Wifi';
    }
  };

  const handleExit = () => {
    if (onExit) {
      onExit();
    } else {
      // Default behavior - navigate to join page
      window.location.href = '/student-quiz-join';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border/50">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Minimal Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-6 h-6 bg-primary rounded">
            <Icon name="Zap" size={14} color="white" />
          </div>
          <span className="text-lg font-medium text-foreground">QuizMaster</span>
        </div>

        {/* Connection Status & Exit */}
        <div className="flex items-center space-x-3">
          {/* Connection Status */}
          <div className="flex items-center space-x-1">
            <Icon 
              name={getConnectionIcon()} 
              size={16} 
              className={`${getConnectionStatusColor()} ${connectionStatus === 'connecting' ? 'animate-spin' : ''}`}
            />
            <span className={`text-xs font-medium ${getConnectionStatusColor()}`}>
              {connectionStatus === 'connected' && 'Connected'}
              {connectionStatus === 'connecting' && 'Connecting...'}
              {connectionStatus === 'disconnected' && 'Disconnected'}
            </span>
          </div>

          {/* Exit Button */}
          {showExitButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExit}
              iconName="X"
              iconSize={16}
              className="text-muted-foreground hover:text-foreground min-w-touch min-h-touch"
            >
              Exit
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default StudentMinimalHeader;