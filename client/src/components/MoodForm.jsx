import { useState } from 'react';

const MoodForm = ({ onSubmit }) => {
  const [moodLevel, setMoodLevel] = useState(5);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  });
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ moodLevel, date, notes });
      setMoodLevel(5);
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    } catch {
      // Error is handled by parent component
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl shadow-xl p-6 mb-8 border border-indigo-100 max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold text-indigo-900 mb-8 pb-4 border-b border-indigo-200">Track Your Mood</h3>
      
      <div className="space-y-6">
        <div className="form-group">
          <label className="block text-sm font-semibold text-indigo-800 mb-3">
            How are you feeling today? (1-10)
          </label>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Worst</span>
            <span className="text-sm text-gray-500">Best</span>
          </div>
          
          <div className="grid grid-cols-10 gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
              <div key={level} className="flex justify-center">
                <input
                  type="radio"
                  id={`mood-${level}`}
                  name="moodLevel"
                  value={level}
                  checked={moodLevel === level}
                  onChange={() => setMoodLevel(level)}
                  className="sr-only"
                />
                <label
                  htmlFor={`mood-${level}`}
                  className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-all text-sm ${
                    moodLevel === level
                      ? 'bg-indigo-600 text-white shadow-md transform scale-110'
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  }`}
                >
                  {level}
                </label>
              </div>
            ))}
          </div>
        <div className="form-group">
          <label className="block text-sm font-semibold text-indigo-800 mb-3">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            max={new Date().toISOString().split('T')[0]}
          />
          </div>
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-semibold text-indigo-800 mb-3">Notes about your mood</label>
          <div className="relative">
            <div className="absolute top-4 left-4 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field w-full min-h-[120px] pl-12 pr-10"
              placeholder="What's influencing your mood today?"
              maxLength="200"
            />
            <div className="absolute right-3 bottom-3 flex items-center">
              <span className="text-xs font-medium text-indigo-500 bg-white px-2 py-1 rounded">
                {notes.length}/200
              </span>
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={submitting}
          className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-5 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {submitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : 'Save Mood Entry'}
        </button>
      </div>
    </form>
  );
};

export default MoodForm;
