
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Report {
  id: string;
  project_id: string;
  material_type_name: string;
  total_wasted_quantity: number;
  total_economy_generated: number;
  project_name: string;
  created_at: string;
}

interface UseReportsResult {
  reports: Report[];
  loading: boolean;
  error: string | null;
}

export const useReports = (): UseReportsResult => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
        
        // Buscar dados agregados de desperdício por material e projeto
        const { data, error } = await supabase
          .from('waste_entries')
          .select(`
            wasted_quantity,
            project_materials!inner(
              id,
              material_type_name,
              cost_per_unit,
              project_id,
              projects!inner(
                name,
                user_id
              )
            )
          `)
          .eq('project_materials.projects.user_id', user.id);

        if (error) {
          console.error('Erro ao buscar relatórios:', error);
          throw error;
        }
        
        console.log('Dados de desperdício encontrados:', data);
        
        // Agregar dados por material e projeto
        const aggregatedReports: Record<string, Report> = {};
        
        data?.forEach((entry: any) => {
          const key = `${entry.project_materials.project_id}-${entry.project_materials.material_type_name}`;
          
          if (!aggregatedReports[key]) {
            aggregatedReports[key] = {
              id: key,
              project_id: entry.project_materials.project_id,
              material_type_name: entry.project_materials.material_type_name,
              total_wasted_quantity: 0,
              total_economy_generated: 0,
              project_name: entry.project_materials.projects.name,
              created_at: new Date().toISOString()
            };
          }
          
          aggregatedReports[key].total_wasted_quantity += entry.wasted_quantity;
          aggregatedReports[key].total_economy_generated += 
            entry.wasted_quantity * (entry.project_materials.cost_per_unit || 0);
        });
        
        setReports(Object.values(aggregatedReports));
      } catch (err: any) {
        console.error('Erro na busca de relatórios:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReports();
    } else {
      setReports([]);
      setLoading(false);
    }
  }, [user]);

  return { reports, loading, error };
};
