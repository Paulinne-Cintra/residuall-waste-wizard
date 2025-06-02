
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProjects } from '@/hooks/useProjects';
import { useProjectMaterials } from '@/hooks/useProjectMaterials';
import { useProjectStageWaste } from '@/hooks/useProjectStageWaste';
import MaterialFormModal from '@/components/MaterialFormModal';
import StageWasteModal from '@/components/StageWasteModal';
import Chart from '@/components/Chart';

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, loading: loadingProjects } = useProjects();
  const { materials, loading: loadingMaterials } = useProjectMaterials();
  const { stageWaste, wasteByStage, loading: loadingStageWaste } = useProjectStageWaste(id);
  
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [isStageWasteModalOpen, setIsStageWasteModalOpen] = useState(false);

  if (loadingProjects) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-residuall-green"></div>
      </div>
    );
  }

  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Projeto não encontrado</h1>
          <p className="text-gray-600 mb-4">O projeto que você está procurando não existe ou foi removido.</p>
          <Link to="/dashboard/projetos">
            <Button>Voltar para Projetos</Button>
          </Link>
        </div>
      </div>
    );
  }

  const projectMaterials = materials.filter(m => m.project_id === id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'execução':
      case 'em_andamento':
        return 'bg-green-100 text-green-800';
      case 'planejamento':
        return 'bg-blue-100 text-blue-800';
      case 'concluído':
      case 'concluido':
        return 'bg-gray-100 text-gray-800';
      case 'finalização':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link to="/dashboard/projetos">
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600">{project.location}</p>
            </div>
          </div>
          <Badge className={getStatusColor(project.status)}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Badge>
        </div>

        {/* Project Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Tipo:</strong> {project.project_type || 'Não especificado'}</p>
                <p><strong>Data de Início:</strong> {project.start_date ? new Date(project.start_date).toLocaleDateString('pt-BR') : 'Não definida'}</p>
                <p><strong>Previsão de Término:</strong> {project.planned_end_date ? new Date(project.planned_end_date).toLocaleDateString('pt-BR') : 'Não definida'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orçamento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-residuall-green">
                {project.budget ? `R$ ${project.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Não definido'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equipe</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{project.responsible_team_contacts || 'Equipe não definida'}</p>
            </CardContent>
          </Card>
        </div>

        {/* Desperdício por Etapa */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Desperdício por Etapa</CardTitle>
              <CardDescription>Controle de desperdício nas diferentes etapas da obra</CardDescription>
            </div>
            <Button onClick={() => setIsStageWasteModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Registrar Desperdício
            </Button>
          </CardHeader>
          <CardContent>
            {loadingStageWaste ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-residuall-green mx-auto"></div>
              </div>
            ) : wasteByStage.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Chart 
                    type="pie" 
                    data={wasteByStage} 
                    height={250} 
                    title="Distribuição por Etapa"
                  />
                </div>
                <div className="space-y-3">
                  {wasteByStage.map((stage, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{stage.name}</span>
                      <div className="text-right">
                        <p className="font-semibold">{stage.quantidade.toFixed(1)} kg</p>
                        {stage.custo > 0 && <p className="text-sm text-gray-600">R$ {stage.custo.toFixed(2)}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum dado de desperdício registrado ainda.</p>
                <Button className="mt-4" onClick={() => setIsStageWasteModalOpen(true)}>
                  Registrar Primeiro Desperdício
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Materiais */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Materiais do Projeto</CardTitle>
              <CardDescription>Materiais cadastrados para este projeto</CardDescription>
            </div>
            <Button onClick={() => setIsMaterialModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Material
            </Button>
          </CardHeader>
          <CardContent>
            {loadingMaterials ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-residuall-green mx-auto"></div>
              </div>
            ) : projectMaterials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectMaterials.map((material) => (
                  <Card key={material.id} className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{material.material_type_name}</CardTitle>
                      <CardDescription>
                        {material.category && <Badge variant="outline">{material.category}</Badge>}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p><strong>Quantidade Estimada:</strong> {material.estimated_quantity} {material.unit_of_measurement}</p>
                        <p><strong>Custo por Unidade:</strong> R$ {material.cost_per_unit?.toFixed(2) || '0,00'}</p>
                        {material.stock_quantity !== undefined && (
                          <p><strong>Estoque:</strong> {material.stock_quantity}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum material cadastrado ainda.</p>
                <Button className="mt-4" onClick={() => setIsMaterialModalOpen(true)}>
                  Adicionar Primeiro Material
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        {project.description_notes && (
          <Card>
            <CardHeader>
              <CardTitle>Descrição e Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{project.description_notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modals */}
      <MaterialFormModal
        isOpen={isMaterialModalOpen}
        onClose={() => setIsMaterialModalOpen(false)}
        onSubmit={() => {}}
        projectId={id!}
      />

      <StageWasteModal
        isOpen={isStageWasteModalOpen}
        onClose={() => setIsStageWasteModalOpen(false)}
        projectId={id!}
      />
    </main>
  );
};

export default ProjectDetailPage;
