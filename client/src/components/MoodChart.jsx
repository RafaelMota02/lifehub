import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MoodChart = ({ moods }) => {
  // Get last 7 days for weekly view
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  const last7Days = getLast7Days();

  // Prepare data for the chart
  const labels = last7Days.map(date => date.toLocaleDateString('en-US', { weekday: 'short' }));

  const dailyMoodData = last7Days.map(day => {
    const dayMoods = moods.filter(mood => {
      const moodDate = new Date(mood.date || mood.created_at);
      return moodDate.toDateString() === day.toDateString();
    });

    if (dayMoods.length === 0) return null;

    // Average mood for the day if multiple entries
    const avgMood = dayMoods.reduce((sum, mood) => sum + Number(mood.mood_level), 0) / dayMoods.length;
    return Math.round(avgMood * 10) / 10; // Round to 1 decimal
  });

  const data = {
    labels,
    datasets: [{
      label: 'Mood Level',
      data: dailyMoodData,
      borderColor: '#8B5CF6', // Purple
      backgroundColor: 'rgba(139, 92, 246, 0.1)', // Light purple background
      borderWidth: 3,
      fill: true,
      pointBackgroundColor: '#8B5CF6',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
      tension: 0.4, // Slight curve for smoother line
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend to keep it clean
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            return `Date: ${context[0].label}`;
          },
          label: function(context) {
            const value = context.parsed.y;
            if (value === null || isNaN(value)) return 'No data';
            const moodLabels = ['Sad', 'Low', 'Neutral', 'Good', 'Excellent'];
            const labelIndex = Math.floor(value) - 1;
            return `Mood: ${value}/5 ${moodLabels[labelIndex] || ''}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            const moodLabels = ['', '😢', '😐', '😊', '😄', '😍'];
            return moodLabels[value] || value;
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    elements: {
      point: {
        hoverBorderWidth: 3,
      },
    },
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood Trends (Last 7 Days)</h3>
      <div className="h-64 w-full">
        <Line data={data} options={options} />
      </div>
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Your Mood Level</span>
          </div>
          <div className="text-sm text-gray-400">
            {dailyMoodData.filter(mood => mood !== null).length} days logged
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodChart;
