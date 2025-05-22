import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
// REMOVIDO: import SidebarDashboard from '../components/SidebarDashboard';
// REMOVIDO: import DashboardHeader from '../components/DashboardHeader';

// Interface para os projetos
interface Project {
  id: string;
  name: string;
  location: string;
  date: string;
  status: 'Em andamento' | 'Finalizado' | 'Iniciando' | 'Pausado';
  reuseRate: number;
}

const ProjectsPage = () => {
  // Dados de exemplo para os projetos
  const projectsData: Project[] = [
    {
      id: '1',
      name: 'Edifício Aurora',
      location: 'São Paulo, SP',
      date: '2023-05-15',
      status: 'Em andamento',
      reuseRate: 75,
    },
    {
      id: '2',
      name: 'Residencial Parque Verde',
      location: 'Curitiba, PR',
      date: '2023-09-01',
      status: 'Iniciando',
      reuseRate: 25,
    },
    {
      id: '3',
      name: 'Torre Corporativa Horizonte',
      location: 'Rio de Janeiro, RJ',
      date: '2022-11-10',
      status: 'Finalizado',
      reuseRate: 92,
    },
    {
      id: '4',
      name: 'Condomínio Vista Mar',
      location: 'Salvador, BA',
      date: '2023-03-20',
      status: 'Em andamento',
      reuseRate: 68,
    },
    {
      id: '5',
      name: 'Centro Empresarial Inovação',
      location: 'Belo Horizonte, MG',
      date: '2023-01-05',
      status: 'Pausado',
      reuseRate: 45,
    },
    {
      id: '6',
      name: 'Residencial Montanhas',
      location: 'Gramado, RS',
      date: '2023-08-15',
      status: 'Iniciando',
      reuseRate: 30,
    },
  ];

  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projectsData);
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Filtragem de projetos por status
  const filterByStatus = (status: string) => {
    setStatusFilter(status);
    if (status === '') {
      setFilteredProjects(projectsData);
    } else {
      setFilteredProjects(projectsData.filter(project => project.status === status));
    }
  };

  // Obtém a cor com base no status do projeto
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em andamento':
        return 'bg-green-100 text-green-800';
      case 'Finalizado':
        return 'bg-purple-100 text-purple-800';
      case 'Iniciando':
        return 'bg-blue-100 text-blue-800';
      case 'Pausado':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Componente para exibir a taxa de reaproveitamento em círculo
  const ReuseRateCircle = ({ rate }: { rate: number }) => {
    const circumference = 2 * Math.PI * 20; // r = 20
    const strokeDashoffset = circumference - (rate / 100) * circumference;
    
    // Determina a cor com base na taxa
    const getColor = () => {
      if (rate >= 70) return '#1E533B'; // verde
      if (rate >= 40) return '#D17B31'; // laranja
      return '#DC2626'; // vermelho
    };

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16" viewBox="0 0 44 44">
            <circle
              className="text-gray-200"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              r="20"
              cx="22"
              cy="22"
            />
            <circle
              className="text-residuall-green transition-all duration-1000 ease-in-out"
              stroke={getColor()}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              fill="transparent"
              r="20"
              cx="22"
              cy="22"
              style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold">{rate}%</span>
          </div>
        </div>
        <span className="text-xs text-residuall-gray mt-1">Reaproveitamento</span>
      </div>
    );
  };

  // O componente ProjectsPage agora renderiza APENAS o seu conteúdo
  // A div pai "min-h-screen bg-residuall-gray-light flex" que continha SidebarDashboard e DashboardHeader foi removida
  // pois o DashboardLayout já provê essa estrutura.
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      {/* Cabeçalho da página */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-residuall-gray-dark">Projetos</h1>
          <p className="text-residuall-gray">Gerencie todos os seus projetos em um só lugar</p>
        </div>
        
        <Link
          to="/dashboard/projetos/novo"
          className="mt-4 md:mt-0 inline-flex items-center bg-residuall-green hover:bg-residuall-green-light text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Novo Projeto
        </Link>
      </div>
      
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <button className="inline-flex items-center bg-white border border-gray-300 text-residuall-gray-dark px-4 py-2 rounded-lg">
              <Filter size={16} className="mr-2" />
              <span>Status</span>
            </button>
            
            {/* Dropdown para o filtro de status (poderia ser implementado com um estado) */}
            <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 hidden">
              <div className="py-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-residuall-gray-dark hover:bg-gray-100"
                  onClick={() => filterByStatus('')}
                >
                  Todos
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-residuall-gray-dark hover:bg-gray-100"
                  onClick={() => filterByStatus('Em andamento')}
                >
                  Em andamento
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-residuall-gray-dark hover:bg-gray-100"
                  onClick={() => filterByStatus('Finalizado')}
                >
                  Finalizado
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-residuall-gray-dark hover:bg-gray-100"
                  onClick={() => filterByStatus('Iniciando')}
                >
                  Iniciando
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-residuall-gray-dark hover:bg-gray-100"
                  onClick={() => filterByStatus('Pausado')}
                >
                  Pausado
                </button>
              </div>
            </div>
          </div>
          
          <button className="inline-flex items-center bg-white border border-gray-300 text-residuall-gray-dark px-4 py-2 rounded-lg">
            <Calendar size={16} className="mr-2" />
            <span>Data</span>
          </button>
        </div>
        
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar projetos..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-residuall-green focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Grid de projetos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-residuall-gray-dark">
                  {project.name}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-residuall-gray mb-4">
                <span className="mr-4">{project.location}</span>
                <span>{new Date(project.date).toLocaleDateString('pt-BR')}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <ReuseRateCircle rate={project.reuseRate} />
                
                <Link
                  to={`/dashboard/projetos/${project.id}`}
                  className="text-sm font-medium text-white bg-residuall-brown hover:bg-residuall-brown-light py-2 px-4 rounded-lg transition-colors"
                >
                  Ver detalhes
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Mensagem caso não haja projetos */}
      {filteredProjects.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <AlertCircle size={48} className="mx-auto text-residuall-gray mb-4" />
          <h3 className="text-lg font-medium text-residuall-gray-dark mb-2">
            Nenhum projeto encontrado
          </h3>
          <p className="text-residuall-gray mb-6">
            Não encontramos projetos com os filtros selecionados. Tente outros critérios ou crie um novo projeto.
          </p>
          <Link
            to="/dashboard/projetos/novo"
            className="inline-flex items-center bg-residuall-green hover:bg-residuall-green-light text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Novo Projeto
          </Link>
        </div>
      )}
    </main>
  );
};

export default ProjectsPage;
