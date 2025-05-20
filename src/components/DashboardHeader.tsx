
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, User } from 'lucide-react';

const DashboardHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica real de busca
    console.log('Pesquisando por:', searchQuery);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 md:px-6 flex items-center justify-between">
      {/* Busca */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar projetos, relatórios..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-residuall-green focus:border-transparent"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
        </div>
      </form>

      {/* Perfil e Notificações */}
      <div className="flex items-center space-x-4">
        {/* Notificações */}
        <div className="relative">
          <button
            className="p-2 rounded-full text-gray-500 hover:text-residuall-green hover:bg-gray-100 transition-colors relative"
            onClick={toggleNotifications}
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 bg-residuall-brown text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>
          
          {/* Dropdown de Notificações */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fade-in">
              <div className="p-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold">Notificações</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <div className="p-3 border-b border-gray-100 hover:bg-gray-50">
                  <p className="text-sm font-medium">Novo relatório disponível</p>
                  <p className="text-xs text-gray-500 mt-1">Há 5 minutos</p>
                </div>
                <div className="p-3 border-b border-gray-100 hover:bg-gray-50">
                  <p className="text-sm font-medium">Projeto atualizado: Torre B</p>
                  <p className="text-xs text-gray-500 mt-1">Há 2 horas</p>
                </div>
                <div className="p-3 hover:bg-gray-50">
                  <p className="text-sm font-medium">5 novas recomendações</p>
                  <p className="text-xs text-gray-500 mt-1">Há 1 dia</p>
                </div>
              </div>
              <div className="p-2 text-center border-t border-gray-200">
                <Link to="#" className="text-xs text-residuall-green hover:underline">
                  Ver todas as notificações
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Perfil */}
        <div className="relative">
          <button
            className="flex items-center space-x-2 p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={toggleProfile}
          >
            <div className="w-8 h-8 rounded-full bg-residuall-green flex items-center justify-center text-white">
              <User size={16} />
            </div>
            <span className="text-sm font-medium hidden md:block">Maria Silva</span>
          </button>
          
          {/* Dropdown de Perfil */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fade-in">
              <div className="p-3 border-b border-gray-200">
                <p className="text-sm font-medium">Maria Silva</p>
                <p className="text-xs text-gray-500">maria@empresa.com.br</p>
              </div>
              <div className="py-1">
                <Link 
                  to="/dashboard/perfil" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Meu Perfil
                </Link>
                <Link 
                  to="/dashboard/configuracoes" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Configurações
                </Link>
                <Link 
                  to="/" 
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sair
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
