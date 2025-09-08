import React, { useEffect } from 'react';
import { useRole } from '../../components/ui/RoleBasedRouter';
import { useNavigate } from 'react-router-dom';
import PlatformHeader from './components/PlatformHeader';
import LoginForm from './components/LoginForm';
import SecurityBadges from './components/SecurityBadges';

const TeacherLogin = () => {
  const { isAuthenticated, isTeacher } = useRole();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && isTeacher) {
      navigate('/teacher-dashboard', { replace: true });
    }
  }, [isAuthenticated, isTeacher, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Platform Header */}
          <PlatformHeader />

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
            {/* Left Side - Login Form */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
              <LoginForm />
            </div>

            {/* Right Side - Security & Trust */}
            <div className="w-full lg:w-1/2">
              <SecurityBadges />
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2">
                © {new Date()?.getFullYear()} QuizMaster Live. All rights reserved.
              </p>
              <div className="flex items-center justify-center space-x-6">
                <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-foreground transition-colors">Support</a>
                <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;