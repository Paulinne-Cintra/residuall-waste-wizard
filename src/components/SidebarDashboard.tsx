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
  X
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
      className={`flex items-center p-3 rounded-lg transition-colors ${
        isActiveRoute(to)
          ? "bg-residuall-green text-white"
          : "text-gray-300 hover:bg-sidebar-accent hover:text-white"
      }`}
      onClick={() => setMobileOpen(false)}
    >
      <Icon size={20} className="mr-3" />
      {!collapsed && <span>{label}</span>}
    </Link>
  );

  // Sidebar content for both mobile and desktop
  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <Link to="/dashboard" className="text-xl font-bold text-white">
          {!collapsed && "RESIDUALL"}
          {collapsed && "R"}
        </Link>
        <button
          onClick={toggleSidebar}
          className="hidden md:block text-gray-400 hover:text-white p-1"
        >
          {collapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden text-gray-400 hover:text-white p-1"
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
          className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-sidebar-accent hover:text-white transition-colors"
          onClick={() => setMobileOpen(false)}
        >
          <LogOut size={20} className="mr-3" />
          {!collapsed && <span>Sair</span>}
        </Link>
      </div>
    </>
  );

  // Missing components for icons
const ChevronLeft = ({ size, className }: { size: number; className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight = ({ size, className }: { size: number; className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
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

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMobileSidebar}
      ></div>

      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 flex flex-col bg-sidebar-DEFAULT md:relative md:z-0
          ${mobileOpen ? "w-64" : "w-0 md:w-auto"} 
          ${collapsed ? "md:w-16" : "md:w-64"}
          transition-all duration-300 ease-in-out`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

// Missing components for icons


export default SidebarDashboard;
