import { useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm';
import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon, CalendarDaysIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext.jsx';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';

const TasksPage = () => {
  const { user } = useAuth();
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
    <div className="p-6">
      <div className="content-block mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Task Manager</h1>
            <p className="text-gray-600">Manage your tasks and stay organized.</p>
          </div>
          <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      {/* Add Task Button */}
      <div className="mb-8">
        <button
          onClick={() => {
            setEditingEntry(null);
            setShowForm(true);
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-8 rounded-lg flex items-center transition-colors text-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Task
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-gray-500 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Total Tasks</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">All Tasks:</span>
              <span className="text-gray-700 font-bold text-lg">{tasks.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-blue-500 p-3 rounded-lg">
              <ExclamationCircleIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">In Progress</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active:</span>
              <span className="text-blue-600 font-bold text-lg">{inProgressCount}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 border border-green-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Completed</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Done:</span>
              <span className="text-green-600 font-bold text-lg">{doneCount}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg p-6 border border-red-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-red-500 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Overdue</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Overdue:</span>
              <span className="text-red-600 font-bold text-lg">{overdueCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Task Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex space-x-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All Tasks
            </button>
            <button 
              onClick={() => setFilter('todo')}
              className={`px-4 py-2 rounded-lg flex items-center ${filter === 'todo' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <ClockIcon className="h-4 w-4 mr-1" /> To Do
            </button>
            <button 
              onClick={() => setFilter('in_progress')}
              className={`px-4 py-2 rounded-lg flex items-center ${filter === 'in_progress' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <ExclamationCircleIcon className="h-4 w-4 mr-1" /> In Progress
            </button>
            <button 
              onClick={() => setFilter('done')}
              className={`px-4 py-2 rounded-lg flex items-center ${filter === 'done' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <CheckCircleIcon className="h-4 w-4 mr-1" /> Completed
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks yet</h3>
            <p className="mt-2 text-gray-500">Get started by creating your first task</p>
            <button 
              onClick={() => setShowForm(true)}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Create Task
            </button>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks match your filters</h3>
            <p className="mt-2 text-gray-500">Try changing your search or filter criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map(task => {
              const statusInfo = getStatusBadge(task.status);
              return (
                <div
                  key={task.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex items-start space-x-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateStatus(
                          task.id,
                          task.status === 'done' ? 'todo' : task.status === 'in_progress' ? 'done' : 'in_progress'
                        );
                      }}
                      className={`mt-1 flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                        task.status === 'done'
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300'
                      }`}
                    >
                      {task.status === 'done' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-900">
                          {task.title}
                        </h3>
                        <span className={`ml-3 px-2 py-1 text-xs rounded-full ${statusInfo.color} flex items-center`}>
                          {statusInfo.icon}
                          {statusInfo.text}
                        </span>
                      </div>
                      {task.description && (
                        <p className="mt-1 text-sm text-gray-600">
                          {task.description.length > 20 ? `${task.description.substring(0, 20)}...` : task.description}
                        </p>
                      )}
                      {task.due_date && (
                        <div className={`mt-2 flex items-center text-sm ${isOverdue(task.due_date) ? 'text-red-600' : 'text-gray-500'}`}>
                          <CalendarDaysIcon className="h-4 w-4 mr-1" />
                          <span>
                            Due: {new Date(task.due_date).toLocaleDateString()}
                            {isOverdue(task.due_date) && ' (Overdue)'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateStatus(
                          task.id,
                          task.status === 'todo' ? 'in_progress' :
                          task.status === 'in_progress' ? 'done' : 'todo'
                        );
                      }}
                      className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded-lg transition-colors"
                    >
                      {task.status === 'todo' ? 'Start' :
                       task.status === 'in_progress' ? 'Complete' : 'Reopen'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(task.id);
                      }}
                      className="text-sm bg-red-50 hover:bg-red-100 text-red-600 py-1 px-3 rounded-lg transition-colors"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {editingEntry ? 'Edit Task' : 'Add New Task'}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            {/* Card Header */}
            <div className="bg-indigo-600 rounded-t-2xl p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Task Details</h3>
                <button onClick={() => setSelectedTask(null)} className="text-white hover:text-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Title</p>
                  <p className="font-medium text-lg break-words">{selectedTask.title}</p>
                </div>

                {selectedTask.description && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Description</p>
                    <p className="font-medium break-words">{selectedTask.description}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedTask.status === 'done' ? 'bg-green-100 text-green-800' :
                    selectedTask.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedTask.status}
                  </span>
                </div>

                {selectedTask.due_date && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Due Date</p>
                    <p className={`font-medium ${isOverdue(selectedTask.due_date) ? 'text-red-600' : 'text-gray-900'}`}>
                      {new Date(selectedTask.due_date).toLocaleDateString()}
                      {isOverdue(selectedTask.due_date) && ' (Overdue)'}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex space-x-4">
                <button
                  onClick={() => {
                    setEditingEntry(selectedTask);
                    setSelectedTask(null);
                    setShowForm(true);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedTask.id);
                    setSelectedTask(null);
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mt-4">Delete Task</h3>
              <p className="text-gray-600 mt-2">Are you sure you want to delete this task? This action cannot be undone.</p>

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

export default TasksPage;
