
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Clock, CheckCircle, XCircle } from "lucide-react";
import { useSupportTickets } from '@/hooks/useSupportTickets';
import SupportChat from './SupportChat';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SupportTicketsList = () => {
  const { tickets, loading } = useSupportTickets();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Aberto':
        return <Clock className="h-4 w-4" />;
      case 'Respondido':
        return <MessageCircle className="h-4 w-4" />;
      case 'Encerrado':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aberto':
        return 'bg-yellow-100 text-yellow-800';
      case 'Respondido':
        return 'bg-blue-100 text-blue-800';
      case 'Encerrado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-gray-200 rounded"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (selectedTicketId) {
    return (
      <SupportChat 
        ticketId={selectedTicketId} 
        onBack={() => setSelectedTicketId(null)} 
      />
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-residuall-gray-dark">Meus Chamados</h3>
      
      {tickets.length === 0 ? (
        <p className="text-residuall-gray text-center py-8">
          Você ainda não possui chamados de suporte.
        </p>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-residuall-gray">
                      #{ticket.id.slice(0, 8)}
                    </span>
                    <Badge className={getStatusColor(ticket.status)}>
                      {getStatusIcon(ticket.status)}
                      <span className="ml-1">{ticket.status}</span>
                    </Badge>
                  </div>
                  <h4 className="font-medium text-residuall-gray-dark mb-1">
                    {ticket.subject}
                  </h4>
                  <p className="text-sm text-residuall-gray">
                    {ticket.message.length > 100 
                      ? `${ticket.message.substring(0, 100)}...` 
                      : ticket.message
                    }
                  </p>
                  <p className="text-xs text-residuall-gray mt-2">
                    Criado em {format(new Date(ticket.created_at), 'dd/MM/yyyy às HH:mm', { locale: ptBR })}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className="ml-4"
                >
                  Ver Conversa
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupportTicketsList;
