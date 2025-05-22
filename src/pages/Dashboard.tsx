
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, TrendingUp, TrendingDown, CheckCircle, AlertTriangle } from 'lucide-react';
import DashboardHeader from '../components/DashboardHeader';
import Chart from '../components/Chart';

const Dashboard = () => {
  // Dados de exemplo para os gráficos
  const wasteByStageData = [
    { name: 'Fundação', value: 25 },
    { name: 'Estrutura', value: 35 },
    { name: 'Alvenaria', value: 20 },
    { name: 'Acabamento', value: 15 },
    { name: 'Instalações', value: 5 },
  ];

  const materialReuseData = [
    { name: 'Concreto', reused: 45, wasted: 55 },
    { name: 'Madeira', reused: 70, wasted: 30 },
    { name: 'Metais', reused: 80, wasted: 20 },
    { name: 'Cerâmica', reused: 25, wasted: 75 },
    { name: 'Gesso', reused: 35, wasted: 65 },
  ];

  const monthlyTrendsData = [
    { name: 'Jan', economia: 12000, desperdicio: 15000 },
    { name: 'Fev', economia: 19000, desperdicio: 12000 },
    { name: 'Mar', economia: 15000, desperdicio: 10000 },
    { name: 'Abr', economia: 21000, desperdicio: 8000 },
    { name: 'Mai', economia: 28000, desperdicio: 7500 },
    { name: 'Jun', economia: 32000, desperdicio: 6000 },
  ];

  return (
    <div className="min-h-screen bg-residuall-gray-light flex">
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-residuall-gray-dark">Dashboard</h1>
            <p className="text-residuall-gray">Bem-vindo de volta, Maria Silva</p>
          </div>
          
          {/* Cards de Indicadores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="dashboard-card bg-white">
              <h3 className="text-residuall-gray-dark font-medium mb-2">Projetos Ativos</h3>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-residuall-gray-dark">12</div>
                <div className="bg-residuall-green bg-opacity-10 p-2 rounded-full">
                  <Briefcase size={24} className="text-residuall-green" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-residuall-green h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-residuall-gray mt-1">75% dos projetos em andamento</p>
              </div>
            </div>
            
            <div className="dashboard-card bg-white">
              <h3 className="text-residuall-gray-dark font-medium mb-2">Economia Gerada</h3>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-residuall-green">R$ 32.450</div>
                <div className="bg-residuall-green bg-opacity-10 p-2 rounded-full">
                  <TrendingUp size={24} className="text-residuall-green" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-residuall-green text-sm mr-2">+18%</span>
                <span className="text-xs text-residuall-gray">comparado ao mês anterior</span>
              </div>
            </div>
            
            <div className="dashboard-card bg-white">
              <h3 className="text-residuall-gray-dark font-medium mb-2">Materiais Reaproveitados</h3>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-residuall-green">65%</div>
                <div className="bg-residuall-green bg-opacity-10 p-2 rounded-full">
                  <CheckCircle size={24} className="text-residuall-green" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-residuall-green text-sm mr-2">+12%</span>
                <span className="text-xs text-residuall-gray">comparado ao mês anterior</span>
              </div>
            </div>
            
            <div className="dashboard-card bg-white">
              <h3 className="text-residuall-gray-dark font-medium mb-2">Desperdício Evitado</h3>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-residuall-brown">2.8 ton</div>
                <div className="bg-residuall-brown bg-opacity-10 p-2 rounded-full">
                  <TrendingDown size={24} className="text-residuall-brown" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-residuall-brown text-sm mr-2">-25%</span>
                <span className="text-xs text-residuall-gray">comparado ao mês anterior</span>
              </div>
            </div>
          </div>
          
          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="dashboard-card">
              <h3 className="text-lg font-medium text-residuall-gray-dark mb-4">
                Economia x Desperdício
              </h3>
              <Chart 
                type="line" 
                data={monthlyTrendsData} 
                height={250} 
              />
            </div>
            
            <div className="dashboard-card">
              <h3 className="text-lg font-medium text-residuall-gray-dark mb-4">
                Desperdício por Etapa
              </h3>
              <Chart 
                type="pie" 
                data={wasteByStageData} 
                height={250} 
              />
            </div>
          </div>
          
          {/* Projetos Recentes e Recomendações */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="dashboard-card lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-residuall-gray-dark">
                  Projetos Recentes
                </h3>
                <Link to="/dashboard/projetos" className="text-sm text-residuall-green hover:underline">
                  Ver todos
                </Link>
              </div>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-residuall-gray-dark">Edifício Aurora</h4>
                      <p className="text-sm text-residuall-gray">São Paulo, SP</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
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
                        className="bg-residuall-green h-2 rounded-full"
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-residuall-gray-dark">Residencial Parque Verde</h4>
                      <p className="text-sm text-residuall-gray">Curitiba, PR</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
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
                        className="bg-residuall-green h-2 rounded-full"
                        style={{ width: '25%' }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-residuall-gray-dark">Torre Corporativa Horizonte</h4>
                      <p className="text-sm text-residuall-gray">Rio de Janeiro, RJ</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                      Finalizado
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progresso</span>
                      <span className="font-medium">100%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-residuall-green h-2 rounded-full"
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="dashboard-card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-residuall-gray-dark">
                  Recomendações
                </h3>
                <Link to="/dashboard/recomendacoes" className="text-sm text-residuall-green hover:underline">
                  Ver todas
                </Link>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start p-3 border border-gray-200 rounded-lg">
                  <CheckCircle size={18} className="text-green-500 mr-3 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-residuall-gray-dark">Reutilize o concreto excedente da fundação para pequenos elementos decorativos.</p>
                    <p className="text-xs text-residuall-gray mt-1">Edifício Aurora</p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 border border-gray-200 rounded-lg">
                  <AlertTriangle size={18} className="text-residuall-brown mr-3 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-residuall-gray-dark">Alto desperdício de cerâmica detectado no Residencial Parque Verde.</p>
                    <p className="text-xs text-residuall-gray mt-1">Ação recomendada: Revisar processo de corte</p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 border border-gray-200 rounded-lg">
                  <CheckCircle size={18} className="text-green-500 mr-3 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-residuall-gray-dark">Madeira dos tapumes pode ser reutilizada para formas de concreto menores.</p>
                    <p className="text-xs text-residuall-gray mt-1">Torre Corporativa Horizonte</p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 border border-gray-200 rounded-lg">
                  <AlertTriangle size={18} className="text-residuall-brown mr-3 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-residuall-gray-dark">Potencial para reduzir em 15% o uso de argamassa com melhor controle de espessura.</p>
                    <p className="text-xs text-residuall-gray mt-1">Edifício Aurora</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
