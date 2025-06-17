
import React, { useCallback, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

interface StableRouterProps {
  children: React.ReactNode;
}

const StableRouter: React.FC<StableRouterProps> = ({ children }) => {
  // Prevenir recarregamentos desnecessários e controlar visibilidade
  const handleVisibilityChange = useCallback(() => {
    // Não fazer nada específico que possa causar recarregamento
    if (document.hidden) {
      console.log('Aba ficou inativa - preservando estado');
    } else {
      console.log('Aba ficou ativa - estado preservado');
    }
  }, []);

  const handleBeforeUnload = useCallback((event: BeforeUnloadEvent) => {
    // Verificar se há dados não salvos importantes
    const hasUnsavedData = sessionStorage.getItem('hasUnsavedData');
    if (hasUnsavedData === 'true') {
      event.preventDefault();
      event.returnValue = 'Você tem dados não salvos. Tem certeza que deseja sair?';
      return 'Você tem dados não salvos. Tem certeza que deseja sair?';
    }
  }, []);

  const handlePageShow = useCallback((event: PageTransitionEvent) => {
    // Detectar quando a página é restaurada do cache (back/forward)
    if (event.persisted) {
      console.log('Página restaurada do cache - estado preservado');
      // Forçar uma verificação de estado se necessário
      window.dispatchEvent(new CustomEvent('pageRestored'));
    }
  }, []);

  const handlePopState = useCallback(() => {
    // Interceptar navegação do histórico para preservar estado
    console.log('Navegação no histórico detectada - preservando estado');
  }, []);

  useEffect(() => {
    // Prevenir recarregamentos automáticos através de eventos
    const preventReload = (e: KeyboardEvent) => {
      // Prevenir F5 e Ctrl+R apenas se houver dados não salvos
      if ((e.key === 'F5' || (e.ctrlKey && e.key === 'r')) && 
          sessionStorage.getItem('hasUnsavedData') === 'true') {
        const confirmReload = window.confirm('Você tem dados não salvos. Tem certeza que deseja recarregar?');
        if (!confirmReload) {
          e.preventDefault();
          return false;
        }
      }
    };

    // Adicionar listeners para controlar comportamento da aplicação
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('keydown', preventReload);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('keydown', preventReload);
    };
  }, [handleVisibilityChange, handleBeforeUnload, handlePageShow, handlePopState]);

  return (
    <Router>
      {children}
    </Router>
  );
};

export default StableRouter;
