// pages/ProjectsPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Importe os novos ícones aqui
import { Filter, Calendar, BarChart, TrendingUp, TrendingDown, Eye, Plus, ChevronDown, Building2, Droplet, Anchor, CheckCircle, AlertTriangle } from 'lucide-react'; // Adicionados Building2, Droplet, Anchor
import AnimatedButton from '@/components/ui/AnimatedButton';
import Chart from '../components/Chart';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import AnimatedCardWrapper from '@/components/AnimatedCardWrapper';
import AnimatedNumber from '@/components/AnimatedNumber';
import { motion } from 'framer-motion';

interface Project {
  id: string;
  name: string;
  location: string;
  status: 'Em andamento' | 'Iniciando' | 'Finalizado' | 'Pausado';
  progress: number;
}

const ProjectsPage = () => {
  // ... (dados de exemplo e funções existentes) ...
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
    { name: 'Tijolos', value: 2.5, unit: 'toneladas', description: 'Desperdício mensal médio', icon: Building2 }, // Adicionado ícone
    { name: 'Cimento', value: 3.2, unit: 'toneladas', description: 'Desperdício mensal médio', icon: Droplet },   // Adicionado ícone
    { name: 'Aço', value: 1.3, unit: 'toneladas', description: 'Desperdício mensal médio', icon: Anchor },      // Adicionado ícone
  ];

  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projectsData);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

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
    alert("Novo projeto criado com sucesso!");
  };

  // Dados de exemplo para recomendações (garantir que existe ou adicionar)
  const [recommendations, setRecommendations] = useState([
    { id: '1', text: 'Analisar desperdício de concreto no projeto Edifício Aurora.', completed: false },
    { id: '2', text: 'Verificar inventário de materiais recicláveis para o próximo projeto.', completed: true },
    { id: '3', text: 'Treinar equipe sobre novas práticas de reuso.', completed: false },
  ]);

  const toggleRecommendation = (id: string) => {
    setRecommendations(prev =>
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
            <Button variant="outline" className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 border-gray-300">
              <Filter size={16} />
              <span>Status</span>
              <ChevronDown size={16} />
            </Button>
            <Button variant="outline" className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 border-gray-300">
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
        {reuseMetricsData.map((metric, index) => {
          const IconComponent = metric.icon; // Obtenha o componente do ícone
          return (
            <AnimatedCardWrapper key={index} delay={0.05 * (index + 1)} animateOnView={true}>
              <Card className="flex flex-col items-center justify-center p-6 shadow-md border-none">
                <CardHeader className="p-0 pb-2 flex-col items-center">
                  <CardDescription className="text-center text-sm font-medium text-gray-700 flex items-center gap-2"> {/* Adicionado flex e gap */}
                    {IconComponent && <IconComponent size={16} className="text-residuall-green-secondary" />} {/* Renderiza o ícone */}
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
