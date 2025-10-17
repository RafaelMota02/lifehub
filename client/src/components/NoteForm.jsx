import { useState, useEffect } from 'react';

const NoteForm = ({ onSubmit, initialData }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
    } else {
      // Reset form when no initial data
      setTitle('');
      setContent('');
      setErrors({});
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Please provide a note title';
    } else if (title.length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    }

    if (!content.trim()) {
      newErrors.content = 'Please provide some content for your note';
    } else if (content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({ title, content });

    // Only reset if not editing
    if (!initialData) {
      setTitle('');
      setContent('');
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Note Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={`input-field ${errors.title ? 'border-red-300' : ''}`}
          placeholder="Give your note a title"
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

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content *
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className={`input-field ${errors.content ? 'border-red-300' : ''}`}
          style={{ minHeight: '240px', resize: 'vertical' }}
          placeholder="Write your thoughts here..."
          maxLength="5000"
          rows="10"
        />
        <div className="flex justify-between items-center mt-1">
          {errors.content && (
            <p className="text-sm text-red-600">{errors.content}</p>
          )}
          <p className="text-sm text-gray-500 ml-auto">
            {content.length}/5000
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          className="btn-primary w-full"
        >
          {initialData ? 'Update Note' : 'Create Note'}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
