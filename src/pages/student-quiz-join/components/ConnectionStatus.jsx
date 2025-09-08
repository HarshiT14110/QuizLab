import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ConnectionStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    // Simulate connection check
    const checkConnection = async () => {
      setConnectionStatus('checking');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock connection success
      setConnectionStatus('connected');
      
      // Mock participant count updates
      const interval = setInterval(() => {
        setParticipantCount(prev => {
          const change = Math.random() > 0.5 ? 1 : -1;
          const newCount = Math.max(0, Math.min(50, prev + change));
          return newCount;
        });
      }, 3000);

      return () => clearInterval(interval);
    };

    checkConnection();
  }, []);

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'checking':
        return {
          icon: 'Loader2',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          text: 'Checking connection...',
          animate: 'animate-spin'
        };
      case 'connected':
        return {
          icon: 'Wifi',
          color: 'text-success',
          bgColor: 'bg-success/10',
          text: 'Connected to QuizMaster',
          animate: ''
        };
      case 'disconnected':
        return {
          icon: 'WifiOff',
          color: 'text-error',
          bgColor: 'bg-error/10',
          text: 'Connection failed',
          animate: ''
        };
      default:
        return {
          icon: 'Wifi',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          text: 'Unknown status',
          animate: ''
        };
    }
  };

  const status = getStatusConfig();

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto">
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-floating">
        <div className="flex items-center justify-between space-x-3">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 ${status?.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon 
                name={status?.icon} 
                size={16} 
                className={`${status?.color} ${status?.animate}`}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">{status?.text}</p>
              {connectionStatus === 'connected' && (
                <p className="text-xs text-muted-foreground">
                  {participantCount} students online
                </p>
              )}
            </div>
          </div>

          {/* Server Status Indicator */}
          {connectionStatus === 'connected' && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse-gentle" />
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatus;