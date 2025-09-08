import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import RoleBasedRouter from "components/ui/RoleBasedRouter";
import NotFound from "pages/NotFound";
import StudentQuizParticipation from './pages/student-quiz-participation';
import LiveQuizHostControl from './pages/live-quiz-host-control';
import AIQuizCreation from './pages/ai-quiz-creation';
import TeacherLogin from './pages/teacher-login';
import StudentQuizJoin from './pages/student-quiz-join';
import TeacherDashboard from './pages/teacher-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RoleBasedRouter>
          <RouterRoutes>
            {/* Define your route here */}
            <Route path="/" element={<AIQuizCreation />} />
            <Route path="/student-quiz-participation" element={<StudentQuizParticipation />} />
            <Route path="/live-quiz-host-control" element={<LiveQuizHostControl />} />
            <Route path="/ai-quiz-creation" element={<AIQuizCreation />} />
            <Route path="/teacher-login" element={<TeacherLogin />} />
            <Route path="/student-quiz-join" element={<StudentQuizJoin />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </RoleBasedRouter>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;