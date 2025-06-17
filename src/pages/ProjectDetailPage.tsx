
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
  Edit
} from 'lucide-react';
import { useOptimizedProjects } from '@/hooks/useOptimizedProjects';
import { useProjectMaterials } from '@/hooks/useProjectMaterials';
import { useProjectTeamMembers } from '@/hooks/useProjectTeamMembers';
import { useProjectTimeline } from '@/hooks/useProjectTimeline';
import { useProjectStageWaste } from '@/hooks/useProjectStageWaste';
import Chart from '@/components/Chart';
import EditProjectForm from '@/components/forms/EditProjectForm';

const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, loading } = useOptimizedProjects();
  const { materials, loading: materialsLoading } = useProjectMaterials(projectId || '');
  const { teamMembers, loading: teamLoading } = useProjectTeamMembers(projectId || '');
  const { timeline, loading: timelineLoading } = useProjectTimeline(projectId || '');
  const { stageWaste } = useProjectStageWaste();
  const [project, setProject] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Filtrar dados de desperdício para este projeto
  const projectWasteData = projectId ? stageWaste.filter(waste => waste.project_id === projectId) : [];

  useEffect(() => {
    if (projects.length > 0 && projectId) {
      const foundProject = projects.find(p => p.id === projectId);
      if (foundProject) {
        setProject(foundProject);
      }
    }
  }, [projects, projectId]);

  const handleProjectUpdate = (updatedProject: any) => {
    setProject(updatedProject);
    setIsEditing(false);
  };

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

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Projeto</h1>
              <p className="text-gray-600">Atualize as informações do projeto</p>
            </div>
          </div>
        </div>
        
        <EditProjectForm 
          project={project} 
          onUpdate={handleProjectUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

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
        <Button onClick={() => setIsEditing(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Editar
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
            <div className="text-2xl font-bold text-gray-900">{project.materials_count || 0}</div>
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
            <div className="text-2xl font-bold text-gray-900">
              {project.planned_end_date ? new Date(project.planned_end_date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }) : 'N/A'}
            </div>
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
                {projectWasteData.length > 0 ? (
                  <Chart type="line" data={projectWasteData.map(waste => ({
                    month: new Date(waste.measurement_date).toLocaleDateString('pt-BR', { month: 'short' }),
                    waste: waste.waste_quantity,
                    cost: waste.waste_cost || 0
                  }))} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum dado de desperdício disponível
                  </div>
                )}
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
                    {project.description_notes || 'Nenhuma descrição disponível.'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Data de Início</h4>
                    <p className="text-sm text-gray-600">
                      {project.start_date ? new Date(project.start_date).toLocaleDateString('pt-BR') : 'Não informado'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Tipo</h4>
                    <p className="text-sm text-gray-600">{project.project_type || 'Não informado'}</p>
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
              {materialsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-residuall-green mx-auto"></div>
                </div>
              ) : materials.length > 0 ? (
                <div className="space-y-4">
                  {materials.map((material) => (
                    <div key={material.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{material.material_type_name}</h4>
                        <p className="text-sm text-gray-500">
                          {material.estimated_quantity} {material.unit_of_measurement} • R$ {material.total_estimated_cost.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm">
                          <AlertTriangle className="h-4 w-4 mr-1 text-orange-500" />
                          <span className="text-orange-600 font-medium">{material.waste_percentage?.toFixed(1) || '0'}%</span>
                        </div>
                        <p className="text-xs text-gray-500">desperdício</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum material cadastrado</h3>
                  <p className="text-gray-500">Cadastre materiais para este projeto para visualizar as informações aqui.</p>
                </div>
              )}
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
              {timelineLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-residuall-green mx-auto"></div>
                </div>
              ) : timeline.length > 0 ? (
                <div className="space-y-6">
                  {timeline.map((phase) => (
                    <div key={phase.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{phase.stage_name}</h4>
                        <Badge variant={phase.status === 'Concluída' ? 'default' : phase.status === 'Em andamento' ? 'secondary' : 'outline'}>
                          {phase.status}
                        </Badge>
                      </div>
                      <Progress value={phase.progress} className="h-2" />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{phase.progress}% concluído</span>
                        <span>Desperdício: {phase.waste_quantity}kg</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum dado de cronograma disponível</h3>
                  <p className="text-gray-500">Registre desperdícios por etapa para visualizar o progresso aqui.</p>
                </div>
              )}
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
              {teamLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-residuall-green mx-auto"></div>
                </div>
              ) : teamMembers.length > 0 ? (
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                      <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {member.profile_picture_url ? (
                          <img
                            src={member.profile_picture_url}
                            alt={member.name}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-600">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{member.name}</h4>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum membro de equipe atribuído</h3>
                  <p className="text-gray-500">Atribua membros da equipe a este projeto para visualizá-los aqui.</p>
                </div>
              )}
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
