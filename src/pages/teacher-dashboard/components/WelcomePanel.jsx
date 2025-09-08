import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomePanel = ({ teacherName = "Teacher", recentActivity = [] }) => {
  const currentDate = new Date()?.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const stats = [
    {
      label: 'Total Quizzes',
      value: '24',
      icon: 'FileText',
      color: 'text-primary'
    },
    {
      label: 'Active Sessions',
      value: '3',
      icon: 'Play',
      color: 'text-success'
    },
    {
      label: 'Students Reached',
      value: '156',
      icon: 'Users',
      color: 'text-secondary'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-100 rounded-2xl border border-blue-100 shadow-xl p-8 h-full">
      {/* Welcome Header */}
      <div className="mb-6 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3 shadow">
          <Icon name="User" size={32} className="text-blue-700" />
        </div>
        <h2 className="text-3xl font-extrabold text-blue-700 mb-1 drop-shadow-lg">
          Welcome back, <span className="text-purple-500">{teacherName}</span>!
        </h2>
        <p className="text-gray-600 text-base font-medium">{currentDate}</p>
      </div>
      {/* Quick Stats */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-medium text-foreground mb-3">Quick Stats</h3>
        {stats?.map((stat, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-background ${stat?.color}`}>
                <Icon name={stat?.icon} size={16} />
              </div>
              <span className="text-sm font-medium text-foreground">{stat?.label}</span>
            </div>
            <span className="text-lg font-semibold text-foreground">{stat?.value}</span>
          </div>
        ))}
      </div>
      {/* Recent Activity */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Recent Activity</h3>
        <div className="space-y-2">
          {recentActivity?.length > 0 ? (
            recentActivity?.slice(0, 3)?.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{activity?.title}</p>
                  <p className="text-xs text-muted-foreground">{activity?.time}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <Icon name="Clock" size={24} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomePanel;