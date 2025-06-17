
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ProjectMaterial {
  id: string;
  material_type_name: string;
  estimated_quantity: number;
  cost_per_unit: number;
  unit_of_measurement: string;
  category: string;
  stock_quantity: number;
  minimum_quantity: number;
  total_estimated_cost: number;
  waste_percentage?: number;
}

export const useProjectMaterials = (projectId: string) => {
  const [materials, setMaterials] = useState<ProjectMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!user || !projectId) {
        setMaterials([]);
        setLoading(false);
        return;
      }

      try {
        console.log('Buscando materiais para projeto:', projectId);
        
        const { data, error } = await supabase
          .from('project_materials')
          .select(`
            id,
            material_type_name,
            estimated_quantity,
            cost_per_unit,
            unit_of_measurement,
            category,
            stock_quantity,
            minimum_quantity,
            waste_entries(
              wasted_quantity
            )
          `)
          .eq('project_id', projectId);

        if (error) {
          console.error('Erro ao buscar materiais:', error);
          throw error;
        }

        const processedMaterials = (data || []).map(material => {
          const totalWasted = material.waste_entries?.reduce((sum: number, entry: any) => sum + entry.wasted_quantity, 0) || 0;
          const wastePercentage = material.estimated_quantity > 0 ? (totalWasted / material.estimated_quantity) * 100 : 0;
          
          return {
            id: material.id,
            material_type_name: material.material_type_name,
            estimated_quantity: material.estimated_quantity || 0,
            cost_per_unit: material.cost_per_unit || 0,
            unit_of_measurement: material.unit_of_measurement || '',
            category: material.category || '',
            stock_quantity: material.stock_quantity || 0,
            minimum_quantity: material.minimum_quantity || 0,
            total_estimated_cost: (material.estimated_quantity || 0) * (material.cost_per_unit || 0),
            waste_percentage: wastePercentage
          };
        });

        setMaterials(processedMaterials);
      } catch (error) {
        console.error('Erro ao buscar materiais do projeto:', error);
        setMaterials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [user, projectId]);

  return { materials, loading };
};
