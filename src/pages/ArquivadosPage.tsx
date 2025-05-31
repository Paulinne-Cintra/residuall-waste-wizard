
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { File, Trash2, Filter, Calendar, ChevronDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useArchivedProjects } from "@/hooks/useArchivedProjects";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const ArquivadosPage = () => {
  const { toast } = useToast();
  const { archivedProjects, loading, error, restoreProject, deleteProject } = useArchivedProjects();
  const [typeFilter, setTypeFilter] = useState('Tipo');
  const [dateFilter, setDateFilter] = useState('Data');
  const [searchQuery, setSearchQuery] = useState('');

  const handleRestore = async (project: any) => {
    const success = await restoreProject(project.id);
    if (success) {
      console.log(`Projeto "${project.name}" restaurado com sucesso`);
    }
  };

  const handleDelete = async (project: any) => {
    const success = await deleteProject(project.id);
    if (success) {
      console.log(`Projeto "${project.name}" excluído permanentemente`);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    console.log('Busca projetos arquivados:', value);
  };

  // Filtragem dos projetos com base na busca
  const filteredProjects = archivedProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (project.location?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
                         (project.project_type?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    
    const matchesType = typeFilter === 'Tipo' || typeFilter === 'Todos' || project.project_type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-residuall-gray-light">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-residuall-green"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 bg-residuall-gray-light">
        <div className="text-center text-red-600">
          Erro ao carregar projetos arquivados: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-residuall-gray-light">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-residuall-gray-dark">Itens Arquivados</h1>
        <p className="text-residuall-gray">Gerencie itens arquivados e restaure quando necessário</p>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="flex flex-wrap gap-4 items-center justify-between p-4">
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter size={16} />
                  <span>{typeFilter}</span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTypeFilter('Todos')}>Todos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('Residencial')}>Residencial</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('Comercial')}>Comercial</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('Industrial')}>Industrial</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('Infraestrutura')}>Infraestrutura</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{dateFilter}</span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
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
              placeholder="Buscar projetos arquivados..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-residuall-green focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-residuall-gray-dark">Lista de Itens Arquivados</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Projeto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Data de Arquivamento</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.project_type || 'Não definido'}</TableCell>
                  <TableCell>{project.location || 'Não definido'}</TableCell>
                  <TableCell>{formatDate(project.updated_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(project)}
                        className="flex items-center"
                      >
                        <File size={16} className="mr-1" /> Restaurar
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-700 flex items-center"
                          >
                            <Trash2 size={16} className="mr-1" /> Excluir
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir este item permanentemente? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(project)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Excluir Permanentemente
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-8">
            <p className="text-residuall-gray">
              {archivedProjects.length === 0 
                ? "Nenhum projeto arquivado encontrado." 
                : "Nenhum projeto encontrado com os filtros aplicados."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArquivadosPage;
