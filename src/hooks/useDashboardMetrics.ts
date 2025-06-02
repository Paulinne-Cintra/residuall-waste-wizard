
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
        const { data, error } = await supabase
          .from('dashboard_metrics')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Erro ao buscar métricas:', error);
          throw error;
        }
        
        console.log('Métricas encontradas:', data);
        setMetrics(data as DashboardMetrics);
      } catch (err: any) {
        console.error('Erro na busca de métricas:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [user]);

  return { metrics, loading, error };
};
