
import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data para materiais
const mockMaterials = [
  {
    id: '1',
    name: 'Tijolo Cerâmico',
    type: 'Alvenaria',
    unit: 'Unidade',
    stock: 5000,
    costPerUnit: 0.85,
    supplier: 'Cerâmica São Paulo',
    category: 'Estrutural'
  },
  {
    id: '2',
    name: 'Cimento Portland',
    type: 'Argamassa',
    unit: 'Saco 50kg',
    stock: 200,
    costPerUnit: 28.50,
    supplier: 'Votorantim',
    category: 'Básico'
  },
  {
    id: '3',
    name: 'Areia Média',
    type: 'Agregado',
    unit: 'm³',
    stock: 150,
    costPerUnit: 45.00,
    supplier: 'Mineração Santos',
    category: 'Agregado'
  },
  {
    id: '4',
    name: 'Brita 1',
    type: 'Agregado',
    unit: 'm³',
    stock: 120,
    costPerUnit: 52.00,
    supplier: 'Pedreira Central',
    category: 'Agregado'
  },
];

const MaterialsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Todos');

  const materialTypes = ['Todos', 'Alvenaria', 'Argamassa', 'Agregado', 'Acabamento'];

  const filteredMaterials = mockMaterials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'Todos' || material.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Materiais</h1>
          <p className="text-gray-600 mt-1">Gerencie o inventário de materiais de construção</p>
        </div>
        <Button className="bg-residuall-green hover:bg-residuall-green/90">
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

          {/* Filtro por Tipo - Dropdown Corrigido */}
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
            <div className="text-2xl font-bold text-gray-900">{mockMaterials.length}</div>
            <p className="text-xs text-gray-500 mt-1">tipos cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Valor Total em Estoque</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              R$ {mockMaterials.reduce((sum, material) => sum + (material.stock * material.costPerUnit), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-500 mt-1">valor total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Materiais em Falta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">2</div>
            <p className="text-xs text-gray-500 mt-1">precisam reposição</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Fornecedores Ativos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {new Set(mockMaterials.map(m => m.supplier)).size}
            </div>
            <p className="text-xs text-gray-500 mt-1">fornecedores</p>
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
                  Estoque
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
              {filteredMaterials.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{material.name}</div>
                      <div className="text-sm text-gray-500">{material.category}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {material.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {material.stock.toLocaleString()} {material.unit}
                    </div>
                    <div className={`text-xs ${material.stock < 100 ? 'text-red-500' : 'text-gray-500'}`}>
                      {material.stock < 100 ? 'Estoque baixo' : 'Estoque normal'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {material.costPerUnit.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {material.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900">
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-900">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum material encontrado com os filtros aplicados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialsPage;
