import { useState, useEffect } from 'react';

const TaskForm = ({ onSubmit, initialData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [due_date, setDue_date] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setStatus(initialData.status || 'todo');
      setDue_date(initialData.due_date || '');
    } else {
      // Reset form when no initial data
      setTitle('');
      setDescription('');
      setStatus('todo');
      setDue_date('');
      setErrors({});
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Please provide a task title';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (description && description.length > 200) {
      newErrors.description = 'Description cannot exceed 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({ title, description, status, due_date });

    // Only reset if not editing
    if (!initialData) {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setDue_date('');
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Task Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={`input-field ${errors.title ? 'border-red-300' : ''}`}
          placeholder="What needs to be done?"
          maxLength="100"
        />
        <div className="flex justify-between items-center mt-1">
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title}</p>
          )}
          <p className="text-sm text-gray-500 ml-auto">
            {title.length}/100
          </p>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field placeholder-opacity-50"  style={{ minHeight: '120px', resize: 'vertical' }}
          placeholder="Add optional details about this task..."
          maxLength="200"
          rows="4"
        />
        <div className="flex justify-between items-center mt-1">
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description}</p>
          )}
          <p className="text-sm text-gray-500 ml-auto">
            {description.length}/200
          </p>
        </div>
      </div>

      {/* Status and Due Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-field"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          <input
            type="date"
            value={due_date}
            onChange={(e) => setDue_date(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          className="btn-primary w-full"
        >
          {initialData ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
