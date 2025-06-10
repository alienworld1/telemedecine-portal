import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './components/LandingPage';

function AppRoutes() {
  const { currentUser, userProfile } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          currentUser ? <Navigate to="/dashboard" replace /> : <LandingPage />
        }
      />
      <Route
        path="/login"
        element={currentUser ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {userProfile?.role === 'doctor' ? (
              <Navigate to="/doctor" replace />
            ) : (
              <PatientDashboard />
            )}
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor"
        element={
          <ProtectedRoute requiredRole={['doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
