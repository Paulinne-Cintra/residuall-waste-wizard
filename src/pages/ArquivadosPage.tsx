
import React from 'react';
import { Trash2, RotateCcw, Archive } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useArchivedProjects } from '@/hooks/useArchivedProjects';
import DashboardHeader from '@/components/DashboardHeader';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ArquivadosPage = () => {
  const { archivedProjects, loading, restoreProject, deleteProject } = useArchivedProjects();

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-residuall-gray-light">
        <DashboardHeader />
        <div className="mt-6 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-residuall-green"></div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluído':
      case 'concluido':
        return 'bg-green-100 text-green-800';
      case 'em_andamento':
      case 'execução':
        return 'bg-blue-100 text-blue-800';
      case 'planejamento':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRestore = async (projectId: string) => {
    await restoreProject(projectId);
  };

  const handleDelete = async (projectId: string) => {
    await deleteProject(projectId);
  };

  return (
    <div className="flex-1 p-6 bg-residuall-gray-light">
      <DashboardHeader />

      <div className="mt-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Archive className="h-8 w-8 text-residuall-green" />
          <div>
            <h1 className="text-2xl font-bold text-residuall-gray-dark">Projetos Arquivados</h1>
            <p className="text-residuall-gray">Gerencie seus projetos arquivados</p>
          </div>
        </div>

        {/* Projetos Arquivados */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-residuall-gray-dark">
              Projetos Arquivados ({archivedProjects.length})
            </CardTitle>
            <CardDescription>
              Projetos que foram arquivados podem ser restaurados ou excluídos permanentemente
            </CardDescription>
          </CardHeader>
          <CardContent>
            {archivedProjects.length === 0 ? (
              <div className="text-center py-12">
                <Archive className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Nenhum projeto arquivado
                </h3>
                <p className="text-gray-500">
                  Você ainda não possui projetos arquivados. Os projetos arquivados aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {archivedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-residuall-gray-dark text-lg">
                            {project.name}
                          </h3>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-residuall-gray">
                          <div>
                            <span className="font-medium">Local:</span> {project.location || 'Não especificado'}
                          </div>
                          <div>
                            <span className="font-medium">Tipo:</span> {project.project_type || 'Não especificado'}
                          </div>
                          <div>
                            <span className="font-medium">Orçamento:</span> {
                              project.budget ? `R$ ${project.budget.toLocaleString('pt-BR')}` : 'Não especificado'
                            }
                          </div>
                        </div>

                        {project.description_notes && (
                          <p className="mt-2 text-sm text-residuall-gray">
                            <span className="font-medium">Descrição:</span> {project.description_notes}
                          </p>
                        )}

                        <div className="mt-2 text-xs text-gray-500">
                          Arquivado em: {new Date(project.updated_at).toLocaleDateString('pt-BR')}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestore(project.id)}
                          className="flex items-center gap-1"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Restaurar
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              Excluir
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir projeto permanentemente?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. O projeto "{project.name}" será 
                                excluído permanentemente junto com todos os seus dados, materiais e relatórios.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(project.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir Permanentemente
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArquivadosPage;
