
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
      console.log('🔍 Buscando membros da equipe para usuário:', user.id);
      
      // Buscar perfis de membros reais (se existirem)
      console.log('📋 Buscando perfis existentes...');
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id); // Excluir o próprio usuário

      if (profilesError) {
        console.error('❌ Erro ao buscar perfis:', profilesError);
        throw profilesError;
      }

      console.log('✅ Perfis encontrados:', profiles);

      // Buscar convites pendentes
      console.log('📮 Buscando convites pendentes...');
      const { data: invitations, error: invitationsError } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('invited_by_user_id', user.id)
        .eq('status', 'pending');

      if (invitationsError) {
        console.error('❌ Erro ao buscar convites:', invitationsError);
        throw invitationsError;
      }

      console.log('✅ Convites encontrados:', invitations);

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

      const allMembers = [...profileMembers, ...invitationMembers];
      console.log('👥 Total de membros carregados:', allMembers.length);
      setMembers(allMembers);
    } catch (error: any) {
      console.error('💥 Erro ao buscar membros:', error);
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
      console.log('➕ Adicionando membro:', memberData);

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

      // Verificar se já existe convite para este email
      console.log('🔍 Verificando convites existentes para:', memberData.email);
      const { data: existingInvitation, error: checkError } = await supabase
        .from('team_invitations')
        .select('id')
        .eq('email', memberData.email)
        .eq('invited_by_user_id', user.id)
        .eq('status', 'pending')
        .maybeSingle();

      if (checkError) {
        console.error('❌ Erro ao verificar convites existentes:', checkError);
        throw checkError;
      }

      if (existingInvitation) {
        toast({
          title: "Convite já enviado",
          description: `Já existe um convite pendente para ${memberData.email}.`,
          variant: "destructive",
        });
        return;
      }

      // Criar convite para conta real com token
      console.log('📨 Criando novo convite...');
      const { data: newInvitation, error: insertError } = await supabase
        .from('team_invitations')
        .insert([
          {
            invited_by_user_id: user.id,
            name: memberData.name,
            email: memberData.email,
            status: 'pending',
            token: generateToken()
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Erro ao criar convite:', insertError);
        throw insertError;
      }

      console.log('✅ Convite criado com sucesso:', newInvitation);

      toast({
        title: "Convite enviado",
        description: `Convite enviado para ${memberData.email}.`,
      });

      // Recarregar lista de membros
      await fetchMembers();
    } catch (error: any) {
      console.error('💥 Erro ao adicionar membro:', error);
      
      let errorMessage = "Ocorreu um erro inesperado.";
      if (error.code === '42501') {
        errorMessage = "Você não tem permissão para enviar convites.";
      } else if (error.code === '23505') {
        errorMessage = "Este email já foi convidado.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Erro ao adicionar membro",
        description: errorMessage,
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
      console.log(`🗑️ Iniciando exclusão do membro: ${memberId}, tem conta: ${hasAccount}`);
      
      // Para conta demo, apenas remover da lista local
      if (user.email === 'teste@exemplo.com') {
        setMembers(prev => prev.filter(member => member.id !== memberId));
        toast({
          title: "Membro removido",
          description: "O membro foi removido da equipe.",
        });
        return true;
      }

      // Para contas reais - tratar diferentes cenários
      if (hasAccount) {
        console.log(`👤 Removendo membro com conta: ${memberId}`);
        
        // ETAPA 1: Remover associações de projetos primeiro
        console.log(`🔗 Removendo associações de projeto para membro: ${memberId}`);
        
        const { error: deleteProjectsError } = await supabase
          .from('team_member_projects')
          .delete()
          .eq('user_id', memberId);

        if (deleteProjectsError) {
          console.error('⚠️ Erro ao remover associações de projeto:', deleteProjectsError);
          // Continuar mesmo se houver erro - pode não ter associações
        } else {
          console.log(`✅ Associações de projeto removidas para membro: ${memberId}`);
        }

        // ETAPA 2: Remover o perfil do membro da tabela profiles - AÇÃO PRINCIPAL
        console.log(`🗂️ Removendo perfil do membro: ${memberId}`);
        
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', memberId);

        if (profileError) {
          console.error('❌ Erro ao remover perfil do membro:', profileError);
          
          // Tratamento específico de erros de permissão
          if (profileError.code === '42501' || profileError.code === 'PGRST301') {
            throw new Error('Você não tem permissão para remover este membro. Apenas quem convidou pode removê-lo.');
          } else {
            throw new Error(`Erro ao remover perfil: ${profileError.message}`);
          }
        }

        console.log(`✅ Perfil do membro ${memberId} removido com sucesso`);
        
        // ETAPA 3: Limpar possíveis convites pendentes relacionados ao email do membro
        const memberEmail = members.find(m => m.id === memberId)?.email;
        if (memberEmail) {
          console.log(`🧹 Removendo possíveis convites pendentes para email: ${memberEmail}`);
          
          const { error: invitationCleanupError } = await supabase
            .from('team_invitations')
            .delete()
            .eq('email', memberEmail)
            .eq('invited_by_user_id', user.id);

          if (invitationCleanupError) {
            console.error('⚠️ Aviso: Não foi possível limpar convites pendentes:', invitationCleanupError);
            // Não interromper - é apenas limpeza
          }
        }

        toast({
          title: "Membro removido",
          description: "O membro foi removido da equipe e de todos os projetos associados.",
        });

      } else {
        // CENÁRIO: Convite pendente - remover da tabela team_invitations
        console.log(`📮 Removendo convite pendente: ${memberId}`);
        
        const { error: invitationError } = await supabase
          .from('team_invitations')
          .delete()
          .eq('id', memberId)
          .eq('invited_by_user_id', user.id);

        if (invitationError) {
          console.error('❌ Erro ao remover convite:', invitationError);
          
          if (invitationError.code === '42501' || invitationError.code === 'PGRST301') {
            throw new Error('Você não tem permissão para remover este convite.');
          } else {
            throw new Error(`Erro ao remover convite: ${invitationError.message}`);
          }
        }

        console.log(`✅ Convite ${memberId} removido com sucesso`);
        toast({
          title: "Convite removido",
          description: "O convite foi removido com sucesso.",
        });
      }

      // ETAPA FINAL: Atualizar a lista de membros
      console.log('🔄 Atualizando lista de membros...');
      await fetchMembers();
      return true;
      
    } catch (error: any) {
      console.error('💥 Erro ao remover membro:', error);
      
      // Mensagens de erro específicas e detalhadas
      let errorMessage = "Ocorreu um erro inesperado.";
      
      if (error.message && error.message.includes('permissão')) {
        errorMessage = error.message;
      } else if (error.code === 'PGRST301' || error.code === '42501') {
        errorMessage = "Você não tem permissão para remover este membro.";
      } else if (error.code === 'PGRST116') {
        errorMessage = "Membro não encontrado ou já foi removido.";
      } else if (error.code === '23503') {
        errorMessage = "Não é possível remover o membro devido a dependências no sistema.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro ao remover membro",
        description: errorMessage,
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
