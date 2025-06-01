
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Calendar, BarChart, TrendingUp, TrendingDown, Eye, Plus, Building2, Droplet, Anchor, CheckCircle, AlertTriangle, ChevronDown } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
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

const ProjectsPage = () => {
  const { toast } = useToast();
  const { projects, loading, error } = useProjects();
  
  const reuseMetricsData = [
    { name: 'Tijolos', value: 2.5, unit: 'toneladas', description: 'Desperdício mensal médio', icon: Building2 },
    { name: 'Cimento', value: 3.2, unit: 'toneladas', description: 'Desperdício mensal médio', icon: Droplet },
    { name: 'Aço', value: 1.3, unit: 'toneladas', description: 'Desperdício mensal médio', icon: Anchor },
  ];

  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [statusFilter, setStatusFilter] = useState('Status');
  const [dateFilter, setDateFilter] = useState('Data');
  const [searchQuery, setSearchQuery] = useState('');

  // Estados para controlar dropdowns abertos
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  // Dados de exemplo para recomendações
  const [recommendations, setRecommendations] = useState([
    { id: '1', text: 'Analisar desperdício de concreto no projeto Edifício Aurora.', completed: false },
    { id: '2', text: 'Verificar inventário de materiais recicláveis para o próximo projeto.', completed: true },
    { id: '3', text: 'Treinar equipe sobre novas práticas de reuso.', completed: false },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'execução':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800';
      case 'planejamento':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800';
      case 'concluído':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800';
      case 'finalização':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800';
      default:
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800';
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

  const toggleRecommendation = (id: string) => {
    setRecommendations(prev =>
      prev.map(rec =>
        rec.id === id ? { ...rec, completed: !rec.completed } : rec
      )
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    console.log('Busca:', value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setStatusDropdownOpen(false);
    console.log('Filtro de status alterado:', value);
  };

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    setDateDropdownOpen(false);
    console.log('Filtro de data alterado:', value);
  };

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-residuall-green"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
        <div className="text-center text-red-600">
          Erro ao carregar projetos: {error}
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
      {/* Cabeçalho da página */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Projetos</h1>
          <p className="text-base text-gray-600">Gerencie todos os seus projetos em um só lugar</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Link to="/dashboard/projetos/novo">
            <Button className="flex items-center gap-2">
              <Plus size={18} />
              Novo Projeto
            </Button>
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6 shadow-sm border-none">
        <CardContent className="flex flex-wrap gap-4 items-center justify-between p-4">
          <div className="flex flex-wrap gap-2">
            <DropdownMenu open={statusDropdownOpen} onOpenChange={setStatusDropdownOpen}>
              <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 text-gray-700">
                <Filter size={16} />
                <span>{statusFilter}</span>
                <ChevronDown 
                  className={`h-4 w-4 transition-transform duration-200 ${
                    statusDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                sideOffset={5}
                className="w-48"
              >
                <DropdownMenuItem 
                  onClick={() => handleStatusFilterChange('Todos')}
                  selected={statusFilter === 'Todos'}
                >
                  Todos
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleStatusFilterChange('planejamento')}
                  selected={statusFilter === 'planejamento'}
                >
                  Planejamento
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleStatusFilterChange('execução')}
                  selected={statusFilter === 'execução'}
                >
                  Execução
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleStatusFilterChange('finalização')}
                  selected={statusFilter === 'finalização'}
                >
                  Finalização
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleStatusFilterChange('concluído')}
                  selected={statusFilter === 'concluído'}
                >
                  Concluído
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu open={dateDropdownOpen} onOpenChange={setDateDropdownOpen}>
              <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 text-gray-700">
                <Calendar size={16} />
                <span>{dateFilter}</span>
                <ChevronDown 
                  className={`h-4 w-4 transition-transform duration-200 ${
                    dateDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                sideOffset={5}
                className="w-48"
              >
                <DropdownMenuItem 
                  onClick={() => handleDateFilterChange('Última semana')}
                  selected={dateFilter === 'Última semana'}
                >
                  Última semana
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDateFilterChange('Último mês')}
                  selected={dateFilter === 'Último mês'}
                >
                  Último mês
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDateFilterChange('Último trimestre')}
                  selected={dateFilter === 'Último trimestre'}
                >
                  Último trimestre
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDateFilterChange('Último ano')}
                  selected={dateFilter === 'Último ano'}
                >
                  Último ano
                </DropdownMenuItem>
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
          <CardTitle className="text-2xl font-bold text-gray-900">Seus Projetos</CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum projeto encontrado</h3>
              <p className="text-gray-500 mb-6">Comece criando seu primeiro projeto para acompanhar desperdícios.</p>
              <Link to="/dashboard/projetos/novo">
                <Button className="bg-residuall-green hover:bg-residuall-green/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Projeto
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => {
                const progress = getProjectProgress(project.status);
                return (
                  <AnimatedCardWrapper key={project.id} delay={0.1 + (index * 0.1)} animateOnView={true}>
                    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 border-none">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-gray-800">{project.name}</CardTitle>
                        <CardDescription className="text-sm text-gray-500">{project.location}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className={getStatusColor(project.status)}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </span>
                          <span className="text-base font-semibold text-gray-700">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-residuall-green h-2 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: `${progress}%` }}
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
                );
              })}
            </div>
          )}
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
