
import { useState } from 'react';
import { Plus, Filter, BarChart, CheckCircle, AlertTriangle } from 'lucide-react';
import Chart from '../components/Chart';

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
  const [categoryFilter, setCategoryFilter] = useState<string>('');

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

  return (
           
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Cabeçalho da página */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-residuall-gray-dark">Materiais</h1>
              <p className="text-residuall-gray">Gerencie o uso e reaproveitamento de materiais</p>
            </div>
            
            <button className="mt-4 md:mt-0 inline-flex items-center bg-residuall-green hover:bg-residuall-green-light text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Plus size={18} className="mr-2" />
              Adicionar Material
            </button>
          </div>
          
          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <button className="inline-flex items-center bg-white border border-gray-300 text-residuall-gray-dark px-4 py-2 rounded-lg">
                  <Filter size={16} className="mr-2" />
                  <span>Categoria</span>
                </button>
              </div>
              
              <button className="inline-flex items-center bg-white border border-gray-300 text-residuall-gray-dark px-4 py-2 rounded-lg">
                <Filter size={16} className="mr-2" />
                <span>Projeto</span>
              </button>
              
              <button className="inline-flex items-center bg-white border border-gray-300 text-residuall-gray-dark px-4 py-2 rounded-lg">
                <Filter size={16} className="mr-2" />
                <span>Status</span>
              </button>
            </div>
            
            <div>
              <input
                type="text"
                placeholder="Buscar materiais..."
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
      </div>
    </div>
  );
};

export default MaterialsPage;
