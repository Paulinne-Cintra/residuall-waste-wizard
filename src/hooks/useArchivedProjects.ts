
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ArchivedProject {
  id: string;
  user_id: string;
  name: string;
  location: string | null;
  project_type: string | null;
  created_at: string;
  updated_at: string;
}

interface UseArchivedProjectsResult {
  archivedProjects: ArchivedProject[];
  loading: boolean;
  error: string | null;
  restoreProject: (projectId: string) => Promise<boolean>;
  deleteProject: (projectId: string) => Promise<boolean>;
  refetch: () => void;
}

export const useArchivedProjects = (): UseArchivedProjectsResult => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [archivedProjects, setArchivedProjects] = useState<ArchivedProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArchivedProjects = async () => {
    setLoading(true);
    setError(null);

    if (!user) {
      setError("Usuário não autenticado.");
      setLoading(false);
      return;
    }

    try {
      console.log('Buscando projetos arquivados para o usuário:', user.id);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .eq('arquivado', true)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar projetos arquivados:', error);
        throw error;
      }
      
      console.log('Projetos arquivados encontrados:', data);
      setArchivedProjects((data || []) as ArchivedProject[]);
    } catch (err: any) {
      console.error('Erro na busca de projetos arquivados:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const restoreProject = async (projectId: string): Promise<boolean> => {
    try {
      console.log('Restaurando projeto:', projectId);
      const { error } = await supabase
        .from('projects')
        .update({ arquivado: false, updated_at: new Date().toISOString() })
        .eq('id', projectId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Erro ao restaurar projeto:', error);
        throw error;
      }

      // Remove o projeto da lista local
      setArchivedProjects(prev => prev.filter(project => project.id !== projectId));
      
      toast({
        title: "Sucesso!",
        description: "Projeto restaurado com sucesso!",
        duration: 3000,
      });

      return true;
    } catch (err: any) {
      console.error('Erro ao restaurar projeto:', err);
      toast({
        title: "Erro",
        description: "Não foi possível restaurar o projeto.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteProject = async (projectId: string): Promise<boolean> => {
    try {
      console.log('Excluindo projeto permanentemente:', projectId);
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Erro ao excluir projeto:', error);
        throw error;
      }

      // Remove o projeto da lista local
      setArchivedProjects(prev => prev.filter(project => project.id !== projectId));
      
      toast({
        title: "Excluído!",
        description: "Projeto excluído permanentemente!",
        duration: 3000,
        variant: "destructive",
      });

      return true;
    } catch (err: any) {
      console.error('Erro ao excluir projeto:', err);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o projeto.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchArchivedProjects();
    } else {
      setArchivedProjects([]);
      setLoading(false);
    }
  }, [user]);

  return { 
    archivedProjects, 
    loading, 
    error, 
    restoreProject, 
    deleteProject, 
    refetch: fetchArchivedProjects 
  };
};
