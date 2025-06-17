
import React, { useCallback, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

interface StableRouterProps {
  children: React.ReactNode;
}

const StableRouter: React.FC<StableRouterProps> = ({ children }) => {
  // Prevenir recarregamentos desnecessários e controlar visibilidade
  const handleVisibilityChange = useCallback(() => {
    // Não fazer nada específico, apenas prevenir ações desnecessárias
    if (document.hidden) {
      console.log('Aba ficou inativa');
    } else {
      console.log('Aba ficou ativa');
    }
  }, []);

  const handleBeforeUnload = useCallback((event: BeforeUnloadEvent) => {
    // Só prevenir se houver dados não salvos importantes
    const hasUnsavedData = sessionStorage.getItem('hasUnsavedData');
    if (hasUnsavedData === 'true') {
      event.preventDefault();
      event.returnValue = '';
    }
  }, []);

  useEffect(() => {
    // Adicionar listeners para controlar comportamento da aplicação
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleVisibilityChange, handleBeforeUnload]);

  return (
    <Router>
      {children}
    </Router>
  );
};

export default StableRouter;
