
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface MaterialWithProject {
  id: string;
  project_id: string;
  project_name: string;
  project_status: string;
  material_type_name: string;
  category: string | null;
  estimated_quantity: number | null;
  stock_quantity: number | null;
  minimum_quantity: number | null;
  cost_per_unit: number | null;
  total_estimated_cost: number | null;
  stock_status: string;
  unit_of_measurement: string | null;
  created_at: string;
}

interface UseOptimizedMaterialsResult {
  materials: MaterialWithProject[];
  loading: boolean;
  error: string | null;
  filterByProject: (projectId: string) => void;
  filterByCategory: (category: string) => void;
  filterByStatus: (status: string) => void;
  refetch: () => void;
}

export const useOptimizedMaterials = (): UseOptimizedMaterialsResult => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<MaterialWithProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [originalMaterials, setOriginalMaterials] = useState<MaterialWithProject[]>([]);

  const fetchMaterials = async () => {
    setLoading(true);
    setError(null);

    if (!user) {
      setError("Usuário não autenticado.");
      setLoading(false);
      return;
    }

    try {
      console.log('Buscando materiais otimizados para o usuário:', user.id);
      const { data, error } = await supabase
        .from('materials_with_project')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar materiais:', error);
        throw error;
      }
      
      console.log('Materiais encontrados:', data);
      const materialsData = data as MaterialWithProject[];
      setMaterials(materialsData);
      setOriginalMaterials(materialsData);
    } catch (err: any) {
      console.error('Erro na busca de materiais:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterByProject = (projectId: string) => {
    if (projectId === 'all' || !projectId) {
      setMaterials(originalMaterials);
    } else {
      setMaterials(originalMaterials.filter(material => material.project_id === projectId));
    }
  };

  const filterByCategory = (category: string) => {
    if (category === 'all' || !category) {
      setMaterials(originalMaterials);
    } else {
      setMaterials(originalMaterials.filter(material => material.category === category));
    }
  };

  const filterByStatus = (status: string) => {
    if (status === 'all' || !status) {
      setMaterials(originalMaterials);
    } else {
      setMaterials(originalMaterials.filter(material => material.stock_status === status));
    }
  };

  useEffect(() => {
    if (user) {
      fetchMaterials();
    } else {
      setMaterials([]);
      setLoading(false);
    }
  }, [user]);

  return { 
    materials, 
    loading, 
    error, 
    filterByProject, 
    filterByCategory, 
    filterByStatus, 
    refetch: fetchMaterials 
  };
};
