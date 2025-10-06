import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { useAuth } from './context/AuthContext.jsx';
import DashboardPage from './pages/DashboardPage';
import FinancesPage from './pages/FinancesPage';
import MoodsPage from './pages/MoodsPage';
import TasksPage from './pages/TasksPage';
import NotesPage from './pages/NotesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './components/Layout';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>;
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route 
            path="/" 
            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} 
          />
          <Route 
            path="/finances" 
            element={<ProtectedRoute><FinancesPage /></ProtectedRoute>} 
          />
          <Route 
            path="/moods" 
            element={<ProtectedRoute><MoodsPage /></ProtectedRoute>} 
          />
          <Route 
            path="/tasks" 
            element={<ProtectedRoute><TasksPage /></ProtectedRoute>} 
          />
          <Route 
            path="/notes" 
            element={<ProtectedRoute><NotesPage /></ProtectedRoute>} 
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
