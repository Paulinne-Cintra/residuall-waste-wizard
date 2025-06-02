
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  Package, 
  TrendingUp,
  AlertTriangle,
  FileText,
  Settings
} from 'lucide-react';
import { useOptimizedProjects } from '@/hooks/useOptimizedProjects';
import Chart from '@/components/Chart';

const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, loading } = useOptimizedProjects();
  const [project, setProject] = useState<any>(null);

  // Dados fictícios para demonstração
  const mockProjectDetails = {
    materials: [
      { name: 'Concreto', quantity: 150, unit: 'm³', cost: 45000, waste: 8.2 },
      { name: 'Aço', quantity: 12, unit: 'ton', cost: 28000, waste: 5.1 },
      { name: 'Tijolos', quantity: 50000, unit: 'un', cost: 15000, waste: 12.3 },
      { name: 'Cimento', quantity: 200, unit: 'sac', cost: 8000, waste: 3.7 }
    ],
    timeline: [
      { phase: 'Fundação', progress: 100, status: 'Concluída' },
      { phase: 'Estrutura', progress: 85, status: 'Em andamento' },
      { phase: 'Alvenaria', progress: 60, status: 'Em andamento' },
      { phase: 'Acabamento', progress: 0, status: 'Pendente' }
    ],
    wasteData: [
      { month: 'Jan', waste: 2.3, cost: 1200 },
      { month: 'Fev', waste: 3.1, cost: 1800 },
      { month: 'Mar', waste: 1.8, cost: 950 },
      { month: 'Abr', waste: 2.7, cost: 1400 }
    ],
    team: [
      { name: 'Ana Silva', role: 'Gerente de Projeto', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40' },
      { name: 'Carlos Mendes', role: 'Arquiteto', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40' },
      { name: 'João Oliveira', role: 'Engenheiro', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40' }
    ]
  };

  useEffect(() => {
    if (projects.length > 0 && projectId) {
      const foundProject = projects.find(p => p.id === projectId);
      if (foundProject) {
        setProject(foundProject);
      } else {
        // Projeto fictício para demonstração
        setProject({
          id: projectId,
          name: 'Edifício Residencial Sustentável',
          location: 'São Paulo, SP',
          status: 'em_andamento',
          progress_percentage: 68,
          materials_count: 4,
          created_at: '2024-01-15T08:00:00Z',
          budget: 2500000,
          start_date: '2024-01-15',
          planned_end_date: '2024-12-20',
          description_notes: 'Projeto de edifício residencial com foco em sustentabilidade e redução de desperdícios.',
          project_type: 'Residencial'
        });
      }
    }
  }, [projects, projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-residuall-green"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h2>
        <Link to="/dashboard/projetos">
          <Button variant="outline">Voltar para Projetos</Button>
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em_andamento':
      case 'execução':
        return 'bg-green-100 text-green-800';
      case 'planejamento':
        return 'bg-blue-100 text-blue-800';
      case 'concluído':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard/projetos">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                {project.location}
              </div>
              <Badge className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
            </div>
          </div>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Configurações
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Progresso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2">{project.progress_percentage}%</div>
            <Progress value={project.progress_percentage} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              Orçamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              R$ {project.budget ? (project.budget / 1000000).toFixed(1) : '2.5'}M
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
              <Package className="h-4 w-4 mr-1" />
              Materiais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{project.materials_count || 4}</div>
            <p className="text-sm text-gray-500">tipos cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Prazo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">Dec/24</div>
            <p className="text-sm text-gray-500">conclusão prevista</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com conteúdo detalhado */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="materials">Materiais</TabsTrigger>
          <TabsTrigger value="timeline">Cronograma</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Desperdício por Mês
                </CardTitle>
                <CardDescription>Evolução do desperdício de materiais</CardDescription>
              </CardHeader>
              <CardContent>
                <Chart type="line" data={mockProjectDetails.wasteData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações do Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Descrição</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {project.description_notes || 'Projeto de edifício residencial com foco em sustentabilidade e redução de desperdícios.'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Data de Início</h4>
                    <p className="text-sm text-gray-600">{new Date(project.start_date || '2024-01-15').toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Tipo</h4>
                    <p className="text-sm text-gray-600">{project.project_type || 'Residencial'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="materials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Materiais do Projeto</CardTitle>
              <CardDescription>Lista de materiais cadastrados e seus desperdícios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProjectDetails.materials.map((material, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{material.name}</h4>
                      <p className="text-sm text-gray-500">
                        {material.quantity} {material.unit} • R$ {material.cost.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm">
                        <AlertTriangle className="h-4 w-4 mr-1 text-orange-500" />
                        <span className="text-orange-600 font-medium">{material.waste}%</span>
                      </div>
                      <p className="text-xs text-gray-500">desperdício</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cronograma do Projeto</CardTitle>
              <CardDescription>Progresso das fases da obra</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockProjectDetails.timeline.map((phase, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{phase.phase}</h4>
                      <Badge variant={phase.status === 'Concluída' ? 'default' : phase.status === 'Em andamento' ? 'secondary' : 'outline'}>
                        {phase.status}
                      </Badge>
                    </div>
                    <Progress value={phase.progress} className="h-2" />
                    <p className="text-sm text-gray-500">{phase.progress}% concluído</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Equipe do Projeto
              </CardTitle>
              <CardDescription>Membros responsáveis pelo projeto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProjectDetails.team.map((member, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{member.name}</h4>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Relatórios
              </CardTitle>
              <CardDescription>Relatórios gerados para este projeto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum relatório disponível</h3>
                <p className="text-gray-500 mb-4">Gere relatórios para acompanhar o progresso do projeto.</p>
                <Button>
                  Gerar Novo Relatório
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetailPage;
