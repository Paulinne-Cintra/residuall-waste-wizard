
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface DashboardMetrics {
  total_projects: number;
  active_projects: number;
  total_materials: number;
  total_waste_quantity: number;
  total_economy_generated: number;
  total_waste_entries: number;
}

interface UseDashboardMetricsResult {
  metrics: DashboardMetrics | null;
  loading: boolean;
  error: string | null;
}

export const useDashboardMetrics = (): UseDashboardMetricsResult => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user) {
        setError("Usuário não autenticado.");
        setLoading(false);
        return;
      }

      try {
        console.log('Buscando métricas do dashboard para o usuário:', user.id);
        
        // Buscar dados diretamente das tabelas relacionadas ao usuário
        const [projectsResult, materialsResult, wasteResult] = await Promise.all([
          // Total de projetos e projetos ativos
          supabase
            .from('projects')
            .select('id, status')
            .eq('user_id', user.id)
            .eq('arquivado', false),
          
          // Total de materiais
          supabase
            .from('project_materials')
            .select('id, project_id')
            .in('project_id', 
              supabase
                .from('projects')
                .select('id')
                .eq('user_id', user.id)
                .eq('arquivado', false)
          ),
          
          // Total de desperdício
          supabase
            .from('waste_entries')
            .select('wasted_quantity, project_material_id')
            .in('project_material_id',
              supabase
                .from('project_materials')
                .select('id')
                .in('project_id',
                  supabase
                    .from('projects')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('arquivado', false)
                )
            )
        ]);

        if (projectsResult.error) throw projectsResult.error;
        if (materialsResult.error) throw materialsResult.error;
        if (wasteResult.error) throw wasteResult.error;

        const projects = projectsResult.data || [];
        const materials = materialsResult.data || [];
        const wasteEntries = wasteResult.data || [];

        const totalProjects = projects.length;
        const activeProjects = projects.filter(p => 
          p.status === 'execução' || p.status === 'em_andamento'
        ).length;
        const totalMaterials = materials.length;
        const totalWasteQuantity = wasteEntries.reduce((sum, entry) => 
          sum + (entry.wasted_quantity || 0), 0
        );
        const totalWasteEntries = wasteEntries.length;
        
        // Calcular economia baseada no desperdício evitado (simulação)
        const totalEconomyGenerated = totalWasteQuantity * 50; // R$ 50 por kg economizado

        const calculatedMetrics: DashboardMetrics = {
          total_projects: totalProjects,
          active_projects: activeProjects,
          total_materials: totalMaterials,
          total_waste_quantity: totalWasteQuantity,
          total_economy_generated: totalEconomyGenerated,
          total_waste_entries: totalWasteEntries
        };

        console.log('Métricas calculadas:', calculatedMetrics);
        setMetrics(calculatedMetrics);
      } catch (err: any) {
        console.error('Erro na busca de métricas:', err);
        setError(err.message);
        // Definir métricas padrão em caso de erro
        setMetrics({
          total_projects: 0,
          active_projects: 0,
          total_materials: 0,
          total_waste_quantity: 0,
          total_economy_generated: 0,
          total_waste_entries: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [user]);

  return { metrics, loading, error };
};
