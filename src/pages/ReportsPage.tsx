
import React, { useState } from 'react';
import { Eye, Download, Filter, Calendar, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useProjects } from '@/hooks/useProjects';
import { useProjectStageWaste } from '@/hooks/useProjectStageWaste';
import { Link } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';

const ReportsPage = () => {
  const { projects, loading } = useProjects();
  const { stageWaste } = useProjectStageWaste();
  const [statusFilter, setStatusFilter] = useState('Status');
  const [dateFilter, setDateFilter] = useState('Data');

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-residuall-green"></div>
        </div>
      </main>
    );
  }

  // Criar relatórios únicos por projeto
  const reports = projects.map(project => {
    const projectWasteData = stageWaste.filter(waste => waste.project_id === project.id);
    const totalWaste = projectWasteData.reduce((sum, waste) => sum + waste.waste_quantity, 0);
    const totalCost = projectWasteData.reduce((sum, waste) => sum + (waste.waste_cost || 0), 0);
    
    return {
      id: project.id,
      title: `Relatório de Desperdício - ${project.name}`,
      project_id: project.id,
      project_name: project.name,
      report_type: 'waste_analysis',
      generated_at: new Date().toISOString(),
      created_at: project.created_at || new Date().toISOString(),
      totalWaste,
      totalCost,
      wasteEntries: projectWasteData.length
    };
  });

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

  const getProjectStatus = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.status || 'indefinido';
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
      <DashboardHeader />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Relatórios</h1>
          <p className="text-base text-gray-600">Análise detalhada de desperdício e performance dos projetos</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6 shadow-sm border-none">
        <CardContent className="flex flex-wrap gap-4 items-center justify-between p-4">
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter size={16} />
                  <span>{statusFilter}</span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('Todos')}>Todos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('planejamento')}>Planejamento</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('execução')}>Execução</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('concluído')}>Concluído</DropdownMenuItem>
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card className="shadow-sm border-none">
        <CardHeader>
          <CardTitle>Relatórios de Projetos</CardTitle>
          <CardDescription>Relatórios de análise de desperdício por projeto</CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Nenhum relatório disponível</p>
              <p className="text-sm text-gray-400">Crie projetos para gerar relatórios automaticamente</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Relatório</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Projeto</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Desperdício Total</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Custo Total</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Registros</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{report.title}</p>
                          <p className="text-sm text-gray-500">{report.report_type}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{report.project_name}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(getProjectStatus(report.project_id))}>
                          {getProjectStatus(report.project_id)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{report.totalWaste.toFixed(1)} kg</td>
                      <td className="py-3 px-4 text-gray-700">R$ {report.totalCost.toFixed(2)}</td>
                      <td className="py-3 px-4 text-gray-700">{report.wasteEntries}</td>
                      <td className="py-3 px-4 text-gray-500">
                        {new Date(report.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Link to={`/dashboard/relatorios/${report.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default ReportsPage;
