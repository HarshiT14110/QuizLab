import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherNavigationBar from '../../components/ui/TeacherNavigationBar';
import LiveSessionStatusBar from '../../components/ui/LiveSessionStatusBar';
import SessionHeader from './components/SessionHeader';
import ParticipantPanel from './components/ParticipantPanel';
import QuestionDisplay from './components/QuestionDisplay';
import ControlPanel from './components/ControlPanel';

const LiveQuizHostControl = () => {
  const navigate = useNavigate();
  
  // Session State
  const [sessionData, setSessionData] = useState({
    quizTitle: "Advanced React Concepts Quiz",
    roomCode: "ABC123",
    sessionStatus: 'active',
    currentQuestionIndex: 0,
    totalQuestions: 5,
    timeRemaining: 30,
    totalTime: 30,
    isTimerRunning: true,
    showResults: false
  });

  // Mock Quiz Data
  const [quizQuestions] = useState([
    {
      id: 1,
      question: "What is the primary purpose of React hooks?",
      options: [
        { text: "To replace class components entirely", isCorrect: false },
        { text: "To allow state and lifecycle methods in functional components", isCorrect: true },
        { text: "To improve performance of React applications", isCorrect: false },
        { text: "To handle routing in React applications", isCorrect: false }
      ]
    },
    {
      id: 2,
      question: "Which hook is used for managing side effects in React?",
      options: [
        { text: "useState", isCorrect: false },
        { text: "useContext", isCorrect: false },
        { text: "useEffect", isCorrect: true },
        { text: "useReducer", isCorrect: false }
      ]
    },
    {
      id: 3,
      question: "What does the dependency array in useEffect control?",
      options: [
        { text: "When the component re-renders", isCorrect: false },
        { text: "When the effect runs", isCorrect: true },
        { text: "Which props are passed to the component", isCorrect: false },
        { text: "The order of hook execution", isCorrect: false }
      ]
    },
    {
      id: 4,
      question: "Which pattern is recommended for sharing state between components?",
      options: [
        { text: "Prop drilling", isCorrect: false },
        { text: "Global variables", isCorrect: false },
        { text: "Context API or state management libraries", isCorrect: true },
        { text: "Local storage", isCorrect: false }
      ]
    },
    {
      id: 5,
      question: "What is the purpose of React.memo()?",
      options: [
        { text: "To memorize component state", isCorrect: false },
        { text: "To prevent unnecessary re-renders", isCorrect: true },
        { text: "To cache API responses", isCorrect: false },
        { text: "To optimize bundle size", isCorrect: false }
      ]
    }
  ]);

  // Participants Data (generic names)
  const [participants, setParticipants] = useState([
    {
      id: 1,
      name: "Alex Smith",
      connectionStatus: 'connected',
      hasAnswered: true,
      joinedAt: new Date(Date.now() - 300000)
    },
    {
      id: 2,
      name: "Jamie Lee",
      connectionStatus: 'connected',
      hasAnswered: false,
      joinedAt: new Date(Date.now() - 240000)
    },
    {
      id: 3,
      name: "Taylor Kim",
      connectionStatus: 'connected',
      hasAnswered: true,
      joinedAt: new Date(Date.now() - 180000)
    }
  ]);

  // Answer Distribution Data
  const [answerDistribution, setAnswerDistribution] = useState([
    { option: 'A', count: 1, percentage: 20 },
    { option: 'B', count: 3, percentage: 60 },
    { option: 'C', count: 1, percentage: 20 },
    { option: 'D', count: 0, percentage: 0 }
  ]);

  // Timer Effect
  useEffect(() => {
    let interval;
    if (sessionData?.isTimerRunning && sessionData?.timeRemaining > 0) {
      interval = setInterval(() => {
        setSessionData(prev => ({
          ...prev,
          timeRemaining: Math.max(0, prev?.timeRemaining - 1)
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionData?.isTimerRunning, sessionData?.timeRemaining]);

  // Auto-show results when timer ends
  useEffect(() => {
    if (sessionData?.timeRemaining === 0 && !sessionData?.showResults) {
      setSessionData(prev => ({
        ...prev,
        showResults: true,
        isTimerRunning: false
      }));
    }
  }, [sessionData?.timeRemaining, sessionData?.showResults]);

  // Control Handlers
  const handleNextQuestion = useCallback(() => {
    const isLastQuestion = sessionData?.currentQuestionIndex >= sessionData?.totalQuestions - 1;
    
    if (isLastQuestion) {
      // End quiz
      setSessionData(prev => ({
        ...prev,
        sessionStatus: 'ended'
      }));
      // Navigate to results or dashboard
      setTimeout(() => {
        navigate('/teacher-dashboard');
      }, 2000);
    } else {
      // Move to next question
      setSessionData(prev => ({
        ...prev,
        currentQuestionIndex: prev?.currentQuestionIndex + 1,
        timeRemaining: prev?.totalTime,
        isTimerRunning: true,
        showResults: false
      }));
      
      // Reset participants' answer status
      setParticipants(prev => 
        prev?.map(p => ({ ...p, hasAnswered: false }))
      );
      
      // Reset answer distribution
      setAnswerDistribution([
        { option: 'A', count: 0, percentage: 0 },
        { option: 'B', count: 0, percentage: 0 },
        { option: 'C', count: 0, percentage: 0 },
        { option: 'D', count: 0, percentage: 0 }
      ]);
    }
  }, [sessionData?.currentQuestionIndex, sessionData?.totalQuestions, navigate]);

  const handlePauseTimer = useCallback(() => {
    setSessionData(prev => ({
      ...prev,
      isTimerRunning: false,
      sessionStatus: 'paused'
    }));
  }, []);

  const handleResumeTimer = useCallback(() => {
    setSessionData(prev => ({
      ...prev,
      isTimerRunning: true,
      sessionStatus: 'active'
    }));
  }, []);

  const handleShowResults = useCallback(() => {
    setSessionData(prev => ({
      ...prev,
      showResults: true,
      isTimerRunning: false
    }));
  }, []);

  const handleRestartQuestion = useCallback(() => {
    setSessionData(prev => ({
      ...prev,
      timeRemaining: prev?.totalTime,
      isTimerRunning: true,
      showResults: false
    }));
    
    // Reset participants' answer status
    setParticipants(prev => 
      prev?.map(p => ({ ...p, hasAnswered: false }))
    );
    
    // Reset answer distribution
    setAnswerDistribution([
      { option: 'A', count: 0, percentage: 0 },
      { option: 'B', count: 0, percentage: 0 },
      { option: 'C', count: 0, percentage: 0 },
      { option: 'D', count: 0, percentage: 0 }
    ]);
  }, []);

  const handleEndQuiz = useCallback(() => {
    setSessionData(prev => ({
      ...prev,
      sessionStatus: 'ended',
      isTimerRunning: false
    }));
    
    setTimeout(() => {
      navigate('/teacher-dashboard');
    }, 2000);
  }, [navigate]);

  const handleKickParticipant = useCallback((participantId) => {
    setParticipants(prev => 
      prev?.filter(p => p?.id !== participantId)
    );
  }, []);

  const handleShareRoom = useCallback(async () => {
    const shareData = {
      title: 'Join Quiz Session',
      text: `Join the quiz "${sessionData?.quizTitle}" with room code: ${sessionData?.roomCode}`,
      url: `${window.location?.origin}/student-quiz-join?code=${sessionData?.roomCode}`
    };

    // Check if Web Share API is supported and available
    if (navigator.share && window.isSecureContext) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share failed:', error);
        // Fallback to clipboard
        fallbackToClipboard(shareData);
      }
    } else {
      // Fallback to clipboard
      fallbackToClipboard(shareData);
    }
  }, [sessionData?.quizTitle, sessionData?.roomCode]);

  // Helper function for fallback sharing
  const fallbackToClipboard = async (shareData) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard?.writeText(shareData?.url);
        // You could add a toast notification here to inform user
        console.log('Room code link copied to clipboard!');
      } else {
        // Final fallback - create temporary input element
        const textArea = document.createElement('textarea');
        textArea.value = shareData?.url;
        document.body?.appendChild(textArea);
        textArea?.select();
        document.execCommand('copy');
        document.body?.removeChild(textArea);
        console.log('Room code link copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Could show an alert or toast with the URL for manual copying
      alert(`Please manually copy this link: ${shareData?.url}`);
    }
  };

  // Get current question
  const currentQuestion = quizQuestions?.[sessionData?.currentQuestionIndex];
  const answeredCount = participants?.filter(p => p?.hasAnswered)?.length;
  const canShowResults = answeredCount > 0 || sessionData?.timeRemaining === 0;
  const canNextQuestion = sessionData?.showResults || sessionData?.timeRemaining === 0;
  const isLastQuestion = sessionData?.currentQuestionIndex >= sessionData?.totalQuestions - 1;

  // Session stats for control panel
  const sessionStats = {
    totalParticipants: participants?.length,
    answeredCount,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100">
      <TeacherNavigationBar user={userData} />
      <main className="pt-16">
        <LiveSessionStatusBar sessionData={sessionData} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Panel: Session Header & Participants */}
            <div className="lg:col-span-4">
              <div className="bg-white/90 rounded-xl shadow-lg border border-blue-100 p-6 mb-6">
                <SessionHeader sessionData={sessionData} />
              </div>
              <div className="bg-white/90 rounded-xl shadow-lg border border-purple-100 p-6">
                <ParticipantPanel participants={participants} roomCode={sessionData?.roomCode} onKickParticipant={handleKickParticipant} />
              </div>
            </div>
            {/* Center Panel: Question Display */}
            <div className="lg:col-span-5">
              <div className="bg-white/90 rounded-xl shadow-lg border border-blue-100 p-6">
                <QuestionDisplay
                  currentQuestion={currentQuestion}
                  questionNumber={sessionData?.currentQuestionIndex + 1}
                  totalQuestions={sessionData?.totalQuestions}
                  timeRemaining={sessionData?.timeRemaining}
                  totalTime={sessionData?.totalTime}
                  answerDistribution={answerDistribution}
                  showResults={sessionData?.showResults}
                />
              </div>
            </div>
            {/* Right Panel: Control Panel */}
            <div className="lg:col-span-3">
              <div className="bg-white/90 rounded-xl shadow-lg border border-purple-100 p-6">
                <ControlPanel
                  isTimerRunning={sessionData?.isTimerRunning}
                  canShowResults={canShowResults}
                  canNextQuestion={canNextQuestion}
                  isLastQuestion={isLastQuestion}
                  onNextQuestion={handleNextQuestion}
                  onPauseTimer={handlePauseTimer}
                  onResumeTimer={handleResumeTimer}
                  onShowResults={handleShowResults}
                  onRestartQuestion={handleRestartQuestion}
                  onEndQuiz={handleEndQuiz}
                  sessionStats={sessionStats}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LiveQuizHostControl;

// hello