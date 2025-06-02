
import React, { useState } from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle, Eye, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRecommendations } from '@/hooks/useRecommendations';

const RecommendationsPage = () => {
  const { recommendations, loading, acceptRecommendation, markAsViewed } = useRecommendations();
  const [filter, setFilter] = useState<'all' | 'accepted' | 'pending'>('all');

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-residuall-green"></div>
        </div>
      </main>
    );
  }

  const filteredRecommendations = recommendations.filter(rec => {
    if (filter === 'accepted') return rec.aceita;
    if (filter === 'pending') return !rec.aceita;
    return true;
  });

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'waste_reduction':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'cost_saving':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Lightbulb className="h-5 w-5 text-blue-600" />;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'waste_reduction':
        return 'bg-green-50 border-green-200';
      case 'cost_saving':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Recomendações</h1>
          <p className="text-base text-gray-600">Sugestões inteligentes baseadas nos dados dos seus projetos</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="shadow-sm border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Recomendações</p>
                <p className="text-3xl font-bold text-gray-900">{recommendations.length}</p>
              </div>
              <Lightbulb className="h-12 w-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aceitas</p>
                <p className="text-3xl font-bold text-green-600">
                  {recommendations.filter(r => r.aceita).length}
                </p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {recommendations.filter(r => !r.aceita).length}
                </p>
              </div>
              <AlertTriangle className="h-12 w-12 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          Todas
        </Button>
        <Button 
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
        >
          Pendentes
        </Button>
        <Button 
          variant={filter === 'accepted' ? 'default' : 'outline'}
          onClick={() => setFilter('accepted')}
        >
          Aceitas
        </Button>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {filteredRecommendations.length === 0 ? (
          <Card className="shadow-sm border-none">
            <CardContent className="p-12 text-center">
              <Lightbulb className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' ? 'Nenhuma recomendação disponível' : 
                 filter === 'pending' ? 'Nenhuma recomendação pendente' :
                 'Nenhuma recomendação aceita'}
              </h3>
              <p className="text-gray-500">
                Continue registrando dados de desperdício para receber sugestões personalizadas.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRecommendations.map((recommendation) => (
            <Card 
              key={recommendation.id} 
              className={`shadow-sm border-l-4 ${getRecommendationColor('general')}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getRecommendationIcon('general')}
                    <div>
                      <CardTitle className="text-lg">{recommendation.titulo}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {new Date(recommendation.data_criacao).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {recommendation.aceita && (
                      <Badge className="bg-green-100 text-green-800">Aceita</Badge>
                    )}
                    {!recommendation.visualizada && (
                      <Badge className="bg-blue-100 text-blue-800">Nova</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {recommendation.descricao && (
                <CardContent className="pt-0">
                  <p className="text-gray-600 mb-4">{recommendation.descricao}</p>
                  
                  <div className="flex gap-2">
                    {!recommendation.visualizada && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => markAsViewed(recommendation.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Marcar como vista
                      </Button>
                    )}
                    
                    {!recommendation.aceita && (
                      <Button 
                        size="sm"
                        onClick={() => acceptRecommendation(recommendation.id)}
                        className="bg-residuall-green hover:bg-residuall-green/90"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Aceitar Recomendação
                      </Button>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </main>
  );
};

export default RecommendationsPage;
