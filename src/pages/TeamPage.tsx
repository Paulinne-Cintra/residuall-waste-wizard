
import React, { useState } from 'react';
import { Search, UserPlus, ChevronDown, User, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  email: string;
  status: 'active' | 'away' | 'inactive';
  avatarUrl: string;
};

const mockTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Alfredo Silva',
    role: 'Engenheiro Civil',
    email: 'alfredo.silva@residuall.com.br',
    status: 'active',
    avatarUrl: 'https://i.pravatar.cc/150?img=11'
  },
  {
    id: 2,
    name: 'Maria Oliveira',
    role: 'Analista de Dados',
    email: 'maria.oliveira@residuall.com.br',
    status: 'active',
    avatarUrl: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: 3,
    name: 'Paulo Santos',
    role: 'Engenheiro Ambiental',
    email: 'paulo.santos@residuall.com.br',
    status: 'away',
    avatarUrl: 'https://i.pravatar.cc/150?img=12'
  },
  {
    id: 4,
    name: 'Carla Mendes',
    role: 'Gerente de Projetos',
    email: 'carla.mendes@residuall.com.br',
    status: 'active',
    avatarUrl: 'https://i.pravatar.cc/150?img=9'
  },
  {
    id: 5,
    name: 'Ricardo Almeida',
    role: 'Arquiteto',
    email: 'ricardo.almeida@residuall.com.br',
    status: 'inactive',
    avatarUrl: 'https://i.pravatar.cc/150?img=15'
  },
  {
    id: 6,
    name: 'Juliana Costa',
    role: 'Engenheira de Materiais',
    email: 'juliana.costa@residuall.com.br',
    status: 'active',
    avatarUrl: 'https://i.pravatar.cc/150?img=8'
  }
];

const TeamPage: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos os Cargos');
  const [statusFilter, setStatusFilter] = useState('Todos os Status');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    email: ''
  });

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

  const handleAddMember = () => {
    console.log('Adicionando membro:', newMember);
    setIsModalOpen(false);
    setNewMember({ name: '', role: '', email: '' });
    toast({
      title: "Sucesso!",
      description: "Membro adicionado com sucesso!",
      duration: 3000,
    });
  };

  return (
    <main className="flex-1 overflow-y-auto bg-[#F8F8F8] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-[#333333] mb-6">Time</h1>
        
        {/* Actions and Filters Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          {/* Add Member Button */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#004C4C] hover:bg-[#003B3B] text-white flex items-center gap-2">
                <UserPlus size={18} />
                <span>+ Adicionar Membro</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Membro</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Nome do Membro"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                />
                <Input
                  placeholder="Cargo"
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                />
              </div>
              <DialogFooter>
                <Button onClick={handleAddMember}>Adicionar Membro</Button>
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
                
                {/* Actions */}
                <div className="flex gap-2 w-full mt-auto">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-[#004C4C] text-[#004C4C] hover:bg-[#004C4C] hover:text-white"
                  >
                    <User size={16} className="mr-1" />
                    Ver Perfil
                  </Button>
                  <Button 
                    className="flex-1 bg-[#FF8C42] hover:bg-[#E07C32] text-white"
                  >
                    <Edit size={16} className="mr-1" />
                    Editar
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
