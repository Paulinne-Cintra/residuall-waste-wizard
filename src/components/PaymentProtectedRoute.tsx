
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';

interface PaymentProtectedRouteProps {
  children: ReactNode;
}

export function PaymentProtectedRoute({ children }: PaymentProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { hasActivePlan, loading: paymentLoading } = usePaymentStatus();
  const location = useLocation();

  console.log('PaymentProtectedRoute - user:', !!user, 'hasActivePlan:', hasActivePlan, 'loading:', authLoading || paymentLoading);

  if (authLoading || paymentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-residuall-gray-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-residuall-green mx-auto mb-4"></div>
          <p className="text-residuall-gray">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('PaymentProtectedRoute - redirecting to login');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!hasActivePlan) {
    console.log('PaymentProtectedRoute - redirecting to payment');
    return <Navigate to="/pagamento" replace state={{ 
      from: location, 
      message: 'Você precisa escolher um plano para acessar a plataforma.'
    }} />;
  }

  return <>{children}</>;
}
