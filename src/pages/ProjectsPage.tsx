
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Calendar, BarChart, TrendingUp, TrendingDown, Eye, Plus, ChevronDown, CheckCircle, AlertTriangle } from 'lucide-react';
import AnimatedButton from '@/components/ui/AnimatedButton';
import Chart from '../components/Chart';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

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

interface Recommendation {
  id: string;
  text: string;
  completed: boolean;
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
    { name: 'Tijolos', value: 2.5, unit: 'toneladas', description: 'Desperdício mensal médio' },
    { name: 'Cimento', value: 3.2, unit: 'toneladas', description: 'Desperdício mensal médio' },
    { name: 'Aço', value: 1.3, unit: 'toneladas', description: 'Desperdício mensal médio' },
  ];

  const recommendations: Recommendation[] = [
    { id: '1', text: 'Revisar plano de materiais do Projeto Alpha', completed: false },
    { id: '2', text: 'Atualizar cronograma do Projeto Beta', completed: true },
    { id: '3', text: 'Solicitar aprovação da fase 2 do Projeto Gamma', completed: false },
  ];

  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projectsData);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [recommendationsList, setRecommendationsList] = useState<Recommendation[]>(recommendations);

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

  const handleCreateNewProject = async () => {
    setIsCreatingProject(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsCreatingProject(false);
    toast({
      title: "Sucesso!",
      description: "Novo projeto criado com sucesso!",
      duration: 3000,
    });
  };

  const handleViewProjectDetails = (projectName: string) => {
    toast({
      title: "Detalhes do Projeto",
      description: `Acessando detalhes do projeto "${projectName}"!`,
      duration: 3000,
    });
  };

  const handleFilterClick = (filterType: string) => {
    toast({
      title: "Filtro",
      description: `Funcionalidade de filtro "${filterType}" em breve!`,
      duration: 3000,
    });
  };

  const toggleRecommendation = (id: string) => {
    setRecommendationsList(prev => 
      prev.map(rec => 
        rec.id === id ? { ...rec, completed: !rec.completed } : rec
      )
    );
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
          <AnimatedButton
            label={isCreatingProject ? "Criando..." : "Novo Projeto"}
            onClick={handleCreateNewProject}
            isLoading={isCreatingProject}
          />
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6 shadow-sm border-none">
        <CardContent className="flex flex-wrap gap-4 items-center justify-between p-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 border-gray-300"
              onClick={() => handleFilterClick('Status')}
            >
              <Filter size={16} />
              <span>Status</span>
              <ChevronDown size={16} />
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 border-gray-300"
              onClick={() => handleFilterClick('Data')}
            >
              <Calendar size={16} />
              <span>Data</span>
              <ChevronDown size={16} />
            </Button>
          </div>
          <div>
            <input
              type="text"
              placeholder="Buscar projetos..."
              className="input-field border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-residuall-green focus:border-transparent transition-all duration-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cards de Métricas (Reuso) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {reuseMetricsData.map((metric, index) => (
          <AnimatedCardWrapper key={index} delay={0.05 * (index + 1)} animateOnView={true}>
            <Card className="flex flex-col items-center justify-center p-6 shadow-md border-none">
              <CardHeader className="p-0 pb-2 flex-col items-center">
                <CardDescription className="text-center text-sm font-medium text-gray-700">{metric.name}</CardDescription>
                <CardTitle className="text-4xl font-extrabold text-gray-900 mt-2">
                  <AnimatedNumber value={metric.value} suffix={` ${metric.unit}`} decimals={1} />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-center text-xs text-gray-500">
                {metric.description}
              </CardContent>
            </Card>
          </AnimatedCardWrapper>
        ))}
      </div>

      {/* Seção de Projetos Ativos */}
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
                    <Button 
                      variant="outline" 
                      className="text-residuall-green-secondary hover:bg-residuall-green-secondary/10 font-medium px-4 py-2"
                      onClick={() => handleViewProjectDetails(project.name)}
                    >
                      Ver detalhes
                    </Button>
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
          {recommendationsList.map((rec) => (
            <div key={rec.id} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150">
              <button
                onClick={() => toggleRecommendation(rec.id)}
                className={`shrink-0 p-1 rounded-full mr-3 ${
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
                <p className="text-sm font-medium text-gray-800">{rec.text}</p>
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
