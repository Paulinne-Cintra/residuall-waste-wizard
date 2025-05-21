
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  ArrowDown,
  BrickWall,
  Layers,
  Hammer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SidebarDashboard from '../components/SidebarDashboard';
import DashboardHeader from '../components/DashboardHeader';
import Chart from '../components/Chart';

const OverviewPage = () => {
  // Dados de exemplo para os gráficos
  const wasteByMaterialData = [
    { name: 'Concreto', value: 35 },
    { name: 'Tijolos', value: 25 },
    { name: 'Madeira', value: 20 },
    { name: 'Aço', value: 15 },
    { name: 'Outros', value: 5 },
  ];

  const wasteHistoryData = [
    { name: 'Jan', desperdicio: 15000 },
    { name: 'Fev', desperdicio: 12000 },
    { name: 'Mar', desperdicio: 10000 },
    { name: 'Abr', desperdicio: 8000 },
    { name: 'Mai', desperdicio: 7500 },
    { name: 'Jun', desperdicio: 6000 },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <SidebarDashboard />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Cartões de Materiais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="bg-[#7FB77E] bg-opacity-10 p-3 rounded-full">
                    <BrickWall size={28} className="text-[#7FB77E]" />
                  </div>
                  <span className="text-[#7FB77E] text-sm font-medium rounded-full bg-[#7FB77E] bg-opacity-10 px-3 py-1">
                    25% do total
                  </span>
                </div>
                <h3 className="text-xl font-bold mt-4 text-gray-800">Tijolos</h3>
                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">2.5</span>
                  <span className="ml-2 text-gray-600">toneladas</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Desperdício mensal médio
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="bg-[#E37A31] bg-opacity-10 p-3 rounded-full">
                    <Layers size={28} className="text-[#E37A31]" />
                  </div>
                  <span className="text-[#E37A31] text-sm font-medium rounded-full bg-[#E37A31] bg-opacity-10 px-3 py-1">
                    35% do total
                  </span>
                </div>
                <h3 className="text-xl font-bold mt-4 text-gray-800">Cimento</h3>
                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">3.2</span>
                  <span className="ml-2 text-gray-600">toneladas</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Desperdício mensal médio
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="bg-[#FFB347] bg-opacity-10 p-3 rounded-full">
                    <Hammer size={28} className="text-[#FFB347]" />
                  </div>
                  <span className="text-[#FFB347] text-sm font-medium rounded-full bg-[#FFB347] bg-opacity-10 px-3 py-1">
                    15% do total
                  </span>
                </div>
                <h3 className="text-xl font-bold mt-4 text-gray-800">Aço</h3>
                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">1.3</span>
                  <span className="ml-2 text-gray-600">toneladas</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Desperdício mensal médio
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Seções do Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Projetos Ativos */}
            <Card className="lg:col-span-2 rounded-lg shadow-sm border border-gray-100">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-residuall-gray-tableText mb-4">Projetos Ativos</h2>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-residuall-gray-tableText">Edifício Aurora</h4>
                        <p className="text-sm text-gray-500">São Paulo, SP</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-residuall-green-secondary text-white">
                        Em andamento
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso</span>
                        <span className="font-medium">75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-residuall-green-secondary h-2 rounded-full"
                          style={{ width: '75%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-residuall-gray-tableText">Residencial Parque Verde</h4>
                        <p className="text-sm text-gray-500">Curitiba, PR</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-residuall-brown text-white">
                        Iniciando
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso</span>
                        <span className="font-medium">25%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-residuall-green-secondary h-2 rounded-full"
                          style={{ width: '25%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Link 
                  to="/dashboard/projetos" 
                  className="text-residuall-green-secondary text-sm font-medium mt-4 inline-block hover:underline"
                >
                  Ver todos os projetos
                </Link>
              </CardContent>
            </Card>
            
            {/* Recomendações */}
            <Card className="rounded-lg shadow-sm border border-gray-100">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-residuall-gray-tableText mb-4">Recomendações</h2>
                
                <div className="space-y-3">
                  <div className="flex items-start p-3 border border-gray-200 rounded-lg">
                    <CheckCircle size={18} className="text-green-500 mr-3 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-residuall-gray-tableText">Reutilize o concreto excedente da fundação.</p>
                      <p className="text-xs text-gray-500 mt-1">Edifício Aurora</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-3 border border-gray-200 rounded-lg">
                    <AlertTriangle size={18} className="text-residuall-brown mr-3 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-residuall-gray-tableText">Alto desperdício de cerâmica detectado.</p>
                      <p className="text-xs text-gray-500 mt-1">Residencial Parque Verde</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-3 border border-gray-200 rounded-lg">
                    <CheckCircle size={18} className="text-green-500 mr-3 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-residuall-gray-tableText">Madeira dos tapumes pode ser reutilizada.</p>
                      <p className="text-xs text-gray-500 mt-1">Torre Corporativa Horizonte</p>
                    </div>
                  </div>
                </div>
                
                <Link 
                  to="/dashboard/recomendacoes" 
                  className="text-residuall-green-secondary text-sm font-medium mt-4 inline-block hover:underline"
                >
                  Ver todas as recomendações
                </Link>
              </CardContent>
            </Card>
          </div>
          
          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="rounded-lg shadow-sm border border-gray-100">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-residuall-gray-tableText mb-4">
                  Materiais Mais Desperdiçados
                </h2>
                <Chart 
                  type="pie" 
                  data={wasteByMaterialData} 
                  height={250}
                  colors={['#2a4a3d', '#6e7848', '#434b3c', '#ff8c42', '#8a8a8a', '#3b3b3b']} 
                />
              </CardContent>
            </Card>
            
            <Card className="rounded-lg shadow-sm border border-gray-100">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-residuall-gray-tableText mb-4">
                  Histórico de Desperdício
                </h2>
                <Chart 
                  type="line" 
                  data={wasteHistoryData} 
                  height={250}
                  colors={['#E37A31']} 
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Botão Ver Detalhes dos Relatórios */}
          <div className="flex justify-center mt-8">
            <Button 
              asChild
              variant="default" 
              className="bg-residuall-green text-white px-8 py-6 rounded-md text-base flex items-center hover:bg-residuall-green/90"
            >
              <Link to="/dashboard/relatorios">
                Ver detalhes dos relatórios
                <ArrowDown className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OverviewPage;
