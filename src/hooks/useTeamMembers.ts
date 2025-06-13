
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
  phone_number?: string;
  professional_role?: string;
  company_name?: string;
  biografia?: string;
  cargo?: string;
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
      // Buscar convites pendentes/aceitos apenas (não buscar todos os perfis)
      const { data: invitations, error: invitationsError } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('invited_by_user_id', user?.id);

      if (invitationsError) throw invitationsError;

      // Converter convites para formato TeamMember
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

      setMembers(invitedMembers);
    } catch (error) {
      console.error('Erro ao buscar membros:', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const addTeamMember = async (memberData: { name: string; email: string; role: string }) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');

      // Gerar token usando a função do banco de dados
      const { data: tokenData, error: tokenError } = await supabase.rpc('generate_invitation_token');
      if (tokenError) throw tokenError;

      const { data, error } = await supabase
        .from('team_invitations')
        .insert({
          email: memberData.email,
          name: memberData.name,
          invited_by_user_id: user.id,
          status: 'pending',
          token: tokenData
        })
        .select()
        .single();

      if (error) throw error;

      await fetchTeamMembers(); // Recarregar lista
      
      toast({
        title: "Sucesso!",
        description: "Membro adicionado à equipe com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar membro à equipe.",
        variant: "destructive",
      });
      throw error;
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
    addTeamMember,
    deleteMember,
    getMemberProjects,
    refetch: fetchTeamMembers
  };
};
