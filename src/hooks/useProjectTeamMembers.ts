
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
        
        const { data, error } = await supabase
          .from('team_member_projects')
          .select(`
            id,
            user_id,
            role,
            assigned_at,
            profiles(
              full_name,
              email,
              profile_picture_url
            )
          `)
          .eq('project_id', projectId);

        if (error) {
          console.error('Erro ao buscar membros da equipe:', error);
          throw error;
        }

        const processedMembers = (data || []).map(member => ({
          id: member.id,
          user_id: member.user_id,
          name: member.profiles?.full_name || 'Nome não informado',
          email: member.profiles?.email || '',
          role: member.role || 'Membro',
          assigned_at: member.assigned_at,
          profile_picture_url: member.profiles?.profile_picture_url
        }));

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
