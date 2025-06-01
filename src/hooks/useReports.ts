
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Report {
  id: string;
  project_id: string;
  project_name: string;
  material_type_name: string;
  total_wasted_quantity: number;
  total_economy_generated: number;
  created_at: string;
  project_status: string;
  project_location: string;
  responsible: string;
}

interface ReportMetrics {
  reuseRate: number;
  totalSavings: number;
  avgSavingsPerProject: number;
  totalProjects: number;
}

interface UseReportsResult {
  reports: Report[];
  metrics: ReportMetrics;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useReports = (): UseReportsResult => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [metrics, setMetrics] = useState<ReportMetrics>({
    reuseRate: 0,
    totalSavings: 0,
    avgSavingsPerProject: 0,
    totalProjects: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);

    if (!user) {
      setError("Usuário não autenticado.");
      setLoading(false);
      return;
    }

    try {
      console.log('Buscando relatórios para o usuário:', user.id);
      
      // Buscar projetos com materiais e desperdícios
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          status,
          location,
          responsible_team_contacts,
          created_at,
          project_materials!inner(
            id,
            material_type_name,
            cost_per_unit,
            estimated_quantity,
            waste_entries(
              wasted_quantity,
              entry_date
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('arquivado', false);

      if (projectsError) {
        console.error('Erro ao buscar projetos:', projectsError);
        throw projectsError;
      }

      console.log('Dados de projetos encontrados:', projectsData);

      // Processar dados para criar relatórios por projeto/material
      const processedReports: Report[] = [];
      let totalWaste = 0;
      let totalEstimated = 0;
      let totalSavings = 0;

      projectsData?.forEach((project: any) => {
        project.project_materials.forEach((material: any) => {
          const wasteEntries = material.waste_entries || [];
          const totalWasted = wasteEntries.reduce((sum: number, entry: any) => sum + entry.wasted_quantity, 0);
          const economyGenerated = totalWasted * (material.cost_per_unit || 0);

          if (totalWasted > 0) {
            processedReports.push({
              id: `${project.id}-${material.id}`,
              project_id: project.id,
              project_name: project.name,
              material_type_name: material.material_type_name,
              total_wasted_quantity: totalWasted,
              total_economy_generated: economyGenerated,
              created_at: project.created_at,
              project_status: project.status,
              project_location: project.location || 'Não informado',
              responsible: project.responsible_team_contacts || 'Não informado'
            });

            totalWaste += totalWasted;
            totalSavings += economyGenerated;
          }

          totalEstimated += material.estimated_quantity || 0;
        });
      });

      // Calcular métricas
      const reuseRate = totalEstimated > 0 ? Math.max(0, ((totalEstimated - totalWaste) / totalEstimated) * 100) : 0;
      const uniqueProjects = new Set(processedReports.map(r => r.project_id)).size;
      const avgSavingsPerProject = uniqueProjects > 0 ? totalSavings / uniqueProjects : 0;

      setReports(processedReports);
      setMetrics({
        reuseRate: Math.round(reuseRate),
        totalSavings: Math.round(totalSavings),
        avgSavingsPerProject: Math.round(avgSavingsPerProject),
        totalProjects: uniqueProjects
      });

    } catch (err: any) {
      console.error('Erro na busca de relatórios:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReports();
    } else {
      setReports([]);
      setMetrics({
        reuseRate: 0,
        totalSavings: 0,
        avgSavingsPerProject: 0,
        totalProjects: 0
      });
      setLoading(false);
    }
  }, [user]);

  return { reports, metrics, loading, error, refetch: fetchReports };
};
