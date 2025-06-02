
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ProjectMaterial {
  id: string;
  project_id: string;
  material_type_name: string;
  estimated_quantity: number | null;
  unit_of_measurement: string | null;
  dimensions_specs: string | null;
  cost_per_unit: number | null;
  stock_quantity: number | null;
  minimum_quantity: number | null;
  category: string | null;
  supplier_id: string | null;
  created_at: string;
  updated_at: string;
}

interface UseProjectMaterialsResult {
  materials: ProjectMaterial[];
  loading: boolean;
  error: string | null;
  createMaterial: (materialData: any) => Promise<boolean>;
}

export const useProjectMaterials = (): UseProjectMaterialsResult => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<ProjectMaterial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      setError(null);

      if (!user) {
        setError("Usuário não autenticado.");
        setLoading(false);
        return;
      }

      try {
        console.log('Buscando materiais para o usuário:', user.id);
        const { data, error } = await supabase
          .from('project_materials')
          .select(`
            *,
            projects!inner(user_id)
          `)
          .eq('projects.user_id', user.id);

        if (error) {
          console.error('Erro ao buscar materiais:', error);
          throw error;
        }
        
        console.log('Materiais encontrados:', data);
        setMaterials(data as ProjectMaterial[]);
      } catch (err: any) {
        console.error('Erro na busca de materiais:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMaterials();
    } else {
      setMaterials([]);
      setLoading(false);
    }
  }, [user]);

  const createMaterial = async (materialData: any): Promise<boolean> => {
    if (!user) {
      setError("Usuário não autenticado.");
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('project_materials')
        .insert([materialData])
        .select();

      if (error) {
        console.error('Erro ao criar material:', error);
        setError(error.message);
        return false;
      }

      if (data && data.length > 0) {
        setMaterials(prev => [...prev, data[0] as ProjectMaterial]);
        return true;
      }

      return false;
    } catch (err: any) {
      console.error('Erro ao criar material:', err);
      setError(err.message);
      return false;
    }
  };

  return { materials, loading, error, createMaterial };
};
