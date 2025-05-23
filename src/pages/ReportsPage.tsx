
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
import Chart from '../components/Chart';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Report {
  id: string;
  project: string;
  date: string;
  responsible: string;
  status: 'Finalizado' | 'Pendente';
  location: string;
}

const ReportsPage = () => {
  const { toast } = useToast();
  
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
  const [projectFilter, setProjectFilter] = useState('Projeto');
  const [periodFilter, setPeriodFilter] = useState('Período');
  const [statusFilter, setStatusFilter] = useState('Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    title: '',
    project: '',
    period: ''
  });

  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Finalizado':
        return 'status-tag status-tag-completed';
      case 'Pendente':
        return 'status-tag status-tag-ongoing';
      default:
        return 'status-tag';
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    console.log('Busca relatórios:', value);
  };

  const handleCreateReport = () => {
    console.log('Criando relatório:', newReport);
    setIsModalOpen(false);
    setNewReport({ title: '', project: '', period: '' });
    toast({
      title: "Sucesso!",
      description: "Relatório criado com sucesso!",
      duration: 3000,
    });
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      {/* Cabeçalho da página */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-residuall-gray-tableText">Relatórios</h1>
          <p className="text-residuall-gray">Visualize e exporte relatórios detalhados</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={18} />
            Exportar
          </Button>
          <Button className="flex items-center gap-2 bg-residuall-brown text-white hover:bg-residuall-brown/90">
            <Share2 size={18} />
            Compartilhar
          </Button>
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
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setProjectFilter('Todos')}>Todos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setProjectFilter('Edifício Aurora')}>Edifício Aurora</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setProjectFilter('Residencial Parque Verde')}>Residencial Parque Verde</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setProjectFilter('Torre Corporativa')}>Torre Corporativa</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{periodFilter}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
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
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('Todos')}>Todos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('Finalizado')}>Finalizado</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('Pendente')}>Pendente</DropdownMenuItem>
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
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Economia Gerada em Materiais</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
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
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Economia por Projetos</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
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
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-residuall-green text-white hover:bg-residuall-green/90">
                <Plus size={16} />
                Novo Relatório
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Relatório</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Título do Relatório"
                  value={newReport.title}
                  onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                />
                <Input
                  placeholder="Projeto Associado"
                  value={newReport.project}
                  onChange={(e) => setNewReport({...newReport, project: e.target.value})}
                />
                <Input
                  placeholder="Período"
                  value={newReport.period}
                  onChange={(e) => setNewReport({...newReport, period: e.target.value})}
                />
              </div>
              <DialogFooter>
                <Button onClick={handleCreateReport}>Criar Relatório</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projeto</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center">
                      <FileText size={16} className="text-residuall-gray mr-2" />
                      <span className="text-sm font-medium text-residuall-gray-tableText">
                        {report.project}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-residuall-gray">
                    {report.date}
                  </TableCell>
                  <TableCell className="text-sm text-residuall-gray">
                    {report.responsible}
                  </TableCell>
                  <TableCell>
                    <span className={getStatusColor(report.status)}>
                      {report.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-residuall-gray">
                    {report.location}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      to={`/dashboard/relatorios/${report.id}`}
                      className="text-residuall-green-secondary hover:text-residuall-green"
                    >
                      <Eye size={18} />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
};

export default ReportsPage;
