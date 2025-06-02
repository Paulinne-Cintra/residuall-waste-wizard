
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Calendar, BarChart, TrendingUp, TrendingDown, Eye, Plus, ChevronDown, Building2, Droplet, Anchor, CheckCircle, AlertTriangle } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useRecommendations } from '@/hooks/useRecommendations';
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
  const { recommendations, updateRecommendation } = useRecommendations();
  
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [statusFilter, setStatusFilter] = useState('Status');
  const [dateFilter, setDateFilter] = useState('Data');
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'execução':
      case 'em_andamento':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800';
      case 'planejamento':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800';
      case 'concluído':
      case 'concluido':
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
      case 'em_andamento':
        return 60;
      case 'finalização':
        return 90;
      case 'concluído':
      case 'concluido':
        return 100;
      default:
        return 0;
    }
  };

  const toggleRecommendation = async (id: string) => {
    const recommendation = recommendations.find(r => r.id === id);
    if (recommendation) {
      await updateRecommendation(id, { aceita: !recommendation.aceita });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    console.log('Busca:', value);
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 border-gray-300">
                  <Filter size={16} />
                  <span>{statusFilter}</span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" sideOffset={5} className="bg-white">
                <DropdownMenuItem onClick={() => setStatusFilter('Todos')}>Todos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('planejamento')}>Planejamento</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('execução')}>Execução</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('finalização')}>Finalização</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('concluído')}>Concluído</DropdownMenuItem>
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
              <DropdownMenuContent align="start" sideOffset={5} className="bg-white">
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

      {/* Seção de Recomendações conectada aos dados reais */}
      <Card className="mb-6 shadow-sm border-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900">Recomendações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhuma recomendação disponível no momento.</p>
            </div>
          ) : (
            recommendations.slice(0, 5).map((rec) => (
              <div 
                key={rec.id} 
                className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                onClick={() => toggleRecommendation(rec.id)}
              >
                <button
                  className={`shrink-0 p-1 rounded-full mr-3 transition-colors duration-200 ${
                    rec.aceita
                      ? 'bg-green-100 text-green-500'
                      : 'bg-residuall-brown bg-opacity-10 text-residuall-brown'
                  }`}
                >
                  {rec.aceita ? (
                    <CheckCircle size={18} />
                  ) : (
                    <AlertTriangle size={18} />
                  )}
                </button>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${rec.aceita ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                    {rec.titulo}
                  </p>
                  {rec.descricao && (
                    <p className="text-xs text-gray-600 mt-1">{rec.descricao}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Projeto: {rec.projects?.name || 'N/A'} • {rec.aceita ? 'Aceita' : 'Pendente'}
                  </p>
                </div>
              </div>
            ))
          )}
          {recommendations.length > 5 && (
            <div className="text-center pt-4">
              <Link to="/dashboard/recomendacoes">
                <Button variant="outline" className="text-residuall-green-secondary">
                  Ver todas as recomendações
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default ProjectsPage;
