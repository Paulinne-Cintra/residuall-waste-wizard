
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Calendar, User, MapPin, FileText, BarChart, TrendingUp, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useProjects } from "@/hooks/useProjects";

const ReportDetailPage = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const { projects, loading } = useProjects();
  const { toast } = useToast();
  
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState({
    email: '',
    message: ''
  });

  // Encontrar o projeto correspondente
  const project = projects.find(p => p.id === reportId);

  const handleExportPDF = () => {
    // Simular exportação
    toast({
      title: "Sucesso!",
      description: "Relatório sendo preparado para download em PDF...",
      duration: 3000,
    });
    
    // Aqui seria implementada a lógica real de exportação
    console.log('Exportando relatório em PDF para projeto:', project?.name);
  };

  const handleExportCSV = () => {
    // Simular exportação
    toast({
      title: "Sucesso!",
      description: "Relatório sendo preparado para download em CSV...",
      duration: 3000,
    });
    
    console.log('Exportando relatório em CSV para projeto:', project?.name);
  };

  const handleShare = () => {
    if (!shareData.email) {
      toast({
        title: "Erro",
        description: "Por favor, insira um e-mail válido.",
        variant: "destructive",
      });
      return;
    }

    // Simular envio de e-mail
    toast({
      title: "Sucesso!",
      description: `Relatório enviado para ${shareData.email}`,
      duration: 3000,
    });
    
    console.log('Compartilhando relatório:', {
      projeto: project?.name,
      email: shareData.email,
      mensagem: shareData.message
    });
    
    setIsShareModalOpen(false);
    setShareData({ email: '', message: '' });
  };

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-residuall-green"></div>
        </div>
      </main>
    );
  }

  if (!project) {
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

  // Calcular métricas do projeto (valores simulados baseados no projeto)
  const metrics = {
    reuseRate: Math.floor(Math.random() * 30) + 65, // 65-95%
    savings: Math.floor(Math.random() * 100000) + 50000, // R$ 50k-150k
    wasteAvoided: Math.floor(Math.random() * 10) + 5, // 5-15 toneladas
    efficiency: Math.floor(Math.random() * 15) + 85 // 85-100%
  };

  const createdDate = new Date(project.created_at).toLocaleDateString('pt-BR');

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
          <h1 className="text-2xl font-bold text-gray-900">Relatório - {project.name}</h1>
        </div>
        <div className="flex space-x-2">
          <div className="flex items-center space-x-1">
            <Button variant="outline" onClick={handleExportPDF} className="flex items-center gap-2">
              <Download size={16} />
              PDF
            </Button>
            <Button variant="outline" onClick={handleExportCSV} className="flex items-center gap-2">
              <Download size={16} />
              CSV
            </Button>
          </div>
          
          <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-residuall-green hover:bg-residuall-green/90">
                <Share2 size={16} />
                Compartilhar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Compartilhar Relatório</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">E-mail do destinatário</label>
                  <Input
                    type="email"
                    placeholder="Digite o e-mail..."
                    value={shareData.email}
                    onChange={(e) => setShareData({ ...shareData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mensagem (opcional)</label>
                  <Textarea
                    placeholder="Adicione uma mensagem personalizada..."
                    value={shareData.message}
                    onChange={(e) => setShareData({ ...shareData, message: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsShareModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleShare} className="bg-residuall-green hover:bg-residuall-green/90">
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Report Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Relatório de Sustentabilidade - {project.name}</CardTitle>
          <CardDescription>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <FileText size={16} className="mr-2" />
                ID: {project.id.substring(0, 8)}
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                Criado em {createdDate}
              </div>
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                {project.responsible_team_contacts || 'Não informado'}
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
              <p className="text-gray-900">{project.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Período
              </label>
              <p className="text-gray-900">
                {project.start_date ? new Date(project.start_date).toLocaleDateString('pt-BR') : 'Não informado'} - 
                {project.planned_end_date ? new Date(project.planned_end_date).toLocaleDateString('pt-BR') : 'Em andamento'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Localização
              </label>
              <div className="flex items-center text-gray-900">
                <MapPin size={16} className="mr-2" />
                {project.location || 'Não informado'}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <p className="text-gray-700">
              {project.description_notes || 'Relatório detalhado sobre o uso de materiais sustentáveis e taxa de reaproveitamento no projeto ' + project.name + '.'}
            </p>
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
              <div className="text-3xl font-bold text-green-600">{metrics.reuseRate}%</div>
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
              <div className="text-3xl font-bold text-blue-600">R$ {(metrics.savings / 1000).toFixed(0)}k</div>
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
              <div className="text-3xl font-bold text-emerald-600">{metrics.wasteAvoided}t</div>
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
              <div className="text-3xl font-bold text-purple-600">{metrics.efficiency}%</div>
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
            <p className="text-gray-700 mb-4">
              Durante o período analisado, o projeto {project.name} apresentou excelentes resultados em sustentabilidade, 
              com {metrics.reuseRate}% de taxa de reaproveitamento de materiais e economia significativa de recursos.
            </p>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Principais Conquistas:</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Superou a meta de reaproveitamento em {metrics.reuseRate - 50}%</li>
                <li>Economia de R$ {metrics.savings.toLocaleString()} em materiais</li>
                <li>Redução de {metrics.wasteAvoided} toneladas de resíduos</li>
                <li>Implementação de práticas sustentáveis inovadoras</li>
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
                <p className="text-sm">(Em desenvolvimento)</p>
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
                <p className="text-sm">(Em desenvolvimento)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ReportDetailPage;
