
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

  // Dados fictícios detalhados para demonstração
  const mockMembers: TeamMember[] = [
    {
      id: 'mock-1',
      name: 'Ana Silva',
      email: 'ana.silva@residuall.com',
      role: 'Gerente de Projetos',
      status: 'active',
      created_at: '2023-01-15T08:00:00Z',
      profile_picture_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      has_account: true,
      phone_number: '+55 11 99999-1234',
      professional_role: 'Engenheira Civil',
      company_name: 'Residuall',
      biografia: 'Especialista em sustentabilidade e redução de desperdícios em obras. Mais de 10 anos de experiência em projetos residenciais e comerciais.',
      cargo: 'Gerente de Projetos'
    },
    {
      id: 'mock-2',
      name: 'Carlos Mendes',
      email: 'carlos.mendes@residuall.com',
      role: 'Arquiteto Sênior',
      status: 'active',
      created_at: '2023-02-01T09:00:00Z',
      profile_picture_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      has_account: true,
      phone_number: '+55 11 99999-5678',
      professional_role: 'Arquiteto',
      company_name: 'Residuall',
      biografia: 'Arquiteto focado em design sustentável e otimização de recursos. Especialista em BIM e tecnologias de construção verde.',
      cargo: 'Arquiteto Sênior'
    },
    {
      id: 'mock-3',
      name: 'Maria Santos',
      email: 'maria.santos@residuall.com',
      role: 'Analista de Sustentabilidade',
      status: 'away',
      created_at: '2023-03-15T10:00:00Z',
      profile_picture_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      has_account: true,
      phone_number: '+55 11 99999-9012',
      professional_role: 'Analista de Dados',
      company_name: 'Residuall',
      biografia: 'Especialista em análise de dados de construção e relatórios de sustentabilidade. Desenvolve métricas para otimização de recursos.',
      cargo: 'Analista de Sustentabilidade'
    },
    {
      id: 'mock-4',
      name: 'João Oliveira',
      email: 'joao.oliveira@residuall.com',
      role: 'Coordenador de Operações',
      status: 'active',
      created_at: '2023-04-01T11:00:00Z',
      profile_picture_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      has_account: true,
      phone_number: '+55 11 99999-3456',
      professional_role: 'Engenheiro de Produção',
      company_name: 'Residuall',
      biografia: 'Engenheiro com foco em otimização de processos construtivos e redução de desperdícios. Especialista em lean construction.',
      cargo: 'Coordenador de Operações'
    },
    {
      id: 'mock-5',
      name: 'Fernanda Costa',
      email: 'fernanda.costa@residuall.com',
      role: 'Supervisora de Obras',
      status: 'active',
      created_at: '2023-05-01T12:00:00Z',
      profile_picture_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      has_account: true,
      phone_number: '+55 11 99999-7890',
      professional_role: 'Técnica em Edificações',
      company_name: 'Residuall',
      biografia: 'Técnica especializada em controle de qualidade e fiscalização de obras. Experiência em acompanhamento de cronogramas e materiais.',
      cargo: 'Supervisora de Obras'
    }
  ];

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
        .select('id, full_name, email, professional_role, avatar_url, created_at, phone_number, company_name, biografia, cargo')
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
        has_account: true,
        phone_number: profile.phone_number,
        professional_role: profile.professional_role,
        company_name: profile.company_name,
        biografia: profile.biografia,
        cargo: profile.cargo
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

      const allMembers = [...realMembers, ...invitedMembers];
      
      // Se não há membros reais, usar dados fictícios
      if (allMembers.length === 0) {
        setMembers(mockMembers);
      } else {
        setMembers(allMembers);
      }
    } catch (error) {
      console.error('Erro ao buscar membros:', error);
      // Em caso de erro, mostrar dados fictícios
      setMembers(mockMembers);
      toast({
        title: "Informação",
        description: "Exibindo dados de demonstração.",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async (memberId: string, hasAccount: boolean) => {
    // Se for um membro fictício, simular sucesso
    if (memberId.startsWith('mock-')) {
      toast({
        title: "Sucesso!",
        description: "Este é um membro de demonstração. Em uma aplicação real, seria removido com sucesso!",
      });
      return true;
    }

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
    // Se for um membro fictício, retornar projetos fictícios
    if (memberId.startsWith('mock-')) {
      return [
        {
          id: 'proj-1',
          projects: {
            id: 'proj-1',
            name: 'Edifício Sustentável Alpha',
            status: 'em_andamento',
            location: 'São Paulo, SP'
          }
        },
        {
          id: 'proj-2',
          projects: {
            id: 'proj-2',
            name: 'Centro Comercial Beta',
            status: 'planejamento',
            location: 'Rio de Janeiro, RJ'
          }
        }
      ];
    }

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
