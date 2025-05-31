
// src/components/SidebarDashboard.tsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, Briefcase, Users, Layers, User, CheckCircle, Settings, File, LogOut, HelpCircle, Menu, X, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';

const SidebarDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

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
    console.log('SidebarDashboard - Tentando fazer logout...');
    try {
      await signOut();
      setMobileOpen(false);
      navigate('/login');
      console.log('SidebarDashboard - Navegou para /login após logout.');
    } catch (error) {
      console.error('SidebarDashboard - Erro ao fazer logout:', error);
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
                src="/lovable-uploads/97cfa9a1-97a5-40dd-8412-f0c969634261.png"
                className="h-8 w-auto mr-2"
              />
              <span className="text-white dark:text-white">RESIDUALL</span>
            </>
          )}
          {collapsed && (
            <img
              alt="Logo Residuall"
              src="/lovable-uploads/97cfa9a1-97a5-40dd-8412-f0c969634261.png"
              className="h-8 w-auto"
            />
          )}
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
        
        {/* Novo link para criar projeto */}
        <Link
          to="/dashboard/projetos/novo"
          className="sidebar-menu-item ml-6 text-sm"
          onClick={() => setMobileOpen(false)}
        >
          <Plus size={16} className="sidebar-icon" />
          {!collapsed && <span>Novo Projeto</span>}
        </Link>
        
        <SidebarLink to="/dashboard/time" icon={Users} label="Time" />
        <SidebarLink to="/dashboard/materiais" icon={Layers} label="Materiais" />
        <SidebarLink to="/dashboard/perfil" icon={User} label="Perfil" />
        <SidebarLink to="/dashboard/recomendacoes" icon={CheckCircle} label="Recomendações" />
        <SidebarLink to="/dashboard/configuracoes" icon={Settings} label="Configurações" />
        <SidebarLink to="/dashboard/arquivados" icon={File} label="Arquivados" />
        <SidebarLink to="/dashboard/ajuda" icon={HelpCircle} label="Ajuda" />
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="sidebar-menu-item w-full text-left"
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
