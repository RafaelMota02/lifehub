import { useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm';
import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon, CalendarDaysIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth.js';
import { useSettings } from '../context/SettingsContext.jsx';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';

const TasksPage = () => {
  const { user } = useAuth();
  const { formatDate } = useSettings();
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, id: null });

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      if (user?.id) {
        try {
          const tasksData = await getTasks(user.id);
          setTasks(tasksData);
        } catch (error) {
          console.error('Failed to fetch tasks:', error);
        }
      }
    };
    fetchTasks();
  }, [user?.id]);

  // Calculate task statistics
  const inProgressCount = tasks.filter(task => task.status === 'in_progress').length;
  const doneCount = tasks.filter(task => task.status === 'done').length;
  
  const overdueCount = tasks.filter(task => 
    task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'
  ).length;

  // Filter and sort tasks based on current filter and search term
  const filteredTasks = tasks
    .filter(task => {
      const matchesFilter = filter === 'all' || task.status === filter;
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      // Compare creation dates lexicographically (ISO format is sortable)
      if (a.created_at !== b.created_at) {
        return b.created_at.localeCompare(a.created_at);
      }
      return b.id - a.id; // Higher IDs first when dates are equal
    });

  const handleAddTask = async (taskData) => {
    try {
      const taskPayload = {
        user_id: user.id,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status || 'todo',
        due_date: taskData.due_date
      };
      const newTask = await createTask(taskPayload);
      setTasks([...tasks, newTask]);
      setShowForm(false);
      setEditingEntry(null);
    } catch (error) {
      console.error('Failed to create task:', error);
      // TODO: Add error handling UI
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await updateTask(editingEntry.id, taskData);
      setTasks(tasks.map(task =>
        task.id === editingEntry.id ? { ...task, ...taskData } : task
      ));
      setShowForm(false);
      setEditingEntry(null);
    } catch (error) {
      console.error('Failed to update task:', error);
      // TODO: Add error handling UI
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateTask(id, { status });
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, status } : task
      ));
    } catch (error) {
      console.error('Failed to update task status:', error);
      // TODO: Add error handling UI
    }
  };

  const handleDelete = (id) => {
    setDeleteConfirmation({ show: true, id });
  };

  const confirmDelete = async () => {
    const id = deleteConfirmation.id;
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
      if (selectedTask && selectedTask.id === id) {
        setSelectedTask(null);
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setDeleteConfirmation({ show: false, id: null });
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'todo': 
        return { text: 'To Do', color: 'bg-gray-100 text-gray-800', icon: <ClockIcon className="h-4 w-4 mr-1" /> };
      case 'in_progress': 
        return { text: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: <ExclamationCircleIcon className="h-4 w-4 mr-1" /> };
      case 'done': 
        return { text: 'Done', color: 'bg-green-100 text-green-800', icon: <CheckCircleIcon className="h-4 w-4 mr-1" /> };
      default: 
        return { text: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const isOverdue = (dueDate) => {
    return dueDate && new Date(dueDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mb-16">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900 mb-3 tracking-tight">Task Manager</h1>
            <p className="text-gray-600 text-lg leading-relaxed">Manage your tasks and stay organized.</p>
          </div>
          <button
            onClick={() => {
              setEditingEntry(null);
              setShowForm(true);
            }}
            className="bg-yellow-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Task
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
        <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-gray-200 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Total Tasks</h2>
          <div className="space-y-2 min-h-[120px] flex flex-col justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold text-gray-900">{tasks.length}</span>
              <p className="text-gray-600 text-sm mt-1">All tasks</p>
            </div>
          </div>
        </div>

        <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 hover:border-blue-200 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <ExclamationCircleIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-blue-800 mb-6">In Progress</h2>
          <div className="space-y-2 min-h-[120px] flex flex-col justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold text-gray-900">{inProgressCount}</span>
              <p className="text-gray-600 text-sm mt-1">Active tasks</p>
            </div>
          </div>
        </div>

        <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-green-100 hover:border-green-200 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <CheckCircleIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-6">Completed</h2>
          <div className="space-y-2 min-h-[120px] flex flex-col justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold text-gray-900">{doneCount}</span>
              <p className="text-gray-600 text-sm mt-1">Finished tasks</p>
            </div>
          </div>
        </div>

        <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-orange-100 hover:border-orange-200 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-orange-800 mb-6">Overdue</h2>
          <div className="space-y-2 min-h-[120px] flex flex-col justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold text-gray-900">{overdueCount}</span>
              <p className="text-gray-600 text-sm mt-1">Past due</p>
            </div>
          </div>
        </div>
      </div>

      {/* Task Controls */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 mb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                filter === 'all'
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setFilter('todo')}
              className={`px-4 py-2.5 rounded-lg font-medium text-sm flex items-center transition-all ${
                filter === 'todo'
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ClockIcon className="h-4 w-4 mr-2" /> To Do
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-4 py-2.5 rounded-lg font-medium text-sm flex items-center transition-all ${
                filter === 'in_progress'
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ExclamationCircleIcon className="h-4 w-4 mr-2" /> In Progress
            </button>
            <button
              onClick={() => setFilter('done')}
              className={`px-4 py-2.5 rounded-lg font-medium text-sm flex items-center transition-all ${
                filter === 'done'
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <CheckCircleIcon className="h-4 w-4 mr-2" /> Completed
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-11"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-4 top-3" />
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 tracking-tight">Task List</h2>
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-medium text-gray-900 mb-3">No tasks yet</h3>
            <p className="text-gray-600 mb-8 max-w-sm mx-auto">Get started by creating your first task and taking control of your productivity.</p>
            <div className="text-left">
              <button onClick={() => setShowForm(true)} className="bg-yellow-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Task
              </button>
            </div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-medium text-gray-900 mb-3">No tasks match your filters</h3>
            <p className="text-gray-600 max-w-sm mx-auto">Try adjusting your search terms or changing the filter criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map(task => {
              const statusInfo = getStatusBadge(task.status);
              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-6 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all duration-200 cursor-pointer group"
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateStatus(
                          task.id,
                          task.status === 'done' ? 'todo' : task.status === 'in_progress' ? 'done' : 'in_progress'
                        );
                      }}
                      className={`flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        task.status === 'done'
                          ? 'bg-black border-black text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {task.status === 'done' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center">
                        <h3 className={`font-medium ${task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.title}
                        </h3>
                        <span className={`ml-3 px-2.5 py-1 text-xs rounded-full ${statusInfo.color} flex items-center`}>
                          {statusInfo.icon}
                          {statusInfo.text}
                        </span>
                      </div>
                      {task.description && (
                        <p className={`mt-2 text-sm ${task.status === 'done' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {task.description.length > 60 ? `${task.description.substring(0, 60)}...` : task.description}
                        </p>
                      )}
                      {task.due_date && (
                        <div className={`mt-2 flex items-center text-sm ${isOverdue(task.due_date) ? 'text-red-500' : 'text-gray-500'}`}>
                          <CalendarDaysIcon className="h-4 w-4 mr-1" />
                          <span>Due {formatDate(task.due_date)}</span>
                          {isOverdue(task.due_date) && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Overdue
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateStatus(
                          task.id,
                          task.status === 'todo' ? 'in_progress' :
                          task.status === 'in_progress' ? 'done' : 'todo'
                        );
                      }}
                      className="btn-secondary text-xs px-3 py-1.5"
                    >
                      {task.status === 'todo' ? 'Start' :
                       task.status === 'in_progress' ? 'Complete' : 'Reopen'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(task.id);
                      }}
                      className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-medium px-3 py-1.5 rounded-lg border border-red-200 hover:border-red-300 transition-all duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="border-b border-gray-100 p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingEntry ? 'Edit Task' : 'Add New Task'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingEntry(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <TaskForm
                onSubmit={editingEntry ? handleUpdateTask : handleAddTask}
                initialData={editingEntry}
              />
            </div>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gray-50 border-b border-gray-100 p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Task Details</h3>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <p className="text-gray-900 font-medium break-words">{selectedTask.title}</p>
                </div>

                {selectedTask.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <p className="text-gray-600 break-words">{selectedTask.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedTask.status === 'done' ? 'bg-green-100 text-green-800' :
                      selectedTask.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedTask.status === 'todo' ? 'To Do' :
                       selectedTask.status === 'in_progress' ? 'In Progress' :
                       selectedTask.status === 'done' ? 'Completed' : selectedTask.status}
                    </span>
                  </div>

                  {selectedTask.due_date && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                      <p className={`font-medium ${isOverdue(selectedTask.due_date) ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatDate(selectedTask.due_date)}
                        {isOverdue(selectedTask.due_date) && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Overdue
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => {
                    setEditingEntry(selectedTask);
                    setSelectedTask(null);
                    setShowForm(true);
                  }}
                  className="flex-1 btn-secondary"
                >
                  Edit Task
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedTask.id);
                    setSelectedTask(null);
                  }}
                  className="px-4 py-3 border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg font-medium transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Delete Task</h3>
              <p className="text-gray-600 mb-8">Are you sure you want to delete this task? This action cannot be undone.</p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmation({ show: false, id: null })}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200"
                >
                  Delete Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
