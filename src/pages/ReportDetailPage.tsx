
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Calendar, User, MapPin, FileText, BarChart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data for reports
const mockReports = [
  {
    id: '1',
    title: 'Relatório de Sustentabilidade - Edifício Aurora',
    project: 'Edifício Aurora',
    period: 'Janeiro - Maio 2023',
    status: 'Finalizado',
    responsible: 'Carlos Pereira',
    location: 'São Paulo, SP',
    createdDate: '15/05/2023',
    description: 'Relatório detalhado sobre o uso de materiais sustentáveis e taxa de reaproveitamento no projeto Edifício Aurora.',
    summary: 'Durante o período analisado, o projeto apresentou excelentes resultados em sustentabilidade, com 72% de taxa de reaproveitamento de materiais e economia significativa de recursos.',
    metrics: {
      reuseRate: 72,
      savings: 125000,
      wasteAvoided: 8.5,
      efficiency: 95
    }
  },
  {
    id: '2',
    title: 'Análise de Materiais - Residencial Parque Verde',
    project: 'Residencial Parque Verde',
    period: 'Março - Junho 2023',
    status: 'Em Revisão',
    responsible: 'Ana Silva',
    location: 'Curitiba, PR',
    createdDate: '20/06/2023',
    description: 'Relatório de análise dos materiais utilizados e estratégias de sustentabilidade implementadas no projeto Parque Verde.',
    summary: 'O projeto demonstrou bom desempenho em sustentabilidade, alcançando 65% de taxa de reaproveitamento e implementando novas tecnologias verdes.',
    metrics: {
      reuseRate: 65,
      savings: 89000,
      wasteAvoided: 6.2,
      efficiency: 88
    }
  },
  {
    id: '3',
    title: 'Relatório Final - Torre Corporativa Horizonte',
    project: 'Torre Corporativa Horizonte',
    period: 'Janeiro - Abril 2023',
    status: 'Finalizado',
    responsible: 'Roberto Costa',
    location: 'Rio de Janeiro, RJ',
    createdDate: '30/04/2023',
    description: 'Relatório final do projeto Torre Corporativa, apresentando resultados excepcionais em sustentabilidade e certificação LEED.',
    summary: 'Projeto concluído com sucesso, superando as metas de sustentabilidade em 15% e obtendo certificação LEED Platinum.',
    metrics: {
      reuseRate: 85,
      savings: 245000,
      wasteAvoided: 12.8,
      efficiency: 97
    }
  },
  {
    id: '4',
    title: 'Avaliação Intermediária - Condomínio Vista Mar',
    project: 'Condomínio Vista Mar',
    period: 'Abril - Julho 2023',
    status: 'Em andamento',
    responsible: 'Marina Santos',
    location: 'Salvador, BA',
    createdDate: '25/07/2023',
    description: 'Avaliação intermediária do projeto Vista Mar, focando em práticas sustentáveis e economia de recursos.',
    summary: 'Progresso satisfatório com implementação bem-sucedida de práticas de reuso e reciclagem de materiais.',
    metrics: {
      reuseRate: 68,
      savings: 156000,
      wasteAvoided: 9.3,
      efficiency: 91
    }
  }
];

const ReportDetailPage = () => {
  const { reportId } = useParams<{ reportId: string }>();

  // Find report by ID
  const report = mockReports.find(r => r.id === reportId);

  // If report not found, show error message
  if (!report) {
    return (
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-red-600">Relatório não encontrado</CardTitle>
              <CardDescription>
                O relatório com ID "{reportId}" não foi encontrado.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/dashboard/relatorios">
                <Button variant="outline" className="flex items-center gap-2 mx-auto">
                  <ArrowLeft size={16} />
                  Voltar para Relatórios
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard/relatorios">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Voltar para Relatórios
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Detalhes do Relatório</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            Baixar PDF
          </Button>
          <Button className="flex items-center gap-2">
            <Share2 size={16} />
            Compartilhar
          </Button>
        </div>
      </div>

      {/* Report Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">{report.title}</CardTitle>
          <CardDescription>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <FileText size={16} className="mr-2" />
                ID: {report.id}
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                Criado em {report.createdDate}
              </div>
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                {report.responsible}
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Projeto Associado
              </label>
              <p className="text-gray-900">{report.project}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Período
              </label>
              <p className="text-gray-900">{report.period}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                {report.status}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Localização
              </label>
              <div className="flex items-center text-gray-900">
                <MapPin size={16} className="mr-2" />
                {report.location}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <p className="text-gray-700">{report.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Taxa de Reaproveitamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-green-600">{report.metrics.reuseRate}%</div>
              <div className="bg-green-100 p-2 rounded-full">
                <BarChart size={24} className="text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">materiais reutilizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Economia Gerada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-blue-600">R$ {(report.metrics.savings / 1000).toFixed(0)}k</div>
              <div className="bg-blue-100 p-2 rounded-full">
                <TrendingUp size={24} className="text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">em materiais</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Resíduos Evitados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-emerald-600">{report.metrics.wasteAvoided}t</div>
              <div className="bg-emerald-100 p-2 rounded-full">
                <BarChart size={24} className="text-emerald-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">toneladas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Eficiência</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-purple-600">{report.metrics.efficiency}%</div>
              <div className="bg-purple-100 p-2 rounded-full">
                <TrendingUp size={24} className="text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">vs meta</p>
          </CardContent>
        </Card>
      </div>

      {/* Summary and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumo Executivo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{report.summary}</p>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Principais Conquistas:</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Superou a meta de reaproveitamento em {report.metrics.reuseRate - 50}%</li>
                <li>Economia de R$ {report.metrics.savings.toLocaleString()} em materiais</li>
                <li>Redução de {report.metrics.wasteAvoided} toneladas de resíduos</li>
                <li>Implementação de 15 práticas sustentáveis</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Análise de Materiais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Concreto</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Madeira</span>
                  <span>78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Metais</span>
                  <span>92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Cerâmica</span>
                  <span>45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Materiais Reutilizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart size={48} className="mx-auto mb-2" />
                <p>Gráfico de Pizza</p>
                <p className="text-sm">(Placeholder)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolução da Economia ao Longo do Tempo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <TrendingUp size={48} className="mx-auto mb-2" />
                <p>Gráfico de Linha</p>
                <p className="text-sm">(Placeholder)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ReportDetailPage;
