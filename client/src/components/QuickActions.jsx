import React from 'react';
import { Link } from 'react-router-dom';

const QuickActions = () => {
  const actions = [
    {
      title: 'Add Task',
      description: 'Plan your next goal',
      icon: '📝',
      link: '/tasks',
      color: 'btn-primary',
      hoverGradient: 'hover:shadow-blue-500/25',
    },
    {
      title: 'Log Mood',
      description: 'How are you feeling?',
      icon: '😊',
      link: '/moods',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      hoverGradient: 'hover:shadow-purple-500/25',
    },
    {
      title: 'Track Finance',
      description: 'Manage your money',
      icon: '💰',
      link: '/finances',
      color: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
      hoverGradient: 'hover:shadow-green-500/25',
    },
    {
      title: 'Take Notes',
      description: 'Save your thoughts',
      icon: '📓',
      link: '/notes',
      color: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600',
      hoverGradient: 'hover:shadow-orange-500/25',
    },
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className={`group block p-4 rounded-xl text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${action.color} ${action.hoverGradient}`}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                {action.icon}
              </span>
              <h4 className="font-semibold text-sm">{action.title}</h4>
              <p className="text-xs opacity-90 group-hover:opacity-100 transition-opacity">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
