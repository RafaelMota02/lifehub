import { useState } from 'react';

const MoodForm = ({ onSubmit }) => {
  const [moodLevel, setMoodLevel] = useState(5);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (notes && notes.length > 200) {
      newErrors.notes = 'Notes cannot exceed 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ moodLevel, date, notes });
      // Don't reset form - user might want same date
      setNotes('');
      setErrors({});
    } catch (error) {
      console.error('Error submitting mood:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getMoodDescription = (level) => {
    switch (level) {
      case 1: case 2: return 'Very Bad';
      case 3: case 4: return 'Bad';
      case 5: case 6: return 'Neutral';
      case 7: case 8: return 'Good';
      case 9: case 10: return 'Excellent';
      default: return '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mood Level Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          How are you feeling? (1-10) *
        </label>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-red-500 font-medium">Worst (1)</span>
            <span className="text-sm text-green-600 font-medium">Best (10)</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={moodLevel}
            onChange={(e) => setMoodLevel(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #ef4444 0%, #f59e0b ${(moodLevel-1)/9*100}%, #10b981 ${(moodLevel-1)/9*100}%, #10b981 100%)`
            }}
          />
          <div className="text-center mt-4">
            <div className="inline-flex items-center space-x-2">
              <span className="text-3xl font-bold text-gray-800">{moodLevel}</span>
              <span className="text-lg text-gray-600">-</span>
              <span className={`text-lg font-medium ${
                moodLevel >= 8 ? 'text-green-600' : moodLevel >= 6 ? 'text-blue-600' : moodLevel >= 4 ? 'text-yellow-600' : moodLevel >= 2 ? 'text-orange-600' : 'text-red-600'
              }`}>
                {getMoodDescription(moodLevel)}
              </span>
            </div>
          </div>
        </div>


      </div>

      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-field"
          max={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={`input-field ${errors.notes ? 'border-red-300' : ''}`}
          style={{ minHeight: '120px', resize: 'vertical' }}
          placeholder="What's influencing your mood today?"
          maxLength="200"
          rows="4"
        />
        <div className="flex justify-between items-center mt-1">
          {errors.notes && (
            <p className="text-sm text-red-600">{errors.notes}</p>
          )}
          <p className="text-sm text-gray-500 ml-auto">
            {notes.length}/200
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full flex items-center justify-center disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            'Log Mood Entry'
          )}
        </button>
      </div>
    </form>
  );
};

export default MoodForm;
