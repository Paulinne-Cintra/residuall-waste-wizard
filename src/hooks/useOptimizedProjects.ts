
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ProjectWithProgress {
  id: string;
  user_id: string;
  name: string;
  location: string | null;
  status: string;
  progress_percentage: number;
  materials_count: number;
  waste_entries_count: number;
  created_at: string;
  updated_at: string | null;
}

interface UseOptimizedProjectsResult {
  projects: ProjectWithProgress[];
  loading: boolean;
  error: string | null;
  searchProjects: (searchTerm: string) => Promise<void>;
  filterProjects: (status: string) => Promise<void>;
  refetch: () => void;
}

export const useOptimizedProjects = (): UseOptimizedProjectsResult => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectWithProgress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async (filters?: { search?: string; status?: string }) => {
    setLoading(true);
    setError(null);

    if (!user) {
      setError("Usuário não autenticado.");
      setLoading(false);
      return;
    }

    try {
      console.log('Buscando projetos otimizados para o usuário:', user.id);
      
      let query = supabase
        .from('projects_with_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('arquivado', false)
        .order('created_at', { ascending: false });

      // Aplicar filtro de status se fornecido
      if (filters?.status && filters.status !== 'Todos' && filters.status !== 'Status') {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar projetos:', error);
        throw error;
      }
      
      console.log('Projetos encontrados:', data);
      
      // Aplicar filtro de busca se fornecido
      let filteredData = data || [];
      if (filters?.search && filters.search.trim()) {
        const searchTerm = filters.search.toLowerCase();
        filteredData = filteredData.filter(project => 
          project.name.toLowerCase().includes(searchTerm) ||
          (project.location && project.location.toLowerCase().includes(searchTerm)) ||
          project.status.toLowerCase().includes(searchTerm)
        );
      }

      setProjects(filteredData as ProjectWithProgress[]);
    } catch (err: any) {
      console.error('Erro na busca de projetos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchProjects = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      await fetchProjects();
      return;
    }

    try {
      console.log('Buscando projetos com termo:', searchTerm);
      const { data, error } = await supabase.rpc('search_projects', {
        search_term: searchTerm,
        user_id_param: user?.id
      });

      if (error) {
        console.error('Erro na busca:', error);
        throw error;
      }

      // Transform the search result to match ProjectWithProgress interface
      const transformedData = (data || []).map(project => ({
        ...project,
        user_id: user?.id || '',
        waste_entries_count: 0, // Default value since search function doesn't return this
        updated_at: null // Default value since search function doesn't return this
      }));

      setProjects(transformedData);
    } catch (err: any) {
      console.error('Erro na busca de projetos:', err);
      setError(err.message);
    }
  };

  const filterProjects = async (status: string) => {
    await fetchProjects({ status });
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
    } else {
      setProjects([]);
      setLoading(false);
    }
  }, [user]);

  return { 
    projects, 
    loading, 
    error, 
    searchProjects, 
    filterProjects, 
    refetch: () => fetchProjects() 
  };
};
