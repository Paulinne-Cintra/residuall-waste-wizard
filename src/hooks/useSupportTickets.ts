
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

  // Estado local para gerenciar tickets demo
  const [demoTickets, setDemoTickets] = useState<SupportTicket[]>([]);

  useEffect(() => {
    fetchTickets();
  }, [user]);

  useEffect(() => {
    if (user?.email === 'teste@exemplo.com') {
      setDemoTickets(getDemoTickets());
    }
  }, [user]);

  const fetchTickets = async () => {
    if (!user) {
      setTickets([]);
      setLoading(false);
      return;
    }

    // Verificar se é a conta de demonstração
    if (user.email === 'teste@exemplo.com') {
      setTickets(demoTickets.length > 0 ? demoTickets : getDemoTickets());
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

      // Garantir que os status estejam no tipo correto
      const typedTickets: SupportTicket[] = (data || []).map(ticket => ({
        ...ticket,
        status: ticket.status as 'Aberto' | 'Respondido' | 'Encerrado'
      }));

      setTickets(typedTickets);
    } catch (error: any) {
      console.error('Erro ao buscar tickets:', error);
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
  }): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Para conta demo, adicionar ao estado local
      if (user.email === 'teste@exemplo.com') {
        const newTicket: SupportTicket = {
          id: `ticket-${Date.now()}`,
          user_id: user.id,
          full_name: ticketData.full_name,
          email: ticketData.email,
          subject: ticketData.subject,
          message: ticketData.message,
          status: 'Aberto',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const updatedTickets = [newTicket, ...demoTickets];
        setDemoTickets(updatedTickets);
        setTickets(updatedTickets);
        
        toast({
          title: "Chamado criado",
          description: "Seu chamado foi enviado com sucesso!",
        });
        return true;
      }

      // Para contas reais, inserir no banco
      const { error } = await supabase
        .from('support_tickets')
        .insert([
          {
            user_id: user.id,
            full_name: ticketData.full_name,
            email: ticketData.email,
            subject: ticketData.subject,
            message: ticketData.message,
            status: 'Aberto'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Chamado criado",
        description: "Seu chamado foi enviado com sucesso!",
      });

      await fetchTickets();
      return true;
    } catch (error: any) {
      console.error('Erro ao criar ticket:', error);
      toast({
        title: "Erro ao criar chamado",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteTicket = async (ticketId: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Para conta demo, remover do estado local
      if (user.email === 'teste@exemplo.com') {
        const updatedTickets = demoTickets.filter(ticket => ticket.id !== ticketId);
        setDemoTickets(updatedTickets);
        setTickets(updatedTickets);
        
        toast({
          title: "Chamado excluído",
          description: "O chamado foi removido com sucesso.",
        });
        return true;
      }

      // Para contas reais, deletar do banco
      // Primeiro deletar mensagens relacionadas
      const { error: messagesError } = await supabase
        .from('support_messages')
        .delete()
        .eq('ticket_id', ticketId);

      if (messagesError) throw messagesError;

      // Depois deletar o ticket
      const { error: ticketError } = await supabase
        .from('support_tickets')
        .delete()
        .eq('id', ticketId)
        .eq('user_id', user.id); // Garantir que o usuário só pode deletar seus próprios tickets

      if (ticketError) throw ticketError;

      // Atualizar a lista local
      setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
      
      toast({
        title: "Chamado excluído",
        description: "O chamado foi removido com sucesso.",
      });
      return true;
    } catch (error: any) {
      console.error('Erro ao deletar ticket:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o chamado.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    tickets,
    loading,
    createTicket,
    deleteTicket,
    refetch: fetchTickets
  };
};
