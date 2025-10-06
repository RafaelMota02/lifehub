import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import MoodForm from '../components/MoodForm';
import { useAuth } from '../context/AuthContext.jsx';
import { getMoods, createMood } from '../services/moodService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const MoodsPage = () => {
  const [moods, setMoods] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [showForm, setShowForm] = useState(false);
  const [averageMood, setAverageMood] = useState(0);
  const [formError, setFormError] = useState('');
  const { user } = useAuth();

  // Fetch moods on mount and when user changes
  useEffect(() => {
    const fetchMoods = async () => {
      if (user) {
        try {
          const data = await getMoods(user.id);
          // Ensure data is an array before setting state
          if (Array.isArray(data)) {
            setMoods(data);
          } else {
            console.error('Received non-array data from getMoods:', data);
            setMoods([]);
          }
        } catch (error) {
          console.error('Error fetching moods:', error);
          setMoods([]);
        }
      }
    };

    fetchMoods();
  }, [user]);

  // Calculate average mood and update chart
  useEffect(() => {
    if (Array.isArray(moods) && moods.length > 0) {
      try {
        const total = moods.reduce((sum, mood) => sum + mood.mood_level, 0);
        setAverageMood(total / moods.length);
        
        // For the chart, sort by mood date in ascending order (oldest first)
        const sortedMoods = [...moods].sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });
        
        // Format dates consistently for the chart
        const labels = sortedMoods.map(mood => {
          const date = new Date(mood.date);
          return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });
        });
        
        const moodData = sortedMoods.map(mood => mood.mood_level);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Mood Level',
              data: moodData,
              borderColor: 'rgb(91, 33, 182)',
              backgroundColor: 'rgba(91, 33, 182, 0.1)',
              fill: true,
              tension: 0.4,
              pointRadius: 5,
              pointHoverRadius: 7,
              pointBackgroundColor: 'rgb(91, 33, 182)',
              borderWidth: 3
            }
          ]
        });
      } catch (error) {
        console.error('Error processing moods data:', error);
        setAverageMood(0);
        setChartData({ labels: [], datasets: [] });
      }
    } else {
      setAverageMood(0);
      setChartData({ labels: [], datasets: [] });
    }
  }, [moods]);

  const handleAddEntry = async (entry) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }
    
    try {
      const newEntry = {
        ...entry,
        user_id: user.id,
        created_at: new Date().toISOString(),  // Add creation timestamp
        date: entry.date || new Date().toISOString().split('T')[0] // Ensure date is set
      };
      const createdEntry = await createMood(newEntry);
      setMoods([...moods, createdEntry]);
      setShowForm(false);
      setFormError('');
    } catch (error) {
      console.error('Error creating mood entry:', error);
      setFormError('Failed to save mood entry. Please try again.');
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 1,
        max: 10,
        ticks: {
          stepSize: 1
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1a202c',
        bodyColor: '#4a5568',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true
      }
    }
  };

  const getMoodColor = (level) => {
    return level >= 8 ? 'bg-green-100 text-green-800' : 
           level >= 6 ? 'bg-blue-100 text-blue-800' : 
           level >= 4 ? 'bg-yellow-100 text-yellow-800' : 
           level >= 2 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800';
  };

  const getMoodEmoji = (level) => {
    return level >= 8 ? '😊' : 
           level >= 6 ? '🙂' : 
           level >= 4 ? '😐' : 
           level >= 2 ? '😕' : '😞';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Mood Tracker</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg flex items-center transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Mood Entry
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow p-6 border border-purple-200">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-700">Total Entries</h2>
              <p className="text-2xl font-bold text-gray-900 mt-1">{moods.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow p-6 border border-blue-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-700">Average Mood</h2>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {moods.length > 0 ? averageMood.toFixed(1) : '0.0'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl shadow p-6 border border-pink-200">
          <div className="flex items-center">
            <div className="bg-pink-100 p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-700">Current Mood</h2>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {moods.length > 0 ? (
                  <span className={`px-3 py-1 rounded-full ${getMoodColor(moods[moods.length - 1].mood_level)}`}>
                    {moods[moods.length - 1].mood_level}/10
                  </span>
                ) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Mood History</h2>
          <div className="flex space-x-2">
            <button className="text-sm font-medium text-purple-600 hover:text-purple-800">
              7 Days
            </button>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-700">
              30 Days
            </button>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-700">
              All Time
            </button>
          </div>
        </div>
        <div className="h-96">
          {moods.length > 0 ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No mood data available. Add your first entry!</p>
            </div>
          )}
        </div>
      </div>

      {/* Mood History */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Recent Mood Entries</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search entries..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {moods.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No mood entries</h3>
            <p className="mt-2 text-gray-500">Start tracking your mood to see your emotional patterns</p>
            <button 
              onClick={() => setShowForm(true)}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Add Mood Entry
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {Array.isArray(moods) && [...moods]
              .sort((a, b) => {
                // Compare creation dates lexicographically (ISO format is sortable)
                if (a.created_at !== b.created_at) {
                  return b.created_at.localeCompare(a.created_at);
                }
                return b.id - a.id; // Higher IDs first when dates are equal
              })
              .map((entry, index) => (
              <div key={`${entry.id || 'entry'}-${entry.date || 'no-date'}-${index}`} className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="mr-4 mt-1">
                  <span className={`text-2xl ${getMoodColor(entry.mood_level)} p-2 rounded-full`}>
                    {getMoodEmoji(entry.mood_level)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900 text-center">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </h3>
                    <span className={`px-3 py-1 text-sm rounded-full ${getMoodColor(entry.mood_level)}`}>
                      {entry.mood_level}/10
                    </span>
                  </div>
                  {entry.notes && (
                    <p className="mt-2 text-gray-600">{entry.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Mood Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Add Mood Entry</h3>
                  <button 
                    onClick={() => {
                      setShowForm(false);
                      setFormError('');
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {formError && (
                  <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">
                          {formError}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <MoodForm onSubmit={handleAddEntry} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodsPage;
