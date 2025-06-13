
import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';

// Lazy load do sidebar para melhor performance
const AnimatedSidebar = React.lazy(() => import('./AnimatedSidebar'));

const DashboardLayout: React.FC = () => {
  const location = useLocation();

  // Mapear rotas para títulos de página
  const getPageTitle = (pathname: string) => {
    const routeTitles: { [key: string]: string } = {
      '/dashboard': 'Visão Geral',
      '/dashboard/projetos': 'Projetos',
      '/dashboard/projetos/novo': 'Novo Projeto',
      '/dashboard/materiais': 'Materiais',
      '/dashboard/relatorios': 'Relatórios',
      '/dashboard/time': 'Equipe',
      '/dashboard/perfil': 'Meu Perfil',
      '/dashboard/recomendacoes': 'Recomendações',
      '/dashboard/configuracoes': 'Configurações',
      '/dashboard/arquivados': 'Arquivados',
      '/dashboard/ajuda': 'Ajuda & Suporte',
    };

    // Verificar rotas dinâmicas
    if (pathname.startsWith('/dashboard/projetos/') && pathname !== '/dashboard/projetos/novo') {
      return 'Detalhes do Projeto';
    }
    if (pathname.startsWith('/dashboard/relatorios/')) {
      return 'Detalhes do Relatório';
    }

    return routeTitles[pathname] || 'Dashboard';
  };

  const pageTitle = getPageTitle(location.pathname);
  
  // Páginas que não devem exibir o header
  const pagesWithoutHeader = ['/dashboard', '/dashboard/ajuda'];
  const shouldShowHeader = !pagesWithoutHeader.includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Suspense 
        fallback={
          <div className="w-64 bg-residuall-green animate-pulse">
            <div className="p-4 space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-10 bg-white/20 rounded"></div>
              ))}
            </div>
          </div>
        }
      >
        <AnimatedSidebar />
      </Suspense>
      <div className="flex-1 flex flex-col">
        {shouldShowHeader && <DashboardHeader />}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
