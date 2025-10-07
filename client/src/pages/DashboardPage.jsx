import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { getTasks } from '../services/taskService';
import { getNotes } from '../services/noteService';
import { getFinances } from '../services/financeService';
import { getMoods } from '../services/moodService';

const DashboardPage = () => {
  const { user } = useAuth();
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
    <div className="p-6">
      <div className="content-block mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {user?.username}!</h1>
          <p className="text-gray-600">Here's an overview of your progress and recent activity.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Finances Summary Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-blue-500 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <Link to="/finances" className="text-blue-600 hover:text-blue-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Finances</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Income:</span>
              <span className="text-green-600 font-semibold">${financeStats.totalIncome.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Expenses:</span>
              <span className="text-red-600 font-semibold">${financeStats.totalExpenses.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-gray-300">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Net Balance:</span>
                <span className={`font-bold ${financeStats.net >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                  ${financeStats.net.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Moods Summary Card */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-6 border border-purple-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-purple-500 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <Link to="/moods" className="text-purple-600 hover:text-purple-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Moods</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Level:</span>
              <div className="flex items-center space-x-2">
                <span className="text-purple-600 font-bold text-lg">{moodStats.averageMood}</span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, Number(moodStats.averageMood) * 10)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Entries:</span>
              <span className="font-semibold">{moods.length}</span>
            </div>
          </div>
        </div>

        {/* Tasks Summary Card */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-lg p-6 border border-yellow-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-yellow-500 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <Link to="/tasks" className="text-yellow-600 hover:text-yellow-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tasks</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Tasks:</span>
              <span className="font-semibold">{tasks.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed:</span>
              <span className="text-green-600 font-semibold">{taskStats.completed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending:</span>
              <span className="text-yellow-600 font-semibold">{taskStats.pending}</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Completion Rate:</span>
                <span className={`font-bold ${tasks.length > 0 && taskStats.completed / tasks.length === 1 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {tasks.length > 0 ? Math.round((taskStats.completed / tasks.length) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${tasks.length > 0 ? Math.round((taskStats.completed / tasks.length) * 100) : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Summary Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 border border-green-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-green-500 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <Link to="/notes" className="text-green-600 hover:text-green-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Notes</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Notes:</span>
              <span className="text-green-600 font-bold text-lg">{notes.length}</span>
            </div>
            <div className="text-center mt-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="mt-12 bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/tasks" className="flex flex-col items-center p-6 bg-yellow-50 border border-yellow-200 rounded-xl hover:bg-yellow-100 hover:border-yellow-300 transition-all duration-200 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-600 mb-3 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-gray-700 font-medium">Add Task</span>
          </Link>

          <Link to="/finances" className="flex flex-col items-center p-6 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600 mb-3 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-gray-700 font-medium">Add Finance</span>
          </Link>

          <Link to="/moods" className="flex flex-col items-center p-6 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 hover:border-purple-300 transition-all duration-200 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600 mb-3 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-700 font-medium">Log Mood</span>
          </Link>

          <Link to="/notes" className="flex flex-col items-center p-6 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 hover:border-green-300 transition-all duration-200 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600 mb-3 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="text-gray-700 font-medium">Add Note</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>

        {/* Recent Tasks */}
        {tasks.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-500 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Latest Tasks</h3>
            </div>
            <div className="space-y-3 ml-11">
              {tasks
                .sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))
                .slice(0, 3)
                .map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center min-w-0 flex-1 mr-4">
                      <input
                        type="checkbox"
                        checked={task.status === 'done'}
                        readOnly
                        className="mr-3 w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 flex-shrink-0"
                      />
                      <span className={`font-medium truncate ${task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 flex-shrink-0 ml-2">
                      {new Date(task.created_at || task.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Recent Finances */}
        {finances.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Latest Finances</h3>
            </div>
            <div className="space-y-3 ml-11">
              {finances
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 3)
                .map(finance => (
                  <div key={finance.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-purple-500 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Moods</h3>
            </div>
            <div className="space-y-3 ml-11">
              {moods
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 3)
                .map(mood => (
                  <div key={mood.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                      {new Date(mood.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {tasks.length === 0 && finances.length === 0 && moods.length === 0 && notes.length === 0 && (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Activity Yet</h3>
            <p className="text-gray-500 mb-6">Start adding tasks, finances, or logging your mood to see your activity here.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/tasks" className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Add Your First Task
              </Link>
              <Link to="/finances" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Log Financial Activity
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
