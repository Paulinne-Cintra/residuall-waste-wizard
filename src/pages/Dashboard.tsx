
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, DollarSign, Package, AlertTriangle, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import Chart from '@/components/Chart';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import AnimatedCardWrapper from '@/components/ui/AnimatedCardWrapper';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { useOptimizedProjects } from '@/hooks/useOptimizedProjects';

const Dashboard = () => {
  const { metrics, loading: metricsLoading } = useDashboardMetrics();
  const { projects, loading: projectsLoading } = useOptimizedProjects();

  const loading = metricsLoading || projectsLoading;

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-residuall-green"></div>
        </div>
      </main>
    );
  }

  // Dados para o gráfico baseados nos projetos reais
  const chartData = projects.slice(0, 6).map(project => ({
    name: project.name.substring(0, 10) + (project.name.length > 10 ? '...' : ''),
    economia: Math.random() * 5000 + 1000, // Placeholder - seria calculado dos dados reais
    desperdicio: Math.random() * 2000 + 500,
  }));

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-base text-gray-600">Visão geral dos seus projetos e métricas</p>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AnimatedCardWrapper delay={0.1}>
          <Card className="shadow-md border-none hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Projetos Ativos</CardTitle>
              <Activity className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                <AnimatedNumber value={metrics?.active_projects || 0} />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                de {metrics?.total_projects || 0} projetos totais
              </p>
            </CardContent>
          </Card>
        </AnimatedCardWrapper>

        <AnimatedCardWrapper delay={0.2}>
          <Card className="shadow-md border-none hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Economia Gerada</CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                R$ <AnimatedNumber value={metrics?.total_economy_generated || 0} decimals={2} />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                através do monitoramento
              </p>
            </CardContent>
          </Card>
        </AnimatedCardWrapper>

        <AnimatedCardWrapper delay={0.3}>
          <Card className="shadow-md border-none hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Materiais Cadastrados</CardTitle>
              <Package className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                <AnimatedNumber value={metrics?.total_materials || 0} />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                em todos os projetos
              </p>
            </CardContent>
          </Card>
        </AnimatedCardWrapper>

        <AnimatedCardWrapper delay={0.4}>
          <Card className="shadow-md border-none hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Desperdício Monitorado</CardTitle>
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                <AnimatedNumber value={metrics?.total_waste_quantity || 0} decimals={1} /> kg
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {metrics?.total_waste_entries || 0} registros de desperdício
              </p>
            </CardContent>
          </Card>
        </AnimatedCardWrapper>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Economia x Desperdício */}
        <AnimatedCardWrapper delay={0.5}>
          <Card className="shadow-md border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Economia vs Desperdício
              </CardTitle>
              <CardDescription>Comparação por projeto (últimos 6 projetos)</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <Chart type="bar" data={chartData} />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Dados insuficientes para gráfico</p>
                    <p className="text-sm">Crie projetos e registre dados</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </AnimatedCardWrapper>

        {/* Projetos Recentes */}
        <AnimatedCardWrapper delay={0.6}>
          <Card className="shadow-md border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Projetos Recentes
              </CardTitle>
              <CardDescription>Últimos projetos criados</CardDescription>
            </CardHeader>
            <CardContent>
              {projects.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500 mb-4">Nenhum projeto encontrado</p>
                  <Link to="/dashboard/projetos/novo">
                    <Button className="bg-residuall-green hover:bg-residuall-green/90">
                      Criar Primeiro Projeto
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div>
                        <h4 className="font-medium text-gray-900">{project.name}</h4>
                        <p className="text-sm text-gray-500">{project.location}</p>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === 'execução' || project.status === 'em_andamento' 
                            ? 'bg-green-100 text-green-800' 
                            : project.status === 'planejamento'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {project.progress_percentage}% concluído
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <Link to="/dashboard/projetos">
                      <Button variant="outline" className="w-full">
                        Ver Todos os Projetos
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </AnimatedCardWrapper>
      </div>
    </main>
  );
};

export default Dashboard;
