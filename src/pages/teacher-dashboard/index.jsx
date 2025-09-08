import React, { useEffect, useState } from 'react';
import { useRole } from '../../components/ui/RoleBasedRouter';
import TeacherNavigationBar from '../../components/ui/TeacherNavigationBar';
import WelcomePanel from './components/WelcomePanel';
import CreateQuizCard from './components/CreateQuizCard';
import UpcomingQuizzesWidget from './components/UpcomingQuizzesWidget';
import QuizLibraryTable from './components/QuizLibraryTable';

const TeacherDashboard = () => {
  const { getUserData, isAuthenticated, isTeacher } = useRole();
  const [userData, setUserData] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (isAuthenticated && isTeacher) {
      const data = getUserData();
      setUserData(data);
      
      // Mock recent activity data
      setRecentActivity([
        {
          title: 'Algebra Quiz completed by 28 students',
          time: '2 hours ago',
          type: 'quiz_completed'
        },
        {
          title: 'New quiz "Chemical Reactions" created',
          time: '1 day ago',
          type: 'quiz_created'
        },
        {
          title: 'History Quiz started live session',
          time: '2 days ago',
          type: 'live_session'
        }
      ]);
    }
  }, [isAuthenticated, isTeacher, getUserData]);

  // Mock upcoming quizzes data
  const upcomingQuizzes = [
    {
      id: 1,
      title: 'Algebra Fundamentals',
      subject: 'Mathematics',
      scheduledTime: '2025-01-20 10:00 AM',
      duration: '45 min',
      participants: 28,
      status: 'scheduled'
    },
    {
      id: 2,
      title: 'World War II History',
      subject: 'History',
      scheduledTime: '2025-01-20 2:30 PM',
      duration: '30 min',
      participants: 22,
      status: 'scheduled'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <TeacherNavigationBar user={userData} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Top Section - 3 Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Welcome Panel */}
            <div className="lg:col-span-4">
              <WelcomePanel 
                teacherName={userData?.name || 'Teacher'}
                recentActivity={recentActivity}
              />
            </div>

            {/* Create Quiz Card */}
            <div className="lg:col-span-4">
              <CreateQuizCard />
            </div>

            {/* Upcoming Quizzes Widget */}
            <div className="lg:col-span-4">
              <UpcomingQuizzesWidget upcomingQuizzes={upcomingQuizzes} />
            </div>
          </div>

          {/* Quiz Library Table */}
          <div className="mb-8">
            <QuizLibraryTable />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;