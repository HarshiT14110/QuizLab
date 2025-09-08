import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherNavigationBar from '../../components/ui/TeacherNavigationBar';
import ConfigurationPanel from './components/ConfigurationPanel';
import PreviewPanel from './components/PreviewPanel';
import MobileWizard from './components/MobileWizard';
import { generateQuizQuestionsWithProgress, regenerateQuestion } from '../../utils/geminiService';
import Icon from '../../components/AppIcon';


const AIQuizCreation = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [generationError, setGenerationError] = useState(null);

  // Quiz configuration state
  const [config, setConfig] = useState({
    topic: '',
    subject: '',
    difficulty: '',
    questionCount: 10,
    questionTypes: ['multiple-choice'],
    timeLimit: '60',
    customInstructions: ''
  });

  // Mock user data (generic)
  const mockUser = {
    name: 'Teacher',
    email: 'teacher@quizmaster.com',
    id: 'teacher_001'
  };

  // Check screen size for responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Replace mock generation with real Gemini API integration
  const handleGenerateQuiz = async () => {
    if (!config?.topic || !config?.subject || config?.questionCount < 1) {
      alert('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationError(null);

    try {
      // Show initial progress
      setGenerationProgress(5);
      
      const generatedQuestions = await generateQuizQuestionsWithProgress(config, (progress) => {
        setGenerationProgress(progress);
      });
      
      if (generatedQuestions?.length > 0) {
        setQuestions(generatedQuestions);
        setGenerationError(null);
      } else {
        throw new Error('No questions were generated. Please try again.');
      }
      
    } catch (error) {
      console.error('Generation error:', error);
      
      // Enhanced error handling for quota issues
      if (error?.message?.includes('quota') || error?.message?.includes('429')) {
        setGenerationError(
          'API quota exceeded. The system has generated sample questions instead. ' + 'Please try again later or consider upgrading your API plan for unlimited generation.'
        );
        
        // Generate sample questions as fallback
        try {
          const fallbackQuestions = await import('../../utils/geminiService')?.then(
            module => module.generateFallbackQuestions?.(config) || []
          );
          if (fallbackQuestions?.length > 0) {
            setQuestions(fallbackQuestions);
          }
        } catch (fallbackError) {
          console.error('Fallback generation failed:', fallbackError);
        }
      } else {
        setGenerationError(
          error?.message || 
          'Failed to generate questions. Please check your configuration and try again.'
        );
      }
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleRegenerateQuestion = async (questionIndex) => {
    const originalQuestion = questions?.[questionIndex];
    if (!originalQuestion) return;

    try {
      const newQuestion = await regenerateQuestion(originalQuestion, config);
      const updatedQuestions = [...questions];
      updatedQuestions[questionIndex] = {
        ...newQuestion,
        id: originalQuestion?.id // Keep original ID
      };
      setQuestions(updatedQuestions);
    } catch (error) {
      console.error('Question regeneration error:', error);
      // Show error feedback (in a real app, use toast notification)
      alert('Failed to regenerate question. Please try again.');
    }
  };

  const handleEditQuestion = (questionIndex, updatedQuestion) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex] = updatedQuestion;
    setQuestions(updatedQuestions);
  };

  const handleSaveDraft = () => {
    const draftData = {
      config,
      questions,
      savedAt: new Date()?.toISOString(),
      status: 'draft'
    };
    
    localStorage.setItem('quizDraft', JSON.stringify(draftData));
    alert('Quiz saved as draft successfully!');
  };

  const handleSaveAndStartSession = () => {
    if (questions?.length === 0) {
      alert('Please generate questions first!');
      return;
    }

    const sessionData = {
      sessionId: `QM${Date.now()?.toString()?.slice(-6)}`,
      config,
      questions,
      createdAt: new Date()?.toISOString(),
      status: 'ready'
    };

    localStorage.setItem('activeQuizSession', JSON.stringify(sessionData));
    navigate('/live-quiz-host-control');
  };

  const handleScheduleQuiz = () => {
    if (questions?.length === 0) {
      alert('Please generate questions first!');
      return;
    }

    const scheduledQuiz = {
      id: `scheduled_${Date.now()}`,
      config,
      questions,
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000)?.toISOString(),
      status: 'scheduled'
    };

    localStorage.setItem('scheduledQuiz', JSON.stringify(scheduledQuiz));
    alert('Quiz scheduled successfully for tomorrow!');
  };

  // Mobile view
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <TeacherNavigationBar user={mockUser} />
        <div className="pt-16">
          <MobileWizard
            config={config}
            onConfigChange={setConfig}
            questions={questions}
            onGenerateQuiz={handleGenerateQuiz}
            onEditQuestion={handleEditQuestion}
            onRegenerateQuestion={handleRegenerateQuestion}
            onSaveDraft={handleSaveDraft}
            onSaveAndStartSession={handleSaveAndStartSession}
            onScheduleQuiz={handleScheduleQuiz}
            isGenerating={isGenerating}
            generationProgress={generationProgress}
            generationError={generationError}
          />
        </div>
      </div>
    );
  }

  // Desktop/Tablet view with error handling
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100">
      <TeacherNavigationBar user={mockUser} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8 flex flex-col items-center justify-center">
            <div className="bg-white/80 shadow-xl rounded-2xl px-8 py-6 mb-4 border border-blue-100 flex flex-col items-center w-full md:w-2/3 lg:w-1/2">
              <h1 className="text-4xl font-extrabold text-blue-700 mb-2 tracking-tight drop-shadow-lg">
                <span className="inline-block align-middle mr-2">
                  <Icon name="Sparkle" size={32} className="text-purple-500" />
                </span>
                AI Quiz Creation
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Generate customized quizzes using <span className="text-purple-500 font-semibold">AI</span> and host live sessions with your students
              </p>
            </div>
          </div>

          {/* Error Message */}
          {generationError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg shadow">
              <div className="flex items-start space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-700">Generation Error</p>
                  <p className="text-red-600 text-sm mt-1">{generationError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Two-panel layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Configuration Panel - 5 columns */}
            <div className="lg:col-span-5">
              <div className="bg-white/90 rounded-xl shadow-lg border border-blue-100 p-6">
                <ConfigurationPanel
                  config={config}
                  onConfigChange={setConfig}
                  onGenerateQuiz={handleGenerateQuiz}
                  isGenerating={isGenerating}
                  generationProgress={generationProgress}
                  generationError={generationError}
                />
              </div>
            </div>

            {/* Preview Panel - 7 columns */}
            <div className="lg:col-span-7">
              <div className="bg-white/90 rounded-xl shadow-lg border border-purple-100 p-6">
                <PreviewPanel
                  questions={questions}
                  isGenerating={isGenerating}
                  onEditQuestion={handleEditQuestion}
                  onRegenerateQuestion={handleRegenerateQuestion}
                  onSaveDraft={handleSaveDraft}
                  onSaveAndStartSession={handleSaveAndStartSession}
                  onScheduleQuiz={handleScheduleQuiz}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIQuizCreation;