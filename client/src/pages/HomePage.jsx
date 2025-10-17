import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Silk from '../components/Silk';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main>
        {/* Hero Section */}
        <section className="relative py-32 sm:py-63 hero-gradient overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Silk
              speed={5}
              scale={1}
              color="#3DAC2B"
              noiseIntensity={0}
              rotation={0}
            />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-5xl sm:text-7xl font-medium text-white mb-8 tracking-tight drop-shadow-lg leading-tight animate-fade-in-up">
Master Your Day,<br />
              <span className="text-yellow-300 bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">Elevate Your Life</span>
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto drop-shadow-md font-light">
              A vibrant platform for tasks, finances, notes, and mood tracking that brings <span className="text-yellow-200 font-medium">clarity and focus</span> to your daily routine.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 bg-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                Get Started Free
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                Sign In
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight animate-fade-in-up">
                Everything You Need in One Place
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Streamline your daily workflow with our integrated suite of tools designed for modern life management.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Tasks */}
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-yellow-100 hover:border-yellow-200 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-yellow-800">Smart Tasks</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Stay organized with intelligent task management. Set priorities, track progress, and never miss a deadline again.
                </p>
              </div>

              {/* Finances */}
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-emerald-100 hover:border-emerald-200 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-800">Financial Insight</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Take control of your finances with detailed expense tracking, budgeting tools, and insightful analytics.
                </p>
              </div>

              {/* Notes */}
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-200 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-purple-800">Intuitive Notes</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Capture your thoughts and ideas in a clean, distraction-free environment that syncs everywhere.
                </p>
              </div>

              {/* Moods */}
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 hover:border-blue-200 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-blue-800">Mood Tracking</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Monitor your emotional well-being with daily mood tracking and pattern recognition for better self-awareness.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-32 bg-gradient-to-r from-white via-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight animate-fade-in-up">
                Built for the Digital Age
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Experience the peace of mind that comes with a thoughtfully designed platform that works for you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="text-center group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="relative w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white absolute inset-0 m-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Blazing performance and instant interactions that keep you focused and productive.
                </p>
              </div>

              <div className="text-center group animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="relative w-20 h-20 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white absolute inset-0 m-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure & Private</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Your data is safely encrypted and handled with privacy-first design principles.
                </p>
              </div>

              <div className="text-center group animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <div className="relative w-20 h-20 bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white absolute inset-0 m-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Always Accessible</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Email synchronization and offline capabilities ensure you can access your data anywhere, anytime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 border-t" style={{ backgroundColor: '#3DAC2B' }}>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-5xl font-bold text-white mb-6 tracking-tight animate-fade-in-up">
              Start Organizing Your Life Today
            </h2>
            <p className="text-xl text-gray-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              Take control of your productivity and unleash your potential with LifeHub.
              Your journey to better habits starts here.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/register" className="inline-flex items-center justify-center px-10 py-4 bg-white text-green-600 font-bold rounded-xl shadow-2xl hover:scale-105 transition-all duration-300 transform hover:shadow-xl">
                Get Started Free
                <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center px-10 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-green-600 transition-all duration-300">
                Sign In
                <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 mt-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="mb-4">
                <h3 className="text-lg font-semibold tracking-tight">
                  <span className="text-primary-700">Life</span><span className="text-emerald-700">Hub</span>
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Your comprehensive life management platform. Track finances, monitor moods, organize tasks, and capture notes all in one place.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Access</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/finances" className="text-gray-600 hover:text-emerald-700 text-sm transition-colors">
                    Finances
                  </Link>
                </li>
                <li>
                  <Link to="/moods" className="text-gray-600 hover:text-blue-700 text-sm transition-colors">
                    Moods
                  </Link>
                </li>
                <li>
                  <Link to="/tasks" className="text-gray-600 hover:text-yellow-700 text-sm transition-colors">
                    Tasks
                  </Link>
                </li>
                <li>
                  <Link to="/notes" className="text-gray-600 hover:text-violet-700 text-sm transition-colors">
                    Notes
                  </Link>
                </li>
              </ul>
            </div>

            {/* Get Started */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Get Started</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/register" className="text-gray-600 hover:text-emerald-700 text-sm transition-colors">
                    Sign Up Free
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} LifeHub. Crafted with precision.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
