
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Package, AlertTriangle, DollarSign } from "lucide-react";
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import DashboardHeader from '@/components/DashboardHeader';

const Dashboard = () => {
  const { metrics, loading } = useDashboardMetrics();

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

  return (
    <div className="flex-1 p-6 bg-residuall-gray-light">
      <DashboardHeader />
      
      <div className="mt-6 space-y-6">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-residuall-gray">
                Total de Projetos
              </CardTitle>
              <Package className="h-4 w-4 text-residuall-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-residuall-gray-dark">
                <AnimatedNumber value={metrics?.total_projects || 0} />
              </div>
              <p className="text-xs text-residuall-gray mt-1">
                Projetos cadastrados
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-residuall-gray">
                Projetos Ativos
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-residuall-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-residuall-gray-dark">
                <AnimatedNumber value={metrics?.active_projects || 0} />
              </div>
              <p className="text-xs text-residuall-gray mt-1">
                Em andamento
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-residuall-gray">
                Desperdício Total
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-residuall-gray-dark">
                <AnimatedNumber value={metrics?.total_waste_quantity || 0} suffix=" kg" />
              </div>
              <p className="text-xs text-residuall-gray mt-1">
                Registrado nos projetos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-residuall-gray">
                Economia Gerada
              </CardTitle>
              <DollarSign className="h-4 w-4 text-residuall-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-residuall-gray-dark">
                R$ <AnimatedNumber value={metrics?.total_economy_generated || 0} />
              </div>
              <p className="text-xs text-residuall-gray mt-1">
                Estimativa de economia
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Resumo Recente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-residuall-gray-dark">Resumo dos Materiais</CardTitle>
              <CardDescription>
                Visão geral dos materiais cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-residuall-gray">Total de Materiais:</span>
                  <span className="font-semibold text-residuall-gray-dark">
                    {metrics?.total_materials || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-residuall-gray">Registros de Desperdício:</span>
                  <span className="font-semibold text-residuall-gray-dark">
                    {metrics?.total_waste_entries || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-residuall-gray-dark">Ações Rápidas</CardTitle>
              <CardDescription>
                Acesso direto às principais funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg bg-residuall-gray-light hover:bg-gray-200 transition-colors">
                  <div className="font-medium text-residuall-gray-dark">Criar Novo Projeto</div>
                  <div className="text-sm text-residuall-gray">Inicie um novo projeto</div>
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-residuall-gray-light hover:bg-gray-200 transition-colors">
                  <div className="font-medium text-residuall-gray-dark">Adicionar Material</div>
                  <div className="text-sm text-residuall-gray">Cadastre um novo material</div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
