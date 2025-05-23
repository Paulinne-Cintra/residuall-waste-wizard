
import { useState } from "react";
import { CheckCircle, AlertTriangle, ChevronRight, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Recommendation {
  id: number;
  text: string;
  date: string;
  status: "Pendente" | "Resolvida";
  type: "success" | "warning";
  projectId?: string;
}

interface Project {
  id: string;
  name: string;
  status: string;
  location: string;
  description: string;
}

const RecommendationsPage = () => {
  const [activeFilter, setActiveFilter] = useState<"Todas" | "Pendente" | "Resolvida">("Todas");
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  
  // Mock data for recommendations
  const recommendations: Recommendation[] = [
    {
      id: 1,
      text: "Ajustar quantidade de concreto para fundação",
      date: "10/05/2023",
      status: "Pendente",
      type: "warning",
      projectId: "1",
    },
    {
      id: 2,
      text: "Substituir material da laje por opção com menor impacto ambiental",
      date: "22/05/2023",
      status: "Pendente",
      type: "warning",
      projectId: "2",
    },
    {
      id: 3,
      text: "Adotar sistema de coleta seletiva no canteiro de obras",
      date: "03/06/2023",
      status: "Resolvida",
      type: "success",
      projectId: "1",
    },
    {
      id: 4,
      text: "Reduzir desperdício de água durante o processo de concretagem",
      date: "15/06/2023",
      status: "Pendente",
      type: "warning",
      projectId: "3",
    },
    {
      id: 5,
      text: "Implementar reuso de materiais da demolição anterior",
      date: "29/06/2023",
      status: "Resolvida",
      type: "success",
      projectId: "2",
    },
  ];

  // Mock data for projects
  const projects: Project[] = [
    {
      id: "1",
      name: "Edifício Aurora",
      status: "Em andamento",
      location: "São Paulo, SP",
      description: "Edifício residencial de alto padrão com 25 andares, localizado no centro de São Paulo. O projeto inclui apartamentos de 2 e 3 dormitórios, com área de lazer completa e garagem subterrânea."
    },
    {
      id: "2",
      name: "Residencial Parque Verde",
      status: "Iniciando",
      location: "Curitiba, PR",
      description: "Condomínio residencial sustentável com 150 unidades, focado em práticas ecológicas e uso de materiais recicláveis. Inclui área verde preservada e sistema de captação de água da chuva."
    },
    {
      id: "3",
      name: "Torre Corporativa Horizonte",
      status: "Finalizado",
      location: "Rio de Janeiro, RJ",
      description: "Edifício comercial de 30 andares com certificação LEED, localizado na zona portuária do Rio de Janeiro. Projeto inovador com fachada inteligente e sistemas de eficiência energética."
    }
  ];

  // Filter recommendations based on active filter
  const filteredRecommendations = activeFilter === "Todas" 
    ? recommendations 
    : recommendations.filter(rec => rec.status === activeFilter);

  const handleViewDetails = (recommendation: Recommendation) => {
    setSelectedRecommendation(recommendation);
  };

  const handleBack = () => {
    setSelectedRecommendation(null);
  };

  const getProjectById = (projectId?: string): Project | null => {
    if (!projectId) return null;
    return projects.find(project => project.id === projectId) || null;
  };

  // Se há uma recomendação selecionada, mostrar detalhes do projeto
  if (selectedRecommendation) {
    const relatedProject = getProjectById(selectedRecommendation.projectId);
    
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

          {relatedProject ? (
            <div className="space-y-6">
              {/* Informações da Recomendação */}
              <Card className="shadow-residuall">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-residuall-gray-dark mb-4">Recomendação</h3>
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      selectedRecommendation.type === "success" 
                        ? "bg-residuall-green-secondary text-white" 
                        : "bg-residuall-brown text-white"
                    }`}>
                      {selectedRecommendation.type === "success" ? (
                        <CheckCircle size={18} />
                      ) : (
                        <AlertTriangle size={18} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-base text-residuall-gray-tableText">{selectedRecommendation.text}</p>
                      <div className="mt-2 flex items-center text-sm gap-3">
                        <span className="text-residuall-gray">{selectedRecommendation.date}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          selectedRecommendation.status === "Pendente" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {selectedRecommendation.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informações do Projeto */}
              <Card className="shadow-residuall">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-residuall-gray-dark mb-6">Detalhes do Projeto</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Informações básicas */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Projeto</label>
                        <p className="text-lg font-semibold text-residuall-gray-dark">{relatedProject.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          relatedProject.status === 'Em andamento' ? 'bg-green-100 text-green-800' :
                          relatedProject.status === 'Iniciando' ? 'bg-blue-100 text-blue-800' :
                          relatedProject.status === 'Finalizado' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {relatedProject.status}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                        <p className="text-gray-600">{relatedProject.location}</p>
                      </div>
                    </div>

                    {/* Estatísticas mockadas */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Progresso</label>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-residuall-green h-3 rounded-full transition-all duration-300"
                            style={{ width: relatedProject.status === 'Finalizado' ? '100%' : 
                                           relatedProject.status === 'Em andamento' ? '75%' : '25%' }}
                          />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {relatedProject.status === 'Finalizado' ? '100%' : 
                           relatedProject.status === 'Em andamento' ? '75%' : '25%'} concluído
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Equipe</label>
                        <p className="text-gray-600">15 membros ativos</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prazo</label>
                        <p className="text-gray-600">Dezembro 2024</p>
                      </div>
                    </div>
                  </div>

                  {/* Descrição */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                    <p className="text-gray-600 leading-relaxed">{relatedProject.description}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="shadow-residuall">
              <CardContent className="p-6 text-center">
                <p className="text-gray-600">Nenhum projeto relacionado encontrado para esta recomendação.</p>
              </CardContent>
            </Card>
          )}
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
          Resolvidas
        </Button>
      </div>

      {/* Recommendations cards */}
      <div className="grid gap-4">
        {filteredRecommendations.map((recommendation) => (
          <Card key={recommendation.id} className="shadow-residuall hover:shadow-residuall-hover transition-all">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    recommendation.type === "success" 
                      ? "bg-residuall-green-secondary text-white" 
                      : "bg-residuall-brown text-white"
                  }`}>
                    {recommendation.type === "success" ? (
                      <CheckCircle size={18} />
                    ) : (
                      <AlertTriangle size={18} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-residuall-gray-tableText">{recommendation.text}</h3>
                    <div className="mt-2 flex items-center text-sm gap-3">
                      <span className="text-residuall-gray">{recommendation.date}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        recommendation.status === "Pendente" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : "bg-green-100 text-green-800"
                      }`}>
                        {recommendation.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="bg-residuall-brown hover:bg-residuall-brown/90 text-white px-4 py-2 h-9 rounded-lg"
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
