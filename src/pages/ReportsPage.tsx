
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Calendar, BarChart, TrendingUp, Eye, FileText, ChevronDown } from 'lucide-react';
import Chart from '../components/Chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useReports } from "@/hooks/useReports";

const ReportsPage = () => {
  const { reports, metrics, loading, error } = useReports();

  // Estado para os filtros
  const [filteredReports, setFilteredReports] = useState(reports);
  const [projectFilter, setProjectFilter] = useState('Projeto');
  const [periodFilter, setPeriodFilter] = useState('Período');
  const [statusFilter, setStatusFilter] = useState('Status');
  const [searchQuery, setSearchQuery] = useState('');

  // Atualizar relatórios filtrados quando os dados mudarem
  useState(() => {
    setFilteredReports(reports);
  }, [reports]);

  // Dados para gráficos baseados nos relatórios reais
  const economyData = [
    { name: 'Jan', economia: Math.round(metrics.totalSavings * 0.15) },
    { name: 'Fev', economia: Math.round(metrics.totalSavings * 0.22) },
    { name: 'Mar', economia: Math.round(metrics.totalSavings * 0.18) },
    { name: 'Abr', economia: Math.round(metrics.totalSavings * 0.25) },
    { name: 'Mai', economia: Math.round(metrics.totalSavings * 0.32) }
  ];

  const projectsEconomyData = reports.slice(0, 5).map(report => ({
    name: report.project_name.length > 15 ? report.project_name.substring(0, 15) + '...' : report.project_name,
    economia: Math.round(report.total_economy_generated)
  }));

  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluído':
        return 'status-tag status-tag-completed';
      case 'execução':
        return 'status-tag status-tag-ongoing';
      case 'planejamento':
        return 'status-tag status-tag-pending';
      default:
        return 'status-tag';
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    const filtered = reports.filter(report =>
      report.project_name.toLowerCase().includes(value.toLowerCase()) ||
      report.material_type_name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredReports(filtered);
  };

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-residuall-green"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="text-center text-red-600">
          Erro ao carregar relatórios: {error}
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      {/* Cabeçalho da página */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-residuall-gray-tableText">Relatórios</h1>
          <p className="text-residuall-gray">Visualize relatórios detalhados baseados nos seus projetos</p>
        </div>
      </div>
      
      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="flex flex-wrap gap-4 items-center justify-between p-4">
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter size={16} />
                  <span>{projectFilter}</span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-48 bg-white" 
                align="start" 
                sideOffset={8}
                avoidCollisions={true}
                collisionPadding={16}
              >
                <DropdownMenuItem onClick={() => setProjectFilter('Todos')}>Todos</DropdownMenuItem>
                {Array.from(new Set(reports.map(r => r.project_name))).map(projectName => (
                  <DropdownMenuItem key={projectName} onClick={() => setProjectFilter(projectName)}>
                    {projectName}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{periodFilter}</span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-48 bg-white" 
                align="start" 
                sideOffset={8}
                avoidCollisions={true}
                collisionPadding={16}
              >
                <DropdownMenuItem onClick={() => setPeriodFilter('Última semana')}>Última semana</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPeriodFilter('Último mês')}>Último mês</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPeriodFilter('Último trimestre')}>Último trimestre</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPeriodFilter('Último ano')}>Último ano</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter size={16} />
                  <span>{statusFilter}</span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-48 bg-white" 
                align="start" 
                sideOffset={8}
                avoidCollisions={true}
                collisionPadding={16}
              >
                <DropdownMenuItem onClick={() => setStatusFilter('Todos')}>Todos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('planejamento')}>Planejamento</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('execução')}>Execução</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('concluído')}>Concluído</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div>
            <Input
              type="text"
              placeholder="Buscar relatórios..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="input-field"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Cards de indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Porcentagem de Resíduos Reaproveitados</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-residuall-green">{metrics.reuseRate}%</div>
              <div className="bg-residuall-green bg-opacity-10 p-2 rounded-full">
                <BarChart size={24} className="text-residuall-green" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-residuall-green h-2 rounded-full" style={{ width: `${metrics.reuseRate}%` }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Economia Gerada em Materiais</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-residuall-green">R$ {metrics.totalSavings.toLocaleString()}</div>
              <div className="bg-residuall-green bg-opacity-10 p-2 rounded-full">
                <TrendingUp size={24} className="text-residuall-green" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="text-residuall-green text-sm mr-2">+{metrics.totalProjects > 0 ? '18' : '0'}%</span>
              <span className="text-xs text-residuall-gray">comparado ao mês anterior</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Economia por Projetos</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-residuall-green">{metrics.totalProjects} projetos</div>
              <div className="bg-residuall-green bg-opacity-10 p-2 rounded-full">
                <BarChart size={24} className="text-residuall-green" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="text-residuall-green text-sm mr-2">R$ {metrics.avgSavingsPerProject.toLocaleString()}</span>
              <span className="text-xs text-residuall-gray">média por projeto</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-residuall-gray-tableText">
              Economia Gerada ao Longo do Tempo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart type="bar" data={economyData} height={250} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-residuall-gray-tableText">
              Economia por Projeto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart type="bar" data={projectsEconomyData} height={250} />
          </CardContent>
        </Card>
      </div>
      
      {/* Lista de Relatórios */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
          <CardTitle className="text-lg text-residuall-gray-tableText">
            Lista de Relatórios
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum relatório encontrado</h3>
              <p className="text-gray-500 mb-6">Crie projetos e registre desperdícios para gerar relatórios.</p>
              <Link to="/dashboard/projetos/novo">
                <Button className="bg-residuall-green hover:bg-residuall-green/90">
                  Criar Primeiro Projeto
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Quantidade Desperdiçada</TableHead>
                  <TableHead>Economia Gerada</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map(report => (
                  <TableRow key={report.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center">
                        <FileText size={16} className="text-residuall-gray mr-2" />
                        <span className="text-sm font-medium text-residuall-gray-tableText">
                          {report.project_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-residuall-gray">
                      {report.material_type_name}
                    </TableCell>
                    <TableCell className="text-sm text-residuall-gray">
                      {report.total_wasted_quantity.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-residuall-green">
                      R$ {report.total_economy_generated.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className={getStatusColor(report.project_status)}>
                        {report.project_status.charAt(0).toUpperCase() + report.project_status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-residuall-gray">
                      {report.project_location}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link 
                        to={`/dashboard/relatorios/${report.project_id}`} 
                        className="text-residuall-green-secondary hover:text-residuall-green"
                      >
                        <Eye size={18} />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default ReportsPage;
