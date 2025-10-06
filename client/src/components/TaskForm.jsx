import { useState } from 'react';

const TaskForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, status, dueDate });
    setTitle('');
    setDescription('');
    setStatus('todo');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl shadow-xl p-6 mb-8 border border-indigo-100 max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold text-indigo-900 mb-8 pb-4 border-b border-indigo-200">Add New Task</h3>
      
      <div className="space-y-6">
        <div className="form-group">
          <label className="block text-sm font-semibold text-indigo-800 mb-3">Title</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required
              className="input-field pl-12 pr-6 py-4"
              placeholder="Task title"
              maxLength="100"
            />
            <div className="absolute right-3 top-3.5 flex items-center">
              <span className="text-xs font-medium text-indigo-500 bg-white px-2 py-1 rounded">
                {title.length}/100
              </span>
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-semibold text-indigo-800 mb-3">Description</label>
          <div className="relative">
            <div className="absolute top-4 left-4 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="input-field w-full min-h-[120px] pl-12 pr-10"
              placeholder="Task details"
              maxLength="200"
            />
            <div className="absolute right-3 bottom-3 flex items-center">
              <span className="text-xs font-medium text-indigo-500 bg-white px-2 py-1 rounded">
                {description.length}/200
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-sm font-semibold text-indigo-800 mb-3">Status</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="input-field pl-12 pr-6 py-4"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-semibold text-indigo-800 mb-3">Due Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <input 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
                className="input-field pl-12 pr-6 py-4"
              />
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-5 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          Add Task
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
