
import React, { useState } from 'react';
import { Search, UserPlus, ChevronDown, User, Edit, ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  email: string;
  status: 'active' | 'away' | 'inactive';
  avatarUrl: string;
  projects?: string[];
};

const mockTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Alfredo Silva',
    role: 'Engenheiro Civil',
    email: 'alfredo.silva@residuall.com.br',
    status: 'active',
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    projects: ['Projeto A', 'Projeto B']
  },
  {
    id: 2,
    name: 'Maria Oliveira',
    role: 'Analista de Dados',
    email: 'maria.oliveira@residuall.com.br',
    status: 'active',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    projects: ['Projeto A']
  },
  {
    id: 3,
    name: 'Paulo Santos',
    role: 'Engenheiro Ambiental',
    email: 'paulo.santos@residuall.com.br',
    status: 'away',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    projects: ['Projeto C']
  },
  {
    id: 4,
    name: 'Carla Mendes',
    role: 'Gerente de Projetos',
    email: 'carla.mendes@residuall.com.br',
    status: 'active',
    avatarUrl: 'https://i.pravatar.cc/150?img=9',
    projects: ['Projeto A', 'Projeto B', 'Projeto C']
  },
  {
    id: 5,
    name: 'Ricardo Almeida',
    role: 'Arquiteto',
    email: 'ricardo.almeida@residuall.com.br',
    status: 'inactive',
    avatarUrl: 'https://i.pravatar.cc/150?img=15',
    projects: ['Projeto B']
  },
  {
    id: 6,
    name: 'Juliana Costa',
    role: 'Engenheira de Materiais',
    email: 'juliana.costa@residuall.com.br',
    status: 'active',
    avatarUrl: 'https://i.pravatar.cc/150?img=8',
    projects: ['Projeto A', 'Projeto C']
  }
];

const mockProjects = [
  { id: '1', name: 'Projeto A' },
  { id: '2', name: 'Projeto B' },
  { id: '3', name: 'Projeto C' },
];

const TeamPage: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedMember, setEditedMember] = useState<TeamMember | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  // Filter team members based on search query and filters
  const filteredMembers = mockTeamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          member.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'Todos os Cargos' || member.role.includes(roleFilter);
    const matchesStatus = statusFilter === 'Todos os Status' || member.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'inactive':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
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
        return status;
    }
  };

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
      const token = Math.random().toString(36).substring(2, 15);
      
      const { error } = await supabase
        .from('team_invitations')
        .insert({
          email: newMember.email,
          name: newMember.name,
          token: token,
          invited_by_user_id: user?.id
        });

      if (error) throw error;

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
      toast({
        title: "Erro",
        description: "Erro ao enviar convite. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleViewProfile = (member: TeamMember) => {
    setSelectedMember(member);
    setIsEditing(false);
  };

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setEditedMember({ ...member });
    setSelectedProjects(member.projects || []);
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    if (editedMember) {
      const updatedMember = {
        ...editedMember,
        projects: selectedProjects
      };
      console.log('Salvando alterações:', updatedMember);
      toast({
        title: "Sucesso!",
        description: "Alterações salvas com sucesso!",
        duration: 3000,
      });
      setSelectedMember(null);
      setIsEditing(false);
      setEditedMember(null);
      setSelectedProjects([]);
    }
  };

  const handleBack = () => {
    setSelectedMember(null);
    setIsEditing(false);
    setEditedMember(null);
    setSelectedProjects([]);
  };

  const handleProjectToggle = (projectName: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectName) 
        ? prev.filter(p => p !== projectName)
        : [...prev, projectName]
    );
  };

  // Se há um membro selecionado, mostrar detalhes/edição
  if (selectedMember) {
    return (
      <main className="flex-1 overflow-y-auto bg-[#F8F8F8] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button onClick={handleBack} variant="outline" className="mr-4">
              <ArrowLeft size={18} className="mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-[#333333]">
              {isEditing ? 'Editar Membro' : 'Detalhes do Membro'}
            </h1>
          </div>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100">
                      <img 
                        src={selectedMember.avatarUrl} 
                        alt={selectedMember.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full ${getStatusColor(selectedMember.status)} border-2 border-white`}></div>
                  </div>
                  
                  {/* Botão Editar movido para baixo do avatar na visualização */}
                  {!isEditing && (
                    <Button 
                      onClick={() => handleEditMember(selectedMember)}
                      className="bg-[#FF8C42] hover:bg-[#E07C32] text-white"
                    >
                      <Edit size={16} className="mr-1" />
                      Editar
                    </Button>
                  )}
                </div>

                {/* Detalhes */}
                <div className="flex-1 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    {isEditing ? (
                      <Input
                        value={editedMember?.name || ''}
                        onChange={(e) => setEditedMember(prev => prev ? {...prev, name: e.target.value} : null)}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-[#333333]">{selectedMember.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                    {isEditing ? (
                      <Input
                        value={editedMember?.role || ''}
                        onChange={(e) => setEditedMember(prev => prev ? {...prev, role: e.target.value} : null)}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-gray-600">{selectedMember.role}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    {isEditing ? (
                      <Input
                        value={editedMember?.email || ''}
                        onChange={(e) => setEditedMember(prev => prev ? {...prev, email: e.target.value} : null)}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-gray-600">{selectedMember.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selectedMember.status === 'active' ? 'bg-green-100 text-green-800' :
                      selectedMember.status === 'away' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getStatusText(selectedMember.status)}
                    </span>
                  </div>

                  {/* Projetos - só aparece na edição */}
                  {isEditing && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Projetos Associados</label>
                      <div className="space-y-3">
                        {mockProjects.map((project) => (
                          <div key={project.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`project-${project.id}`}
                              checked={selectedProjects.includes(project.name)}
                              onCheckedChange={() => handleProjectToggle(project.name)}
                            />
                            <label
                              htmlFor={`project-${project.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {project.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projetos - visualização */}
                  {!isEditing && selectedMember.projects && selectedMember.projects.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Projetos Associados</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedMember.projects.map((project, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                          >
                            {project}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Botões de ação */}
                  {isEditing && (
                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleSaveChanges} className="bg-[#004C4C] hover:bg-[#003B3B]">
                        Salvar Alterações
                      </Button>
                      <Button onClick={handleBack} variant="outline">
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center">
                {/* Avatar and Status */}
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100">
                    <img 
                      src={member.avatarUrl} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full ${getStatusColor(member.status)} border-2 border-white`}></div>
                </div>
                
                {/* Member Info */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-[#333333]">{member.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{member.role}</p>
                  <p className="text-sm text-gray-500 mt-2">{member.email}</p>
                  <div className="flex items-center justify-center mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      member.status === 'active' ? 'bg-green-100 text-green-800' :
                      member.status === 'away' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getStatusText(member.status)}
                    </span>
                  </div>
                </div>
                
                {/* Actions - apenas botão Ver Perfil */}
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
      </div>
    </main>
  );
};

export default TeamPage;
