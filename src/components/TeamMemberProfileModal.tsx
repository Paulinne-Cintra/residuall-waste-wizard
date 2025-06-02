
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Calendar, Briefcase } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'away' | 'inactive';
  created_at: string;
  profile_picture_url?: string;
  has_account: boolean;
  invitation_status?: 'pending' | 'accepted' | 'declined';
}

interface TeamMemberProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
}

const TeamMemberProfileModal: React.FC<TeamMemberProfileModalProps> = ({
  isOpen,
  onClose,
  member
}) => {
  if (!member) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'away':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'away':
        return 'Ausente';
      case 'inactive':
        return 'Inativo';
      default:
        return 'Indefinido';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Perfil do Membro</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Avatar e informações básicas */}
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 mb-4">
              <AvatarImage src={member.profile_picture_url} />
              <AvatarFallback className="bg-residuall-green text-white text-lg">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
            <p className="text-gray-600">{member.role}</p>
            <Badge className={getStatusColor(member.status)}>
              {getStatusText(member.status)}
            </Badge>
          </div>

          {/* Informações de contato */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Informações de Contato</h4>
            
            <div className="flex items-center space-x-3 text-sm">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">{member.email}</span>
            </div>
            
            {member.has_account && (
              <>
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">Não informado</span>
                </div>
                
                <div className="flex items-center space-x-3 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">Não informado</span>
                </div>
              </>
            )}
          </div>

          {/* Informações da conta */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Informações da Conta</h4>
            
            <div className="flex items-center space-x-3 text-sm">
              <Briefcase className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">
                {member.has_account ? 'Membro registrado' : 'Convite pendente'}
              </span>
            </div>
            
            <div className="flex items-center space-x-3 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">
                Adicionado em {new Date(member.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>

            {!member.has_account && member.invitation_status && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Status do convite: <span className="font-medium">{member.invitation_status}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamMemberProfileModal;
