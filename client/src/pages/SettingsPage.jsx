import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';

const SettingsPage = () => {
  const { user, logout, updateProfile } = useContext(AuthContext);
  const {
    theme,
    language,
    timezone,
    notifications,
    updateSetting,
    resetSettings
  } = useSettings();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    feedbackType: 'general',
    feedbackSubject: '',
    feedbackMessage: '',
    feedbackPriority: 'normal',
    includeContact: true
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleResetSettings = () => {
    // Reset all settings to defaults using the context
    resetSettings();
    showMessage('Settings reset to defaults', false);
    setShowResetModal(false);
  };

  const showMessage = (message, isError = false) => {
    if (isError) {
      setError(message);
      setSuccess('');
    } else {
      setSuccess(message);
      setError('');
    }
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 5000);
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await updateProfile(formData.username, formData.email);
      if (result.success) {
        showMessage('Profile updated successfully', false);
        setShowProfileModal(false);
        setFormData(prev => ({ ...prev, currentPassword: '', confirmPassword: '' }));
      } else {
        showMessage(result.error, true);
      }
    } catch {
      showMessage('Failed to update profile', true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      showMessage('New passwords do not match', true);
      return;
    }

    if (formData.newPassword.length < 6) {
      showMessage('Password must be at least 6 characters', true);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const url = import.meta.env.PROD
        ? 'https://lifehub-production.up.railway.app/api/settings/password'
        : 'http://localhost:5000/api/settings/password';

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      showMessage('Password updated successfully', false);
      setShowPasswordModal(false);
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      showMessage(err.message || 'Failed to update password', true);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const url = import.meta.env.PROD
        ? 'https://lifehub-production.up.railway.app/api/settings/export'
        : 'http://localhost:5000/api/settings/export';

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      const data = await response.blob();
      const urlBlob = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = urlBlob;
      a.download = 'lifehub-data.json';
      a.click();
      window.URL.revokeObjectURL(urlBlob);
      showMessage('Data exported successfully', false);
    } catch (err) {
      showMessage(err.message || 'Failed to update profile', true);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const url = import.meta.env.PROD
        ? 'https://lifehub-production.up.railway.app/api/settings/account'
        : 'http://localhost:5000/api/settings/account';

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete account');
      }

      logout();
    } catch (error) {
      console.error('Error deleting account:', error);
      showMessage('Failed to delete account', true);
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!formData.feedbackSubject.trim() || !formData.feedbackMessage.trim()) {
      showMessage('Please fill in both subject and message', true);
      return;
    }
    if (formData.feedbackMessage.length < 10) {
      showMessage('Message must be at least 10 characters long', true);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const url = import.meta.env.PROD
        ? 'https://lifehub-production.up.railway.app/api/settings/feedback'
        : 'http://localhost:5000/api/settings/feedback';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: formData.feedbackSubject,
          message: formData.feedbackMessage,
          type: formData.feedbackType,
          priority: formData.feedbackPriority,
          includeContact: formData.includeContact
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      showMessage('Feedback submitted successfully! Thank you for helping us improve.', false);
      setShowFeedbackModal(false);
      setFormData(prev => ({ ...prev, feedbackSubject: '', feedbackMessage: '', feedbackType: 'general', feedbackPriority: 'normal', includeContact: true }));
    } catch (err) {
      showMessage(err.message || 'Failed to submit feedback', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <div className="mb-2">
        <div className="flex items-center mb-6">
          <h1 className="text-4xl font-semibold text-gray-900 tracking-tight flex-1">Settings</h1>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-500 rounded-lg text-gray-700 hover:text-gray-900 dark:hover:text-slate-100 transition-colors ml-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>
        <p className="text-gray-600 text-lg leading-relaxed">Manage your account preferences and application settings.</p>
      </div>
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">

          {/* Status Messages */}
          {(error || success) && (
            <div className={`p-4 rounded-lg border ${error ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'}`}>
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${error ? 'text-red-400' : 'text-green-400'}`}>
                  {error ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${error ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'}`}>
                    {error || success}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Account Settings */}
          <div className="bg-white dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-slate-700 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-slate-100">Account Settings</h2>
                  <p className="text-sm text-gray-600 dark:text-slate-300">Manage your account information</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Username</label>
                  <p className="text-sm text-gray-600 dark:text-slate-400">{user?.username || 'Not logged in'}</p>
                </div>
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="ml-4 inline-flex items-center px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-300 dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                >
                  Edit
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Email</label>
                  <p className="text-sm text-gray-600 dark:text-slate-400">{user?.email || 'Not logged in'}</p>
                </div>
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="ml-4 inline-flex items-center px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-300 dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                >
                  Edit
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Password
                  </label>
                  <p className="text-sm text-gray-600 dark:text-slate-400">••••••••</p>
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="ml-4 inline-flex items-center px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-300 dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                >
                  Change
                </button>
              </div>
              <div className="border-t border-gray-200 dark:border-slate-600 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Email Notifications</label>
                    <p className="text-sm text-gray-600 dark:text-slate-400">Receive updates about your tasks and progress</p>
                  </div>
                  <button
                    onClick={() => updateSetting('notifications', !notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-slate-200 transition-transform ${
                        notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-slate-700 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.947c-1.177-.489-2.44.093-2.58 1.416a1.532 1.532 0 01-1.594 1.464c-1.56-.076-2.492 1.635-1.562 2.779.236.37.552.673.937 1.028l1.221 1.062c1.505 1.309 2.748 2.566 3.878 3.847l1.07 1.209c.724.873 2.165.873 2.89 0l1.07-1.209c1.13-1.281 2.373-2.538 3.878-3.847l1.221-1.062c.385-.355.701-.658.937-1.028.93-1.144-.002-2.855-1.562-2.78a1.532 1.532 0 01-1.594-1.464c-.14-1.323-1.403-1.905-2.58-1.416a1.532 1.532 0 01-2.286-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-slate-100">Preferences</h2>
                  <p className="text-sm text-gray-600 dark:text-slate-300">Customize your experience</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
                    </svg>
                    Theme
                  </label>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Choose your preferred theme</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Coming soon</p>
                </div>
                <select
                  value={theme}
                  disabled
                  className="border border-gray-300 dark:border-slate-500 dark:bg-slate-600 dark:text-slate-400 rounded-lg px-3 py-2 text-sm opacity-50 cursor-not-allowed"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 5a3 3 0 011.93-.75l1.526-.91c.862-.514 1.944-.01 2.456.852l.187.945a1 1 0 001.917-.075l1.527.912A3 3 0 0117 5v14h6a1 1 0 010-2H1a1 1 0 010 2h4V9a2 2 0 014 0v10h2V7a1 1 0 112 0v8h2V5a1 1 0 012 0v13h4V5z" clipRule="evenodd" />
                    </svg>
                    Language
                  </label>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Select your preferred language</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Coming soon</p>
                </div>
                <select
                  value={language}
                  disabled
                  className="border border-gray-300 dark:border-slate-500 dark:bg-slate-600 dark:text-slate-400 rounded-lg px-3 py-2 text-sm opacity-50 cursor-not-allowed"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="pt">Português</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Timezone
                  </label>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Set your timezone for reminders</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Coming soon</p>
                </div>
                <select
                  value={timezone}
                  disabled
                  className="border border-gray-300 dark:border-slate-500 dark:bg-slate-600 dark:text-slate-400 rounded-lg px-3 py-2 text-sm opacity-50 cursor-not-allowed"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Standard Time</option>
                  <option value="PST">Pacific Standard Time</option>
                  <option value="CET">Central European Time</option>
                  <option value="GMT">Greenwich Mean Time</option>
                  <option value="IST">Indian Standard Time</option>
                </select>
              </div>

              <div className="border-t border-gray-200 dark:border-slate-600 pt-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <button
                      onClick={() => setShowResetModal(true)}
                      className="text-sm text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 font-medium"
                    >
                      Reset Settings
                    </button>
                    <p className="text-sm text-gray-600 dark:text-slate-400">Reset all preferences to defaults</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data & Privacy */}
          <div className="bg-white dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-slate-700 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.355.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-slate-100">Data & Privacy</h2>
                  <p className="text-sm text-gray-600 dark:text-slate-300">Control your data and privacy settings</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414L7.707 11.293a1 1 0 00-1.414 0L5 12.586V5a1 1 0 00-2 0v8.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 000-1.4z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <button
                    onClick={handleExportData}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                  >
                    Export Your Data
                  </button>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Download all your data as a JSON file</p>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-slate-600 pt-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
                    >
                      Delete Account
                    </button>
                    <p className="text-sm text-gray-600 dark:text-slate-400">Permanently delete your account and all data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Support & Feedback */}
          <div className="bg-white dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-slate-700 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 012 0z" clipRule="evenodd" />
                </svg>
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-slate-100">Support & Feedback</h2>
                  <p className="text-sm text-gray-600 dark:text-slate-300">Get help and share your thoughts</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-slate-100">Contact Support</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Have questions or need assistance? We're here to help.</p>
                  <a
                    href="mailto:dwayceprdc@gmail.com"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mt-1 inline-block"
                  >
                    dwayceprdc@gmail.com
                  </a>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-slate-600 pt-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-slate-100">Share Feedback</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400">Help us improve by sharing your thoughts and suggestions.</p>
                    <button
                      onClick={() => setShowFeedbackModal(true)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium mt-1"
                    >
                      Submit Feedback
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-white dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-slate-700 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-slate-100">About</h2>
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    LifeHub v1.0.0 - Your personal life management platform.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">
                    Built for productivity and wellness
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-slate-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>Last updated: Today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md mx-4 p-6 border dark:border-slate-600">
            <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">Edit Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-slate-400 hover:text-gray-800 hover:dark:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleUpdateProfile}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md mx-4 p-6 border dark:border-slate-600">
            <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Current Password</label>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">New Password</label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-slate-400 hover:text-gray-800 hover:dark:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleUpdatePassword}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md mx-4 p-6 border dark:border-slate-600">
            <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">Delete Account</h3>
            <div className="space-y-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-800 dark:text-red-200">
                    This action cannot be undone. All your data will be permanently deleted.
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-300">
                Are you sure you want to delete your account? This will remove all your tasks, finances, moods, notes, and achievements.
              </p>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-slate-400 hover:text-gray-800 hover:dark:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Settings Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md mx-4 p-6 border dark:border-slate-600">
            <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">Reset Settings</h3>
            <div className="space-y-4">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    This will reset all your preferences to their default values.
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-300">
                Are you sure you want to reset all settings? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-slate-400 hover:text-gray-800 hover:dark:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetSettings}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Reset Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-2xl mx-4 p-6 border dark:border-slate-600 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">Submit Feedback</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-6">Help us improve LifeHub by sharing your thoughts and suggestions.</p>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Feedback Type</label>
                  <select
                    value={formData.feedbackType}
                    onChange={(e) => setFormData(prev => ({ ...prev, feedbackType: e.target.value }))}
                    className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="general">General Feedback</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="ui">UI/UX Suggestion</option>
                    <option value="performance">Performance Issue</option>
                    <option value="help">Help/Support</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Priority</label>
                  <select
                    value={formData.feedbackPriority}
                    onChange={(e) => setFormData(prev => ({ ...prev, feedbackPriority: e.target.value }))}
                    className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={formData.feedbackSubject}
                  onChange={(e) => setFormData(prev => ({ ...prev, feedbackSubject: e.target.value }))}
                  className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of your feedback"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Message</label>
                <textarea
                  value={formData.feedbackMessage}
                  onChange={(e) => setFormData(prev => ({ ...prev, feedbackMessage: e.target.value }))}
                  rows={8}
                  className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Please provide detailed information. What were you doing when you experienced the issue? What should be happening instead? Include any error messages or screenshots if applicable."
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeContact"
                  checked={formData.includeContact}
                  onChange={(e) => setFormData(prev => ({ ...prev, includeContact: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="includeContact" className="text-sm text-gray-700 dark:text-slate-300">
                  Include my contact information for follow-up
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-slate-400 hover:text-gray-800 hover:dark:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleSubmitFeedback}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
