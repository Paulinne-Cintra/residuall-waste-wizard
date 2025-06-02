
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

  // Dados fictícios para demonstração
  const getMockMessages = (ticketId: string): SupportMessage[] => {
    const mockMessagesMap: { [key: string]: SupportMessage[] } = {
      'ticket-1': [
        {
          id: 'msg-1',
          ticket_id: 'ticket-1',
          user_id: user?.id || 'mock-user',
          sender_name: 'Ana Silva',
          sender_email: 'ana.silva@residuall.com',
          message: 'Estou enfrentando dificuldades para registrar corretamente o desperdício de concreto na obra do Edifício Residencial Sustentável. O sistema não está calculando adequadamente a economia gerada pela redução do desperdício.',
          is_from_user: true,
          created_at: '2024-01-15T09:30:00Z'
        }
      ],
      'ticket-2': [
        {
          id: 'msg-2',
          ticket_id: 'ticket-2',
          user_id: user?.id || 'mock-user',
          sender_name: 'Carlos Mendes',
          sender_email: 'carlos.mendes@residuall.com',
          message: 'Gostaria de solicitar uma funcionalidade para integração do sistema Residuall com softwares de modelagem BIM como Revit e ArchiCAD.',
          is_from_user: true,
          created_at: '2024-01-10T14:20:00Z'
        },
        {
          id: 'msg-3',
          ticket_id: 'ticket-2',
          user_id: null,
          sender_name: 'Suporte Técnico Residuall',
          sender_email: 'suporte@residuall.com',
          message: 'Olá Carlos! Obrigado pelo feedback. Já temos essa funcionalidade em nosso roadmap de desenvolvimento para o próximo trimestre. A integração com Revit será priorizada, seguida pelo ArchiCAD.',
          is_from_user: false,
          created_at: '2024-01-12T11:45:00Z'
        }
      ],
      'ticket-3': [
        {
          id: 'msg-4',
          ticket_id: 'ticket-3',
          user_id: user?.id || 'mock-user',
          sender_name: 'Maria Santos',
          sender_email: 'maria.santos@residuall.com',
          message: 'Tentei gerar um relatório personalizado de desperdício por etapa da obra, mas o sistema apresenta erro interno.',
          is_from_user: true,
          created_at: '2024-01-08T16:15:00Z'
        },
        {
          id: 'msg-5',
          ticket_id: 'ticket-3',
          user_id: user?.id || 'mock-user',
          sender_name: 'Maria Santos',
          sender_email: 'maria.santos@residuall.com',
          message: 'Complementando: o erro ocorre especificamente com projetos que têm mais de 500 registros de desperdício.',
          is_from_user: true,
          created_at: '2024-01-09T08:15:00Z'
        }
      ],
      'ticket-5': [
        {
          id: 'msg-6',
          ticket_id: 'ticket-5',
          user_id: user?.id || 'mock-user',
          sender_name: 'Fernanda Costa',
          sender_email: 'fernanda.costa@residuall.com',
          message: 'Durante as visitas às obras, frequentemente não temos internet estável. Seria possível implementar uma funcionalidade offline?',
          is_from_user: true,
          created_at: '2023-12-28T13:45:00Z'
        },
        {
          id: 'msg-7',
          ticket_id: 'ticket-5',
          user_id: null,
          sender_name: 'Suporte Técnico Residuall',
          sender_email: 'suporte@residuall.com',
          message: 'Fernanda, implementamos a funcionalidade offline básica na versão 2.1. Agora você pode visualizar dados dos últimos 30 dias e inserir novos registros que serão sincronizados automaticamente.',
          is_from_user: false,
          created_at: '2024-01-03T09:20:00Z'
        }
      ]
    };

    return mockMessagesMap[ticketId] || [];
  };

  const fetchMessages = async () => {
    if (!ticketId) return;

    // Se for um ticket fictício, usar dados fictícios
    if (ticketId.startsWith('ticket-')) {
      setMessages(getMockMessages(ticketId));
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

    // Se for um ticket fictício, simular sucesso
    if (ticketId.startsWith('ticket-')) {
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
