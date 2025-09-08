import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import WelcomeHeader from './components/WelcomeHeader';
import JoinForm from './components/JoinForm';
import TeacherModeLink from './components/TeacherModeLink';
import ConnectionStatus from './components/ConnectionStatus';

const StudentQuizJoin = () => {
  useEffect(() => {
    // Set page title and meta tags
    document.title = 'Join Quiz - QuizMaster Live';
  }, []);

  return (
    <>
      <Helmet>
        <title>Join Quiz - QuizMaster Live</title>
        <meta name="description" content="Join a live quiz session with your room code. Participate in real-time quizzes with your classmates." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#2563EB" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Main Content */}
        <div className="flex flex-col min-h-screen">
          {/* Content Container */}
          <div className="flex-1 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
              {/* Welcome Header */}
              <WelcomeHeader />

              {/* Join Form */}
              <div className="bg-card border border-border rounded-xl shadow-card p-6">
                <JoinForm />
                
                {/* Teacher Mode Link */}
                <TeacherModeLink />
              </div>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-xs text-muted-foreground">
                  © {new Date()?.getFullYear()} QuizMaster Live. All rights reserved.
                </p>
                <div className="flex items-center justify-center space-x-4 mt-2">
                  <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                  <span className="text-xs text-muted-foreground">•</span>
                  <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </a>
                  <span className="text-xs text-muted-foreground">•</span>
                  <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Help
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <ConnectionStatus />
      </div>
    </>
  );
};

export default StudentQuizJoin;