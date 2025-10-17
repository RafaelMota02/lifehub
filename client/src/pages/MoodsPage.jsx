import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import MoodForm from '../components/MoodForm';
import { useAuth } from '../hooks/useAuth.js';
import { getMoods, createMood, deleteMood } from '../services/moodService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const MoodsPage = () => {
  const [moods, setMoods] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [showForm, setShowForm] = useState(false);
  const [averageMood, setAverageMood] = useState(0);
  const [formError, setFormError] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, id: null });
  const [moodStreaks, setMoodStreaks] = useState({ current: 0, best: 0 });
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

  // Calculate average mood, streaks and update chart
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

        // Calculate mood streaks (consecutive days with mood >= 7)
        let currentStreak = 0;
        let bestStreak = 0;
        const validMoods = sortedMoods.filter(m => !isNaN(m.mood_level));

        // Sort by date desc to calculate streaks from most recent
        const sortedByDateDesc = validMoods.sort((a, b) => new Date(b.date) - new Date(a.date));

        for (let i = 0; i < sortedByDateDesc.length; i++) {
          const mood = sortedByDateDesc[i];
          const nextMood = sortedByDateDesc[i + 1];
          const daysDiff = nextMood ?
            (new Date(mood.date) - new Date(nextMood.date)) / (1000 * 60 * 60 * 24) : 2;

          if (mood.mood_level >= 7) {
            currentStreak++;
            if (currentStreak > bestStreak) bestStreak = currentStreak;
          } else {
            break; // Break on first bad mood (working backwards from today)
          }

          // Break if not consecutive days
          if (daysDiff > 1 && i < sortedByDateDesc.length - 1) {
            break;
          }
        }

        setMoodStreaks({ current: currentStreak, best: bestStreak });
      } catch (error) {
        console.error('Error processing moods data:', error);
        setAverageMood(0);
        setChartData({ labels: [], datasets: [] });
        setMoodStreaks({ current: 0, best: 0 });
      }
    } else {
      setAverageMood(0);
      setChartData({ labels: [], datasets: [] });
      setMoodStreaks({ current: 0, best: 0 });
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

  const handleDelete = (id) => {
    setDeleteConfirmation({ show: true, id });
  };

  const confirmDelete = async () => {
    const id = deleteConfirmation.id;
    try {
      await deleteMood(id);
      setMoods(moods.filter(mood => mood.id !== id));
      if (selectedMood && selectedMood.id === id) {
        setSelectedMood(null);
      }
    } catch (error) {
      console.error('Failed to delete mood entry:', error);
    } finally {
      setDeleteConfirmation({ show: false, id: null });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mb-16">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900 mb-3 tracking-tight">Mood Tracker</h1>
            <p className="text-gray-600 text-lg leading-relaxed">Monitor and understand your emotional well-being.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Mood Entry
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
        <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 hover:border-blue-200 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-blue-800 mb-6">Total Entries</h2>
          <div className="space-y-2 min-h-[120px] flex flex-col justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold text-gray-900">{moods.length}</span>
              <p className="text-gray-600 text-sm mt-1">Logged moods</p>
            </div>
          </div>
        </div>

        <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-200 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-purple-800 mb-6">Average Mood</h2>
          <div className="space-y-2 min-h-[120px] flex flex-col justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold text-gray-900">{moods.length > 0 ? averageMood.toFixed(1) : '0.0'}</span>
              <p className="text-gray-600 text-sm mt-1">Average level</p>
              {moods.length > 0 && (
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-black h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(averageMood / 10) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-green-100 hover:border-green-200 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-6">Current Mood</h2>
          <div className="space-y-2 min-h-[120px] flex flex-col justify-center">
            {moods.length > 0 ? (
              <div className="text-center">
                <span className="text-5xl mb-3 block">
                  {getMoodEmoji(moods[moods.length - 1].mood_level)}
                </span>
                <span className={`text-xl font-semibold ${getMoodColor(moods[moods.length - 1].mood_level)}`}>
                  {moods[moods.length - 1].mood_level}/10
                </span>
                <p className="text-gray-600 text-sm mt-1">Latest entry</p>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-3xl font-bold text-gray-400">-</span>
                <p className="text-gray-600 text-sm mt-1">No entries yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-orange-100 hover:border-orange-200 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-orange-800 mb-6">Mood Streaks</h2>
          <div className="space-y-2 min-h-[120px] flex flex-col justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold text-gray-900">{moodStreaks.current}</span>
              <p className="text-gray-600 text-sm mt-1">Current streak</p>
              <div className="mt-2 flex items-center justify-center space-x-3">
                <div className="text-center">
                  <span className="text-lg font-semibold text-gray-700">{moodStreaks.best}</span>
                  <p className="text-xs text-gray-500">Best</p>
                </div>
              </div>
              {moodStreaks.current > 0 && (
                <div className="mt-3">
                  <div className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    🔥 {moodStreaks.current} day streak!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Mood History</h2>
          <div className="flex space-x-3">
            <button className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors px-3 py-1 rounded-lg hover:bg-gray-100">
              Weekly
            </button>
            <span className="text-gray-300">|</span>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors px-3 py-1 rounded-lg hover:bg-gray-100">
              Daily
            </button>
            <span className="text-gray-300">|</span>
            <button className="text-sm font-medium hover:text-gray-600 transition-colors px-3 py-1 rounded-lg bg-black text-white">
              Monthly
            </button>
          </div>
        </div>
        <div className="h-96">
          {moods.length > 0 ? (
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
              <Line data={chartData} options={chartOptions} />
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-fade-in-up">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="mt-4 text-2xl font-bold text-gray-900 animate-fade-in-up">No mood data yet</h3>
              <p className="mb-8 mt-2 text-gray-600 text-lg leading-relaxed max-w-md mx-auto animate-fade-in-up">Start tracking your emotional well-being by adding your first mood entry</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center animate-fade-in-up"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Your First Mood Entry
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mood History */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 tracking-tight">Recent Mood Entries</h2>

        {moods.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-fade-in-up">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-2xl font-bold text-gray-900 animate-fade-in-up">No mood entries yet</h3>
            <p className="mb-8 mt-2 text-gray-600 text-lg leading-relaxed max-w-md mx-auto animate-fade-in-up">Start tracking your emotional well-being by logging your first mood entry</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center animate-fade-in-up"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Your First Mood Entry
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {Array.isArray(moods) && [...moods]
              .sort((a, b) => {
                // Compare creation dates lexicographically (ISO format is sortable)
                if (a.created_at !== b.created_at) {
                  return b.created_at.localeCompare(a.created_at);
                }
                return b.id - a.id; // Higher IDs first when dates are equal
              })
              .map((entry, index) => (
              <div key={`${entry.id || 'entry'}-${entry.date || 'no-date'}-${index}`} className="p-6 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setSelectedMood(entry)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${getMoodColor(entry.mood_level)} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <span className="text-2xl">{getMoodEmoji(entry.mood_level)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </h3>
                      {entry.notes && (
                        <p className="text-gray-600 text-sm mt-1 max-w-md">
                          {entry.notes.length > 50 ? `${entry.notes.substring(0, 50)}...` : entry.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-4 py-2 ${getMoodColor(entry.mood_level)} rounded-xl text-lg font-semibold shadow-lg`}>
                      {entry.mood_level}/10
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Mood Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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

      {/* Mood Details Modal */}
      {selectedMood && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            {/* Card Header */}
            <div className="bg-purple-600 rounded-t-2xl p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Mood Details</h3>
                <button onClick={() => setSelectedMood(null)} className="text-white hover:text-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date</p>
                  <p className="font-medium">{new Date(selectedMood.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Mood Level</p>
                  <div className="flex items-center">
                    <span className={`text-2xl mr-2 ${getMoodColor(selectedMood.mood_level)} p-2 rounded-full`}>
                      {getMoodEmoji(selectedMood.mood_level)}
                    </span>
                    <span className={`px-3 py-1 text-sm rounded-full ${getMoodColor(selectedMood.mood_level)}`}>
                      {selectedMood.mood_level}/10
                    </span>
                  </div>
                </div>

                {selectedMood.notes && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Notes</p>
                    <p className="font-medium break-words">{selectedMood.notes}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex space-x-4">
                <button
                  onClick={() => {
                    handleDelete(selectedMood.id);
                    setSelectedMood(null);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Remove
                </button>
                <button
                  onClick={() => setSelectedMood(null)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[99999]">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mt-4">Delete Mood Entry</h3>
              <p className="text-gray-600 mt-2">Are you sure you want to delete this mood entry? This action cannot be undone.</p>

              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={() => setDeleteConfirmation({ show: false, id: null })}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodsPage;
