
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardHeaderProps {
  pageTitle?: string;
}

const DashboardHeader = ({ pageTitle }: DashboardHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Pesquisando por:', searchQuery);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const userDisplayName = profile?.full_name || user?.email || 'Usuário';
  const userEmail = profile?.email || user?.email || '';

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 md:px-6 flex items-center justify-between">
      {/* Page Title */}
      {pageTitle && (
        <div className="mr-4 hidden sm:block">
          <h1 className="text-xl font-semibold text-residuall-gray-tableText">{pageTitle}</h1>
        </div>
      )}

      {/* Busca */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar projetos, relatórios..."
            className="header-search pl-10"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-residuall-gray" />
          </div>
        </div>
      </form>

      {/* Perfil e Notificações */}
      <div className="flex items-center space-x-4">
        {/* Notificações */}
        <div className="relative">
          <button
            className="p-2 rounded-full text-residuall-gray hover:text-residuall-brown hover:bg-gray-100 transition-colors relative"
            onClick={toggleNotifications}
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 bg-residuall-brown text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>
          
          {/* Dropdown de Notificações */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-residuall border border-gray-200 z-50 animate-fade-in">
              <div className="p-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold">Notificações</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <div className="p-3 border-b border-gray-100 hover:bg-gray-50">
                  <p className="text-sm font-medium">Novo relatório disponível</p>
                  <p className="text-xs text-residuall-gray mt-1">Há 5 minutos</p>
                </div>
                <div className="p-3 border-b border-gray-100 hover:bg-gray-50">
                  <p className="text-sm font-medium">Projeto atualizado: Torre B</p>
                  <p className="text-xs text-residuall-gray mt-1">Há 2 horas</p>
                </div>
                <div className="p-3 hover:bg-gray-50">
                  <p className="text-sm font-medium">5 novas recomendações</p>
                  <p className="text-xs text-residuall-gray mt-1">Há 1 dia</p>
                </div>
              </div>
              <div className="p-2 text-center border-t border-gray-200">
                <Link to="#" className="text-xs text-residuall-green-secondary hover:underline">
                  Ver todas as notificações
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Menu do Perfil */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 p-2 rounded-lg text-residuall-gray-username hover:bg-gray-100 transition-colors focus:outline-none">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url} alt={userDisplayName} />
                <AvatarFallback className="bg-residuall-green text-white">
                  <User size={16} />
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">{userDisplayName}</span>
                <span className="admin-tag">Administrador</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 z-50" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userDisplayName}</p>
                <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard/perfil" className="flex items-center cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Ver perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/configuracoes" className="flex items-center cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
