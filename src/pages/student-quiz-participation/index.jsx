import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StudentMinimalHeader from '../../components/ui/StudentMinimalHeader';
import LiveSessionStatusBar from '../../components/ui/LiveSessionStatusBar';
import QuestionDisplay from './components/QuestionDisplay';
import AnswerOptions from './components/AnswerOptions';
import QuizTimer from './components/QuizTimer';
import SubmissionStatus from './components/SubmissionStatus';
import ParticipantCounter from './components/ParticipantCounter';
import QuizCompletionScreen from './components/QuizCompletionScreen';

const StudentQuizParticipation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get quiz session data from navigation state
  const sessionData = location?.state || {};
  
  // Quiz state management
  const [quizState, setQuizState] = useState('active'); // 'active', 'completed', 'disconnected'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState('waiting');
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [showResults, setShowResults] = useState(false);
  
  // Quiz data and statistics
  const [quizData] = useState({
    id: sessionData?.quizId || 'QUIZ123',
    title: sessionData?.quizTitle || 'Science Quiz - Chapter 5',
    totalQuestions: 10,
    timePerQuestion: 30,
    participantCount: 24,
    questions: [
      {
        id: 1,
        text: "What is the chemical symbol for gold?",
        type: "multiple-choice",
        options: [
          { text: "Go" },
          { text: "Au" },
          { text: "Gd" },
          { text: "Ag" }
        ],
        correctAnswer: 1,
        timeLimit: 30
      },
      {
        id: 2,
        text: "Which planet is known as the Red Planet?",
        type: "multiple-choice",
        options: [
          { text: "Venus" },
          { text: "Jupiter" },
          { text: "Mars" },
          { text: "Saturn" }
        ],
        correctAnswer: 2,
        timeLimit: 30
      },
      {
        id: 3,
        text: "What is the largest organ in the human body?",
        type: "multiple-choice",
        options: [
          { text: "Heart" },
          { text: "Brain" },
          { text: "Liver" },
          { text: "Skin" }
        ],
        correctAnswer: 3,
        timeLimit: 30
      },
      {
        id: 4,
        text: "Which gas makes up approximately 78% of Earth's atmosphere?",
        type: "multiple-choice",
        options: [
          { text: "Oxygen" },
          { text: "Carbon Dioxide" },
          { text: "Nitrogen" },
          { text: "Argon" }
        ],
        correctAnswer: 2,
        timeLimit: 30
      },
      {
        id: 5,
        text: "What is the speed of light in a vacuum?",
        type: "multiple-choice",
        options: [
          { text: "300,000 km/s" },
          { text: "299,792,458 m/s" },
          { text: "150,000 km/s" },
          { text: "500,000 km/s" }
        ],
        correctAnswer: 1,
        timeLimit: 30
      }
    ]
  });

  const [studentStats, setStudentStats] = useState({
    correctAnswers: 0,
    totalScore: 0,
    timeSpent: 0,
    rank: null,
    answers: []
  });

  const currentQuestion = quizData?.questions?.[currentQuestionIndex] || {};
  const isLastQuestion = currentQuestionIndex >= quizData?.questions?.length - 1;

  // Handle answer selection
  const handleAnswerSelect = (answerIndex) => {
    if (submissionStatus !== 'waiting') return;
    
    setSelectedAnswer(answerIndex);
    setSubmissionStatus('submitted');
    setIsTimerActive(false);
    
    // Record the answer
    const newAnswer = {
      questionId: currentQuestion?.id,
      selectedAnswer: answerIndex,
      correctAnswer: currentQuestion?.correctAnswer,
      isCorrect: answerIndex === currentQuestion?.correctAnswer,
      timeSpent: quizData?.timePerQuestion - timeLeft
    };
    
    setStudentStats(prev => ({
      ...prev,
      answers: [...prev?.answers, newAnswer],
      correctAnswers: prev?.correctAnswers + (newAnswer?.isCorrect ? 1 : 0),
      totalScore: prev?.totalScore + (newAnswer?.isCorrect ? 100 : 0),
      timeSpent: prev?.timeSpent + newAnswer?.timeSpent
    }));

    // Simulate showing results after a delay
    setTimeout(() => {
      setSubmissionStatus(answerIndex === currentQuestion?.correctAnswer ? 'correct' : 'incorrect');
      setShowResults(true);
      
      // Auto-advance to next question or complete quiz
      setTimeout(() => {
        if (isLastQuestion) {
          completeQuiz();
        } else {
          handleNextQuestion();
        }
      }, 3000);
    }, 1500);
  };

  // Handle timer expiration
  const handleTimeUp = () => {
    if (submissionStatus === 'waiting') {
      setSubmissionStatus('timeout');
      setIsTimerActive(false);
      
      // Record timeout answer
      const timeoutAnswer = {
        questionId: currentQuestion?.id,
        selectedAnswer: null,
        correctAnswer: currentQuestion?.correctAnswer,
        isCorrect: false,
        timeSpent: quizData?.timePerQuestion
      };
      
      setStudentStats(prev => ({
        ...prev,
        answers: [...prev?.answers, timeoutAnswer],
        timeSpent: prev?.timeSpent + timeoutAnswer?.timeSpent
      }));

      setTimeout(() => {
        setShowResults(true);
        
        setTimeout(() => {
          if (isLastQuestion) {
            completeQuiz();
          } else {
            handleNextQuestion();
          }
        }, 3000);
      }, 1500);
    }
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (isLastQuestion) {
      completeQuiz();
      return;
    }
    
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setSubmissionStatus('waiting');
    setShowResults(false);
    setTimeLeft(quizData?.timePerQuestion);
    setIsTimerActive(true);
  };

  // Complete quiz
  const completeQuiz = () => {
    setQuizState('completed');
    setIsTimerActive(false);
    
    // Calculate final rank (mock)
    const finalPercentage = (studentStats?.correctAnswers / quizData?.questions?.length) * 100;
    const mockRank = finalPercentage >= 80 ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 10) + 4;
    
    setStudentStats(prev => ({
      ...prev,
      rank: mockRank
    }));
  };

  // Handle exit quiz
  const handleExitQuiz = () => {
    const confirmExit = window.confirm('Are you sure you want to exit the quiz? Your progress will be lost.');
    if (confirmExit) {
      navigate('/student-quiz-join');
    }
  };

  // Handle view results
  const handleViewResults = () => {
    // Navigate to results page or show detailed results
    console.log('View detailed results');
  };

  // Handle join new quiz
  const handleJoinNewQuiz = () => {
    navigate('/student-quiz-join');
  };

  // Simulate connection status changes
  useEffect(() => {
    const connectionInterval = setInterval(() => {
      const statuses = ['connected', 'connected', 'connected', 'connecting'];
      const randomStatus = statuses?.[Math.floor(Math.random() * statuses?.length)];
      setConnectionStatus(randomStatus);
    }, 10000);

    return () => clearInterval(connectionInterval);
  }, []);

  // Quiz completion screen
  if (quizState === 'completed') {
    return (
      <div className="min-h-screen bg-background">
        <StudentMinimalHeader 
          connectionStatus={connectionStatus}
          onExit={handleJoinNewQuiz}
          showExitButton={false}
        />
        <main className="pt-14 pb-6 px-4">
          <div className="max-w-2xl mx-auto">
            <QuizCompletionScreen
              score={studentStats?.totalScore}
              totalQuestions={quizData?.questions?.length}
              correctAnswers={studentStats?.correctAnswers}
              timeSpent={studentStats?.timeSpent}
              rank={studentStats?.rank}
              totalParticipants={quizData?.participantCount}
              onViewResults={handleViewResults}
              onJoinNewQuiz={handleJoinNewQuiz}
              showLeaderboard={true}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <StudentMinimalHeader 
        connectionStatus={connectionStatus}
        onExit={handleExitQuiz}
      />
      {/* Status Bar */}
      <LiveSessionStatusBar
        sessionId={quizData?.id}
        participantCount={quizData?.participantCount}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={quizData?.questions?.length}
        sessionStatus="active"
        connectionHealth={connectionStatus === 'connected' ? 'good' : 'fair'}
        isTeacher={false}
      />
      {/* Main Content */}
      <main className="pt-28 pb-6 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Participant Counter */}
          <ParticipantCounter
            participantCount={quizData?.participantCount}
            connectionStatus={connectionStatus}
          />

          {/* Question Display */}
          <QuestionDisplay
            question={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={quizData?.questions?.length}
          />

          {/* Timer */}
          <QuizTimer
            timeLimit={currentQuestion?.timeLimit || quizData?.timePerQuestion}
            isActive={isTimerActive}
            onTimeUp={handleTimeUp}
            isPaused={submissionStatus !== 'waiting'}
          />

          {/* Answer Options */}
          {submissionStatus === 'waiting' && (
            <AnswerOptions
              options={currentQuestion?.options || []}
              selectedAnswer={selectedAnswer}
              onAnswerSelect={handleAnswerSelect}
              isSubmitted={false}
              isDisabled={false}
            />
          )}

          {/* Submission Status */}
          {submissionStatus !== 'waiting' && (
            <SubmissionStatus
              status={submissionStatus}
              selectedAnswer={selectedAnswer}
              correctAnswer={showResults ? currentQuestion?.correctAnswer : null}
              options={currentQuestion?.options || []}
              onNextQuestion={handleNextQuestion}
              showNextButton={false}
              participantsSubmitted={Math.floor(quizData?.participantCount * 0.8)}
              totalParticipants={quizData?.participantCount}
            />
          )}

          {/* Answer Options with Results */}
          {showResults && (
            <AnswerOptions
              options={currentQuestion?.options || []}
              selectedAnswer={selectedAnswer}
              onAnswerSelect={() => {}}
              isSubmitted={true}
              isDisabled={true}
              correctAnswer={currentQuestion?.correctAnswer}
              showResults={true}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentQuizParticipation;