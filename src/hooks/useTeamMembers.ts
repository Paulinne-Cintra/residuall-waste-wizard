
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone_number?: string;
  company_name?: string;
  profile_picture_url?: string;
  created_at: string;
  has_account: boolean;
}

export const useTeamMembers = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const getDemoMembers = (): TeamMember[] => {
    return [
      {
        id: 'member-1',
        name: 'Ana Silva',
        email: 'ana.silva@residuall.com',
        role: 'Engenheiro Civil',
        status: 'active',
        phone_number: '(11) 99999-1111',
        company_name: 'Construtora ABC',
        created_at: '2024-01-15T10:00:00Z',
        has_account: true
      },
      {
        id: 'member-2',
        name: 'Carlos Mendes',
        email: 'carlos.mendes@residuall.com',
        role: 'Arquiteta',
        status: 'active',
        phone_number: '(11) 99999-2222',
        company_name: 'Arquitetura XYZ',
        created_at: '2024-01-10T14:30:00Z',
        has_account: true
      },
      {
        id: 'member-3',
        name: 'Maria Santos',
        email: 'maria.santos@residuall.com',
        role: 'Técnico em Edificações',
        status: 'active',
        phone_number: '(11) 99999-3333',
        company_name: 'Técnica DEF',
        created_at: '2024-01-08T09:15:00Z',
        has_account: false
      },
      {
        id: 'member-4',
        name: 'João Oliveira',
        email: 'joao.oliveira@residuall.com',
        role: 'Gerente de Projetos',
        status: 'active',
        phone_number: '(11) 99999-4444',
        company_name: 'Gestão GHI',
        created_at: '2024-01-05T16:45:00Z',
        has_account: true
      }
    ];
  };

  useEffect(() => {
    fetchMembers();
  }, [user]);

  const fetchMembers = async () => {
    if (!user) {
      setMembers([]);
      setLoading(false);
      return;
    }

    // Para conta de demonstração
    if (user.email === 'teste@exemplo.com') {
      setMembers(getDemoMembers());
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Buscar perfis de membros reais (se existirem)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id); // Excluir o próprio usuário

      if (profilesError) throw profilesError;

      // Buscar convites pendentes
      const { data: invitations, error: invitationsError } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('invited_by_user_id', user.id)
        .eq('status', 'pending');

      if (invitationsError) throw invitationsError;

      const profileMembers: TeamMember[] = (profiles || []).map(profile => ({
        id: profile.id,
        name: profile.full_name || 'Nome não informado',
        email: profile.email || '',
        role: profile.professional_role || 'Função não definida',
        status: 'active',
        phone_number: profile.phone_number,
        company_name: profile.company_name,
        profile_picture_url: profile.profile_picture_url,
        created_at: profile.created_at,
        has_account: true
      }));

      const invitationMembers: TeamMember[] = (invitations || []).map(invitation => ({
        id: invitation.id,
        name: invitation.name,
        email: invitation.email,
        role: 'Convite Pendente',
        status: 'inactive',
        created_at: invitation.created_at,
        has_account: false
      }));

      setMembers([...profileMembers, ...invitationMembers]);
    } catch (error: any) {
      console.error('Erro ao buscar membros:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os membros da equipe.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para gerar token único
  const generateToken = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const addTeamMember = async (memberData: { name: string; email: string; role: string }) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Verificar se é conta demo
      if (user.email === 'teste@exemplo.com') {
        const newMember: TeamMember = {
          id: `member-${Date.now()}`,
          name: memberData.name,
          email: memberData.email,
          role: memberData.role,
          status: 'active',
          created_at: new Date().toISOString(),
          has_account: false
        };
        
        setMembers(prev => [...prev, newMember]);
        toast({
          title: "Membro adicionado",
          description: `${memberData.name} foi adicionado à equipe.`,
        });
        return;
      }

      // Criar convite para conta real com token
      const { error } = await supabase
        .from('team_invitations')
        .insert([
          {
            invited_by_user_id: user.id,
            name: memberData.name,
            email: memberData.email,
            status: 'pending',
            token: generateToken()
          }
        ]);

      if (error) throw error;

      toast({
        title: "Convite enviado",
        description: `Convite enviado para ${memberData.email}.`,
      });

      await fetchMembers();
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar membro",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    }
  };

  const deleteMember = async (memberId: string, hasAccount: boolean): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Para conta demo, apenas remover da lista local
      if (user.email === 'teste@exemplo.com') {
        setMembers(prev => prev.filter(member => member.id !== memberId));
        toast({
          title: "Membro removido",
          description: "O membro foi removido da equipe.",
        });
        return true;
      }

      // Para contas reais
      if (hasAccount) {
        // Se o membro tem conta, remover da tabela team_member_projects
        const { error: projectsError } = await supabase
          .from('team_member_projects')
          .delete()
          .eq('user_id', memberId);

        if (projectsError) throw projectsError;
      } else {
        // Se é um convite pendente, remover da tabela team_invitations
        const { error: invitationError } = await supabase
          .from('team_invitations')
          .delete()
          .eq('id', memberId);

        if (invitationError) throw invitationError;
      }

      toast({
        title: "Membro removido",
        description: "O membro foi removido da equipe com sucesso.",
      });

      await fetchMembers();
      return true;
    } catch (error: any) {
      console.error('Erro ao remover membro:', error);
      toast({
        title: "Erro ao remover membro",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
      return false;
    }
  };

  const refetch = async () => {
    await fetchMembers();
  };

  return {
    members,
    loading,
    addTeamMember,
    deleteMember,
    refetch
  };
};
