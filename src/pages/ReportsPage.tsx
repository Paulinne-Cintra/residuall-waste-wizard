
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Filter, 
  Calendar, 
  BarChart, 
  TrendingUp, 
  TrendingDown,
  Download, 
  Share2,
  Plus,
  Eye,
  FileText
} from 'lucide-react';
import SidebarDashboard from '../components/SidebarDashboard';
import DashboardHeader from '../components/DashboardHeader';
import Chart from '../components/Chart';

interface Report {
  id: string;
  project: string;
  date: string;
  responsible: string;
  status: 'Finalizado' | 'Pendente';
  location: string;
}

const ReportsPage = () => {
  // Dados de exemplo para relatórios
  const reportsData: Report[] = [
    {
      id: '1',
      project: 'Edifício Aurora',
      date: '15/05/2023',
      responsible: 'Carlos Pereira',
      status: 'Finalizado',
      location: 'São Paulo, SP',
    },
    {
      id: '2',
      project: 'Residencial Parque Verde',
      date: '10/05/2023',
      responsible: 'Ana Silva',
      status: 'Pendente',
      location: 'Curitiba, PR',
    },
    {
      id: '3',
      project: 'Torre Corporativa Horizonte',
      date: '01/05/2023',
      responsible: 'Roberto Santos',
      status: 'Finalizado',
      location: 'Rio de Janeiro, RJ',
    },
    {
      id: '4',
      project: 'Condomínio Vista Mar',
      date: '28/04/2023',
      responsible: 'Fernanda Lima',
      status: 'Finalizado',
      location: 'Salvador, BA',
    },
    {
      id: '5',
      project: 'Centro Empresarial Inovação',
      date: '20/04/2023',
      responsible: 'Lucas Oliveira',
      status: 'Pendente',
      location: 'Belo Horizonte, MG',
    },
  ];

  // Dados para gráficos
  const reuseRateData = [
    { name: 'Reutilizado', value: 65 },
    { name: 'Desperdício', value: 35 },
  ];

  const economyData = [
    { name: 'Jan', economia: 15000 },
    { name: 'Fev', economia: 22000 },
    { name: 'Mar', economia: 18000 },
    { name: 'Abr', economia: 25000 },
    { name: 'Mai', economia: 32000 },
  ];

  const projectsEconomyData = [
    { name: 'Edifício Aurora', economia: 12500 },
    { name: 'Residencial Parque Verde', economia: 8200 },
    { name: 'Torre Corporativa', economia: 15300 },
    { name: 'Condomínio Vista Mar', economia: 7500 },
    { name: 'Centro Empresarial', economia: 9800 },
  ];

  // Estado para os filtros
  const [filteredReports, setFilteredReports] = useState<Report[]>(reportsData);

  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Finalizado':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-residuall-gray-light flex">
      <SidebarDashboard />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Cabeçalho da página */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-residuall-gray-dark">Relatórios</h1>
              <p className="text-residuall-gray">Visualize e exporte relatórios detalhados</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-2">
              <button className="inline-flex items-center bg-residuall-gray-dark hover:bg-residuall-gray-dark/90 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                <Download size={18} className="mr-2" />
                Exportar
              </button>
              <button className="inline-flex items-center bg-residuall-green hover:bg-residuall-green-light text-white font-medium py-2 px-4 rounded-lg transition-colors">
                <Share2 size={18} className="mr-2" />
                Compartilhar
              </button>
            </div>
          </div>
          
          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <button className="inline-flex items-center bg-white border border-gray-300 text-residuall-gray-dark px-4 py-2 rounded-lg">
                  <Filter size={16} className="mr-2" />
                  <span>Projeto</span>
                </button>
              </div>
              
              <button className="inline-flex items-center bg-white border border-gray-300 text-residuall-gray-dark px-4 py-2 rounded-lg">
                <Calendar size={16} className="mr-2" />
                <span>Período</span>
              </button>
              
              <button className="inline-flex items-center bg-white border border-gray-300 text-residuall-gray-dark px-4 py-2 rounded-lg">
                <Filter size={16} className="mr-2" />
                <span>Status</span>
              </button>
            </div>
            
            <div>
              <input
                type="text"
                placeholder="Buscar relatórios..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-residuall-green focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Cards de indicadores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
              <h3 className="text-residuall-gray font-medium mb-2">Porcentagem de Resíduos Reaproveitados</h3>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-residuall-green">65%</div>
                <div className="bg-residuall-green bg-opacity-10 p-2 rounded-full">
                  <BarChart size={24} className="text-residuall-green" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-residuall-green h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
              <h3 className="text-residuall-gray font-medium mb-2">Economia Gerada em Materiais</h3>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-residuall-green">R$ 32.450</div>
                <div className="bg-residuall-green bg-opacity-10 p-2 rounded-full">
                  <TrendingUp size={24} className="text-residuall-green" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-residuall-green text-sm mr-2">+18%</span>
                <span className="text-xs text-residuall-gray">comparado ao mês anterior</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
              <h3 className="text-residuall-gray font-medium mb-2">Economia por Projetos</h3>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-residuall-green">5 projetos</div>
                <div className="bg-residuall-green bg-opacity-10 p-2 rounded-full">
                  <TrendingDown size={24} className="text-residuall-green" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-residuall-green text-sm mr-2">R$ 10.630</span>
                <span className="text-xs text-residuall-gray">média por projeto</span>
              </div>
            </div>
          </div>
          
          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-residuall-gray-dark mb-4">
                Economia Gerada ao Longo do Tempo
              </h3>
              <Chart type="bar" data={economyData} height={250} />
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-residuall-gray-dark mb-4">
                Economia por Projeto
              </h3>
              <Chart type="bar" data={projectsEconomyData} height={250} />
            </div>
          </div>
          
          {/* Lista de Relatórios */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-residuall-gray-dark">
                Lista de Relatórios
              </h3>
              <button className="inline-flex items-center text-sm bg-residuall-green hover:bg-residuall-green-light text-white py-2 px-3 rounded-lg transition-colors">
                <Plus size={16} className="mr-1" />
                Novo Relatório
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-residuall-gray-dark uppercase tracking-wider">
                      Projeto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-residuall-gray-dark uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-residuall-gray-dark uppercase tracking-wider">
                      Responsável
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-residuall-gray-dark uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-residuall-gray-dark uppercase tracking-wider">
                      Localização
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-residuall-gray-dark uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText size={16} className="text-residuall-gray mr-2" />
                          <span className="text-sm font-medium text-residuall-gray-dark">
                            {report.project}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-residuall-gray">
                        {report.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-residuall-gray">
                        {report.responsible}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-residuall-gray">
                        {report.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <Link
                          to={`/dashboard/relatorios/${report.id}`}
                          className="text-residuall-green hover:text-residuall-green-light mr-3"
                        >
                          <Eye size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsPage;
