import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

// 🔴 THE FIX: Changed 'Login' to 'AuthPage' to match your actual file name!
import AuthPage from './pages/AuthPage'; 
import Dashboard from './pages/DashboardPage'; 

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('App Error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', backgroundColor: '#0F172A', color: '#fff', fontFamily: 'Arial', padding: '20px', textAlign: 'center' }}>
          <h1>⚠️ Error Loading Application</h1>
          <p style={{ marginTop: '10px', marginBottom: '20px', maxWidth: '400px' }}>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#06b6d4', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
            Reload Page
          </button>
          <details style={{ marginTop: '30px', textAlign: 'left', fontSize: '12px', color: '#999', maxWidth: '600px' }}>
            <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>Stack Trace</summary>
            <pre style={{ backgroundColor: '#1a1a2e', padding: '10px', borderRadius: '4px', overflow: 'auto', maxHeight: '200px' }}>
              {this.state.error?.stack}
            </pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, error } = useAuth0();

  if (isLoading) {
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F172A', color: '#06b6d4', fontFamily: 'Arial', fontSize: '18px' }}>🔄 Loading...</div>;
  }

  if (error) {
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F172A', color: '#ff6b6b', fontFamily: 'Arial', fontSize: '16px', padding: '20px', textAlign: 'center' }}>⚠️ Auth Error: {error.message}</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

// Component to handle Auth0 redirect
function AuthRedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, isAuthenticated } = useAuth0();

  useEffect(() => {
    // Check if we're on the root path (Auth0 redirect) and authenticated
    if (!isLoading && isAuthenticated && location.pathname === '/') {
      console.log('✅ User authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [isLoading, isAuthenticated, navigate, location.pathname]);

  return null;
}

function AppContent() {
  return (
    <>
      <AuthRedirectHandler />
      <Routes>
        {/* Route 1: The Public Login Page */}
        <Route path="/" element={<AuthPage />} />

        {/* Route 2: The Locked Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;