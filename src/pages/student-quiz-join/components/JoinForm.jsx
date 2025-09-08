import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useRole } from '../../../components/ui/RoleBasedRouter';

const JoinForm = () => {
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useRole();

  // Mock valid room codes for demonstration
  const validRoomCodes = ['QUIZ123', 'LEARN456', 'TEST789', 'STUDY101'];

  const formatRoomCode = (value) => {
    // Remove non-alphanumeric characters and convert to uppercase
    const cleaned = value?.replace(/[^a-zA-Z0-9]/g, '')?.toUpperCase();
    // Limit to 8 characters
    return cleaned?.slice(0, 8);
  };

  const handleRoomCodeChange = (e) => {
    const formatted = formatRoomCode(e?.target?.value);
    setRoomCode(formatted);
    if (error) setError('');
  };

  const validateRoomCode = (code) => {
    if (!code?.trim()) {
      return 'Please enter a room code';
    }
    if (code?.length < 4) {
      return 'Room code must be at least 4 characters';
    }
    if (!validRoomCodes?.includes(code)) {
      return 'Invalid room code. Please check and try again.';
    }
    return null;
  };

  const handleJoinQuiz = async (e) => {
    e?.preventDefault();
    
    const validationError = validateRoomCode(roomCode);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock student data
      const studentData = {
        name: 'Student User',
        roomCode: roomCode,
        joinedAt: new Date()?.toISOString()
      };

      // Login as student and navigate
      login('student', studentData);
      
    } catch (err) {
      setError('Failed to join quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQRScan = () => {
    // Mock QR code scanning - in real app would open camera
    const mockScannedCode = 'QUIZ123';
    setRoomCode(mockScannedCode);
    setError('');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleJoinQuiz} className="space-y-6">
        {/* Room Code Input */}
        <div className="space-y-2">
          <Input
            label="Room Code"
            type="text"
            placeholder="Enter room code (e.g., QUIZ123)"
            value={roomCode}
            onChange={handleRoomCodeChange}
            error={error}
            required
            className="text-center text-lg font-mono tracking-wider"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground text-center">
            Enter the code shared by your teacher
          </p>
        </div>

        {/* Join Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={!roomCode?.trim() || isLoading}
          iconName="ArrowRight"
          iconPosition="right"
          className="h-12"
        >
          {isLoading ? 'Joining Quiz...' : 'Join Quiz'}
        </Button>

        {/* Alternative Methods */}
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* QR Code Scanner */}
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={handleQRScan}
            iconName="QrCode"
            iconPosition="left"
            disabled={isLoading}
          >
            Scan QR Code
          </Button>
        </div>

        {/* Valid Room Codes Hint */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
            <Icon name="Info" size={16} className="mr-2 text-primary" />
            Demo Room Codes
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {validRoomCodes?.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setRoomCode(code);
                  setError('');
                }}
                className="text-xs font-mono bg-background border border-border rounded px-2 py-1 hover:bg-muted transition-colors"
                disabled={isLoading}
              >
                {code}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Click any code above to auto-fill
          </p>
        </div>
      </form>
    </div>
  );
};

export default JoinForm;