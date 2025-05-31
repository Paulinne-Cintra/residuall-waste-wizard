
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: string;
  progress: number;
  created_at: string;
}

interface UseProjectsResult {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

export const useProjects = (): UseProjectsResult => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      if (!user) {
        setError("Usuário não autenticado.");
        setLoading(false);
        return;
      }

      try {
        console.log('Buscando projetos para o usuário:', user.id);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Erro ao buscar projetos:', error);
          throw error;
        }
        
        console.log('Projetos encontrados:', data);
        setProjects(data as Project[]);
      } catch (err: any) {
        console.error('Erro na busca de projetos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProjects();
    } else {
      setProjects([]);
      setLoading(false);
    }
  }, [user]);

  return { projects, loading, error };
};
