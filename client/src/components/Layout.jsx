import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navigation from './Navigation';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navigation />
      <main className="flex-1">
        <div className="page-container">
          <Outlet />
        </div>
      </main>
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
              <p className="text-gray-500 text-xs">
                &copy; {new Date().getFullYear()} LifeHub. Crafted with precision.
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

            {/* Account */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Account</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/settings" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                    Settings
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
