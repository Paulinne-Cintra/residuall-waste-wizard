
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface TeamInvitation {
  id: string;
  invited_by_user_id: string;
  email: string;
  name: string;
  status: 'pending' | 'accepted' | 'declined';
  token: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export const useTeamInvitations = () => {
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchInvitations();
    }
  }, [user]);

  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('team_invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error('Erro ao buscar convites:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar convites.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendInvitation = async (email: string, name: string) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');

      const token = await generateToken();
      
      const { data, error } = await supabase
        .from('team_invitations')
        .insert({
          email,
          name,
          token,
          invited_by_user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Aqui você pode adicionar lógica para enviar email de convite
      console.log('Convite criado:', data);
      
      await fetchInvitations(); // Recarregar lista
      
      toast({
        title: "Sucesso!",
        description: "Convite enviado com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Erro ao enviar convite:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar convite.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const generateToken = async (): Promise<string> => {
    const { data, error } = await supabase.rpc('generate_invitation_token');
    if (error) throw error;
    return data;
  };

  const updateInvitationStatus = async (id: string, status: 'accepted' | 'declined') => {
    try {
      const { error } = await supabase
        .from('team_invitations')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      await fetchInvitations();
      
      toast({
        title: "Sucesso!",
        description: `Convite ${status === 'accepted' ? 'aceito' : 'recusado'} com sucesso!`,
      });
    } catch (error) {
      console.error('Erro ao atualizar convite:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar convite.",
        variant: "destructive",
      });
    }
  };

  return {
    invitations,
    loading,
    sendInvitation,
    updateInvitationStatus,
    refetch: fetchInvitations
  };
};
