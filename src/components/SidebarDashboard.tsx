// src/components/SidebarDashboard.tsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Importe useNavigate
import { Home, FileText, Briefcase, Users, Layers, User, CheckCircle, Settings, File, LogOut, HelpCircle, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from '@/hooks/useAuth'; // Importe o useAuth

const SidebarDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Inicialize useNavigate
  const { signOut } = useAuth(); // Obtenha a função signOut do seu hook de autenticação

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    console.log('SidebarDashboard - Tentando fazer logout...'); // Log para depuração
    try {
      await signOut(); // Chama a função signOut do useAuth
      setMobileOpen(false); // Fecha o sidebar móvel após o logout
      navigate('/login'); // Redireciona para a página de login
      console.log('SidebarDashboard - Navegou para /login após logout.'); // Log para depuração
    } catch (error) {
      console.error('SidebarDashboard - Erro ao fazer logout:', error);
      // Aqui você pode adicionar um toast de erro se desejar
    }
  };

  const SidebarLink = ({
    to,
    icon: Icon,
    label
  }: {
    to: string;
    icon: React.ElementType;
    label: string;
  }) => {
    const active = isActiveRoute(to);
    return (
      <Link
        to={to}
        className={`${active ? "sidebar-menu-item-active" : "sidebar-menu-item"}`}
        onClick={() => setMobileOpen(false)}
      >
        <Icon size={20} className="sidebar-icon" />
        {!collapsed && <span>{label}</span>}
      </Link>
    );
  };

  // Sidebar content for both mobile and desktop
  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center text-xl font-bold">
          {!collapsed && (
            <>
              <img
                alt="Logo Residuall"
                style={{
                  maxHeight: '32px',
                  width: 'auto'
                }}
                src="/lovable-uploads/d4826481-6237-4186-8ced-b0b927c45423.png" // Verifique se este caminho da imagem está correto
                className="h-8 mr-2 block object-scale-down"
              />
              <span className="text-white dark:text-white">RESIDUALL</span>
            </>
          )}
          {collapsed && <span className="text-white dark:text-white">R</span>}
        </Link>
        <button
          onClick={toggleSidebar}
          className="hidden md:block toggle-button p-1"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        <button onClick={toggleMobileSidebar} className="md:hidden toggle-button p-1">
          <X size={20} />
        </button>
      </div>

      <div className="p-4 space-y-1 overflow-y-auto flex-grow">
        <SidebarLink to="/dashboard" icon={Home} label="Visão Geral" />
        <SidebarLink to="/dashboard/relatorios" icon={FileText} label="Relatórios" />
        <SidebarLink to="/dashboard/projetos" icon={Briefcase} label="Projetos" />
        <SidebarLink to="/dashboard/time" icon={Users} label="Time" />
        <SidebarLink to="/dashboard/materiais" icon={Layers} label="Materiais" />
        <SidebarLink to="/dashboard/perfil" icon={User} label="Perfil" />
        <SidebarLink to="/dashboard/recomendacoes" icon={CheckCircle} label="Recomendações" />
        <SidebarLink to="/dashboard/configuracoes" icon={Settings} label="Configurações" />
        <SidebarLink to="/dashboard/arquivados" icon={File} label="Arquivados" />
        <SidebarLink to="/dashboard/ajuda" icon={HelpCircle} label="Ajuda" />
      </div>

      <div className="p-4 border-t border-sidebar-border">
        {/* Botão Sair - Agora chama handleLogout */}
        <button
          onClick={handleLogout} // Chame a função handleLogout
          className="sidebar-menu-item w-full text-left" // Use w-full e text-left para ocupar todo o espaço
        >
          <LogOut size={20} className="sidebar-icon" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile sidebar trigger */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden fixed bottom-4 right-4 z-30 bg-residuall-green text-white p-3 rounded-full shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={toggleMobileSidebar}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 flex flex-col md:relative md:z-0
          sidebar-container
          ${mobileOpen ? "w-64" : "w-0 md:w-auto"}
          ${collapsed ? "md:w-16" : "md:w-64"}
          transition-all duration-300 ease-in-out`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default SidebarDashboard;
