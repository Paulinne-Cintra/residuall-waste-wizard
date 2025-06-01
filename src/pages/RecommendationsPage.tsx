
import { useState } from "react";
import { CheckCircle, AlertTriangle, ChevronRight, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRecommendations } from "@/hooks/useRecommendations";

interface ProjectDetails {
  id: string;
  name: string;
  location: string | null;
  status: string;
  description_notes: string | null;
  budget: number | null;
  materials?: {
    id: string;
    material_type_name: string;
    estimated_quantity: number | null;
    cost_per_unit: number | null;
    unit_of_measurement: string | null;
    stock_quantity: number | null;
    minimum_quantity: number | null;
  }[];
  totalCost?: number;
  materialsInShortage?: number;
}

const RecommendationsPage = () => {
  const [activeFilter, setActiveFilter] = useState<"Todas" | "Pendente" | "Resolvida">("Todas");
  const [selectedProject, setSelectedProject] = useState<ProjectDetails | null>(null);
  const [selectedRecommendationId, setSelectedRecommendationId] = useState<string | null>(null);
  
  const { recommendations, loading, error, updateRecommendation, getProjectDetails } = useRecommendations();

  // Filter recommendations based on active filter
  const filteredRecommendations = activeFilter === "Todas" 
    ? recommendations 
    : recommendations.filter(rec => {
        if (activeFilter === "Pendente") return !rec.aceita;
        if (activeFilter === "Resolvida") return rec.aceita;
        return true;
      });

  const handleViewDetails = async (recommendation: any) => {
    setSelectedRecommendationId(recommendation.id);
    
    // Marcar como visualizada se ainda não foi
    if (!recommendation.visualizada) {
      await updateRecommendation(recommendation.id, { visualizada: true });
    }
    
    // Buscar detalhes do projeto
    const projectDetails = await getProjectDetails(recommendation.projeto_id);
    if (projectDetails) {
      setSelectedProject(projectDetails);
    }
  };

  const handleBack = () => {
    setSelectedProject(null);
    setSelectedRecommendationId(null);
  };

  const handleAcceptanceChange = async (recommendationId: string, accepted: boolean) => {
    await updateRecommendation(recommendationId, { aceita: accepted });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Se há um projeto selecionado, mostrar detalhes
  if (selectedProject) {
    const selectedRecommendation = recommendations.find(r => r.id === selectedRecommendationId);
    
    return (
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button onClick={handleBack} variant="outline" className="mr-4">
              <ArrowLeft size={18} className="mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-residuall-gray-dark">Resumo do Projeto Relacionado</h1>
          </div>

          <div className="space-y-6">
            {/* Informações da Recomendação */}
            {selectedRecommendation && (
              <Card className="shadow-residuall">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-residuall-gray-dark mb-4">Recomendação</h3>
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      selectedRecommendation.aceita 
                        ? "bg-residuall-green-secondary text-white" 
                        : "bg-residuall-brown text-white"
                    }`}>
                      {selectedRecommendation.aceita ? (
                        <CheckCircle size={18} />
                      ) : (
                        <AlertTriangle size={18} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-base text-residuall-gray-tableText font-medium mb-2">{selectedRecommendation.titulo}</p>
                      {selectedRecommendation.descricao && (
                        <p className="text-sm text-residuall-gray mb-3">{selectedRecommendation.descricao}</p>
                      )}
                      <div className="flex items-center text-sm gap-3">
                        <span className="text-residuall-gray">{formatDate(selectedRecommendation.data_criacao)}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          selectedRecommendation.aceita 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {selectedRecommendation.aceita ? "Aceita" : "Pendente"}
                        </span>
                        {selectedRecommendation.visualizada && (
                          <span className="flex items-center text-xs text-gray-500">
                            <Eye size={12} className="mr-1" />
                            Visualizada
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Informações do Projeto */}
            <Card className="shadow-residuall">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-residuall-gray-dark mb-6">Detalhes do Projeto</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informações básicas */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Projeto</label>
                      <p className="text-lg font-semibold text-residuall-gray-dark">{selectedProject.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        selectedProject.status === 'em_andamento' ? 'bg-green-100 text-green-800' :
                        selectedProject.status === 'planejamento' ? 'bg-blue-100 text-blue-800' :
                        selectedProject.status === 'concluido' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedProject.status === 'em_andamento' ? 'Em andamento' :
                         selectedProject.status === 'planejamento' ? 'Planejamento' :
                         selectedProject.status === 'concluido' ? 'Concluído' : selectedProject.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                      <p className="text-gray-600">{selectedProject.location || 'Não informado'}</p>
                    </div>
                  </div>

                  {/* Estatísticas */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Orçamento</label>
                      <p className="text-lg font-semibold text-residuall-green">
                        {selectedProject.budget ? formatCurrency(selectedProject.budget) : 'Não definido'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Custo Total de Materiais</label>
                      <p className="text-lg font-semibold text-residuall-brown">
                        {formatCurrency(selectedProject.totalCost || 0)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Materiais Cadastrados</label>
                      <p className="text-gray-600">{selectedProject.materials?.length || 0} itens</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Materiais em Falta</label>
                      <p className={`font-semibold ${
                        (selectedProject.materialsInShortage || 0) > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {selectedProject.materialsInShortage || 0} itens
                      </p>
                    </div>
                  </div>
                </div>

                {/* Descrição */}
                {selectedProject.description_notes && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                    <p className="text-gray-600 leading-relaxed">{selectedProject.description_notes}</p>
                  </div>
                )}

                {/* Lista de Materiais */}
                {selectedProject.materials && selectedProject.materials.length > 0 && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Materiais do Projeto</label>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="space-y-2">
                        {selectedProject.materials.map((material) => (
                          <div key={material.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{material.material_type_name}</p>
                              <p className="text-sm text-gray-600">
                                {material.estimated_quantity} {material.unit_of_measurement} - 
                                {material.cost_per_unit ? ` ${formatCurrency(material.cost_per_unit)}` : ' Custo não definido'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                Estoque: {material.stock_quantity || 0}
                              </p>
                              {(material.stock_quantity || 0) <= (material.minimum_quantity || 0) && (
                                <span className="text-xs text-red-600 font-medium">Em falta</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="p-6">
        <div className="text-center py-8">
          <p className="text-residuall-gray">Carregando recomendações...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <div className="text-center py-8">
          <p className="text-red-600">Erro ao carregar recomendações: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6">
      {/* Filter buttons */}
      <div className="mb-6 flex gap-4">
        <Button 
          variant={activeFilter === "Todas" ? "default" : "outline"}
          onClick={() => setActiveFilter("Todas")}
          className={activeFilter === "Todas" ? "bg-residuall-green text-white" : "text-residuall-gray-tableText"}
        >
          Todas
        </Button>
        <Button 
          variant={activeFilter === "Pendente" ? "default" : "outline"}
          onClick={() => setActiveFilter("Pendente")}
          className={activeFilter === "Pendente" ? "bg-residuall-green text-white" : "text-residuall-gray-tableText"}
        >
          Pendentes
        </Button>
        <Button 
          variant={activeFilter === "Resolvida" ? "default" : "outline"}
          onClick={() => setActiveFilter("Resolvida")}
          className={activeFilter === "Resolvida" ? "bg-residuall-green text-white" : "text-residuall-gray-tableText"}
        >
          Aceitas
        </Button>
      </div>

      {/* Recommendations cards */}
      <div className="grid gap-4">
        {filteredRecommendations.map((recommendation) => (
          <Card key={recommendation.id} className="shadow-residuall hover:shadow-residuall-hover transition-all">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    recommendation.aceita 
                      ? "bg-residuall-green-secondary text-white" 
                      : "bg-residuall-brown text-white"
                  }`}>
                    {recommendation.aceita ? (
                      <CheckCircle size={18} />
                    ) : (
                      <AlertTriangle size={18} />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-base font-medium text-residuall-gray-tableText pr-4">
                        {recommendation.titulo}
                      </h3>
                      {!recommendation.visualizada && (
                        <div className="flex items-center text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                          <EyeOff size={12} className="mr-1" />
                          Nova
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm gap-3 mb-3">
                      <span className="text-residuall-gray">{formatDate(recommendation.data_criacao)}</span>
                      <span className="text-residuall-gray">•</span>
                      <span className="text-residuall-gray">
                        {recommendation.projects?.name || 'Projeto não encontrado'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`accept-${recommendation.id}`}
                          checked={recommendation.aceita}
                          onCheckedChange={(checked) => handleAcceptanceChange(recommendation.id, !!checked)}
                        />
                        <label 
                          htmlFor={`accept-${recommendation.id}`} 
                          className="text-sm text-gray-700 cursor-pointer"
                        >
                          Aceitar recomendação
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="bg-residuall-brown hover:bg-residuall-brown/90 text-white px-4 py-2 h-9 rounded-lg ml-4"
                  onClick={() => handleViewDetails(recommendation)}
                >
                  <span className="mr-1">Ver Detalhes</span>
                  <ChevronRight size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredRecommendations.length === 0 && (
        <div className="text-center py-8">
          <p className="text-residuall-gray">Nenhuma recomendação encontrada para o filtro selecionado.</p>
        </div>
      )}
    </main>
  );
};

export default RecommendationsPage;
