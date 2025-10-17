import React, { useState, useEffect } from 'react';

const MotivationalQuote = () => {
  const quotes = [
    {
      text: "The journey of a thousand miles begins with a single step.",
      author: "Lao Tzu"
    },
    {
      text: "Small daily improvements lead to stunning results.",
      author: "Robin Sharma"
    },
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    },
    {
      text: "Track your progress, celebrate your growth.",
      author: "LifeHub"
    },
    {
      text: "Every expert was once a beginner.",
      author: "Helen Hayes"
    },
    {
      text: "Today's small actions are tomorrow's big achievements.",
      author: "LifeHub"
    },
    {
      text: "Progress is impossible without change, and those who cannot change their minds cannot change anything.",
      author: "George Bernard Shaw"
    },
    {
      text: "Your future self will thank you for what you're doing today.",
      author: "LifeHub"
    }
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    // Change quote every 30 seconds
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 30000);

    return () => clearInterval(interval);
  }, [quotes.length]);

  const currentQuote = quotes[currentQuoteIndex];

  return (
    <div className="card bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">💭</span>
        </div>
        <div className="flex-1">
          <blockquote className="text-lg font-medium text-gray-900 mb-2 leading-relaxed">
            "{currentQuote.text}"
          </blockquote>
          <cite className="text-sm text-indigo-600 font-medium">
            — {currentQuote.author}
          </cite>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          Changes every 30 seconds
        </div>
        <div className="flex space-x-1">
          {quotes.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentQuoteIndex ? 'bg-indigo-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MotivationalQuote;
