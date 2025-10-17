import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardTasksChart = ({ tasks }) => {
  const completed = tasks.filter(task => task.status === 'done').length;
  const pending = tasks.filter(task => task.status !== 'done').length;
  const total = tasks.length;

  const data = {
    labels: ['Completed', 'Pending'],
    datasets: [{
      data: [completed, pending],
      backgroundColor: [
        '#10B981', // Success green
        '#F59E0B', // Warning orange
      ],
      borderColor: [
        '#059669',
        '#D97706',
      ],
      borderWidth: 2,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'DM Sans, sans-serif',
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Progress</h3>
      <div className="h-64 w-full">
        <Doughnut data={data} options={options} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTasksChart;
