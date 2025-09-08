import React from 'react';
import Icon from '../../../components/AppIcon';

const ParticipantPanel = ({ 
  participants = [], 
  roomCode = '', 
  onKickParticipant = null 
}) => {
  const getConnectionStatusColor = (status) => {
    switch (status) {
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

  const getConnectionIcon = (status) => {
    switch (status) {
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

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground">Participants</h3>
          <div className="flex items-center space-x-2 bg-primary/10 px-3 py-1 rounded-full">
            <Icon name="Users" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">{participants?.length}</span>
          </div>
        </div>
        
        {/* Room Code */}
        <div className="bg-muted rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Room Code</p>
              <p className="text-lg font-mono font-bold text-foreground">{roomCode}</p>
            </div>
            <Icon name="Copy" size={18} className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
          </div>
        </div>
      </div>
      {/* Participants List */}
      <div className="flex-1 overflow-y-auto p-4">
        {participants?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <Icon name="UserPlus" size={32} className="text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Waiting for participants to join...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {participants?.map((participant) => (
              <div
                key={participant?.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-primary-foreground">
                      {participant?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {participant?.name}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Icon 
                        name={getConnectionIcon(participant?.connectionStatus)} 
                        size={12} 
                        className={`${getConnectionStatusColor(participant?.connectionStatus)} ${
                          participant?.connectionStatus === 'connecting' ? 'animate-spin' : ''
                        }`}
                      />
                      <span className={`text-xs ${getConnectionStatusColor(participant?.connectionStatus)}`}>
                        {participant?.connectionStatus}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-1">
                  {participant?.hasAnswered && (
                    <div className="w-2 h-2 bg-success rounded-full" title="Answered" />
                  )}
                  {onKickParticipant && (
                    <button
                      onClick={() => onKickParticipant(participant?.id)}
                      className="p-1 text-muted-foreground hover:text-error transition-colors"
                      title="Remove participant"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Recent Activity */}
      <div className="p-4 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-2">Recent Activity</h4>
        <div className="space-y-1 max-h-20 overflow-y-auto">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="UserPlus" size={12} className="text-success" />
            <span>Alex joined the quiz</span>
            <span className="text-xs">2m ago</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="CheckCircle" size={12} className="text-primary" />
            <span>Mike answered question 3</span>
            <span className="text-xs">3m ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantPanel;