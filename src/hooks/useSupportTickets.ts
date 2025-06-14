
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

  // Dados fictícios apenas para a conta de demonstração
  const getDemoTickets = (): SupportTicket[] => {
    return [
      {
        id: 'ticket-1',
        user_id: user?.id || 'demo-user',
        full_name: 'Ana Silva',
        email: 'ana.silva@residuall.com',
        subject: 'Problema com cálculo de desperdício de materiais',
        message: 'Estou enfrentando dificuldades para registrar corretamente o desperdício de concreto na obra do Edifício Residencial Sustentável.',
        status: 'Aberto',
        created_at: '2024-01-15T09:30:00Z',
        updated_at: '2024-01-15T09:30:00Z'
      },
      {
        id: 'ticket-2',
        user_id: user?.id || 'demo-user',
        full_name: 'Carlos Mendes',
        email: 'carlos.mendes@residuall.com',
        subject: 'Integração com software de modelagem BIM',
        message: 'Gostaria de solicitar uma funcionalidade para integração do sistema Residuall com softwares de modelagem BIM.',
        status: 'Respondido',
        created_at: '2024-01-10T14:20:00Z',
        updated_at: '2024-01-12T11:45:00Z'
      },
      {
        id: 'ticket-3',
        user_id: user?.id || 'demo-user',
        full_name: 'Maria Santos',
        email: 'maria.santos@residuall.com',
        subject: 'Relatórios personalizados não estão sendo gerados',
        message: 'Tentei gerar um relatório personalizado de desperdício por etapa da obra, mas o sistema apresenta erro interno.',
        status: 'Respondido',
        created_at: '2024-01-08T16:15:00Z',
        updated_at: '2024-01-09T10:30:00Z'
      },
      {
        id: 'ticket-4',
        user_id: user?.id || 'demo-user',
        full_name: 'João Oliveira',
        email: 'joao.oliveira@residuall.com',
        subject: 'Sugestão de melhoria: alertas automáticos',
        message: 'Seria muito útil ter um sistema de alertas automáticos quando o desperdício de determinado material ultrapassar um limite.',
        status: 'Aberto',
        created_at: '2024-01-05T11:00:00Z',
        updated_at: '2024-01-05T11:00:00Z'
      },
      {
        id: 'ticket-5',
        user_id: user?.id || 'demo-user',
        full_name: 'Fernanda Costa',
        email: 'fernanda.costa@residuall.com',
        subject: 'Dificuldade para acessar dados offline',
        message: 'Durante as visitas às obras, frequentemente não temos internet estável.',
        status: 'Encerrado',
        created_at: '2023-12-28T13:45:00Z',
        updated_at: '2024-01-03T09:20:00Z'
      }
    ];
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);

  const fetchTickets = async () => {
    if (!user) {
      setTickets([]);
      setLoading(false);
      return;
    }

    // Verificar se é a conta de demonstração
    if (user.email === 'teste@exemplo.com') {
      setTickets(getDemoTickets());
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Para usuários normais, mostrar apenas tickets reais
      setTickets((data as SupportTicket[]) || []);
    } catch (error) {
      console.error('Erro ao buscar chamados:', error);
      // Para usuários normais, em caso de erro, iniciar vazio
      setTickets([]);
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

  return {
    tickets,
    loading,
    createTicket,
    refetch: fetchTickets,
  };
};
