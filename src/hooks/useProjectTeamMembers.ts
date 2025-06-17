
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ProjectTeamMember {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  assigned_at: string;
}

export const useProjectTeamMembers = (projectId: string | undefined) => {
  const [teamMembers, setTeamMembers] = useState<ProjectTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (projectId && user) {
      fetchProjectTeamMembers();
    } else {
      setTeamMembers([]);
      setLoading(false);
    }
  }, [projectId, user]);

  const fetchProjectTeamMembers = async () => {
    if (!projectId || !user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('team_member_projects')
        .select(`
          id,
          user_id,
          role,
          assigned_at,
          profiles!inner(
            id,
            full_name,
            email,
            profile_picture_url
          )
        `)
        .eq('project_id', projectId);

      if (error) throw error;

      const members: ProjectTeamMember[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        name: (item.profiles as any)?.full_name || 'Nome não informado',
        email: (item.profiles as any)?.email || '',
        role: item.role || 'Membro',
        avatar_url: (item.profiles as any)?.profile_picture_url,
        assigned_at: item.assigned_at
      }));

      setTeamMembers(members);
    } catch (error) {
      console.error('Erro ao buscar membros da equipe do projeto:', error);
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  return { teamMembers, loading, refetch: fetchProjectTeamMembers };
};
