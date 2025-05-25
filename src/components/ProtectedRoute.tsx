
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - user:', !!user, 'loading:', loading, 'path:', location.pathname);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-residuall-gray-light">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-residuall-green-default"></div>
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute - redirecting to login from:', location.pathname);
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
