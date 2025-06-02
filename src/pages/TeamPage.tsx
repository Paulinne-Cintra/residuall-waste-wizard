
import React, { useState } from 'react';
import { Plus, Users, Mail, Phone, MapPin, MoreHorizontal, Search, Filter, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { useToast } from "@/hooks/use-toast";
import TeamMemberProfileModal from '@/components/TeamMemberProfileModal';
import EditTeamMemberModal from '@/components/EditTeamMemberModal';

const TeamPage = () => {
  const { members, loading, deleteMember, refetch } = useTeamMembers();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');
  
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Engenheiro Civil':
        return 'bg-blue-100 text-blue-800';
      case 'Arquiteta':
        return 'bg-purple-100 text-purple-800';
      case 'Técnico em Edificações':
        return 'bg-green-100 text-green-800';
      case 'Gerente de Projetos':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'Todos' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'Todos' || member.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const roles = [...new Set(members.map(member => member.role))];

  const handleViewProfile = (member: any) => {
    setSelectedMember(member);
    setIsProfileModalOpen(true);
  };

  const handleEditMember = (member: any) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  const handleRemoveMember = async (member: any) => {
    if (window.confirm(`Tem certeza que deseja remover ${member.name} da equipe?`)) {
      const success = await deleteMember(member.id, member.has_account);
      if (success) {
        refetch();
      }
    }
  };

  const handleSaveMember = async (memberId: string, data: { name: string; role: string; status: string }) => {
    // Aqui você implementaria a lógica para salvar as alterações
    // Por enquanto, vamos simular uma operação bem-sucedida
    console.log('Salvando alterações do membro:', memberId, data);
    
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular sucesso
    await refetch();
    return true;
  };

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-residuall-green"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-residuall-gray-tableText">Equipe</h1>
          <p className="text-residuall-gray">Gerencie os membros da sua equipe e suas funções</p>
        </div>
        <Button className="flex items-center gap-2 bg-residuall-green hover:bg-residuall-green/90 mt-4 md:mt-0">
          <Plus size={18} />
          Adicionar Membro
        </Button>
      </div>

      {/* Estatísticas da equipe */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users size={16} className="text-residuall-green" />
              Total de Membros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-residuall-gray-tableText">{members.length}</div>
            <p className="text-sm text-residuall-gray">membros ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Funções Diferentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-residuall-green">{roles.length}</div>
            <p className="text-sm text-residuall-gray">especialidades</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Projetos Ativos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">6</div>
            <p className="text-sm text-residuall-gray">em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Taxa de Atividade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">100%</div>
            <p className="text-sm text-residuall-gray">membros ativos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="flex flex-wrap gap-4 items-center justify-between p-4">
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter size={16} />
                  <span>{roleFilter}</span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem onClick={() => setRoleFilter('Todos')}>
                  Todas as Funções
                </DropdownMenuItem>
                {roles.map(role => (
                  <DropdownMenuItem key={role} onClick={() => setRoleFilter(role)}>
                    {role}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter size={16} />
                  <span>{statusFilter}</span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem onClick={() => setStatusFilter('Todos')}>
                  Todos os Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                  Ativo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>
                  Inativo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar membros..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de membros da equipe */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-residuall-gray-tableText">
            Membros da Equipe ({filteredMembers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {members.length === 0 ? 'Nenhum membro cadastrado' : 'Nenhum membro encontrado'}
              </h3>
              <p className="text-gray-500 mb-6">
                {members.length === 0 
                  ? 'Comece adicionando membros à sua equipe.' 
                  : 'Tente ajustar os filtros de busca.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.profile_picture_url || undefined} />
                        <AvatarFallback className="bg-residuall-green text-white">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-base">{member.name}</CardTitle>
                        <Badge className={`text-xs ${getRoleColor(member.role)}`}>
                          {member.role}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white">
                          <DropdownMenuItem onClick={() => handleViewProfile(member)}>
                            Ver Perfil
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditMember(member)}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRemoveMember(member)}
                            className="text-red-600 focus:text-red-600"
                          >
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} />
                        <span>Não informado</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>Não informado</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="w-full flex items-center justify-between text-xs text-gray-500">
                      <span>Desde {new Date(member.created_at).toLocaleDateString('pt-BR')}</span>
                      <Badge className={member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {member.status === 'active' ? 'Ativo' : 
                         member.status === 'away' ? 'Ausente' : 'Inativo'}
                      </Badge>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modais */}
      <TeamMemberProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        member={selectedMember}
      />

      <EditTeamMemberModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        member={selectedMember}
        onSave={handleSaveMember}
      />
    </main>
  );
};

export default TeamPage;
