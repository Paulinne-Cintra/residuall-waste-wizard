
import { useState } from 'react';
import { Plus, Filter, BarChart, CheckCircle, AlertTriangle, Eye, ArrowLeft } from 'lucide-react';
import Chart from '../components/Chart';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Interface para os materiais
interface Material {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reuseRate: number;
  status: 'Em uso' | 'Reutilizado' | 'Descartado' | 'Em estoque';
}

const MaterialsPage = () => {
  const { toast } = useToast();
  
  // Dados de exemplo para os materiais
  const materialsData: Material[] = [
    {
      id: '1',
      name: 'Concreto',
      category: 'Estrutural',
      quantity: 250,
      unit: 'm³',
      reuseRate: 68,
      status: 'Em uso',
    },
    {
      id: '2',
      name: 'Madeira Pinus',
      category: 'Madeiras',
      quantity: 420,
      unit: 'm²',
      reuseRate: 85,
      status: 'Reutilizado',
    },
    {
      id: '3',
      name: 'Aço CA-50',
      category: 'Estrutural',
      quantity: 1200,
      unit: 'kg',
      reuseRate: 92,
      status: 'Em uso',
    },
    {
      id: '4',
      name: 'Tijolo Cerâmico',
      category: 'Alvenaria',
      quantity: 15000,
      unit: 'un',
      reuseRate: 25,
      status: 'Descartado',
    },
    {
      id: '5',
      name: 'Tinta Acrílica',
      category: 'Acabamento',
      quantity: 85,
      unit: 'L',
      reuseRate: 15,
      status: 'Em estoque',
    },
    {
      id: '6',
      name: 'Argamassa',
      category: 'Alvenaria',
      quantity: 350,
      unit: 'kg',
      reuseRate: 40,
      status: 'Em uso',
    },
  ];

  // Dados para gráficos
  const reuseRateData = [
    { name: 'Reutilizado', value: 68 },
    { name: 'Desperdício', value: 32 },
  ];

  const materialsByReuseData = [
    { name: 'Aço', reusado: 92 },
    { name: 'Madeira', reusado: 85 },
    { name: 'Concreto', reusado: 68 },
    { name: 'Argamassa', reusado: 40 },
    { name: 'Cerâmica', reusado: 25 },
    { name: 'Tinta', reusado: 15 },
  ];

  // Estado para os filtros
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>(materialsData);
  const [categoryFilter, setCategoryFilter] = useState('Categoria');
  const [projectFilter, setProjectFilter] = useState('Projeto');
  const [statusFilter, setStatusFilter] = useState('Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    quantity: '',
    category: ''
  });

  // Estados para visualização de detalhes
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  // Recomendações de materiais
  const recommendations = [
    {
      id: '1',
      text: 'Reutilize a madeira das formas para elementos decorativos ou acabamentos internos.',
      completed: true,
    },
    {
      id: '2',
      text: 'O desperdício de cerâmica está alto. Reconsidere o método de corte e aplicação.',
      completed: false,
    },
    {
      id: '3',
      text: 'O concreto excedente pode ser utilizado para criar pequenos blocos para uso em jardins.',
      completed: false,
    },
  ];

  // Cores para os gráficos
  const chartColors = ['#1E533B', '#2D7A59', '#D17B31', '#E89A5C', '#8E9196'];

  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em uso':
        return 'bg-blue-100 text-blue-800';
      case 'Reutilizado':
        return 'bg-green-100 text-green-800';
      case 'Descartado':
        return 'bg-red-100 text-red-800';
      case 'Em estoque':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    console.log('Busca materiais:', value);
  };

  const handleAddMaterial = () => {
    console.log('Adicionando material:', newMaterial);
    setIsModalOpen(false);
    setNewMaterial({ name: '', quantity: '', category: '' });
    toast({
      title: "Sucesso!",
      description: "Material adicionado com sucesso!",
      duration: 3000,
    });
  };

  const handleViewDetails = (material: Material) => {
    setSelectedMaterial(material);
  };

  const handleBack = () => {
    setSelectedMaterial(null);
  };

  // Se há um material selecionado, mostrar detalhes
  if (selectedMaterial) {
    return (
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button onClick={handleBack} variant="outline" className="mr-4">
              <ArrowLeft size={18} className="mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-residuall-gray-dark">Detalhes do Material</h1>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Informações básicas */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-residuall-gray-dark mb-4">Informações Gerais</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                      <p className="text-lg font-semibold text-residuall-gray-dark">{selectedMaterial.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                      <p className="text-gray-600">{selectedMaterial.category}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                      <p className="text-gray-600">{selectedMaterial.quantity} {selectedMaterial.unit}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedMaterial.status)}`}>
                        {selectedMaterial.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-residuall-gray-dark mb-4">Estatísticas de Reaproveitamento</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2" style={{
                        color: selectedMaterial.reuseRate >= 70 ? '#1E533B' : 
                               selectedMaterial.reuseRate >= 40 ? '#D17B31' : '#EF4444'
                      }}>
                        {selectedMaterial.reuseRate}%
                      </div>
                      <p className="text-sm text-gray-600">Taxa de Reaproveitamento</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                      <div 
                        className="h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${selectedMaterial.reuseRate}%`,
                          backgroundColor: selectedMaterial.reuseRate >= 70 ? '#1E533B' : 
                                         selectedMaterial.reuseRate >= 40 ? '#D17B31' : '#EF4444'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Informações adicionais mockadas */}
                <div>
                  <h3 className="text-lg font-semibold text-residuall-gray-dark mb-4">Detalhes Adicionais</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Projeto Principal:</span>
                      <span className="font-medium">Edifício Aurora</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data de Entrada:</span>
                      <span className="font-medium">15/01/2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fornecedor:</span>
                      <span className="font-medium">Construtora ABC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valor Unitário:</span>
                      <span className="font-medium">R$ 120,00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      {/* Cabeçalho da página */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-residuall-gray-dark">Materiais</h1>
          <p className="text-residuall-gray">Gerencie o uso e reaproveitamento de materiais</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0 inline-flex items-center bg-residuall-green hover:bg-residuall-green-light text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Plus size={18} className="mr-2" />
              Adicionar Material
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Material</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nome do Material"
                value={newMaterial.name}
                onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})}
              />
              <Input
                placeholder="Quantidade"
                value={newMaterial.quantity}
                onChange={(e) => setNewMaterial({...newMaterial, quantity: e.target.value})}
              />
              <Select onValueChange={(value) => setNewMaterial({...newMaterial, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Madeiras">Madeiras</SelectItem>
                  <SelectItem value="Alvenaria">Alvenaria</SelectItem>
                  <SelectItem value="Estrutural">Estrutural</SelectItem>
                  <SelectItem value="Acabamento">Acabamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button onClick={handleAddMaterial}>Adicionar Material</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="inline-flex items-center bg-white border border-gray-300 text-residuall-gray-dark px-4 py-2 rounded-lg">
                <Filter size={16} className="mr-2" />
                <span>{categoryFilter}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setCategoryFilter('Todas')}>Todas</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('Madeiras')}>Madeiras</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('Alvenaria')}>Alvenaria</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('Estrutural')}>Estrutural</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('Acabamento')}>Acabamento</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="inline-flex items-center bg-white border border-gray-300 text-residuall-gray-dark px-4 py-2 rounded-lg">
                <Filter size={16} className="mr-2" />
                <span>{projectFilter}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setProjectFilter('Todos')}>Todos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setProjectFilter('Edifício Aurora')}>Edifício Aurora</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setProjectFilter('Residencial Parque Verde')}>Residencial Parque Verde</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setProjectFilter('Torre Corporativa')}>Torre Corporativa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="inline-flex items-center bg-white border border-gray-300 text-residuall-gray-dark px-4 py-2 rounded-lg">
                <Filter size={16} className="mr-2" />
                <span>{statusFilter}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter('Todos')}>Todos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Em uso')}>Em uso</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Reutilizado')}>Reutilizado</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Descartado')}>Descartado</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Em estoque')}>Em estoque</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <Input
            type="text"
            placeholder="Buscar materiais..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-residuall-green focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabela de Materiais */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-residuall-gray-dark uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-residuall-gray-dark uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-residuall-gray-dark uppercase tracking-wider">
                      Quantidade
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-residuall-gray-dark uppercase tracking-wider">
                      Reaproveitado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-residuall-gray-dark uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-residuall-gray-dark uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMaterials.map((material) => (
                    <tr key={material.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-residuall-gray-dark">
                        {material.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-residuall-gray">
                        {material.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-residuall-gray-dark">
                        {material.quantity} {material.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end">
                          <span 
                            className={`text-sm font-medium ${
                              material.reuseRate >= 70 
                                ? 'text-green-600' 
                                : material.reuseRate >= 40 
                                ? 'text-residuall-brown' 
                                : 'text-red-600'
                            }`}
                          >
                            {material.reuseRate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(material.status)}`}>
                          {material.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(material)}
                          className="inline-flex items-center"
                        >
                          <Eye size={16} className="mr-1" />
                          Ver Detalhes
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Gráficos e Recomendações */}
        <div className="space-y-6">
          {/* Gráfico de Taxa de Reaproveitamento */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-residuall-gray-dark mb-4 flex items-center">
              <BarChart size={20} className="mr-2" />
              Materiais Reutilizados
            </h2>
            <Chart type="pie" data={reuseRateData} height={200} colors={['#1E533B', '#D17B31']} />
          </div>

          {/* Gráfico de Materiais mais Reutilizados */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-residuall-gray-dark mb-4">
              Materiais mais Reutilizados (%)
            </h2>
            <Chart 
              type="bar" 
              data={materialsByReuseData.sort((a, b) => b.reusado - a.reusado)} 
              height={250} 
              colors={chartColors}
            />
          </div>

          {/* Recomendações */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-residuall-gray-dark mb-4">
              Recomendações
            </h2>

            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="flex items-start p-3 border border-gray-200 rounded-lg">
                  <div className={`shrink-0 p-1 rounded-full mr-3 ${
                    rec.completed 
                      ? 'bg-green-100 text-green-500' 
                      : 'bg-residuall-brown bg-opacity-10 text-residuall-brown'
                  }`}>
                    {rec.completed ? (
                      <CheckCircle size={18} />
                    ) : (
                      <AlertTriangle size={18} />
                    )}
                  </div>
                  <p className="text-sm text-residuall-gray-dark">
                    {rec.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MaterialsPage;
