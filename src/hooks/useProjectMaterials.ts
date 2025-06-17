
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ProjectMaterial {
  id: string;
  project_id: string;
  material_type_name: string;
  estimated_quantity: number;
  cost_per_unit: number;
  unit_of_measurement: string;
  category: string;
  stock_quantity: number;
  minimum_quantity: number;
  total_estimated_cost: number;
  waste_percentage?: number;
  dimensions_specs?: string;
  created_at: string;
}

export const useProjectMaterials = (projectId?: string) => {
  const [materials, setMaterials] = useState<ProjectMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!user) {
        setMaterials([]);
        setLoading(false);
        return;
      }

      try {
        console.log('Buscando materiais para projeto:', projectId);
        
        let query = supabase
          .from('project_materials')
          .select(`
            id,
            project_id,
            material_type_name,
            estimated_quantity,
            cost_per_unit,
            unit_of_measurement,
            category,
            stock_quantity,
            minimum_quantity,
            dimensions_specs,
            created_at,
            waste_entries(
              wasted_quantity
            )
          `);

        if (projectId) {
          query = query.eq('project_id', projectId);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Erro ao buscar materiais:', error);
          setError(error.message);
          return;
        }

        const processedMaterials = (data || []).map(material => {
          const totalWasted = material.waste_entries?.reduce((sum: number, entry: any) => sum + entry.wasted_quantity, 0) || 0;
          const wastePercentage = material.estimated_quantity > 0 ? (totalWasted / material.estimated_quantity) * 100 : 0;
          
          return {
            id: material.id,
            project_id: material.project_id,
            material_type_name: material.material_type_name,
            estimated_quantity: material.estimated_quantity || 0,
            cost_per_unit: material.cost_per_unit || 0,
            unit_of_measurement: material.unit_of_measurement || '',
            category: material.category || '',
            stock_quantity: material.stock_quantity || 0,
            minimum_quantity: material.minimum_quantity || 0,
            total_estimated_cost: (material.estimated_quantity || 0) * (material.cost_per_unit || 0),
            waste_percentage: wastePercentage,
            dimensions_specs: material.dimensions_specs,
            created_at: material.created_at
          };
        });

        setMaterials(processedMaterials);
        setError(null);
      } catch (error) {
        console.error('Erro ao buscar materiais do projeto:', error);
        setMaterials([]);
        setError('Erro ao carregar materiais');
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [user, projectId]);

  const createMaterial = async (materialData: any): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('project_materials')
        .insert([materialData]);

      if (error) {
        console.error('Erro ao criar material:', error);
        setError(error.message);
        return false;
      }

      // Refresh materials list
      const fetchMaterials = async () => {
        let query = supabase
          .from('project_materials')
          .select(`
            id,
            project_id,
            material_type_name,
            estimated_quantity,
            cost_per_unit,
            unit_of_measurement,
            category,
            stock_quantity,
            minimum_quantity,
            dimensions_specs,
            created_at,
            waste_entries(
              wasted_quantity
            )
          `);

        if (projectId) {
          query = query.eq('project_id', projectId);
        }

        const { data } = await query;
        
        const processedMaterials = (data || []).map(material => {
          const totalWasted = material.waste_entries?.reduce((sum: number, entry: any) => sum + entry.wasted_quantity, 0) || 0;
          const wastePercentage = material.estimated_quantity > 0 ? (totalWasted / material.estimated_quantity) * 100 : 0;
          
          return {
            id: material.id,
            project_id: material.project_id,
            material_type_name: material.material_type_name,
            estimated_quantity: material.estimated_quantity || 0,
            cost_per_unit: material.cost_per_unit || 0,
            unit_of_measurement: material.unit_of_measurement || '',
            category: material.category || '',
            stock_quantity: material.stock_quantity || 0,
            minimum_quantity: material.minimum_quantity || 0,
            total_estimated_cost: (material.estimated_quantity || 0) * (material.cost_per_unit || 0),
            waste_percentage: wastePercentage,
            dimensions_specs: material.dimensions_specs,
            created_at: material.created_at
          };
        });

        setMaterials(processedMaterials);
      };

      await fetchMaterials();
      return true;
    } catch (error) {
      console.error('Erro ao criar material:', error);
      setError('Erro ao criar material');
      return false;
    }
  };

  return { materials, loading, error, createMaterial };
};
