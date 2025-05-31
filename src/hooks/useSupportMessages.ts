
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { SupportMessage } from './useSupportTickets';

export const useSupportMessages = (ticketId: string | null) => {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMessages = async () => {
    if (!ticketId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as mensagens.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string, ticketId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('support_messages')
        .insert({
          ticket_id: ticketId,
          user_id: user.id,
          sender_name: user.user_metadata?.full_name || user.email || '',
          sender_email: user.email || '',
          message,
          is_from_user: true,
        });

      if (error) throw error;

      // Atualizar status do ticket para "Respondido"
      await supabase
        .from('support_tickets')
        .update({ status: 'Respondido' })
        .eq('id', ticketId);

      await fetchMessages();
      return true;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [ticketId]);

  return {
    messages,
    loading,
    sendMessage,
    refetch: fetchMessages,
  };
};
