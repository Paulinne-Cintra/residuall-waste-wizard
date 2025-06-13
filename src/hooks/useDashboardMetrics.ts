
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface DashboardMetrics {
  total_projects: number;
  active_projects: number;
  total_materials: number;
  total_waste_entries: number;
  total_waste_quantity: number;
  total_economy_generated: number;
}

export const useDashboardMetrics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMetrics();
    } else {
      setMetrics(null);
      setLoading(false);
    }
  }, [user]);

  const fetchMetrics = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Buscando métricas para usuário:', user.id);

      // Buscar métricas diretamente das tabelas com filtro por user_id
      const [projectsResult, materialsResult, wasteResult] = await Promise.all([
        // Projetos
        supabase
          .from('projects')
          .select('id, status')
          .eq('user_id', user.id)
          .eq('arquivado', false),
        
        // Materiais
        supabase
          .from('project_materials')
          .select('id, project_id')
          .in('project_id', supabase
            .from('projects')
            .select('id')
            .eq('user_id', user.id)
            .eq('arquivado', false)
          ),
        
        // Entradas de desperdício
        supabase
          .from('waste_entries')
          .select('id, wasted_quantity, project_material_id')
          .in('project_material_id', supabase
            .from('project_materials')
            .select('id')
            .in('project_id', supabase
              .from('projects')
              .select('id')
              .eq('user_id', user.id)
              .eq('arquivado', false)
            )
          )
      ]);

      const projects = projectsResult.data || [];
      const materials = materialsResult.data || [];
      const wasteEntries = wasteResult.data || [];

      const totalProjects = projects.length;
      const activeProjects = projects.filter(p => 
        p.status === 'execução' || p.status === 'em_andamento' || p.status === 'planejamento'
      ).length;
      
      const totalMaterials = materials.length;
      const totalWasteEntries = wasteEntries.length;
      const totalWasteQuantity = wasteEntries.reduce((sum, entry) => 
        sum + (Number(entry.wasted_quantity) || 0), 0
      );
      
      // Cálculo básico de economia (placeholder - pode ser refinado)
      const totalEconomyGenerated = totalWasteQuantity * 15; // R$ 15 por kg economizado

      const metricsData: DashboardMetrics = {
        total_projects: totalProjects,
        active_projects: activeProjects,
        total_materials: totalMaterials,
        total_waste_entries: totalWasteEntries,
        total_waste_quantity: totalWasteQuantity,
        total_economy_generated: totalEconomyGenerated
      };

      console.log('Métricas calculadas:', metricsData);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      setMetrics({
        total_projects: 0,
        active_projects: 0,
        total_materials: 0,
        total_waste_entries: 0,
        total_waste_quantity: 0,
        total_economy_generated: 0
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    metrics,
    loading,
    refetch: fetchMetrics
  };
};
