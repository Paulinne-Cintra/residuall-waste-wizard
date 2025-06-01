
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  name: string;
  status: string;
  location: string | null;
}

interface TeamMemberProject {
  id: string;
  user_id: string;
  project_id: string;
  role: string;
  assigned_at: string;
  project?: Project;
}

export const useTeamProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [memberProjects, setMemberProjects] = useState<TeamMemberProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, status, location')
        .eq('user_id', user?.id)
        .eq('arquivado', false)
        .order('name');

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar projetos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberProjects = async (memberId: string) => {
    try {
      const { data, error } = await supabase
        .from('team_member_projects')
        .select(`
          *,
          projects:project_id (
            id,
            name,
            status,
            location
          )
        `)
        .eq('user_id', memberId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar projetos do membro:', error);
      return [];
    }
  };

  const assignProjectsToMember = async (memberId: string, projectIds: string[]) => {
    try {
      // Primeiro, remove todas as atribuições existentes
      await supabase
        .from('team_member_projects')
        .delete()
        .eq('user_id', memberId);

      // Depois, adiciona as novas atribuições
      if (projectIds.length > 0) {
        const assignments = projectIds.map(projectId => ({
          user_id: memberId,
          project_id: projectId,
          assigned_by: user?.id,
          role: 'member'
        }));

        const { error } = await supabase
          .from('team_member_projects')
          .insert(assignments);

        if (error) throw error;
      }

      toast({
        title: "Sucesso!",
        description: "Projetos atribuídos com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao atribuir projetos:', error);
      toast({
        title: "Erro",
        description: "Erro ao atribuir projetos ao membro.",
        variant: "destructive",
      });
    }
  };

  const deleteMember = async (memberId: string) => {
    try {
      // Remove todas as atribuições de projetos do membro
      await supabase
        .from('team_member_projects')
        .delete()
        .eq('user_id', memberId);

      // Remove convites pendentes se houver
      await supabase
        .from('team_invitations')
        .delete()
        .eq('invited_by_user_id', user?.id)
        .eq('status', 'pending');

      toast({
        title: "Sucesso!",
        description: "Membro removido da equipe com sucesso!",
      });

      return true;
    } catch (error) {
      console.error('Erro ao remover membro:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover membro da equipe.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    projects,
    loading,
    fetchMemberProjects,
    assignProjectsToMember,
    deleteMember,
    refetch: fetchProjects
  };
};
