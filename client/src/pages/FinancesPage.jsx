import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import FinanceForm from '../components/FinanceForm';
import Alert from '../components/Alert';
import { getFinances, createFinance, updateFinance, deleteFinance } from '../services/financeService';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FinancesPage = () => {
  const [finances, setFinances] = useState([]);
  const [sortedFinances, setSortedFinances] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [showForm, setShowForm] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc', // default: newest first
  });

  // Function to fetch finances
  const fetchFinances = async () => {
    try {
      const data = await getFinances();
      // Convert amount values to numbers - dates will be handled during sorting
      const formattedData = data.map(entry => ({
        ...entry,
        amount: Number(entry.amount)
      }));
      setFinances(formattedData);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setFinances([]); // Clear data on error
    }
  };

  // Sort finances whenever sortConfig or finances change
  useEffect(() => {
    console.log('Starting sort...');
    console.log('Current sort configuration:', sortConfig);
    
    // Log raw dates before sorting
    console.log('Raw transaction dates before sorting:');
    finances.forEach((entry, index) => {
      console.log(`#${index + 1}: ${entry.date} (raw) - ${new Date(entry.date).toString()}`);
    });
    
    const sorted = [...finances].sort((a, b) => {
      // Convert both dates to timestamps for reliable comparison
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      console.log(`Comparing: ${a.date} (${dateA}) vs ${b.date} (${dateB})`);
      
      if (dateA !== dateB) {
        if (sortConfig.direction === 'desc') {
          return dateB - dateA; // Newest first
        }
        return dateA - dateB; // Oldest first
      } else {
        // When dates are identical, sort by ID in descending order (higher IDs = more recent)
        return b.id - a.id;
      }
    });
    
    // Detailed debug output
    console.log('Sorted finances:');
    sorted.forEach((entry, index) => {
      const timestamp = new Date(entry.date).getTime();
      console.log(`#${index + 1}: ${entry.date} - ${new Date(entry.date).toString()} (timestamp: ${timestamp}, id: ${entry.id})`);
    });
    
    setSortedFinances(sorted);
  }, [finances, sortConfig]);

  // Initialize on component mount
  useEffect(() => {
    fetchFinances();
  }, []);

  // Calculate totals
  const totalIncome = finances
    .filter(f => f.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpenses = finances
    .filter(f => f.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  const net = totalIncome - totalExpenses;

  // Update chart when finances change
  useEffect(() => {
    if (finances.length === 0) {
      setChartData({ labels: [], datasets: [] });
      return;
    }

    const income = finances.filter(f => f.type === 'income');
    const expenses = finances.filter(f => f.type === 'expense');

    const incomeByCategory = {};
    const expenseByCategory = {};
    
    income.forEach(item => {
      incomeByCategory[item.category] = (incomeByCategory[item.category] || 0) + item.amount;
    });
    
    expenses.forEach(item => {
      expenseByCategory[item.category] = (expenseByCategory[item.category] || 0) + item.amount;
    });

    const categories = [...new Set([
      ...Object.keys(incomeByCategory),
      ...Object.keys(expenseByCategory)
    ])];

    setChartData({
      labels: categories,
      datasets: [
        {
          label: 'Income',
          data: categories.map(cat => incomeByCategory[cat] || 0),
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
        {
          label: 'Expenses',
          data: categories.map(cat => expenseByCategory[cat] || 0),
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        }
      ]
    });
  }, [finances]);

  const [editingEntry, setEditingEntry] = useState(null);

  const handleAddEntry = async (entry) => {
    try {
      if (editingEntry) {
        await updateFinance(editingEntry.id, entry);
        showAlert('Transaction updated successfully', 'success');
      } else {
        await createFinance(entry);
        showAlert('Transaction saved successfully', 'success');
      }

      // Refetch all transactions to get sorted results
      await fetchFinances();
      setShowForm(false);
      setEditingEntry(null);
    } catch (error) {
      console.error(`Error ${editingEntry ? 'updating' : 'saving'} transaction:`, error);
      showAlert(`Failed to ${editingEntry ? 'update' : 'save'} transaction: ${error.message}`, 'error');
    }
  };

  const handleDelete = (id) => {
    setDeleteConfirmation({ show: true, id });
  };

  const confirmDelete = async () => {
    const id = deleteConfirmation.id;
    try {
      await deleteFinance(id);

      // Refetch all transactions to get sorted results
      await fetchFinances();
      setSelectedEntry(null);
      showAlert('Transaction deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      showAlert('Failed to delete transaction. Please try again.', 'error');
    } finally {
      setDeleteConfirmation({ show: false, id: null });
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
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

  const [selectedEntry, setSelectedEntry] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, id: null });

  const showAlert = (message, type) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  };

  return (
    <div className="p-6">
      {alerts.map(alert => (
        <Alert
          key={alert.id}
          message={alert.message}
          type={alert.type}
        />
      ))}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mt-4">Delete Transaction</h3>
              <p className="text-gray-600 mt-2">Are you sure you want to delete this transaction? This action cannot be undone.</p>
              
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
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4"
             onClick={() => setSelectedEntry(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
               onClick={e => e.stopPropagation()}>
            {/* Card Header */}
            <div className={`${selectedEntry.type === 'income' ? 'bg-green-500' : 'bg-red-500'} rounded-t-2xl p-6`}>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Transaction Details</h3>
                <button onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEntry(null);
                  }}
                  className="text-white hover:text-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Card Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="font-medium text-lg break-words">{selectedEntry.description}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date</p>
                  <p className="font-medium">
                    {typeof selectedEntry.date === 'string' 
                      ? new Date(selectedEntry.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : selectedEntry.date.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                    }
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <p className="font-medium">{selectedEntry.category}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Type</p>
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedEntry.type === 'income' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedEntry.type}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Amount</p>
                  <p className={`text-xl font-bold ${
                    selectedEntry.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedEntry.type === 'income' ? '+' : '-'}${selectedEntry.amount.toFixed(2)}
                  </p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-8 flex space-x-4">
                <button
                  onClick={() => {
                    setEditingEntry(selectedEntry);
                    setShowForm(true);
                    setSelectedEntry(null);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(selectedEntry.id);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="content-block mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Financial Dashboard</h1>
            <p className="text-gray-600">Monitor your income, expenses, and financial health.</p>
          </div>
          <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow p-6 border border-green-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-700">Total Income</h2>
              <p className="text-2xl font-bold text-gray-900 mt-1">${totalIncome.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow p-6 border border-red-200">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-700">Total Expenses</h2>
              <p className="text-2xl font-bold text-gray-900 mt-1">${totalExpenses.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className={`bg-gradient-to-br ${net >= 0 ? 'from-blue-50 to-blue-100 border-blue-200' : 'from-amber-50 to-amber-100 border-amber-200'} rounded-xl shadow p-6 border`}>
          <div className="flex items-center">
            <div className={`p-3 rounded-lg mr-4 ${net >= 0 ? 'bg-blue-100' : 'bg-amber-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${net >= 0 ? 'text-blue-600' : 'text-amber-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-700">Net Balance</h2>
              <p className={`text-2xl font-bold mt-1 ${net >= 0 ? 'text-blue-700' : 'text-amber-700'}`}>
                ${net.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Financial Overview</h2>
          <div className="flex space-x-2">
            <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
              Monthly
            </button>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-700">
              Quarterly
            </button>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-700">
              Yearly
            </button>
          </div>
        </div>
        <div className="h-96">
          {finances.length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No financial data available. Add your first entry!</p>
            </div>
          )}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Transaction History</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {finances.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No transactions</h3>
            <p className="mt-2 text-gray-500">Get started by adding your first financial transaction</p>
            <button 
              onClick={() => setShowForm(true)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Add Transaction
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSortConfig(prev => ({
                      key: 'date',
                      direction: prev.direction === 'desc' ? 'asc' : 'desc'
                    }));
                  }}
                >
                  <div className="flex items-center">
                    Date
                    {sortConfig.key === 'date' && (
                      sortConfig.direction === 'desc' ? 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg> :
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                    )}
                  </div>
                </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedFinances.map(entry => (
                  <tr key={entry.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedEntry(entry)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {typeof entry.date === 'string' 
                        ? new Date(entry.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : entry.date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        entry.type === 'income' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {entry.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {entry.description.length > 20 ? 
                        `${entry.description.substring(0, 20)}...` : 
                        entry.description
                      }
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                      entry.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {entry.type === 'income' ? '+' : '-'}${entry.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingEntry(entry);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(entry.id);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {editingEntry ? 'Edit Transaction' : 'Add Transaction'}
                </h3>
                <button 
                  onClick={() => {
                    setShowForm(false);
                    setEditingEntry(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <FinanceForm 
                onSubmit={handleAddEntry} 
                initialData={editingEntry} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancesPage;
