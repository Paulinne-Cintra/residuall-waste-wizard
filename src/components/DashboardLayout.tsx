
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SidebarDashboard from './SidebarDashboard';
import DashboardHeader from './DashboardHeader';

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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarDashboard /> 
      <div className="flex-1 flex flex-col">
        <DashboardHeader pageTitle={pageTitle} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
