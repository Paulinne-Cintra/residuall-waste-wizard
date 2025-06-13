
import React from 'react';
import { Bell, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import DashboardNotifications from './DashboardNotifications';

const DashboardHeader: React.FC = () => {
  const { user, signOut } = useAuth();

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-900 hidden md:block">
          RESIDUALL
        </h1>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Componente de Notificações */}
        <DashboardNotifications />
        
        {/* Dropdown do usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-residuall-green text-white">
                  {user?.email ? getInitials(user.email) : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium text-sm">{user?.user_metadata?.full_name || 'Usuário'}</p>
                <p className="w-[200px] truncate text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard/perfil" className="w-full cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/configuracoes" className="w-full cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="w-full cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
