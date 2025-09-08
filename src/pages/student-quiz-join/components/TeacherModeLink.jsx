import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../../components/ui/Button';

const TeacherModeLink = () => {
  const navigate = useNavigate();

  const handleTeacherMode = () => {
    navigate('/teacher-login');
  };

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          Are you a teacher?
        </p>
        <Button
          variant="ghost"
          onClick={handleTeacherMode}
          iconName="GraduationCap"
          iconPosition="left"
          className="text-primary hover:text-primary hover:bg-primary/10"
        >
          Switch to Teacher Mode
        </Button>
      </div>
    </div>
  );
};

export default TeacherModeLink;