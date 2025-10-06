import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ backgroundColor: '#1f2937', color: 'white', padding: '1rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>LifeHub</div>
            <div style={{ marginLeft: '2.5rem', display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
              <Link to="/" style={{ 
                  padding: '0.5rem 0.75rem', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  borderRadius: '0.375rem',
                  textDecoration: 'none',
                  color: 'white'
                }}>
                Dashboard
              </Link>
              {user && (
                <>
                  <Link to="/finances" style={{ 
                      padding: '0.5rem 0.75rem', 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      borderRadius: '0.375rem',
                      textDecoration: 'none',
                      color: 'white'
                    }}>
                    Finances
                  </Link>
                  <Link to="/moods" style={{ 
                      padding: '0.5rem 0.75rem', 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      borderRadius: '0.375rem',
                      textDecoration: 'none',
                      color: 'white'
                    }}>
                    Moods
                  </Link>
                  <Link to="/tasks" style={{ 
                      padding: '0.5rem 0.75rem', 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      borderRadius: '0.375rem',
                      textDecoration: 'none',
                      color: 'white'
                    }}>
                    Tasks
                  </Link>
                  <Link to="/notes" style={{ 
                      padding: '0.5rem 0.75rem', 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      borderRadius: '0.375rem',
                      textDecoration: 'none',
                      color: 'white'
                    }}>
                    Notes
                  </Link>
                </>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {user ? (
              <button 
                onClick={logout}
                style={{ 
                  marginLeft: '1rem', 
                  backgroundColor: '#dc2626', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '0.375rem', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" style={{ 
                    padding: '0.5rem 0.75rem', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    borderRadius: '0.375rem',
                    textDecoration: 'none',
                    color: '#d1d5db'
                  }}>
                  Login
                </Link>
                <Link to="/register" style={{ 
                    marginLeft: '1rem', 
                    backgroundColor: '#2563eb', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '0.375rem', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    textDecoration: 'none',
                    color: 'white'
                  }}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
