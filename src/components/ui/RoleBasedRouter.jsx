import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RoleContext = createContext();

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleBasedRouter');
  }
  return context;
};

const RoleBasedRouter = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Define route access patterns
  const routeAccess = {
    teacher: [
      '/teacher-login',
      '/teacher-dashboard', 
      '/ai-quiz-creation',
      '/live-quiz-host-control'
    ],
    student: [
      '/student-quiz-join',
      '/student-quiz-participation'
    ],
    public: [
      '/teacher-login',
      '/student-quiz-join'
    ]
  };

  // Initialize user role and authentication state
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check for stored authentication data
        const storedRole = localStorage.getItem('userRole');
        const storedAuth = localStorage.getItem('isAuthenticated');
        const sessionToken = localStorage.getItem('sessionToken');

        if (storedAuth === 'true' && sessionToken && storedRole) {
          setUserRole(storedRole);
          setIsAuthenticated(true);
        } else {
          // Clear any invalid stored data
          localStorage.removeItem('userRole');
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('sessionToken');
        }
      } catch (error) {
        console.error('Error initializing authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Handle route protection and redirection
  useEffect(() => {
    if (isLoading) return;

    const currentPath = location?.pathname;
    
    // Allow access to public routes
    if (routeAccess?.public?.includes(currentPath)) {
      return;
    }

    // Redirect unauthenticated users
    if (!isAuthenticated) {
      if (currentPath?.startsWith('/teacher') || routeAccess?.teacher?.includes(currentPath)) {
        navigate('/teacher-login', { replace: true });
      } else if (currentPath?.startsWith('/student') || routeAccess?.student?.includes(currentPath)) {
        navigate('/student-quiz-join', { replace: true });
      }
      return;
    }

    // Validate role-based access for authenticated users
    if (userRole === 'teacher' && !routeAccess?.teacher?.includes(currentPath)) {
      // Teacher trying to access student routes
      if (routeAccess?.student?.includes(currentPath)) {
        navigate('/teacher-dashboard', { replace: true });
      }
    } else if (userRole === 'student' && !routeAccess?.student?.includes(currentPath)) {
      // Student trying to access teacher routes
      if (routeAccess?.teacher?.includes(currentPath)) {
        navigate('/student-quiz-join', { replace: true });
      }
    }
  }, [location?.pathname, userRole, isAuthenticated, isLoading, navigate]);

  // Authentication methods
  const login = (role, userData = {}) => {
    try {
      const sessionToken = `${role}_${Date.now()}_${Math.random()?.toString(36)?.substr(2, 9)}`;
      
      localStorage.setItem('userRole', role);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('sessionToken', sessionToken);
      localStorage.setItem('userData', JSON.stringify(userData));

      setUserRole(role);
      setIsAuthenticated(true);

      // Navigate to appropriate dashboard
      if (role === 'teacher') {
        navigate('/teacher-dashboard');
      } else if (role === 'student') {
        navigate('/student-quiz-participation');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('userRole');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('userData');

      setUserRole(null);
      setIsAuthenticated(false);

      // Navigate to appropriate login page based on current route
      if (location?.pathname?.startsWith('/teacher')) {
        navigate('/teacher-login');
      } else {
        navigate('/student-quiz-join');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const switchRole = (newRole) => {
    logout();
    setTimeout(() => {
      if (newRole === 'teacher') {
        navigate('/teacher-login');
      } else {
        navigate('/student-quiz-join');
      }
    }, 100);
  };

  // Get user data from storage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : {};
    } catch (error) {
      console.error('Error getting user data:', error);
      return {};
    }
  };

  // Check if current route is accessible
  const isRouteAccessible = (path) => {
    if (routeAccess?.public?.includes(path)) return true;
    if (!isAuthenticated) return false;
    
    if (userRole === 'teacher') {
      return routeAccess?.teacher?.includes(path);
    } else if (userRole === 'student') {
      return routeAccess?.student?.includes(path);
    }
    
    return false;
  };

  const contextValue = {
    userRole,
    isAuthenticated,
    isLoading,
    login,
    logout,
    switchRole,
    getUserData,
    isRouteAccessible,
    isTeacher: userRole === 'teacher',
    isStudent: userRole === 'student'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary rounded-full animate-pulse-gentle" />
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <RoleContext.Provider value={contextValue}>
      {children}
    </RoleContext.Provider>
  );
};

export default RoleBasedRouter;