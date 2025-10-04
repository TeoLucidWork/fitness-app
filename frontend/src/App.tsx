import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { ProgramBuilder } from './components/ProgramBuilder';
import { ProgramList } from './components/ProgramList';
import { ExerciseBuilder } from './components/ExerciseBuilder';
import { ClientBuilder } from './components/ClientBuilder';
import { ClientList } from './components/ClientList';
import { ClientDetail } from './components/ClientDetail';
import { RegistrationLinks } from './components/RegistrationLinks';
import { ClientProgramView } from './components/ClientProgramView';
import { WeightTracking } from './components/WeightTracking';
import { authService } from './services/authService';
import { ViewType } from './types/component.types';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

// Protected Route component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          await authService.getProfile();
          setIsAuthenticated(true);
        } catch (error) {
          authService.logout();
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        Зареждане...
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Router-aware component wrappers
const LoginWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  const handleSwitchToRegister = () => {
    navigate('/register');
  };

  return (
    <Login
      onSuccess={handleLoginSuccess}
      onSwitchToRegister={handleSwitchToRegister}
    />
  );
};

const RegisterWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    navigate('/dashboard');
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  return (
    <Register
      onSuccess={handleRegisterSuccess}
      onSwitchToLogin={handleSwitchToLogin}
    />
  );
};

const ProgramListWrapper: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ProgramList
      onNavigateBack={() => navigate('/dashboard')}
      onCreateProgram={() => navigate('/program-builder')}
      onEditProgram={(programId) => navigate(`/program-builder/${programId}`)}
      onViewProgram={(programId) => navigate(`/programs/${programId}`)}
    />
  );
};

const ProgramBuilderWrapper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const programId = pathParts[pathParts.length - 1] !== 'program-builder' ? parseInt(pathParts[pathParts.length - 1]) : undefined;

  return (
    <ProgramBuilder
      programId={programId}
      onNavigateBack={() => navigate('/programs')}
      onProgramSaved={() => navigate('/programs')}
    />
  );
};

const ExerciseBuilderWrapper: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ExerciseBuilder
      onNavigateBack={() => navigate('/dashboard')}
      onExerciseSaved={() => navigate('/dashboard')}
    />
  );
};

const ClientBuilderWrapper: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ClientBuilder
      onNavigateBack={() => navigate('/client-list')}
      onClientSaved={() => navigate('/client-list')}
    />
  );
};

const ClientListWrapper: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ClientList
      onNavigateBack={() => navigate('/dashboard')}
      onCreateClient={() => navigate('/client-builder')}
      onViewClient={(clientId) => navigate(`/client/${clientId}`)}
    />
  );
};

const RegistrationLinksWrapper: React.FC = () => {
  const navigate = useNavigate();

  return (
    <RegistrationLinks
      onNavigateBack={() => navigate('/dashboard')}
    />
  );
};

const ClientProgramViewWrapper: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ClientProgramView
      onNavigateBack={() => navigate('/dashboard')}
    />
  );
};

const WeightTrackingWrapper: React.FC = () => {
  const navigate = useNavigate();

  return (
    <WeightTracking
      onNavigateBack={() => navigate('/dashboard')}
    />
  );
};

const ClientDetailWrapper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const clientId = parseInt(pathParts[pathParts.length - 1]);

  return (
    <ClientDetail
      clientId={clientId}
      onNavigateBack={() => navigate('/client-list')}
    />
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginWrapper />} />
          <Route path="/register" element={<RegisterWrapper />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/programs" element={
            <ProtectedRoute>
              <ProgramListWrapper />
            </ProtectedRoute>
          } />
          <Route path="/program-builder" element={
            <ProtectedRoute>
              <ProgramBuilderWrapper />
            </ProtectedRoute>
          } />
          <Route path="/program-builder/:id" element={
            <ProtectedRoute>
              <ProgramBuilderWrapper />
            </ProtectedRoute>
          } />
          <Route path="/exercise-builder" element={
            <ProtectedRoute>
              <ExerciseBuilderWrapper />
            </ProtectedRoute>
          } />
          <Route path="/client-builder" element={
            <ProtectedRoute>
              <ClientBuilderWrapper />
            </ProtectedRoute>
          } />
          <Route path="/client-list" element={
            <ProtectedRoute>
              <ClientListWrapper />
            </ProtectedRoute>
          } />
          <Route path="/registration-links" element={
            <ProtectedRoute>
              <RegistrationLinksWrapper />
            </ProtectedRoute>
          } />
          <Route path="/client-programs" element={
            <ProtectedRoute>
              <ClientProgramViewWrapper />
            </ProtectedRoute>
          } />
          <Route path="/weight-tracking" element={
            <ProtectedRoute>
              <WeightTrackingWrapper />
            </ProtectedRoute>
          } />
          <Route path="/client/:id" element={
            <ProtectedRoute>
              <ClientDetailWrapper />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;