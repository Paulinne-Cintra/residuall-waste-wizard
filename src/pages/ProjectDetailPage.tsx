
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Save, MapPin, Calendar, User, BarChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Mock data for the project
  const [projectData, setProjectData] = useState({
    id: projectId,
    name: 'Edifício Aurora',
    location: 'São Paulo, SP',
    status: 'Em andamento',
    progress: 75,
    startDate: '15/05/2023',
    endDate: '15/12/2023',
    responsible: 'Carlos Pereira',
    description: 'Projeto de construção de edifício residencial de alto padrão com foco em sustentabilidade e reutilização de materiais.',
    budget: 'R$ 2.500.000',
    team: 8
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Sucesso!",
      description: "Projeto atualizado com sucesso!",
      duration: 3000,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard/projetos">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Voltar para Projetos
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Projeto' : 'Detalhes do Projeto'}
          </h1>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save size={16} />
                Salvar Alterações
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
              <Edit size={16} />
              Editar Projeto
            </Button>
          )}
        </div>
      </div>

      {/* Project Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Projeto
              </label>
              {isEditing ? (
                <Input
                  value={projectData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              ) : (
                <p className="text-gray-900">{projectData.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Localização
              </label>
              {isEditing ? (
                <Input
                  value={projectData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              ) : (
                <div className="flex items-center text-gray-900">
                  <MapPin size={16} className="mr-2" />
                  {projectData.location}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              {isEditing ? (
                <Select 
                  value={projectData.status} 
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Em andamento">Em andamento</SelectItem>
                    <SelectItem value="Iniciando">Iniciando</SelectItem>
                    <SelectItem value="Finalizado">Finalizado</SelectItem>
                    <SelectItem value="Pausado">Pausado</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                  {projectData.status}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsável
              </label>
              {isEditing ? (
                <Input
                  value={projectData.responsible}
                  onChange={(e) => handleInputChange('responsible', e.target.value)}
                />
              ) : (
                <div className="flex items-center text-gray-900">
                  <User size={16} className="mr-2" />
                  {projectData.responsible}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Timeline and Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Cronograma e Progresso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Início
              </label>
              {isEditing ? (
                <Input
                  value={projectData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              ) : (
                <div className="flex items-center text-gray-900">
                  <Calendar size={16} className="mr-2" />
                  {projectData.startDate}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Conclusão Prevista
              </label>
              {isEditing ? (
                <Input
                  value={projectData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
              ) : (
                <div className="flex items-center text-gray-900">
                  <Calendar size={16} className="mr-2" />
                  {projectData.endDate}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Progresso
              </label>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>{projectData.progress}% concluído</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${projectData.progress}%` }}
                ></div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Orçamento
              </label>
              {isEditing ? (
                <Input
                  value={projectData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                />
              ) : (
                <p className="text-gray-900">{projectData.budget}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Descrição do Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={projectData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              placeholder="Descrição detalhada do projeto..."
            />
          ) : (
            <p className="text-gray-700">{projectData.description}</p>
          )}
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Equipe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-blue-600">{projectData.team}</div>
              <div className="bg-blue-100 p-2 rounded-full">
                <User size={24} className="text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">membros ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Taxa de Reaproveitamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-green-600">72%</div>
              <div className="bg-green-100 p-2 rounded-full">
                <BarChart size={24} className="text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">materiais reutilizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Economia Gerada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-emerald-600">R$ 125k</div>
              <div className="bg-emerald-100 p-2 rounded-full">
                <BarChart size={24} className="text-emerald-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">em materiais</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ProjectDetailPage;
