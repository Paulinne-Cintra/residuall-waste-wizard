
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

  // Dados fictícios apenas para a conta de demonstração
  const getDemoMessages = (ticketId: string): SupportMessage[] => {
    const mockMessagesMap: { [key: string]: SupportMessage[] } = {
      'ticket-1': [
        {
          id: 'msg-1',
          ticket_id: 'ticket-1',
          user_id: user?.id || 'demo-user',
          sender_name: 'Ana Silva',
          sender_email: 'ana.silva@residuall.com',
          message: 'Estou enfrentando dificuldades para registrar corretamente o desperdício de concreto na obra.',
          is_from_user: true,
          created_at: '2024-01-15T09:30:00Z'
        }
      ],
      'ticket-2': [
        {
          id: 'msg-2',
          ticket_id: 'ticket-2',
          user_id: user?.id || 'demo-user',
          sender_name: 'Carlos Mendes',
          sender_email: 'carlos.mendes@residuall.com',
          message: 'Gostaria de solicitar uma funcionalidade para integração com BIM.',
          is_from_user: true,
          created_at: '2024-01-10T14:20:00Z'
        },
        {
          id: 'msg-3',
          ticket_id: 'ticket-2',
          user_id: null,
          sender_name: 'Suporte Técnico Residuall',
          sender_email: 'suporte@residuall.com',
          message: 'Já temos essa funcionalidade em nosso roadmap para o próximo trimestre.',
          is_from_user: false,
          created_at: '2024-01-12T11:45:00Z'
        }
      ],
      'ticket-3': [
        {
          id: 'msg-4',
          ticket_id: 'ticket-3',
          user_id: user?.id || 'demo-user',
          sender_name: 'Maria Santos',
          sender_email: 'maria.santos@residuall.com',
          message: 'Tentei gerar um relatório personalizado mas apresenta erro.',
          is_from_user: true,
          created_at: '2024-01-08T16:15:00Z'
        }
      ],
      'ticket-5': [
        {
          id: 'msg-6',
          ticket_id: 'ticket-5',
          user_id: user?.id || 'demo-user',
          sender_name: 'Fernanda Costa',
          sender_email: 'fernanda.costa@residuall.com',
          message: 'Seria possível implementar uma funcionalidade offline?',
          is_from_user: true,
          created_at: '2023-12-28T13:45:00Z'
        },
        {
          id: 'msg-7',
          ticket_id: 'ticket-5',
          user_id: null,
          sender_name: 'Suporte Técnico Residuall',
          sender_email: 'suporte@residuall.com',
          message: 'Implementamos a funcionalidade offline básica na versão 2.1.',
          is_from_user: false,
          created_at: '2024-01-03T09:20:00Z'
        }
      ]
    };

    return mockMessagesMap[ticketId] || [];
  };

  const fetchMessages = async () => {
    if (!ticketId) return;

    // Verificar se é a conta de demonstração e ticket fictício
    if (user?.email === 'teste@exemplo.com' && ticketId.startsWith('ticket-')) {
      setMessages(getDemoMessages(ticketId));
      setLoading(false);
      return;
    }

    // Para tickets fictícios de usuários normais, não mostrar mensagens
    if (ticketId.startsWith('ticket-')) {
      setMessages([]);
      setLoading(false);
      return;
    }

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
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string, ticketId: string) => {
    if (!user) return false;

    // Se for um ticket fictício, simular sucesso apenas para conta demo
    if (ticketId.startsWith('ticket-')) {
      if (user.email === 'teste@exemplo.com') {
        const newMessage: SupportMessage = {
          id: `msg-${Date.now()}`,
          ticket_id: ticketId,
          user_id: user.id,
          sender_name: user.user_metadata?.full_name || user.email || '',
          sender_email: user.email || '',
          message,
          is_from_user: true,
          created_at: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, newMessage]);
        toast({
          title: "Sucesso",
          description: "Mensagem enviada! (Demonstração)",
        });
        return true;
      }
      return false;
    }

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
