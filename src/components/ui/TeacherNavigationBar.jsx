import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const TeacherNavigationBar = ({ user = null }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
  {
    label: 'Dashboard',
    path: '/teacher-dashboard',
    icon: 'LayoutDashboard'
  },
  {
    label: 'Create Quiz',
    path: '/ai-quiz-creation',
    icon: 'Plus'
  },
  {
    label: 'Live Session',
    path: '/live-quiz-host-control',
    icon: 'Play'
  }];


  const isActivePath = (path) => location?.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    navigate('/teacher-login');
    setIsProfileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg overflow-hidden">
            <img src="/assets/images/custom_icon.png" alt="QuiZLab Logo" className="w-8 h-8 object-contain" />
          </div>
          <span className="text-xl font-semibold text-foreground">QuiZLab</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems?.map((item) =>
          <Button
            key={item?.path}
            variant={isActivePath(item?.path) ? "default" : "ghost"}
            onClick={() => handleNavigation(item?.path)}
            iconName={item?.icon}
            iconPosition="left"
            iconSize={18}
            className="px-4 py-2">

              {item?.label}
            </Button>
          )}
        </nav>

        {/* User Profile & Mobile Menu */}
        <div className="flex items-center space-x-2">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden">

            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 px-3 py-2">

              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <span className="hidden sm:block text-sm font-medium">
                {user?.name || 'Teacher'}
              </span>
              <Icon name="ChevronDown" size={16} />
            </Button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen &&
            <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-modal z-50">
                <div className="p-2">
                  <div className="px-3 py-2 text-sm text-muted-foreground border-b border-border mb-2">
                    {user?.email || 'teacher@example.com'}
                  </div>
                  <Button
                  variant="ghost"
                  onClick={() => {
                    setIsProfileOpen(false);
                    // Handle profile navigation
                  }}
                  iconName="Settings"
                  iconPosition="left"
                  className="w-full justify-start mb-1">

                    Settings
                  </Button>
                  <Button
                  variant="ghost"
                  onClick={() => {
                    setIsProfileOpen(false);
                    // Handle help navigation
                  }}
                  iconName="HelpCircle"
                  iconPosition="left"
                  className="w-full justify-start mb-1">

                    Help & Support
                  </Button>
                  <Button
                  variant="ghost"
                  onClick={handleLogout}
                  iconName="LogOut"
                  iconPosition="left"
                  className="w-full justify-start text-error hover:text-error hover:bg-error/10">

                    Sign Out
                  </Button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen &&
      <div className="md:hidden bg-card border-t border-border">
          <nav className="p-4 space-y-2">
            {navigationItems?.map((item) =>
          <Button
            key={item?.path}
            variant={isActivePath(item?.path) ? "default" : "ghost"}
            onClick={() => handleNavigation(item?.path)}
            iconName={item?.icon}
            iconPosition="left"
            iconSize={18}
            className="w-full justify-start">

                {item?.label}
              </Button>
          )}
          </nav>
        </div>
      }
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen &&
      <div
        className="fixed inset-0 bg-black/20 z-40 md:hidden"
        onClick={() => setIsMobileMenuOpen(false)} />

      }
      {/* Overlay for profile dropdown */}
      {isProfileOpen &&
      <div
        className="fixed inset-0 z-40"
        onClick={() => setIsProfileOpen(false)} />

      }
    </header>);

};

export default TeacherNavigationBar;