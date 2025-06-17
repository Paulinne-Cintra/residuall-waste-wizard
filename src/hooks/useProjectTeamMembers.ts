
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ProjectTeamMember {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
  assigned_at: string;
  profile_picture_url?: string;
}

export const useProjectTeamMembers = (projectId: string) => {
  const [teamMembers, setTeamMembers] = useState<ProjectTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!user || !projectId) {
        setTeamMembers([]);
        setLoading(false);
        return;
      }

      try {
        console.log('Buscando membros da equipe para projeto:', projectId);
        
        // First get team member projects
        const { data: teamMemberProjects, error: teamError } = await supabase
          .from('team_member_projects')
          .select('*')
          .eq('project_id', projectId);

        if (teamError) {
          console.error('Erro ao buscar membros da equipe:', teamError);
          throw teamError;
        }

        if (!teamMemberProjects || teamMemberProjects.length === 0) {
          setTeamMembers([]);
          setLoading(false);
          return;
        }

        // Get user IDs to fetch profiles
        const userIds = teamMemberProjects.map(member => member.user_id);
        
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', userIds);

        if (profilesError) {
          console.error('Erro ao buscar perfis:', profilesError);
          throw profilesError;
        }

        // Combine the data
        const processedMembers = teamMemberProjects.map(member => {
          const profile = profiles?.find(p => p.id === member.user_id);
          
          return {
            id: member.id,
            user_id: member.user_id,
            name: profile?.full_name || 'Nome não informado',
            email: profile?.email || '',
            role: member.role || 'Membro',
            assigned_at: member.assigned_at,
            profile_picture_url: profile?.profile_picture_url
          };
        });

        setTeamMembers(processedMembers);
      } catch (error) {
        console.error('Erro ao buscar membros da equipe do projeto:', error);
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [user, projectId]);

  return { teamMembers, loading };
};
