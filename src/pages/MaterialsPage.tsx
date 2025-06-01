
import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import MaterialFormModal from "@/components/MaterialFormModal";
import { useMaterialsManagement } from "@/hooks/useMaterialsManagement";
import { useProjects } from "@/hooks/useProjects";
import { useNavigate } from 'react-router-dom';

const MaterialsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { materials, stats, loading, createMaterial, deleteMaterial } = useMaterialsManagement();
  const { projects } = useProjects();

  const materialTypes = ['Todos', 'Alvenaria', 'Argamassa', 'Agregado', 'Acabamento', 'Estrutural', 'Hidráulico', 'Elétrico', 'Madeira', 'Metal', 'Tintas', 'Outros'];

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.material_type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (material.suppliers?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'Todos' || material.category === selectedType;
    return matchesSearch && matchesType;
  });

  const handleViewProject = (projectId: string) => {
    navigate(`/dashboard/projetos/${projectId}`);
  };

  const handleDeleteMaterial = async (materialId: string) => {
    await deleteMaterial(materialId);
  };

  const handleCreateMaterial = async (data: any) => {
    return await createMaterial(data);
  };

  if (loading) {
    return (
      <div className="p-0">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Carregando materiais...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Materiais</h1>
          <p className="text-gray-600 mt-1">Gerencie o inventário de materiais de construção</p>
        </div>
        <Button 
          className="bg-residuall-green hover:bg-residuall-green/90"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} className="mr-2" />
          Adicionar Material
        </Button>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar materiais ou fornecedores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtro por Tipo */}
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 min-w-[150px] justify-between">
                  <Filter size={16} />
                  <span>{selectedType}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="start" sideOffset={8}>
                {materialTypes.map((type) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={selectedType === type ? 'bg-residuall-green/10 text-residuall-green font-medium' : ''}
                  >
                    {type}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Materiais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalMaterials}</div>
            <p className="text-xs text-gray-500 mt-1">tipos cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Valor Total em Estoque</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              R$ {stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-500 mt-1">valor total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Materiais em Falta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.lowStockCount}</div>
            <p className="text-xs text-gray-500 mt-1">precisam reposição</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tipo Mais Utilizado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.mostUsedType}</div>
            <p className="text-xs text-gray-500 mt-1">categoria</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Materiais */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Lista de Materiais ({filteredMaterials.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Material
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Custo/Unidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fornecedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMaterials.map((material) => {
                const project = projects.find(p => p.id === material.project_id);
                const stock = material.stock_quantity || 0;
                const minimum = material.minimum_quantity || 0;
                const isLowStock = stock <= minimum;
                
                return (
                  <tr key={material.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{material.material_type_name}</div>
                        <div className="text-sm text-gray-500">{project?.name || 'Projeto não encontrado'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {material.category || 'Outros'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {(material.estimated_quantity || 0).toLocaleString()} {material.unit_of_measurement}
                      </div>
                      <div className={`text-xs ${isLowStock ? 'text-red-500' : 'text-gray-500'}`}>
                        Estoque: {stock.toLocaleString()} {isLowStock ? '(Baixo)' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {(material.cost_per_unit || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {material.suppliers?.name || 'Não informado'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleViewProject(material.project_id)}
                          title="Ver projeto"
                        >
                          <Eye size={16} />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-900">
                              <Trash2 size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o material "{material.material_type_name}"? 
                                Esta ação não poderá ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDeleteMaterial(material.id)}
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum material encontrado com os filtros aplicados.</p>
          </div>
        )}
      </div>

      {/* Modal de Cadastro */}
      <MaterialFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateMaterial}
      />
    </div>
  );
};

export default MaterialsPage;
