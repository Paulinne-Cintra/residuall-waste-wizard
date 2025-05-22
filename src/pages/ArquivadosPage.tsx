
import React, { useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';

const ArquivadosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const mockArchivedItems = [
    { id: 1, name: 'Projeto X', type: 'projeto', date: '01/01/2023', owner: 'Cristiana Soares' },
    { id: 2, name: 'Relatório Anual 2022', type: 'relatorio', date: '15/02/2023', owner: 'João Silva' },
    { id: 3, name: 'Material Y', type: 'material', date: '10/03/2023', owner: 'Ana Costa' },
    { id: 4, name: 'Projeto Z', type: 'projeto', date: '05/04/2023', owner: 'Pedro Santos' },
    { id: 5, name: 'Análise Trimestral', type: 'relatorio', date: '20/05/2023', owner: 'Marta Oliveira' },
  ];

  const filteredItems = mockArchivedItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 flex flex-col bg-residuall-gray-light min-h-screen">
      <DashboardHeader title="Arquivados" />
      
      <main className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-residuall-gray-dark mb-2">Itens Arquivados</h1>
          <p className="text-lg text-residuall-gray">
            Acesse e gerencie todos os itens que foram arquivados no sistema.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Opções de Busca e Filtro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Buscar por nome ou responsável..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-residuall-green"
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-residuall-gray" />
              </div>
              
              <div className="w-full md:w-64">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-residuall-green"
                >
                  <option value="all">Todos os tipos</option>
                  <option value="projeto">Projetos</option>
                  <option value="relatorio">Relatórios</option>
                  <option value="material">Materiais</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Lista de Itens Arquivados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-residuall-gray uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-residuall-gray uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-residuall-gray uppercase tracking-wider">Data Arquivamento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-residuall-gray uppercase tracking-wider">Responsável</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-residuall-gray uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-residuall-gray-dark">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-residuall-gray">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.type === 'projeto' ? 'bg-blue-100 text-blue-800' : 
                            item.type === 'relatorio' ? 'bg-green-100 text-green-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.type === 'projeto' ? 'Projeto' : 
                             item.type === 'relatorio' ? 'Relatório' : 'Material'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-residuall-gray">{item.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-residuall-gray">{item.owner}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-residuall-green hover:text-residuall-green-dark mr-3">Restaurar</button>
                          <button className="text-red-500 hover:text-red-700">Excluir</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-residuall-gray">
                        Nenhum item arquivado encontrado com esses filtros.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ArquivadosPage;
