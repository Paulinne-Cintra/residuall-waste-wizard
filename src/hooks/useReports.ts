
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Report {
  id: string;
  user_id: string;
  project_id: string | null;
  report_date: string;
  economy_generated: number | null;
  waste_avoided_tons: number | null;
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
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Erro ao buscar relatórios:', error);
          throw error;
        }
        
        console.log('Relatórios encontrados:', data);
        setReports(data as Report[]);
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
