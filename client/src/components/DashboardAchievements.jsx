import React from 'react';
import AchievementBadge from './AchievementBadge';

const DashboardAchievements = ({ tasks, notes, moods, finances }) => {
  const achievements = [
    {
      id: 'first_task',
      title: 'Task Starter',
      description: 'Complete your first task',
      icon: '✅',
      condition: tasks.filter(t => t.status === 'done').length >= 1,
    },
    {
      id: 'task_master',
      title: 'Task Master',
      description: 'Complete 10 tasks',
      icon: '🏆',
      condition: tasks.filter(t => t.status === 'done').length >= 10,
    },
    {
      id: 'mood_tracker',
      title: 'Mood Tracker',
      description: 'Log your mood for 7 days',
      icon: '😊',
      condition: moods.length >= 7,
    },
    {
      id: 'note_keeper',
      title: 'Note Keeper',
      description: 'Create 5 notes',
      icon: '📝',
      condition: notes.length >= 5,
    },
    {
      id: 'finance_watcher',
      title: 'Finance Watcher',
      description: 'Track $1000 in transactions',
      icon: '💰',
      condition: finances.reduce((sum, f) => sum + Math.abs(Number(f.amount)), 0) >= 1000,
    },
    {
      id: 'streak_maker',
      title: 'Streak Maker',
      description: 'Log activity for 30 days',
      icon: '🔥',
      condition: Math.max(tasks.length, notes.length, moods.length, finances.length) >= 30,
    },
    {
      id: 'wellness_warrior',
      title: 'Wellness Warrior',
      description: 'Average mood above 4/5',
      icon: '⭐',
      condition: moods.length > 0 &&
                 (moods.reduce((sum, m) => sum + Number(m.mood_level), 0) / moods.length) >= 4,
    },
    {
      id: 'goal_getter',
      title: 'Goal Getter',
      description: 'Complete 50% of all tasks',
      icon: '🎯',
      condition: tasks.length > 0 &&
                 (tasks.filter(t => t.status === 'done').length / tasks.length) >= 0.5,
    },
  ];

  const unlockedCount = achievements.filter(a => a.condition).length;
  const totalAchievements = achievements.length;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
          <p className="text-sm text-gray-600 mt-1">
            {unlockedCount} of {totalAchievements} unlocked
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-2xl">🏅</div>
          <span className="text-xl font-bold text-orange-500">{unlockedCount}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="text-center group">
            <AchievementBadge
              achievement={achievement}
              unlocked={achievement.condition}
              className="mx-auto"
            />
            <div className="mt-2">
              <h4 className="text-xs font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                {achievement.title}
              </h4>
              <p className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {achievement.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {unlockedCount === 0 && (
        <div className="mt-6 text-center py-8">
          <div className="text-4xl mb-2">🎯</div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Ready to earn your first badge?</h4>
          <p className="text-xs text-gray-500">Start by completing a task or logging your mood!</p>
        </div>
      )}
    </div>
  );
};

export default DashboardAchievements;
