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
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
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
      <div className="content-block">
        <div className="flex justify-between items-center">
          <h1 className="section-title">Welcome back, {user?.username}!</h1>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Finances Summary */}
        <div className="card transition-transform hover:scale-[1.02]">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Finances</h2>
          </div>
          <p className="text-gray-600 mb-1">Total Income: <span className="text-green-600 font-medium">${financeStats.totalIncome.toFixed(2)}</span></p>
          <p className="text-gray-600 mb-1">Total Expenses: <span className="text-red-600 font-medium">${financeStats.totalExpenses.toFixed(2)}</span></p>
          <p className="text-gray-800 font-medium mb-4">Net: <span className={`font-medium ${financeStats.net >= 0 ? 'text-blue-600' : 'text-red-600'}`}>${financeStats.net.toFixed(2)}</span></p>
          <Link to="/finances" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Moods Summary */}
        <div className="card transition-transform hover:scale-[1.02]">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Moods</h2>
          </div>
          <p className="text-gray-600 mb-4">Average Mood: <span className="text-purple-600 font-medium">{moodStats.averageMood}</span></p>
          <Link to="/moods" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Tasks Summary */}
        <div className="card transition-transform hover:scale-[1.02]">
          <div className="flex items-center mb-4">
            <div className="bg-yellow-100 p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Tasks</h2>
          </div>
          <p className="text-gray-600 mb-1">Completed: <span className="text-green-600 font-medium">{taskStats.completed}</span></p>
          <p className="text-gray-600 mb-4">Pending: <span className="text-yellow-600 font-medium">{taskStats.pending}</span></p>
          <Link to="/tasks" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Notes Summary */}
        <div className="card transition-transform hover:scale-[1.02]">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Notes</h2>
          </div>
          <p className="text-gray-600 mb-4">Total Notes: <span className="text-green-600 font-medium">{notes.length}</span></p>
          <Link to="/notes" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
