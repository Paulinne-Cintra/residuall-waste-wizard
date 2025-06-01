
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'away' | 'inactive';
  created_at: string;
  profile_picture_url?: string;
  has_account: boolean;
  invitation_status?: 'pending' | 'accepted' | 'declined';
}

export const useTeamMembers = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchTeamMembers();
    }
  }, [user]);

  const fetchTeamMembers = async () => {
    try {
      // Buscar membros reais (com conta na plataforma)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, professional_role, avatar_url, created_at')
        .neq('id', user?.id); // Excluir o próprio usuário

      if (profilesError) throw profilesError;

      // Buscar convites pendentes/aceitos
      const { data: invitations, error: invitationsError } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('invited_by_user_id', user?.id);

      if (invitationsError) throw invitationsError;

      // Combinar dados
      const realMembers: TeamMember[] = (profiles || []).map(profile => ({
        id: profile.id,
        name: profile.full_name || 'Nome não informado',
        email: profile.email || '',
        role: profile.professional_role || 'Cargo não informado',
        status: 'active' as const,
        created_at: profile.created_at,
        profile_picture_url: profile.avatar_url,
        has_account: true
      }));

      const invitedMembers: TeamMember[] = (invitations || []).map(invitation => ({
        id: invitation.id,
        name: invitation.name,
        email: invitation.email,
        role: 'Convidado',
        status: invitation.status === 'accepted' ? 'active' as const : 
                invitation.status === 'declined' ? 'inactive' as const : 'away' as const,
        created_at: invitation.created_at,
        has_account: false,
        invitation_status: invitation.status as 'pending' | 'accepted' | 'declined'
      }));

      setMembers([...realMembers, ...invitedMembers]);
    } catch (error) {
      console.error('Erro ao buscar membros:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar membros da equipe.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async (memberId: string, hasAccount: boolean) => {
    try {
      if (hasAccount) {
        // Remover atribuições de projetos
        await supabase
          .from('team_member_projects')
          .delete()
          .eq('user_id', memberId);
      } else {
        // Remover convite
        await supabase
          .from('team_invitations')
          .delete()
          .eq('id', memberId);
      }

      // Atualizar lista local
      setMembers(prev => prev.filter(member => member.id !== memberId));

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

  const getMemberProjects = async (memberId: string) => {
    try {
      const { data, error } = await supabase
        .from('team_member_projects')
        .select(`
          id,
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

  return {
    members,
    loading,
    fetchTeamMembers,
    deleteMember,
    getMemberProjects,
    refetch: fetchTeamMembers
  };
};
