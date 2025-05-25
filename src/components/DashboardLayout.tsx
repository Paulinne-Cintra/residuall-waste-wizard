
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import SidebarDashboard from './SidebarDashboard';
import { Search, Bell, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      // O redirecionamento será feito automaticamente pelo useAuth/ProtectedRoute
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarDashboard /> 

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10">
          <div className="flex items-center flex-grow">
            <Search size={20} className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Buscar projetos, relatórios..."
              className="header-search"
            />
          </div>
          <div className="flex items-center space-x-4 ml-auto">
            <button className="p-2 text-gray-600 hover:text-residuall-green transition-colors">
              <Bell size={20} />
            </button>
            <div className="flex items-center cursor-pointer">
              <img
                src="https://via.placeholder.com/32"
                alt="User Avatar"
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="text-gray-700 font-medium hidden md:block">
                Engª. Cristiana Soares
              </span>
              <ChevronDown size={16} className="text-gray-500 ml-1 hidden md:block" />
            </div>
            <button className="bg-residuall-green text-white px-4 py-2 rounded-lg font-medium hover:bg-residuall-green/90 transition-colors hidden md:block">
              Publish
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center gap-1"
            >
              <LogOut size={18} /> Sair
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
