
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  user_id: string;
  name: string;
  location: string | null;
  dimensions_details: string | null;
  project_type: string | null;
  status: string;
  start_date: string | null;
  planned_end_date: string | null;
  budget: number | null;
  responsible_team_contacts: string | null;
  description_notes: string | null;
  created_at: string;
  updated_at: string;
  arquivado: boolean;
}

interface UseProjectsResult {
  projects: Project[];
  loading: boolean;
  error: string | null;
  archiveProject: (projectId: string) => Promise<boolean>;
  refetch: () => void;
}

export const useProjects = (): UseProjectsResult => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        .eq('user_id', user.id)
        .eq('arquivado', false);

      if (error) {
        console.error('Erro ao buscar projetos:', error);
        throw error;
      }
      
      console.log('Projetos encontrados:', data);
      setProjects((data || []) as Project[]);
    } catch (err: any) {
      console.error('Erro na busca de projetos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const archiveProject = async (projectId: string): Promise<boolean> => {
    try {
      console.log('Arquivando projeto:', projectId);
      const { error } = await supabase
        .from('projects')
        .update({ arquivado: true, updated_at: new Date().toISOString() })
        .eq('id', projectId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Erro ao arquivar projeto:', error);
        throw error;
      }

      // Remove o projeto da lista local
      setProjects(prev => prev.filter(project => project.id !== projectId));
      
      toast({
        title: "Sucesso!",
        description: "Projeto arquivado com sucesso!",
        duration: 3000,
      });

      return true;
    } catch (err: any) {
      console.error('Erro ao arquivar projeto:', err);
      toast({
        title: "Erro",
        description: "Não foi possível arquivar o projeto.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
    } else {
      setProjects([]);
      setLoading(false);
    }
  }, [user]);

  return { projects, loading, error, archiveProject, refetch: fetchProjects };
};
