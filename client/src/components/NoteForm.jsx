import { useState } from 'react';

const NoteForm = ({ onSubmit, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content });
    if (!initialData) {
      setTitle('');
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl shadow-xl p-6 mb-8 border border-indigo-100 max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold text-indigo-900 mb-8 pb-4 border-b border-indigo-200">
        {initialData ? 'Edit Note' : 'Create Note'}
      </h3>
      
      <div className="space-y-6">
        <div className="form-group">
          <label className="block text-sm font-semibold text-indigo-800 mb-3">Title</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </div>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required
              className="input-field pl-12 pr-6 py-4"
              placeholder="Note title"
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
          <label className="block text-sm font-semibold text-indigo-800 mb-3">Content</label>
          <div className="relative">
            <div className="absolute top-4 left-4 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              required
              className="input-field w-full min-h-[220px] pl-12 pr-10"
              placeholder="Write your note here..."
              maxLength="5000"
            />
            <div className="absolute right-3 bottom-3 flex items-center">
              <span className="text-xs font-medium text-indigo-500 bg-white px-2 py-1 rounded">
                {content.length}/5000
              </span>
            </div>
          </div>
        </div>
      
        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-5 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          {initialData ? 'Update Note' : 'Create Note'}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
