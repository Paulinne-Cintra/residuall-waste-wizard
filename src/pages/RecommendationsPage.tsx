import { useState } from "react";
import { CheckCircle, AlertTriangle, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
// REMOVIDO: import DashboardHeader from "@/components/DashboardHeader";
// REMOVIDO: import SidebarDashboard from "@/components/SidebarDashboard";
import { Button } from "@/components/ui/button";

interface Recommendation {
  id: number;
  text: string;
  date: string;
  status: "Pendente" | "Resolvida";
  type: "success" | "warning";
}

const RecommendationsPage = () => {
  const [activeFilter, setActiveFilter] = useState<"Todas" | "Pendente" | "Resolvida">("Todas");
  
  // Mock data for recommendations
  const recommendations: Recommendation[] = [
    {
      id: 1,
      text: "Ajustar quantidade de concreto para fundação",
      date: "10/05/2023",
      status: "Pendente",
      type: "warning",
    },
    {
      id: 2,
      text: "Substituir material da laje por opção com menor impacto ambiental",
      date: "22/05/2023",
      status: "Pendente",
      type: "warning",
    },
    {
      id: 3,
      text: "Adotar sistema de coleta seletiva no canteiro de obras",
      date: "03/06/2023",
      status: "Resolvida",
      type: "success",
    },
    {
      id: 4,
      text: "Reduzir desperdício de água durante o processo de concretagem",
      date: "15/06/2023",
      status: "Pendente",
      type: "warning",
    },
    {
      id: 5,
      text: "Implementar reuso de materiais da demolição anterior",
      date: "29/06/2023",
      status: "Resolvida",
      type: "success",
    },
  ];

  // Filter recommendations based on active filter
  const filteredRecommendations = activeFilter === "Todas" 
    ? recommendations 
    : recommendations.filter(rec => rec.status === activeFilter);

  return (
    // Removida a div pai que continha SidebarDashboard e DashboardHeader,
    // pois o DashboardLayout já provê essa estrutura.
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
