
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Package, 
  BarChart3, 
  Lightbulb, 
  Users, 
  Settings, 
  User,
  HelpCircle,
  Archive,
  Plus
} from 'lucide-react';

const SidebarDashboard: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Visão Geral', path: '/dashboard' },
    { icon: FolderOpen, label: 'Projetos', path: '/dashboard/projetos' },
    { icon: Plus, label: 'Novo Projeto', path: '/dashboard/projetos/novo' },
    { icon: Package, label: 'Materiais', path: '/dashboard/materiais' },
    { icon: BarChart3, label: 'Relatórios', path: '/dashboard/relatorios' },
    { icon: Lightbulb, label: 'Recomendações', path: '/dashboard/recomendacoes' },
    { icon: Users, label: 'Equipe', path: '/dashboard/equipe' },
    { icon: Settings, label: 'Configurações', path: '/dashboard/configuracoes' },
    { icon: User, label: 'Perfil', path: '/dashboard/perfil' },
    { icon: HelpCircle, label: 'Ajuda', path: '/dashboard/ajuda' },
    { icon: Archive, label: 'Arquivados', path: '/dashboard/arquivados' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <img 
            src="/logo-residuall-branca.png" 
            alt="Residuall" 
            className="h-8 w-auto"
          />
          <span className="text-xl font-bold text-residuall-green">Residuall</span>
        </div>
      </div>
      
      <nav className="px-4 pb-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    active
                      ? 'bg-residuall-green text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarDashboard;
