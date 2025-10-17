import { useState } from 'react';

const FinanceForm = ({ onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    if (!description.trim()) {
      newErrors.description = 'Please provide a description';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      amount: parseFloat(amount),
      type,
      category,
      description
    });

    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount *
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            step="0.01"
            min="0.01"
            className={`input-field pl-12 ${errors.amount ? 'border-red-300' : ''}`}
            placeholder="0.00"
            inputMode="decimal"
          />
        </div>
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
        )}

        {/* Quick amount buttons */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          {[10, 20, 50, 100].map((value, index) => {
            const colors = [
              'bg-accent-lime hover:bg-lime-400 text-lime-900',
              'bg-accent-yellow hover:bg-yellow-400 text-yellow-900',
              'bg-accent-pink hover:bg-pink-400 text-pink-900',
              'bg-accent-indigo hover:bg-indigo-400 text-indigo-900'
            ];
            return (
              <button
                key={value}
                type="button"
                onClick={() => setAmount((parseFloat(amount || 0) + value).toFixed(2))}
                className={`px-3 py-2 font-medium rounded-lg transition-all text-sm shadow-sm hover:shadow-md ${colors[index]}`}
              >
                +${value}
              </button>
            );
          })}
        </div>
      </div>

      {/* Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Transaction Type *
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setType('income')}
            className={`btn-radio ${type === 'income' ? 'btn-radio-active' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            Income
          </button>
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`btn-radio ${type === 'expense' ? 'btn-radio-active' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-coral-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Expense
          </button>
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`input-field ${errors.category ? 'border-red-300' : ''}`}
        >
          <option value="">Choose a category</option>
          <option value="Salary">Salary</option>
          <option value="Freelance">Freelance</option>
          <option value="Investment">Investment</option>
          <option value="Rent">Rent</option>
          <option value="Utilities">Utilities</option>
          <option value="Groceries">Groceries</option>
          <option value="Dining">Dining</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Travel">Travel</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Education">Education</option>
          <option value="Other">Other</option>
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`input-field ${errors.description ? 'border-red-300' : ''}`}
          placeholder="Describe this transaction..."
          maxLength="200"
          rows="3"
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

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          className="btn-primary w-full"
        >
          Add Transaction
        </button>
      </div>
    </form>
  );
};

export default FinanceForm;
