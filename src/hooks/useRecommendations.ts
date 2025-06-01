
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Recommendation {
  id: string;
  titulo: string;
  descricao: string | null;
  data_criacao: string;
  visualizada: boolean;
  aceita: boolean;
  projeto_id: string;
  created_at: string;
  updated_at: string;
  projects?: {
    id: string;
    name: string;
    location: string | null;
    status: string;
    description_notes: string | null;
    budget: number | null;
  };
}

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

interface UseRecommendations {
  recommendations: Recommendation[];
  loading: boolean;
  error: string | null;
  updateRecommendation: (id: string, updates: Partial<Recommendation>) => Promise<void>;
  getProjectDetails: (projectId: string) => Promise<ProjectDetails | null>;
  refetch: () => Promise<void>;
}

export const useRecommendations = (): UseRecommendations => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Buscando recomendações...');
      const { data, error } = await supabase
        .from('recomendacoes')
        .select(`
          *,
          projects (
            id,
            name,
            location,
            status,
            description_notes,
            budget
          )
        `)
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error('Erro ao buscar recomendações:', error);
        throw error;
      }

      console.log('Recomendações encontradas:', data);
      setRecommendations(data as Recommendation[]);
    } catch (err: any) {
      console.error('Erro na busca de recomendações:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateRecommendation = async (id: string, updates: Partial<Recommendation>) => {
    try {
      console.log('Atualizando recomendação:', id, updates);
      const { error } = await supabase
        .from('recomendacoes')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar recomendação:', error);
        throw error;
      }

      // Atualizar localmente
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === id ? { ...rec, ...updates } : rec
        )
      );
      
      console.log('Recomendação atualizada com sucesso');
    } catch (err: any) {
      console.error('Erro na atualização de recomendação:', err);
      setError(err.message);
    }
  };

  const getProjectDetails = async (projectId: string): Promise<ProjectDetails | null> => {
    try {
      console.log('Buscando detalhes do projeto:', projectId);
      
      // Buscar dados do projeto
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError) {
        console.error('Erro ao buscar projeto:', projectError);
        throw projectError;
      }

      // Buscar materiais do projeto
      const { data: materialsData, error: materialsError } = await supabase
        .from('project_materials')
        .select('*')
        .eq('project_id', projectId);

      if (materialsError) {
        console.error('Erro ao buscar materiais:', materialsError);
        throw materialsError;
      }

      // Calcular estatísticas
      const totalCost = materialsData?.reduce((sum, material) => {
        const quantity = material.estimated_quantity || 0;
        const cost = material.cost_per_unit || 0;
        return sum + (quantity * cost);
      }, 0) || 0;

      const materialsInShortage = materialsData?.filter(material => {
        const stock = material.stock_quantity || 0;
        const minimum = material.minimum_quantity || 0;
        return stock <= minimum;
      }).length || 0;

      console.log('Detalhes do projeto encontrados:', projectData);
      
      return {
        ...projectData,
        materials: materialsData || [],
        totalCost,
        materialsInShortage
      };
    } catch (err: any) {
      console.error('Erro ao buscar detalhes do projeto:', err);
      setError(err.message);
      return null;
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return {
    recommendations,
    loading,
    error,
    updateRecommendation,
    getProjectDetails,
    refetch: fetchRecommendations,
  };
};
