import React from 'react';
import Icon from '../../../components/AppIcon';

const ParticipantCounter = ({ 
  participantCount = 0,
  maxParticipants = null,
  showOnlineStatus = true,
  connectionStatus = 'connected'
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

  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      {/* Participant Count */}
      <div className="flex items-center space-x-2">
        <Icon name="Users" size={16} className="text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">
          {participantCount} {participantCount === 1 ? 'participant' : 'participants'}
        </span>
        {maxParticipants && (
          <span className="text-sm text-muted-foreground">
            / {maxParticipants}
          </span>
        )}
      </div>

      {/* Connection Status */}
      {showOnlineStatus && (
        <div className="flex items-center space-x-1">
          <Icon 
            name={getConnectionIcon()} 
            size={14} 
            className={`${getConnectionStatusColor()} ${connectionStatus === 'connecting' ? 'animate-spin' : ''}`}
          />
          <span className={`text-xs font-medium ${getConnectionStatusColor()}`}>
            {connectionStatus === 'connected' && 'Online'}
            {connectionStatus === 'connecting' && 'Connecting...'}
            {connectionStatus === 'disconnected' && 'Offline'}
          </span>
        </div>
      )}
    </div>
  );
};

export default ParticipantCounter;