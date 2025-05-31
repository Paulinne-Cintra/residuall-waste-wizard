
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface SupportTicket {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  status: 'Aberto' | 'Respondido' | 'Encerrado';
  created_at: string;
  updated_at: string;
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  user_id: string | null;
  sender_name: string;
  sender_email: string;
  message: string;
  is_from_user: boolean;
  created_at: string;
}

export const useSupportTickets = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTickets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets((data || []) as SupportTicket[]);
    } catch (error) {
      console.error('Erro ao buscar chamados:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os chamados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (ticketData: {
    full_name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar um chamado.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          ...ticketData,
        })
        .select()
        .single();

      if (error) throw error;

      // Criar a primeira mensagem do chamado
      await supabase
        .from('support_messages')
        .insert({
          ticket_id: data.id,
          user_id: user.id,
          sender_name: ticketData.full_name,
          sender_email: ticketData.email,
          message: ticketData.message,
          is_from_user: true,
        });

      await fetchTickets();
      toast({
        title: "Sucesso",
        description: "Chamado criado com sucesso!",
      });
      return true;
    } catch (error) {
      console.error('Erro ao criar chamado:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o chamado.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);

  return {
    tickets,
    loading,
    createTicket,
    refetch: fetchTickets,
  };
};
