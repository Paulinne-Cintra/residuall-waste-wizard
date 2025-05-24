// src/components/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth'; // Assumindo que '@/hooks/useAuth' aponta corretamente

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth(); // Desestruturando user e loading do seu custom hook

  if (loading) {
    // Exibe um spinner de carregamento enquanto a sessão está sendo verificada
    return (
      <div className="min-h-screen flex items-center justify-center bg-residuall-gray-light">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-residuall-green-default"></div>
      </div>
    );
  }

  if (!user) {
    // Se não houver usuário autenticado, redireciona para a página de login
    return <Navigate to="/login" replace />;
  }

  // Se o usuário estiver autenticado e não estiver carregando, renderiza o conteúdo da rota protegida
  return <>{children}</>;
}
