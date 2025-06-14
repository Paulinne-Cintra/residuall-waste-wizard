
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '@/hooks/useProjects';
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import {
  Building,
  Plus,
  MapPin,
  Package,
  AlertTriangle,
  Eye,
  MoreVertical,
  Edit,
  FileText,
  Archive
} from "lucide-react";

const ProjectsPage = () => {
  const { projects, loading, error, archiveProject, refetch } = useProjects();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');

  // Logs para debug
  console.log('🏠 ProjectsPage renderizando:');
  console.log('- Projects:', projects);
  console.log('- Loading:', loading);
  console.log('- Error:', error);
  console.log('- Quantidade de projetos:', projects?.length);

  useEffect(() => {
    console.log('🔄 ProjectsPage useEffect - StatusFilter mudou:', statusFilter);
    // Não precisamos refetch quando o filtro de status mudar, apenas quando o componente montar
  }, []);

  const handleArchiveProject = async (project: any) => {
    console.log('📦 Tentando arquivar projeto:', project);
    const success = await archiveProject(project.id);
    if (success) {
      refetch(); // Atualizar a lista após arquivar
    }
  };

  // Filtrar projetos por busca e status
  const filteredProjects = React.useMemo(() => {
    console.log('🔍 Filtrando projetos...');
    console.log('- Array original:', projects);
    console.log('- É array?', Array.isArray(projects));
    
    if (!Array.isArray(projects)) {
      console.log('❌ Projects não é um array válido');
      return [];
    }

    const filtered = projects.filter(project => {
      const searchTerm = searchQuery.toLowerCase();
      const matchesSearch = project.name.toLowerCase().includes(searchTerm) ||
             (project.location && project.location.toLowerCase().includes(searchTerm)) ||
             project.status.toLowerCase().includes(searchTerm);
      
      const matchesStatus = statusFilter === 'Todos' || project.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    console.log('✅ Projetos filtrados:', filtered);
    return filtered;
  }, [projects, searchQuery, statusFilter]);

  if (error) {
    console.log('❌ Exibindo erro:', error);
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-16 w-16 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar projetos</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={refetch}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-residuall-gray-dark">Projetos</h1>
          <p className="text-residuall-gray">Acompanhe e gerencie seus projetos</p>
        </div>
        <Link to="/dashboard/projetos/novo">
          <Button className="bg-residuall-green hover:bg-residuall-green/90">
            <Plus className="h-4 w-4 mr-2" />
            Criar Novo Projeto
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="flex flex-wrap gap-4 items-center justify-between p-4">
          <div className="flex flex-wrap gap-2">
            <div>
              <Label htmlFor="search">Buscar Projeto:</Label>
              <Input
                type="text"
                id="search"
                placeholder="Buscar por nome, localização..."
                className="ml-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="status">Filtrar por Status:</Label>
              <select
                id="status"
                className="ml-2 p-2 border rounded"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="Todos">Todos</option>
                <option value="planejamento">Planejamento</option>
                <option value="execução">Execução</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluído">Concluído</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de projetos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-residuall-gray-tableText">
            Projetos ({filteredProjects.length})
            {loading && <span className="text-sm font-normal text-gray-500 ml-2">(Carregando...)</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-residuall-green mx-auto"></div>
              <p className="mt-4 text-gray-500">Carregando projetos...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <Building className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {projects.length === 0 ? 'Nenhum projeto criado' : 'Nenhum projeto encontrado'}
              </h3>
              <p className="text-gray-500 mb-4">
                {projects.length === 0 
                  ? 'Comece criando seu primeiro projeto para monitorar desperdícios e otimizar recursos.'
                  : 'Tente ajustar os filtros de busca ou criar um novo projeto.'
                }
              </p>
              <Link to="/dashboard/projetos/novo">
                <Button className="bg-residuall-green hover:bg-residuall-green/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Novo Projeto
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                console.log('🎨 Renderizando projeto:', project);
                return (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <Link to={`/dashboard/projetos/${project.id}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base font-semibold text-residuall-gray-dark line-clamp-2">
                              {project.name}
                            </CardTitle>
                            <div className="flex items-center text-sm text-residuall-gray mt-1">
                              <MapPin size={14} className="mr-1" />
                              {project.location || 'Localização não informada'}
                            </div>
                          </div>
                          <Badge 
                            className={`ml-2 ${
                              project.status === 'execução' || project.status === 'em_andamento' 
                                ? 'bg-green-100 text-green-800' 
                                : project.status === 'planejamento'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {project.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-residuall-gray">Progresso</span>
                              <span className="font-medium">0%</span>
                            </div>
                            <Progress value={0} className="h-2 bg-gray-200" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center text-residuall-gray">
                              <Package size={14} className="mr-1" />
                              <span>0 materiais</span>
                            </div>
                            <div className="flex items-center text-residuall-gray">
                              <AlertTriangle size={14} className="mr-1" />
                              <span>0 registros</span>
                            </div>
                          </div>

                          <div className="text-xs text-residuall-gray">
                            Criado em {new Date(project.created_at).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                    
                    <CardContent className="pt-0 border-t">
                      <div className="flex justify-between items-center">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/dashboard/projetos/${project.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Link>
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/dashboard/projetos/${project.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver detalhes
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/dashboard/projetos/${project.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/dashboard/relatorios/${project.id}`}>
                                <FileText className="h-4 w-4 mr-2" />
                                Gerar relatório
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-orange-600"
                              onClick={() => handleArchiveProject(project)}
                            >
                              <Archive className="h-4 w-4 mr-2" />
                              Arquivar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsPage;
