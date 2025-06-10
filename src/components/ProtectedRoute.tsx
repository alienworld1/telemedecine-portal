import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth, UserRole } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || !userProfile) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole && !requiredRole.includes(userProfile.role)) {
    // Redirect based on user role
    if (userProfile.role === 'patient') {
      return <Navigate to="/dashboard" replace />;
    } else if (userProfile.role === 'doctor') {
      return <Navigate to="/doctor" replace />;
    } else {
      return <Navigate to="/admin" replace />;
    }
  }

  return <>{children}</>;
}
