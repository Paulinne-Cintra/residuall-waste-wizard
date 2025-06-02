
import React, { useState, useMemo } from 'react';
import { Plus, Search, Package, AlertTriangle, CheckCircle, Filter, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useProjectMaterials } from '@/hooks/useProjectMaterials';
import { useProjects } from '@/hooks/useProjects';
import MaterialFormModal from '@/components/MaterialFormModal';

const MaterialsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [stockFilter, setStockFilter] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { materials, loading, error } = useProjectMaterials();
  const { projects } = useProjects();

  // Filtrar materiais baseado nos filtros
  const filteredMaterials = useMemo(() => {
    return materials.filter(material => {
      const matchesSearch = material.material_type_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (material.category && material.category.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'Todas' || material.category === categoryFilter;
      
      let matchesStock = true;
      if (stockFilter === 'Em Falta') {
        matchesStock = (material.stock_quantity || 0) <= (material.minimum_quantity || 0);
      } else if (stockFilter === 'Estoque Normal') {
        matchesStock = (material.stock_quantity || 0) > (material.minimum_quantity || 0);
      }
      
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [materials, searchQuery, categoryFilter, stockFilter]);

  // Estatísticas dos materiais
  const stats = useMemo(() => {
    const totalMaterials = materials.length;
    const materialsInShortage = materials.filter(m => (m.stock_quantity || 0) <= (m.minimum_quantity || 0)).length;
    const totalValue = materials.reduce((sum, m) => sum + ((m.estimated_quantity || 0) * (m.cost_per_unit || 0)), 0);
    const categories = [...new Set(materials.map(m => m.category).filter(Boolean))];
    
    return {
      totalMaterials,
      materialsInShortage,
      totalValue,
      categoriesCount: categories.length
    };
  }, [materials]);

  // Obter categorias únicas para filtro
  const categories = useMemo(() => {
    return [...new Set(materials.map(m => m.category).filter(Boolean))];
  }, [materials]);

  // Função para obter status do estoque
  const getStockStatus = (material: any) => {
    const stock = material.stock_quantity || 0;
    const minimum = material.minimum_quantity || 0;
    
    if (stock <= minimum) {
      return { status: 'low', label: 'Estoque Baixo', color: 'bg-red-500' };
    } else if (stock <= minimum * 1.5) {
      return { status: 'medium', label: 'Estoque Médio', color: 'bg-yellow-500' };
    } else {
      return { status: 'good', label: 'Estoque Bom', color: 'bg-green-500' };
    }
  };

  // Função para obter nome do projeto
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Projeto não encontrado';
  };

  // Função para calcular progresso do estoque
  const getStockProgress = (material: any) => {
    const stock = material.stock_quantity || 0;
    const minimum = material.minimum_quantity || 0;
    const estimated = material.estimated_quantity || 0;
    
    if (estimated === 0) return 0;
    return Math.min((stock / estimated) * 100, 100);
  };

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-residuall-green"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="text-center text-red-600">
          Erro ao carregar materiais: {error}
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-residuall-gray-tableText">Materiais</h1>
          <p className="text-residuall-gray">Gerencie todos os materiais dos seus projetos</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-residuall-green hover:bg-residuall-green/90 mt-4 md:mt-0"
        >
          <Plus size={18} />
          Adicionar Material
        </Button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Package size={16} className="text-residuall-green" />
              Total de Materiais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-residuall-gray-tableText">{stats.totalMaterials}</div>
            <p className="text-sm text-residuall-gray">cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-500" />
              Materiais em Falta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.materialsInShortage}</div>
            <p className="text-sm text-residuall-gray">precisam de reposição</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle size={16} className="text-residuall-green" />
              Valor Total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-residuall-green">
              R$ {stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-residuall-gray">em materiais</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Categorias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-residuall-gray-tableText">{stats.categoriesCount}</div>
            <p className="text-sm text-residuall-gray">diferentes tipos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="flex flex-wrap gap-4 items-center justify-between p-4">
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter size={16} />
                  <span>{categoryFilter}</span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem onClick={() => setCategoryFilter('Todas')}>
                  Todas as Categorias
                </DropdownMenuItem>
                {categories.map(category => (
                  <DropdownMenuItem key={category} onClick={() => setCategoryFilter(category)}>
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <AlertTriangle size={16} />
                  <span>{stockFilter}</span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem onClick={() => setStockFilter('Todos')}>
                  Todos os Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStockFilter('Em Falta')}>
                  Em Falta
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStockFilter('Estoque Normal')}>
                  Estoque Normal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar materiais..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela de materiais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-residuall-gray-tableText">
            Lista de Materiais ({filteredMaterials.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMaterials.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {materials.length === 0 ? 'Nenhum material cadastrado' : 'Nenhum material encontrado'}
              </h3>
              <p className="text-gray-500 mb-6">
                {materials.length === 0 
                  ? 'Comece adicionando materiais aos seus projetos.' 
                  : 'Tente ajustar os filtros de busca.'
                }
              </p>
              {materials.length === 0 && (
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-residuall-green hover:bg-residuall-green/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Material
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Projeto</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Custo Unit.</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progresso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((material) => {
                    const stockStatus = getStockStatus(material);
                    const stockProgress = getStockProgress(material);
                    
                    return (
                      <TableRow key={material.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-residuall-gray-tableText">
                              {material.material_type_name}
                            </p>
                            {material.dimensions_specs && (
                              <p className="text-sm text-gray-500">{material.dimensions_specs}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-residuall-gray">
                          {getProjectName(material.project_id)}
                        </TableCell>
                        <TableCell>
                          {material.category && (
                            <Badge variant="secondary" className="text-xs">
                              {material.category}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-residuall-gray">
                          {material.estimated_quantity} {material.unit_of_measurement}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex flex-col">
                            <span className={`font-medium ${stockStatus.status === 'low' ? 'text-red-600' : 'text-gray-900'}`}>
                              {material.stock_quantity || 0}
                            </span>
                            <span className="text-xs text-gray-500">
                              Min: {material.minimum_quantity || 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm font-medium text-residuall-green">
                          {material.cost_per_unit 
                            ? `R$ ${material.cost_per_unit.toFixed(2)}`
                            : 'N/A'
                          }
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={`text-xs text-white ${
                              stockStatus.status === 'low' ? 'bg-red-500' :
                              stockStatus.status === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                          >
                            {stockStatus.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="w-full">
                            <Progress value={stockProgress} className="h-2" />
                            <span className="text-xs text-gray-500 mt-1">
                              {stockProgress.toFixed(0)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para adicionar material */}
      <MaterialFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
};

export default MaterialsPage;
