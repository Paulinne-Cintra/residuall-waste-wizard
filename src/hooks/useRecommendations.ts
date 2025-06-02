
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Recommendation {
  id: string;
  titulo: string;
  descricao: string | null;
  data_criacao: string;
  visualizada: boolean;
  aceita: boolean;
  projeto_id: string;
}

interface UseRecommendationsResult {
  recommendations: Recommendation[];
  loading: boolean;
  error: string | null;
  acceptRecommendation: (id: string) => Promise<void>;
  markAsViewed: (id: string) => Promise<void>;
  refetch: () => void;
}

export const useRecommendations = (): UseRecommendationsResult => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);

    if (!user) {
      setError("Usuário não autenticado.");
      setLoading(false);
      return;
    }

    try {
      console.log('Buscando recomendações para o usuário:', user.id);
      
      // Buscar recomendações através dos projetos do usuário
      const { data, error } = await supabase
        .from('recomendacoes')
        .select(`
          *,
          projects!inner(user_id)
        `)
        .eq('projects.user_id', user.id)
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error('Erro ao buscar recomendações:', error);
        throw error;
      }
      
      console.log('Recomendações encontradas:', data);
      setRecommendations(data || []);
    } catch (err: any) {
      console.error('Erro na busca de recomendações:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const acceptRecommendation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recomendacoes')
        .update({ aceita: true })
        .eq('id', id);

      if (error) throw error;

      // Atualizar o estado local
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === id ? { ...rec, aceita: true } : rec
        )
      );
    } catch (err: any) {
      console.error('Erro ao aceitar recomendação:', err);
      setError(err.message);
    }
  };

  const markAsViewed = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recomendacoes')
        .update({ visualizada: true })
        .eq('id', id);

      if (error) throw error;

      // Atualizar o estado local
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === id ? { ...rec, visualizada: true } : rec
        )
      );
    } catch (err: any) {
      console.error('Erro ao marcar como visualizada:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    } else {
      setRecommendations([]);
      setLoading(false);
    }
  }, [user]);

  return { 
    recommendations, 
    loading, 
    error, 
    acceptRecommendation, 
    markAsViewed, 
    refetch: fetchRecommendations 
  };
};
