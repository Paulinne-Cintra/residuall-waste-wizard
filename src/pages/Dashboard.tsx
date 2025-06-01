import React, { useEffect } from 'react';
import { Search, Bell, ChevronDown, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { useProjectMaterials } from '@/hooks/useProjectMaterials';
import { useWasteEntries } from '@/hooks/useWasteEntries';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const { projects, loading: loadingProjects, error: errorProjects } = useProjects();
  const { materials, loading: loadingMaterials, error: errorMaterials } = useProjectMaterials();
  const { wasteEntries, loading: loadingWasteEntries, error: errorWasteEntries } = useWasteEntries();

  // Calcula o número de projetos ativos
  const activeProjectsCount = projects.filter(p => p.status === 'execução' || p.status === 'planejamento').length;
  
  // Calcula total de materiais cadastrados
  const totalMaterialsCount = materials.length;

  // Calcula total de desperdício evitado (baseado nas entradas de desperdício)
  const totalWasteAvoided = wasteEntries.reduce((sum, entry) => sum + entry.wasted_quantity, 0);

  // Calcula economia estimada (baseado no custo dos materiais desperdiçados)
  const totalEconomyGenerated = materials.reduce((sum, material) => {
    const materialWaste = wasteEntries.filter(entry => entry.project_material_id === material.id);
    const wastedQuantity = materialWaste.reduce((wasteSum, entry) => wasteSum + entry.wasted_quantity, 0);
    return sum + (wastedQuantity * (material.cost_per_unit || 0));
  }, 0);

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

  const getProjectProgress = (status: string) => {
    switch (status) {
      case 'planejamento':
        return 25;
      case 'execução':
        return 60;
      case 'finalização':
        return 90;
      case 'concluído':
        return 100;
      default:
        return 0;
    }
  };

  useEffect(() => {
    if (location.state?.welcomeMessage) {
      toast({
        title: "Bem-vindo!",
        description: location.state.welcomeMessage,
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, toast, navigate]);

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
          {/* Filtro de Projetos - Corrigido */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Filtrar Projetos
                <ChevronDown size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="start" sideOffset={8}>
              <DropdownMenuItem>Todos os Projetos</DropdownMenuItem>
              <DropdownMenuItem>Em Andamento</DropdownMenuItem>
              <DropdownMenuItem>Finalizados</DropdownMenuItem>
              <DropdownMenuItem>Pausados</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button className="p-2 text-gray-600 hover:text-residuall-green transition-colors">
            <Bell size={20} />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center cursor-pointer focus:outline-none">
                <img
                  src="https://via.placeholder.com/32"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-gray-700 font-medium hidden md:block">
                  {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'Usuário'}
                </span>
                <ChevronDown size={16} className="text-gray-500 ml-1 hidden md:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end" sideOffset={8}>
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
          {loadingMaterials || loadingWasteEntries ? (
            <p className="text-4xl font-bold text-gray-900">...</p>
          ) : errorMaterials || errorWasteEntries ? (
            <p className="text-red-500">Erro ao calcular</p>
          ) : (
            <p className="text-4xl font-bold text-gray-900">
              R$ {totalEconomyGenerated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          )}
          <p className="text-sm text-green-500 mt-2">Baseado no desperdício evitado</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Materiais Cadastrados</h3>
          {loadingMaterials ? (
            <p className="text-4xl font-bold text-gray-900">...</p>
          ) : errorMaterials ? (
            <p className="text-red-500">Erro: {errorMaterials}</p>
          ) : (
            <p className="text-4xl font-bold text-gray-900">{totalMaterialsCount}</p>
          )}
          <p className="text-sm text-green-500 mt-2">
            {totalMaterialsCount > 0 ? `${totalMaterialsCount} tipos de materiais` : 'Nenhum material cadastrado'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Desperdício Monitorado</h3>
          {loadingWasteEntries ? (
            <p className="text-4xl font-bold text-gray-900">...</p>
          ) : errorWasteEntries ? (
            <p className="text-red-500">Erro: {errorWasteEntries}</p>
          ) : (
            <p className="text-4xl font-bold text-gray-900">{Math.round(totalWasteAvoided)}</p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            {wasteEntries.length > 0 ? `${wasteEntries.length} registros de desperdício` : 'Nenhum registro'}
          </p>
        </div>
      </div>

      {/* SEÇÃO: Projetos Recentes com Barra de Progresso */}
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
            {recentProjects.map((project) => {
              const progress = getProjectProgress(project.status);
              return (
                <div key={project.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-800">{project.name}</h4>
                    <span className="text-sm text-gray-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-residuall-green h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Status: {project.status}</p>
                  {project.location && (
                    <p className="text-xs text-gray-500">Local: {project.location}</p>
                  )}
                </div>
              );
            })}
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
