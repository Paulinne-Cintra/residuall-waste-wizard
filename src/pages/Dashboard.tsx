
import React from 'react';
import { Search, Bell, ChevronDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { useMaterials } from '@/hooks/useMaterials';
import { useReports } from '@/hooks/useReports';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { projects, loading: loadingProjects, error: errorProjects } = useProjects();
  const { materials, loading: loadingMaterials, error: errorMaterials } = useMaterials();
  const { reports, loading: loadingReports, error: errorReports } = useReports();

  // Calcula o número de projetos ativos
  const activeProjectsCount = projects.filter(p => p.status === 'active').length;
  
  // Calcula total de materiais reaproveitados (baseado na porcentagem de reuso)
  const totalMaterialsReused = materials.reduce((sum, m) => {
    const quantity = m.quantity || 0;
    const reusedPercentage = m.reused_percentage || 0;
    return sum + (quantity * reusedPercentage / 100);
  }, 0);

  // Calcula economia total dos relatórios
  const totalEconomy = reports.reduce((sum, r) => sum + (r.economy_generated || 0), 0);

  // Projetos recentes (ordenados por data de criação, limitados a 3)
  const recentProjects = projects
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

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
          {loadingProjects ? (
            <p className="text-4xl font-bold text-residuall-green">...</p>
          ) : errorProjects ? (
            <p className="text-red-500">Erro: {errorProjects}</p>
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
          {loadingReports ? (
            <p className="text-4xl font-bold text-gray-900">...</p>
          ) : errorReports ? (
            <p className="text-red-500">Erro: {errorReports}</p>
          ) : (
            <p className="text-4xl font-bold text-gray-900">
              R$ {totalEconomy.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          )}
          <p className="text-sm text-green-500 mt-2">Baseado nos relatórios</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Materiais Reaproveitados</h3>
          {loadingMaterials ? (
            <p className="text-4xl font-bold text-gray-900">...</p>
          ) : errorMaterials ? (
            <p className="text-red-500">Erro: {errorMaterials}</p>
          ) : (
            <p className="text-4xl font-bold text-gray-900">{Math.round(totalMaterialsReused)}</p>
          )}
          <p className="text-sm text-green-500 mt-2">
            {materials.length > 0 ? `${materials.length} materiais cadastrados` : 'Nenhum material cadastrado'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Relatórios Gerados</h3>
          {loadingReports ? (
            <p className="text-4xl font-bold text-gray-900">...</p>
          ) : errorReports ? (
            <p className="text-red-500">Erro: {errorReports}</p>
          ) : (
            <p className="text-4xl font-bold text-gray-900">{reports.length}</p>
          )}
          <p className="text-sm text-gray-500 mt-2">Total de relatórios</p>
        </div>
      </div>

      {/* NOVA SEÇÃO: Projetos Recentes com Barra de Progresso */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 mx-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Projetos Recentes</h3>
        {loadingProjects ? (
          <p className="text-gray-500">Carregando projetos...</p>
        ) : errorProjects ? (
          <p className="text-red-500">Erro ao carregar projetos: {errorProjects}</p>
        ) : recentProjects.length === 0 ? (
          <p className="text-gray-500">Nenhum projeto recente para exibir.</p>
        ) : (
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-800">{project.name}</h4>
                  <span className="text-sm text-gray-600">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-residuall-green h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Status: {project.status}</p>
              </div>
            ))}
          </div>
        )}
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
