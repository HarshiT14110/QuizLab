import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionHeader = ({
  quizTitle = '',
  roomCode = '',
  sessionStatus = 'active',
  participantCount = 0,
  currentQuestion = 1,
  totalQuestions = 10,
  onShareRoom = null,
  onSessionSettings = null
}) => {
  const getStatusColor = () => {
    switch (sessionStatus) {
      case 'active':
        return 'text-success';
      case 'paused':
        return 'text-warning';
      case 'ended':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = () => {
    switch (sessionStatus) {
      case 'active':
        return 'Play';
      case 'paused':
        return 'Pause';
      case 'ended':
        return 'Square';
      default:
        return 'Circle';
    }
  };

  const handleCopyRoomCode = async () => {
    try {
      await navigator.clipboard?.writeText(roomCode);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy room code:', err);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left Section - Quiz Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-xl font-bold text-foreground truncate">
              {quizTitle || 'Live Quiz Session'}
            </h1>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                sessionStatus === 'active' ? 'bg-success animate-pulse-gentle' : 
                sessionStatus === 'paused' ? 'bg-warning' : 'bg-error'
              }`} />
              <span className={`text-sm font-medium capitalize ${getStatusColor()}`}>
                {sessionStatus}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={14} />
              <span>{participantCount} participants</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="FileText" size={14} />
              <span>Question {currentQuestion} of {totalQuestions}</span>
            </div>
          </div>
        </div>

        {/* Center Section - Room Code */}
        <div className="flex-shrink-0">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
            <div className="text-center">
              <p className="text-xs text-primary font-medium mb-1">Room Code</p>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-mono font-bold text-primary">
                  {roomCode}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyRoomCode}
                  className="h-8 w-8 text-primary hover:bg-primary/10"
                >
                  <Icon name="Copy" size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            iconName="Share2"
            iconPosition="left"
            onClick={onShareRoom}
            className="hidden sm:flex"
          >
            Share Room
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onSessionSettings}
            className="min-w-touch min-h-touch"
          >
            <Icon name="Settings" size={18} />
          </Button>
        </div>
      </div>

      {/* Mobile Share Button */}
      <div className="sm:hidden mt-3">
        <Button
          variant="outline"
          fullWidth
          iconName="Share2"
          iconPosition="left"
          onClick={onShareRoom}
        >
          Share Room Code
        </Button>
      </div>
    </div>
  );
};

export default SessionHeader;