
import React, { useState } from 'react';
import { Search, UserPlus, ChevronDown, User, ArrowLeft, Trash2, Calendar, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useTeamInvitations } from "@/hooks/useTeamInvitations";
import { useTeamProjects } from "@/hooks/useTeamProjects";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import MemberStatusBadge from "@/components/MemberStatusBadge";

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

const TeamPage: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { sendInvitation } = useTeamInvitations();
  const { projects, fetchMemberProjects, assignProjectsToMember } = useTeamProjects();
  const { members, loading, deleteMember, getMemberProjects } = useTeamMembers();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos os Cargos');
  const [statusFilter, setStatusFilter] = useState('Todos os Status');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: ''
  });

  // Estados para detalhes/edição de membros
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [memberProjects, setMemberProjects] = useState<any[]>([]);

  // Filter team members based on search query and filters
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          member.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'Todos os Cargos' || member.role.includes(roleFilter);
    const matchesStatus = statusFilter === 'Todos os Status' || member.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    console.log('Busca por nome:', value);
  };

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.email) {
      toast({
        title: "Erro",
        description: "Por favor, preencha nome e email.",
        variant: "destructive",
      });
      return;
    }

    try {
      await sendInvitation(newMember.email, newMember.name);
      
      console.log('Convite enviado para:', newMember);
      setIsAddModalOpen(false);
      setNewMember({ name: '', email: '' });
      
      toast({
        title: "Sucesso!",
        description: "Convite enviado com sucesso! O membro receberá um email de confirmação.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Erro ao enviar convite:', error);
    }
  };

  const handleViewProfile = async (member: TeamMember) => {
    setSelectedMember(member);

    // Buscar projetos do membro se for um membro real (com conta)
    if (member.has_account) {
      const projects = await getMemberProjects(member.id);
      setMemberProjects(projects);
    } else {
      setMemberProjects([]);
    }
  };

  const handleDeleteMember = async (member: TeamMember) => {
    try {
      const success = await deleteMember(member.id, member.has_account);
      if (success) {
        handleBack();
      }
    } catch (error) {
      console.error('Erro ao excluir membro:', error);
    }
  };

  const handleBack = () => {
    setSelectedMember(null);
    setSelectedProjects([]);
    setMemberProjects([]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Se há um membro selecionado, mostrar detalhes
  if (selectedMember) {
    return (
      <main className="flex-1 overflow-y-auto bg-[#F8F8F8] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button onClick={handleBack} variant="outline" className="mr-4">
                <ArrowLeft size={18} className="mr-2" />
                Voltar
              </Button>
              <h1 className="text-2xl font-bold text-[#333333]">Detalhes do Membro</h1>
            </div>
            
            {/* Botão Excluir reposicionado */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                  size="sm"
                >
                  <Trash2 size={16} className="mr-1" />
                  Excluir Membro
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir Membro</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja remover <strong>{selectedMember.name}</strong> da equipe? 
                    Esta ação não pode ser desfeita e o membro perderá acesso a todos os projetos.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => handleDeleteMember(selectedMember)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card Principal - Informações do Membro */}
            <Card className="bg-white shadow-sm lg:col-span-2">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Avatar e Status */}
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100">
                        {selectedMember.profile_picture_url ? (
                          <img 
                            src={selectedMember.profile_picture_url} 
                            alt={selectedMember.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <User size={48} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <MemberStatusBadge 
                      status={selectedMember.status}
                      invitationStatus={selectedMember.invitation_status}
                      hasAccount={selectedMember.has_account}
                    />
                    
                    {!selectedMember.has_account && (
                      <div className="mt-2 text-center">
                        <p className="text-sm text-amber-600 font-medium">
                          ⚠️ Sem conta na plataforma
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Convite necessário para acesso completo
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Informações do Membro */}
                  <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Nome Completo</h3>
                        <p className="text-lg font-semibold text-[#333333]">{selectedMember.name}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Cargo/Função</h3>
                        <p className="text-gray-700">{selectedMember.role}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">E-mail</h3>
                        <p className="text-gray-700">{selectedMember.email}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Data de Entrada</h3>
                        <div className="flex items-center text-gray-700">
                          <Calendar size={16} className="mr-2" />
                          {formatDate(selectedMember.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card de Projetos Vinculados */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FolderOpen size={20} className="mr-2" />
                  Projetos Vinculados
                </CardTitle>
              </CardHeader>
              <CardContent>
                {memberProjects.length > 0 ? (
                  <div className="space-y-3">
                    {memberProjects.map((mp: any) => (
                      <div
                        key={mp.id}
                        className="p-3 bg-blue-50 rounded-lg border border-blue-100"
                      >
                        <h4 className="font-medium text-blue-900">
                          {mp.projects?.name || 'Projeto não encontrado'}
                        </h4>
                        {mp.projects?.location && (
                          <p className="text-sm text-blue-700 mt-1">
                            📍 {mp.projects.location}
                          </p>
                        )}
                        <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {mp.projects?.status || 'Status indefinido'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FolderOpen size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">
                      {selectedMember.has_account 
                        ? 'Nenhum projeto vinculado'
                        : 'Projetos serão exibidos após criação da conta'
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-[#F8F8F8] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-[#333333] mb-6">Time</h1>
        
        {/* Actions and Filters Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          {/* Add Member Button */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#004C4C] hover:bg-[#003B3B] text-white flex items-center gap-2">
                <UserPlus size={18} />
                <span>+ Adicionar Membro</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Convidar Novo Membro</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <Input
                    placeholder="Nome completo do membro"
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    placeholder="email@exemplo.com"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Um convite será enviado por email para confirmação.
                </p>
              </div>
              <DialogFooter>
                <Button onClick={handleAddMember}>Enviar Convite</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <Input
                type="text"
                placeholder="Buscar por nome..."
                className="pl-10 pr-4 py-2"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex gap-3 w-full md:w-auto">
              {/* Role Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto justify-between">
                    {roleFilter}
                    <ChevronDown size={16} className="ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setRoleFilter('Todos os Cargos')}>Todos os Cargos</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter('Engenheiro')}>Engenheiro</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter('Analista')}>Analista</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter('Gerente')}>Gerente</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter('Arquiteto')}>Arquiteto</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto justify-between">
                    {statusFilter}
                    <ChevronDown size={16} className="ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter('Todos os Status')}>Todos os Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('active')}>Ativo</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('away')}>Ausente</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>Inativo</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {/* Team Members Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="bg-white shadow-sm animate-pulse">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center">
                  {/* Avatar */}
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100">
                      {member.profile_picture_url ? (
                        <img 
                          src={member.profile_picture_url} 
                          alt={member.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <User size={32} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Member Info */}
                  <div className="text-center mb-4 w-full">
                    <h3 className="text-xl font-bold text-[#333333] mb-1">{member.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{member.role}</p>
                    <p className="text-sm text-gray-500 mb-3 truncate">{member.email}</p>
                    
                    {/* Status Badge */}
                    <div className="flex justify-center mb-3">
                      <MemberStatusBadge 
                        status={member.status}
                        invitationStatus={member.invitation_status}
                        hasAccount={member.has_account}
                      />
                    </div>

                    {/* Alerta para membros sem conta */}
                    {!member.has_account && (
                      <div className="text-xs text-amber-600 mb-3 px-2 py-1 bg-amber-50 rounded">
                        ⚠️ Aguardando criação de conta
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 w-full mt-auto">
                    <Button 
                      variant="outline" 
                      className="flex-1 border-[#004C4C] text-[#004C4C] hover:bg-[#004C4C] hover:text-white"
                      onClick={() => handleViewProfile(member)}
                    >
                      <User size={16} className="mr-1" />
                      Ver Perfil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default TeamPage;
