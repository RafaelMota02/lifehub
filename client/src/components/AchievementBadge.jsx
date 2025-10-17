import React from 'react';

const AchievementBadge = ({ achievement, unlocked, className = "" }) => {
  return (
    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl border-2 transition-all duration-300 ${className} ${
      unlocked
        ? 'bg-gradient-to-br from-yellow-300 to-orange-400 border-yellow-400 shadow-lg transform hover:scale-105'
        : 'bg-gray-100 border-gray-300 opacity-50'
    }`}>
      {unlocked ? (
        <div className="relative">
          <span className="text-2xl">{achievement.icon}</span>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
      ) : (
        <span className="text-2xl text-gray-400 opacity-50">{achievement.icon}</span>
      )}
    </div>
  );
};

export default AchievementBadge;
