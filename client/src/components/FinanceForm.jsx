import { useState } from 'react';

const FinanceForm = ({ onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ 
      amount: parseFloat(amount), 
      type, 
      category, 
      description 
    });
    setAmount('');
    setCategory('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl shadow-xl p-6 mb-8 border border-indigo-100 max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold text-indigo-900 mb-8 pb-4 border-b border-indigo-200">New Financial Entry</h3>
      
      <div className="space-y-6">
          <div className="form-group">
            <label className="block text-sm font-semibold text-indigo-800 mb-3">Amount</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                required
                step="0.01"
                min="0"
                className="input-field pl-12 pr-6 py-3 text-lg font-medium"
                placeholder="0.00"
                inputMode="decimal"
              />
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[10, 20, 50, 100].map(value => (
                <button 
                  key={value}
                  type="button"
                  onClick={() => setAmount((parseFloat(amount || 0) + value).toFixed(2))}
                  className="px-2 py-1 bg-indigo-100 text-indigo-700 font-medium rounded-lg hover:bg-indigo-200 transition-colors text-xs flex items-center justify-center"
                >
                  +{value}
                </button>
              ))}
            </div>
          </div>
          
          {/* Type */}
          <div className="form-group">
            <label className="block text-sm font-semibold text-indigo-800 mb-3">Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex items-center justify-center py-3 px-4 rounded-xl border-2 transition-all ${
                  type === 'income' 
                    ? 'bg-green-50 border-green-400 text-green-700 shadow-sm' 
                    : 'bg-white border-indigo-100 text-gray-600 hover:border-indigo-300'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Income</span>
              </button>
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`flex items-center justify-center py-4 px-4 rounded-xl border-2 transition-all ${
                  type === 'expense' 
                    ? 'bg-red-50 border-red-400 text-red-700 shadow-sm' 
                    : 'bg-white border-indigo-100 text-gray-600 hover:border-indigo-300'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Expense</span>
              </button>
            </div>
          </div>
        
        {/* Category */}
        <div className="form-group">
          <label className="block text-sm font-semibold text-indigo-800 mb-3">Category</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M17 10a7 7 0 11-14 0 7 7 0 0114 0zm-7-3a3 3 0 00-3 3 1 1 0 11-2 0 5 5 0 0110 0 1 1 0 01-2 0 3 3 0 00-3-3z" clipRule="evenodd" />
              </svg>
            </div>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="input-field pl-12 pr-6 py-3"
            >
              <option value="">Select category</option>
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
          </div>
        </div>
        
        {/* Description */}
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
              className="input-field w-full min-h-[100px] pl-12 pr-10"
              placeholder="Transaction details..."
              maxLength="200"
            />
            <div className="absolute right-3 bottom-3 flex items-center">
              <span className="text-xs font-medium text-indigo-500 bg-white px-2 py-1 rounded">
                {description.length}/200
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-indigo-100">
        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-md"
        >
          Add Financial Entry
        </button>
      </div>
    </form>
  );
};

export default FinanceForm;
