import React, { useState } from 'react';
import { Search, UserPlus, ChevronDown, User, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
// Removidas as importações de SidebarDashboard e DashboardHeader
// import SidebarDashboard from '@/components/SidebarDashboard';
// import DashboardHeader from '@/components/DashboardHeader';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Filter team members based on search query and filters
  const filteredMembers = mockTeamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          member.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === '' || member.role.includes(roleFilter);
    const matchesStatus = statusFilter === '' || member.status === statusFilter;
    
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

  return (
    // A página agora começa diretamente com o conteúdo da área principal.
    // O layout (sidebar e header) é providenciado pelo DashboardLayout no App.tsx.
    <main className="flex-1 overflow-y-auto bg-[#F8F8F8] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-[#333333] mb-6">Time</h1>
        
        {/* Actions and Filters Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          {/* Add Member Button */}
          <Button 
            className="bg-[#004C4C] hover:bg-[#003B3B] text-white flex items-center gap-2"
          >
            <UserPlus size={18} />
            <span>+ Adicionar Membro</span>
          </Button>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Buscar por nome..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#004C4C] focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex gap-3 w-full md:w-auto">
              {/* Role Filter */}
              <div className="relative w-full md:w-auto">
                <select
                  className="appearance-none w-full bg-white border border-gray-300 px-4 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004C4C]"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="">Todos os Cargos</option>
                  <option value="Engenheiro">Engenheiro</option>
                  <option value="Analista">Analista</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Arquiteto">Arquiteto</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
              </div>
              
              {/* Status Filter */}
              <div className="relative w-full md:w-auto">
                <select
                  className="appearance-none w-full bg-white border border-gray-300 px-4 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004C4C]"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Todos os Status</option>
                  <option value="active">Ativo</option>
                  <option value="away">Ausente</option>
                  <option value="inactive">Inativo</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
              </div>
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
