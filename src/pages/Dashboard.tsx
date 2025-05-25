
import React from 'react';
import { Search, Bell, ChevronDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { projects, loading, error } = useProjects();

  // Calcula o número de projetos ativos
  const activeProjectsCount = projects.filter(p => p.status === 'active').length;

  const handleLogout = async () => {
    try {
      console.log('Dashboard - Iniciando logout...');
      await signOut();
      navigate('/login', { replace: true });
      console.log('Dashboard - Navegando para /login após logout');
    } catch (error) {
      console.error('Dashboard - Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="p-0">
      {/* Header com busca e perfil */}
      <div className="bg-white shadow-sm py-4 px-6 flex items-center justify-between mb-6 rounded-lg">
        <div className="flex items-center flex-grow">
          <Search size={20} className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Buscar projetos, relatórios..."
            className="flex-grow py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-residuall-green"
          />
        </div>
        <div className="flex items-center space-x-4 ml-auto">
          <button className="p-2 text-gray-600 hover:text-residuall-green transition-colors">
            <Bell size={20} />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center cursor-pointer">
                <img
                  src="https://via.placeholder.com/32"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-gray-700 font-medium hidden md:block">
                  {user?.user_metadata?.name || user?.email || 'Usuário'}
                </span>
                <ChevronDown size={16} className="text-gray-500 ml-1 hidden md:block" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem onClick={() => navigate('/dashboard/perfil')}>
                Meu Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/dashboard/configuracoes')}>
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                <LogOut size={16} className="mr-2" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button className="bg-residuall-green text-white px-4 py-2 rounded-lg font-medium hover:bg-residuall-green/90 transition-colors hidden md:block">
            Publish
          </button>
        </div>
      </div>

      {/* Título do Dashboard */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6 px-6">Dashboard</h1>
      <p className="text-gray-600 mb-8 px-6">Bem-vindo!</p>

      {/* Cards de indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Projetos Ativos</h3>
          {loading ? (
            <p className="text-4xl font-bold text-residuall-green">...</p>
          ) : error ? (
            <p className="text-red-500">Erro: {error}</p>
          ) : (
            <p className="text-4xl font-bold text-residuall-green">{activeProjectsCount}</p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            {projects.length > 0 
              ? `${projects.length} projeto${projects.length > 1 ? 's' : ''} total`
              : 'Nenhum projeto'
            }
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Economia Gerada</h3>
          <p className="text-4xl font-bold text-gray-900">R$ 32.450</p>
          <p className="text-sm text-green-500 mt-2">+18% comparado ao mês anterior</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Materiais Reaproveitados</h3>
          <p className="text-4xl font-bold text-gray-900">65%</p>
          <p className="text-sm text-green-500 mt-2">+12% comparado ao mês anterior</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Desperdício Evitado</h3>
          <p className="text-4xl font-bold text-gray-900">2.8 ton</p>
          <p className="text-sm text-red-500 mt-2">-25% comparado ao mês anterior</p>
        </div>
      </div>

      {/* Seções de gráficos */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 mx-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Economia x Desperdício</h3>
        <div className="w-full h-48 bg-gray-100 rounded flex items-center justify-center">
          <p className="text-gray-500">Gráfico de Economia x Desperdício</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mx-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Desperdício por Etapa</h3>
        <div className="w-full h-48 bg-gray-100 rounded flex items-center justify-center">
          <p className="text-gray-500">Gráfico de Desperdício por Etapa</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
