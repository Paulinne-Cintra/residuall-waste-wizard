
import React, { useCallback } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

interface StableRouterProps {
  children: React.ReactNode;
}

const StableRouter: React.FC<StableRouterProps> = ({ children }) => {
  // Prevenir recarregamentos desnecessários
  const handlePopState = useCallback((event: PopStateEvent) => {
    // Prevenir o comportamento padrão que pode causar recarregamentos
    event.preventDefault();
  }, []);

  React.useEffect(() => {
    // Adicionar listener para controlar navegação
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [handlePopState]);

  return (
    <Router>
      {children}
    </Router>
  );
};

export default StableRouter;
