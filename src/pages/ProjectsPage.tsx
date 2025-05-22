// pages/ProjectsPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Calendar, BarChart, TrendingUp, TrendingDown, Eye, Plus, ChevronDown } from 'lucide-react';
import AnimatedButton from '@/components/ui/AnimatedButton';
import Chart from '../components/Chart';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// NOVO: Importe o AnimatedCardWrapper
import AnimatedCardWrapper from '@/components/AnimatedCardWrapper'; // Ajuste o caminho se necessário

interface Project {
  id: string;
  name: string;
  location: string;
  status: 'Em andamento' | 'Iniciando' | 'Finalizado' | 'Pausado';
  progress: number;
}

const ProjectsPage = () => {
  // Dados de exemplo para projetos
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

  const projectsOverviewData = [
    { name: 'Em Andamento', value: 3 },
    { name: 'Finalizados', value: 1 },
    { name: 'Iniciando', value: 2 },
    { name: 'Pausados', value: 1 },
  ];

  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projectsData);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em andamento':
        return 'status-tag status-tag-ongoing';
      case 'Iniciando':
        return 'status-tag status-tag-starting';
      case 'Finalizado':
        return 'status-tag status-tag-completed';
      case 'Pausado':
        return 'status-tag status-tag-paused';
      default:
        return 'status-tag';
    }
  };

  const handleCreateNewProject = async () => {
    setIsCreatingProject(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsCreatingProject(false);
    alert("Novo projeto criado com sucesso!");
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      {/* Cabeçalho da página */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-residuall-gray-tableText">Projetos</h1>
          <p className="text-residuall-gray">Gerencie todos os seus projetos em um só lugar</p>
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
      <Card className="mb-6">
        <CardContent className="flex flex-wrap gap-4 items-center justify-between p-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              <span>Status</span>
              <ChevronDown size={16} />
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Data</span>
              <ChevronDown size={16} />
            </Button>
          </div>
          <div>
            <input
              type="text"
              placeholder="Buscar projetos..."
              className="input-field"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cards de Métricas (Reuso) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Podemos aplicar o AnimatedCardWrapper aqui também se quisermos */}
        {reuseMetricsData.map((metric, index) => (
          <AnimatedCardWrapper key={index} delay={0.05 * (index + 1)}> {/* Pequeno atraso sequencial */}
            <Card className="flex flex-col items-center justify-center p-4">
              <CardHeader className="p-0 pb-2 flex-col items-center">
                <CardDescription className="text-center">{metric.name}</CardDescription>
                <CardTitle className="text-2xl font-bold text-residuall-gray-tableText mt-2">
                  {metric.value} {metric.unit}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-center text-sm text-residuall-gray">
                {metric.description}
              </CardContent>
            </Card>
          </AnimatedCardWrapper>
        ))}
      </div>

      {/* Seção de Projetos Ativos (Cards de Projeto) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl text-residuall-gray-tableText">Projetos Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              // Envolva cada Card de Projeto com AnimatedCardWrapper
              <AnimatedCardWrapper key={project.id} delay={0.1 + (index * 0.1)}> {/* Atraso sequencial para cada card */}
                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-residuall-gray-tableText">{project.name}</CardTitle>
                    <CardDescription className="text-sm text-residuall-gray">{project.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className={getStatusColor(project.status)}>
                        {project.status}
                      </span>
                      <span className="text-residuall-gray">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-residuall-green h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Link to={`/dashboard/projetos/${project.id}`}>
                      <Button variant="outline" className="text-residuall-green-secondary hover:bg-residuall-green-secondary/10">
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
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl text-residuall-gray-tableText">Recomendações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Poderíamos aplicar o AnimatedCardWrapper aqui também */}
          {recommendations.map((rec) => (
            <div key={rec.id} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
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
                <p className="text-sm text-residuall-gray-dark">{rec.text}</p>
                <p className="text-xs text-residuall-gray mt-1">
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
