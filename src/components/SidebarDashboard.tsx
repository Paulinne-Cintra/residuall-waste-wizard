
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  FileText, 
  Briefcase, 
  Users, 
  Layers, 
  User, 
  CheckCircle, 
  Settings, 
  File, 
  LogOut, 
  HelpCircle, 
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const SidebarDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    return location.pathname.includes(path);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const SidebarLink = ({ 
    to, 
    icon: Icon, 
    label 
  }: { 
    to: string; 
    icon: React.ElementType; 
    label: string 
  }) => (
    <Link
      to={to}
      className={`${
        isActiveRoute(to)
          ? "sidebar-menu-item-active"
          : "sidebar-menu-item"
      }`}
      onClick={() => setMobileOpen(false)}
    >
      <Icon size={20} className="sidebar-icon" />
      {!collapsed && <span>{label}</span>}
    </Link>
  );

  // Sidebar content for both mobile and desktop
  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center text-xl font-bold text-white">
          {!collapsed && (
            <>
              <img src="/assets/logo-residuall-branca.png" alt="Logo Residuall" className="h-8 mr-2" />
              <span>RESIDUALL</span>
            </>
          )}
          {collapsed && "R"}
        </Link>
        <button
          onClick={toggleSidebar}
          className="hidden md:block text-residuall-gray-text hover:text-white p-1"
        >
          {collapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden text-residuall-gray-text hover:text-white p-1"
        >
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
        <Link
          to="/"
          className="sidebar-menu-item"
          onClick={() => setMobileOpen(false)}
        >
          <LogOut size={20} className="sidebar-icon" />
          {!collapsed && <span>Sair</span>}
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile sidebar trigger */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden fixed bottom-4 right-4 z-30 bg-residuall-green text-white p-3 rounded-full shadow-residuall"
      >
        <Menu size={24} />
      </button>

      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMobileSidebar}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 flex flex-col bg-residuall-green md:relative md:z-0
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
