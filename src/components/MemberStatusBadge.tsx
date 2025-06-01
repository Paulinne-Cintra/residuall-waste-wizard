
import React from 'react';
import { CheckCircle, Clock, XCircle, UserCheck, UserX, UserClock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MemberStatusBadgeProps {
  status: 'active' | 'away' | 'inactive';
  invitationStatus?: 'pending' | 'accepted' | 'declined';
  hasAccount: boolean;
}

const MemberStatusBadge: React.FC<MemberStatusBadgeProps> = ({ 
  status, 
  invitationStatus, 
  hasAccount 
}) => {
  const getStatusConfig = () => {
    if (!hasAccount && invitationStatus) {
      switch (invitationStatus) {
        case 'pending':
          return {
            icon: <Clock size={16} />,
            text: 'Pendente',
            className: 'bg-yellow-100 text-yellow-800',
            tooltip: 'Convite pendente de confirmação'
          };
        case 'accepted':
          return {
            icon: <CheckCircle size={16} />,
            text: 'Confirmado',
            className: 'bg-green-100 text-green-800',
            tooltip: 'Convite aceito, conta criada'
          };
        case 'declined':
          return {
            icon: <XCircle size={16} />,
            text: 'Recusado',
            className: 'bg-red-100 text-red-800',
            tooltip: 'Convite recusado'
          };
      }
    }

    // Status para membros com conta
    switch (status) {
      case 'active':
        return {
          icon: <UserCheck size={16} />,
          text: 'Ativo',
          className: 'bg-green-100 text-green-800',
          tooltip: 'Membro ativo na equipe'
        };
      case 'away':
        return {
          icon: <UserClock size={16} />,
          text: 'Ausente',
          className: 'bg-yellow-100 text-yellow-800',
          tooltip: 'Membro temporariamente ausente'
        };
      case 'inactive':
        return {
          icon: <UserX size={16} />,
          text: 'Inativo',
          className: 'bg-gray-100 text-gray-800',
          tooltip: 'Membro inativo'
        };
      default:
        return {
          icon: <UserCheck size={16} />,
          text: 'Ativo',
          className: 'bg-green-100 text-green-800',
          tooltip: 'Membro ativo na equipe'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
            {config.icon}
            {config.text}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MemberStatusBadge;
