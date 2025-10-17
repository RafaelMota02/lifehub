import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useSettings } from '../context/SettingsContext.jsx';
import { Link } from 'react-router-dom';
import { getTasks } from '../services/taskService';
import { getNotes } from '../services/noteService';
import { getFinances } from '../services/financeService';
import { getMoods } from '../services/moodService';
import DashboardTasksChart from '../components/DashboardTasksChart';
import MoodChart from '../components/MoodChart';
import DashboardAchievements from '../components/DashboardAchievements';
import QuickActions from '../components/QuickActions';
import MotivationalQuote from '../components/MotivationalQuote';

const DashboardPage = () => {
  const { user } = useAuth();
  const { formatDate } = useSettings();
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [finances, setFinances] = useState([]);
  const [moods, setMoods] = useState([]);

  // Fetch all data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;

      try {
        const [tasksData, notesData, financesData, moodsData] = await Promise.all([
          getTasks(user.id),
          getNotes(user.id),
          getFinances(),
          getMoods(user.id)
        ]);

        setTasks(tasksData);
        setNotes(notesData);
        setFinances(financesData);
        setMoods(moodsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  // Calculate statistics
  const taskStats = {
    completed: tasks.filter(task => task.status === 'done').length,
    pending: tasks.filter(task => task.status !== 'done').length
  };

  const financeStats = {
    totalIncome: finances
      .filter(f => f.type === 'income')
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0),
    totalExpenses: finances
      .filter(f => f.type === 'expense')
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  };
  financeStats.net = financeStats.totalIncome - financeStats.totalExpenses;

  const moodStats = {
    averageMood: moods.length > 0
      ? (moods.reduce((sum, mood) => sum + (Number(mood.mood_level) || 0), 0) / moods.length).toFixed(1)
      : 'N/A'
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mb-16">
        <div>
          <h1 className="text-4xl font-semibold text-gray-900 mb-3 tracking-tight">Welcome back, {user?.username}</h1>
          <p className="text-gray-600 text-lg leading-relaxed">Here's an overview of your progress and recent activity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Finances Summary Card */}
        <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-emerald-100 hover:border-emerald-200 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <Link to="/finances" className="text-gray-400 hover:text-emerald-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <h2 className="text-2xl font-bold text-emerald-800 mb-6">Finances</h2>
          <div className="space-y-6 min-h-[200px] flex flex-col justify-between">
            <div className="flex-grow space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Income</span>
                <span className="text-green-600 font-semibold">${financeStats.totalIncome.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Expenses</span>
                <span className="text-red-600 font-semibold">${financeStats.totalExpenses.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Balance</span>
                  <span className={`font-semibold ${financeStats.net >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                    ${financeStats.net.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <Link to="/finances" className="group flex items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 mt-auto">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3 group-hover:scale-105 transition-transform duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-gray-700 font-medium text-sm">Add Finance</span>
            </Link>
          </div>
        </div>

        {/* Moods Summary Card */}
        <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 hover:border-blue-200 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <Link to="/moods" className="text-gray-400 hover:text-blue-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <h2 className="text-2xl font-bold text-blue-800 mb-6">Moods</h2>
          <div className="space-y-6 min-h-[200px] flex flex-col justify-between">
            <div className="flex-grow space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Average</span>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-lg">{moodStats.averageMood}</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-black h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Number(moodStats.averageMood) * 20)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Entries</span>
                <span className="font-semibold">{moods.length}</span>
              </div>
            </div>
            <Link to="/moods" className="group flex items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 mt-auto">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3 group-hover:scale-105 transition-transform duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-gray-700 font-medium text-sm">Log Mood</span>
            </Link>
          </div>
        </div>

        {/* Tasks Summary Card */}
        <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-yellow-100 hover:border-yellow-200 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <Link to="/tasks" className="text-gray-400 hover:text-yellow-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <h2 className="text-2xl font-bold text-yellow-800 mb-6">Tasks</h2>
          <div className="space-y-6 min-h-[200px] flex flex-col justify-between">
            <div className="flex-grow space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Total</span>
                <span className="font-semibold">{tasks.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Completed</span>
                <span className="text-green-600 font-semibold">{taskStats.completed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Pending</span>
                <span className="text-orange-600 font-semibold">{taskStats.pending}</span>
              </div>
              {tasks.length > 0 && (
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900 text-sm">
                      {Math.round((taskStats.completed / tasks.length) * 100)}% done
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-black h-2 rounded-full transition-all duration-300"
                      style={{ width: `${tasks.length > 0 ? Math.round((taskStats.completed / tasks.length) * 100) : 0}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            <Link to="/tasks" className="group flex items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 mt-auto">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3 group-hover:scale-105 transition-transform duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-gray-700 font-medium text-sm">Add Task</span>
            </Link>
          </div>
        </div>

        {/* Notes Summary Card */}
        <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-200 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <Link to="/notes" className="text-gray-400 hover:text-purple-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <h2 className="text-2xl font-bold text-purple-800 mb-6">Notes</h2>
          <div className="space-y-6 min-h-[200px] flex flex-col justify-between">
            <div className="flex-grow space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Total Notes</span>
                <span className="font-semibold">{notes.length}</span>
              </div>
            </div>
            <Link to="/notes" className="group flex items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 mt-auto">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3 group-hover:scale-105 transition-transform duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <span className="text-gray-700 font-medium text-sm">Add Note</span>
            </Link>
          </div>
        </div>
      </div>



      {/* Motivational Quote Section */}
      <div className="mt-12">
        <MotivationalQuote />
      </div>



      {/* Recent Activity Section */}
      <div className="mt-12 bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 tracking-tight">Recent Activity</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Recent Tasks */}
          {tasks.length > 0 && (
            <div className="group">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center mr-4 group-hover:scale-105 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Latest Tasks</h3>
              </div>
              <div className="space-y-3">
                {tasks
                  .sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))
                  .slice(0, 4)
                  .map(task => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center min-w-0 flex-1 mr-4">
                        <input
                          type="checkbox"
                          checked={task.status === 'done'}
                          readOnly
                          className="mr-3 w-4 h-4 text-black bg-white border-gray-300 rounded focus:ring-black/20 flex-shrink-0"
                        />
                        <span className={`font-medium truncate ${task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.title}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 flex-shrink-0 ml-2">
                        {formatDate(task.created_at || task.date)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Recent Finances */}
          {finances.length > 0 && (
            <div className="group">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center mr-4 group-hover:scale-105 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Latest Finances</h3>
              </div>
              <div className="space-y-3">
                {finances
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 4)
                  .map(finance => (
                    <div key={finance.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center min-w-0 flex-1 mr-4">
                        <span className={`w-3 h-3 rounded-full mr-3 flex-shrink-0 ${finance.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="font-medium text-gray-900 truncate">{finance.description}</span>
                      </div>
                      <span className={`font-medium flex-shrink-0 ${finance.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {finance.type === 'income' ? '+' : '-'}${finance.amount}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Recent Moods */}
          {moods.length > 0 && (
            <div className="group">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center mr-4 group-hover:scale-105 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Moods</h3>
              </div>
              <div className="space-y-3">
                {moods
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 4)
                  .map(mood => (
                    <div key={mood.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3 min-w-0 flex-1 mr-4">
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span
                              key={star}
                              className={`text-lg ${star <= Number(mood.mood_level) ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                        <span className="font-medium text-gray-900 flex-shrink-0 ml-1">
                          {mood.mood_level}/5 mood
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 flex-shrink-0">
                        {formatDate(mood.date)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {tasks.length === 0 && finances.length === 0 && moods.length === 0 && notes.length === 0 && (
          <div className="col-span-full text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-medium text-gray-900 mb-3">Get started with LifeHub</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Add your first tasks, track finances, log moods, or take notes to see your personalized dashboard.</p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <Link to="/tasks" className="btn-primary text-center">
                Add Task
              </Link>
              <Link to="/finances" className="btn-secondary text-center">
                Add Finance
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
