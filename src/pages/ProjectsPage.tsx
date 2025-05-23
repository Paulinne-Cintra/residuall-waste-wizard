import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Calendar, BarChart, TrendingUp, TrendingDown, Eye, Plus, ChevronDown, Building2, Droplet, Anchor, CheckCircle, AlertTriangle } from 'lucide-react';
import AnimatedButton from '@/components/ui/AnimatedButton';
import Chart from '../components/Chart';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

import AnimatedCardWrapper from '@/components/ui/AnimatedCardWrapper';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import { motion } from 'framer-motion';

interface Project {
  id: string;
  name: string;
  location: string;
  status: 'Em andamento' | 'Iniciando' | 'Finalizado' | 'Pausado';
  progress: number;
}

const ProjectsPage = () => {
  const { toast } = useToast();
  
  const projectsData: Project[] = [
    {
      id: '1',
      name: 'Edifício Aurora',
      location: 'São Paulo, SP',
      status: 'Em andamento',
      progress: 75,
    },
    {
      id: '2',
      name: 'Residencial Parque Verde',
      location: 'Curitiba, PR',
      status: 'Iniciando',
      progress: 25,
    },
    {
      id: '3',
      name: 'Torre Corporativa Horizonte',
      location: 'Rio de Janeiro, RJ',
      status: 'Finalizado',
      progress: 92,
    },
    {
      id: '4',
      name: 'Condomínio Vista Mar',
      location: 'Salvador, BA',
      status: 'Em andamento',
      progress: 68,
    },
    {
      id: '5',
      name: 'Centro Empresarial Inovação',
      location: 'Belo Horizonte, MG',
      status: 'Pausado',
      progress: 45,
    },
    {
      id: '6',
      name: 'Residencial Montanhas',
      location: 'Gramado, RS',
      status: 'Iniciando',
      progress: 30,
    },
  ];

  const reuseMetricsData = [
    { name: 'Tijolos', value: 2.5, unit: 'toneladas', description: 'Desperdício mensal médio', icon: Building2 },
    { name: 'Cimento', value: 3.2, unit: 'toneladas', description: 'Desperdício mensal médio', icon: Droplet },
    { name: 'Aço', value: 1.3, unit: 'toneladas', description: 'Desperdício mensal médio', icon: Anchor },
  ];

  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projectsData);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [statusFilter, setStatusFilter] = useState('Status');
  const [dateFilter, setDateFilter] = useState('Data');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    location: '',
    status: ''
  });

  // Dados de exemplo para recomendações
  const [recommendations, setRecommendations] = useState([
    { id: '1', text: 'Analisar desperdício de concreto no projeto Edifício Aurora.', completed: false },
    { id: '2', text: 'Verificar inventário de materiais recicláveis para o próximo projeto.', completed: true },
    { id: '3', text: 'Treinar equipe sobre novas práticas de reuso.', completed: false },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em andamento':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800';
      case 'Iniciando':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800';
      case 'Finalizado':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800';
      case 'Pausado':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800';
      default:
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800';
    }
  };

  const toggleRecommendation = (id: string) => {
    setRecommendations(prev =>
      prev.map(rec =>
        rec.id === id ? { ...rec, completed: !rec.completed } : rec
      )
    );
  };

  const handleCreateProject = () => {
    console.log('Criando projeto:', newProject);
    setIsModalOpen(false);
    setNewProject({ name: '', location: '', status: '' });
    toast({
      title: "Sucesso!",
      description: "Projeto criado com sucesso!",
      duration: 3000,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    console.log('Busca:', value);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
      {/* Cabeçalho da página */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Projetos</h1>
          <p className="text-base text-gray-600">Gerencie todos os seus projetos em um só lugar</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={18} />
                Novo Projeto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Projeto</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Nome do Projeto"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                />
                <Input
                  placeholder="Localização"
                  value={newProject.location}
                  onChange={(e) => setNewProject({...newProject, location: e.target.value})}
                />
                <Select onValueChange={(value) => setNewProject({...newProject, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Em andamento">Em andamento</SelectItem>
                    <SelectItem value="Iniciando">Iniciando</SelectItem>
                    <SelectItem value="Finalizado">Finalizado</SelectItem>
                    <SelectItem value="Pausado">Pausado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateProject}>Criar Projeto</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6 shadow-sm border-none">
        <CardContent className="flex flex-wrap gap-4 items-center justify-between p-4">
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 border-gray-300">
                  <Filter size={16} />
                  <span>{statusFilter}</span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('Todos')}>Todos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('Em andamento')}>Em andamento</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('Iniciando')}>Iniciando</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('Finalizado')}>Finalizado</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('Pausado')}>Pausado</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 border-gray-300">
                  <Calendar size={16} />
                  <span>{dateFilter}</span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setDateFilter('Última semana')}>Última semana</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateFilter('Último mês')}>Último mês</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateFilter('Último trimestre')}>Último trimestre</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateFilter('Último ano')}>Último ano</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <Input
              type="text"
              placeholder="Buscar projetos..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-residuall-green focus:border-transparent transition-all duration-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cards de Métricas (Reuso) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {reuseMetricsData.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <AnimatedCardWrapper key={index} delay={0.05 * (index + 1)} animateOnView={true}>
              <Card className="flex flex-col items-center justify-center p-6 shadow-md border-none">
                <CardHeader className="p-0 pb-2 flex-col items-center">
                  <CardDescription className="text-center text-sm font-medium text-gray-700 flex items-center gap-2">
                    {IconComponent && <IconComponent size={16} className="text-residuall-green-secondary" />}
                    {metric.name}
                  </CardDescription>
                  <CardTitle className="text-4xl font-extrabold text-gray-900 mt-2">
                    <AnimatedNumber value={metric.value} suffix={` ${metric.unit}`} decimals={1} />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-center text-xs text-gray-500">
                  {metric.description}
                </CardContent>
              </Card>
            </AnimatedCardWrapper>
          );
        })}
      </div>

      {/* Seção de Projetos Ativos (Cards de Projeto) */}
      <Card className="mb-6 shadow-sm border-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900">Projetos Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <AnimatedCardWrapper key={project.id} delay={0.1 + (index * 0.1)} animateOnView={true}>
                <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 border-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-gray-800">{project.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-500">{project.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className={getStatusColor(project.status)}>
                        {project.status}
                      </span>
                      <span className="text-base font-semibold text-gray-700">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-residuall-green h-2 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{
                          duration: 1.5,
                          delay: 0.5 + (index * 0.1),
                          ease: "easeOut"
                        }}
                      ></motion.div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Link to={`/dashboard/projetos/${project.id}`}>
                      <Button variant="outline" className="text-residuall-green-secondary hover:bg-residuall-green-secondary/10 font-medium px-4 py-2">
                        Ver detalhes
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </AnimatedCardWrapper>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seção de Recomendações */}
      <Card className="mb-6 shadow-sm border-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900">Recomendações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((rec) => (
            <div 
              key={rec.id} 
              className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
              onClick={() => toggleRecommendation(rec.id)}
            >
              <button
                className={`shrink-0 p-1 rounded-full mr-3 transition-colors duration-200 ${
                  rec.completed
                    ? 'bg-green-100 text-green-500'
                    : 'bg-residuall-brown bg-opacity-10 text-residuall-brown'
                }`}
              >
                {rec.completed ? (
                  <CheckCircle size={18} />
                ) : (
                  <AlertTriangle size={18} />
                )}
              </button>
              <div>
                <p className={`text-sm font-medium ${rec.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                  {rec.text}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {rec.completed ? 'Concluído' : 'Pendente'}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
};

export default ProjectsPage;
