import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useState } from 'react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="nav-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold tracking-tight transition-colors">
              <span className="text-primary-700 hover:text-primary-800">Life</span><span className="text-emerald-700 hover:text-emerald-800">Hub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-white hover:bg-gray-900 transition-all hover:shadow-sm"
            >
              Dashboard
            </Link>
            {user && (
              <>
                <Link
                  to="/finances"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-all hover:shadow-sm"
                >
                  Finances
                </Link>
                <Link
                  to="/moods"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-all hover:shadow-sm"
                >
                  Moods
                </Link>
                <Link
                  to="/tasks"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-yellow-700 hover:bg-yellow-50 transition-all hover:shadow-sm"
                >
                  Tasks
                </Link>
                <Link
                  to="/notes"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-violet-700 hover:bg-violet-50 transition-all hover:shadow-sm"
                >
                  Notes
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Link
                  to="/settings"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-black hover:bg-red-600 transition-all shadow-sm hover:shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-black hover:bg-gray-800 transition-all shadow-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-black hover:bg-gray-50 transition-all"
            >
              <svg
                className={`block h-6 w-6 transition-transform ${isMenuOpen ? 'rotate-45' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link
              to="/dashboard"
              className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-white hover:bg-gray-900 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            {user && (
              <>
                <Link
                  to="/finances"
                  className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Finances
                </Link>
                <Link
                  to="/moods"
                  className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Moods
                </Link>
                <Link
                  to="/tasks"
                  className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-yellow-700 hover:bg-yellow-50 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tasks
                </Link>
                <Link
                  to="/notes"
                  className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-violet-700 hover:bg-violet-50 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Notes
                </Link>
              </>
            )}
          </div>

          {/* Auth buttons mobile */}
          <div className="pt-4 pb-6 border-t border-gray-100">
            <div className="px-4">
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 rounded-lg text-base font-medium text-white bg-black hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="block w-full text-center px-4 py-3 rounded-lg text-base font-medium text-white bg-black hover:bg-gray-800 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center px-4 py-3 rounded-lg text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
