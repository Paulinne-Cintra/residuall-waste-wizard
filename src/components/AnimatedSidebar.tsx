
import React, { useState, memo, useMemo, Suspense } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, Briefcase, Users, Layers, User, CheckCircle, Settings, File, LogOut, HelpCircle, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';

// Componente memoizado para evitar re-renderizações desnecessárias
const SidebarLink = memo(({
  to,
  icon: Icon,
  label,
  collapsed,
  isActive,
  onClick
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <Link
      to={to}
      className={`${
        isActive 
          ? "sidebar-menu-item-active bg-residuall-green/90 text-white shadow-md transform scale-105" 
          : "sidebar-menu-item hover:bg-residuall-green/10 hover:shadow-sm hover:transform hover:scale-105"
      } transition-all duration-300 ease-out group relative overflow-hidden`}
      onClick={onClick}
    >
      <Icon size={20} className={`sidebar-icon transition-all duration-200 ${isActive ? 'text-white' : 'group-hover:text-residuall-green'}`} />
      {!collapsed && (
        <span className={`transition-all duration-200 ${isActive ? 'text-white font-medium' : 'group-hover:text-residuall-green'}`}>
          {label}
        </span>
      )}
      {/* Linha indicadora animada para item ativo */}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full animate-scale-in" />
      )}
    </Link>
  );
});

SidebarLink.displayName = "SidebarLink";

// Loading component para o sidebar
const SidebarLoading = memo(() => (
  <div className="sidebar-container w-64 flex flex-col animate-pulse">
    <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
      <div className="flex items-center">
        <div className="h-8 w-8 bg-gray-300 rounded mr-2"></div>
        <div className="h-6 w-24 bg-gray-300 rounded"></div>
      </div>
    </div>
    <div className="p-4 space-y-2">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <div className="h-5 w-5 bg-gray-300 rounded"></div>
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  </div>
));

SidebarLoading.displayName = "SidebarLoading";

const AnimatedSidebar = memo(() => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  // Memoizar funções para evitar re-criação
  const toggleSidebar = React.useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);

  const toggleMobileSidebar = React.useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen]);

  const handleLogout = React.useCallback(async () => {
    console.log('AnimatedSidebar - Tentando fazer logout...');
    try {
      await signOut();
      setMobileOpen(false);
      navigate('/login');
      console.log('AnimatedSidebar - Navegou para /login após logout.');
    } catch (error) {
      console.error('AnimatedSidebar - Erro ao fazer logout:', error);
    }
  }, [signOut, navigate]);

  const closeMobileSidebar = React.useCallback(() => {
    setMobileOpen(false);
  }, []);

  // Memoizar verificação de rota ativa
  const isActiveRoute = React.useCallback((path: string) => {
    return location.pathname === path;
  }, [location.pathname]);

  // Memoizar configuração dos links do menu
  const menuItems = useMemo(() => [
    { to: "/dashboard", icon: Home, label: "Visão Geral" },
    { to: "/dashboard/relatorios", icon: FileText, label: "Relatórios" },
    { to: "/dashboard/projetos", icon: Briefcase, label: "Projetos" },
    { to: "/dashboard/time", icon: Users, label: "Time" },
    { to: "/dashboard/materiais", icon: Layers, label: "Materiais" },
    { to: "/dashboard/perfil", icon: User, label: "Perfil" },
    { to: "/dashboard/recomendacoes", icon: CheckCircle, label: "Recomendações" },
    { to: "/dashboard/configuracoes", icon: Settings, label: "Configurações" },
    { to: "/dashboard/arquivados", icon: File, label: "Arquivados" },
    { to: "/dashboard/ajuda", icon: HelpCircle, label: "Ajuda" },
  ], []);

  // Memoizar conteúdo do sidebar
  const sidebarContent = useMemo(() => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center text-xl font-bold group">
          {!collapsed && (
            <>
              <img
                alt="Logo Residuall"
                src="/lovable-uploads/97cfa9a1-97a5-40dd-8412-f0c969634261.png"
                className="h-8 w-auto mr-2 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-white dark:text-white transition-all duration-300 group-hover:text-residuall-green-secondary">
                RESIDUALL
              </span>
            </>
          )}
          {collapsed && (
            <img
              alt="Logo Residuall"
              src="/lovable-uploads/97cfa9a1-97a5-40dd-8412-f0c969634261.png"
              className="h-8 w-auto transition-transform duration-300 group-hover:scale-110"
            />
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="hidden md:block toggle-button p-1 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110"
          aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={20} className="transition-transform duration-200" />
          ) : (
            <ChevronLeft size={20} className="transition-transform duration-200" />
          )}
        </button>
        <button 
          onClick={toggleMobileSidebar} 
          className="md:hidden toggle-button p-1 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110" 
          aria-label="Fechar menu"
        >
          <X size={20} className="transition-transform duration-200" />
        </button>
      </div>

      <div className="p-4 space-y-1 overflow-y-auto flex-grow">
        {menuItems.map((item, index) => (
          <div
            key={item.to}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <SidebarLink
              to={item.to}
              icon={item.icon}
              label={item.label}
              collapsed={collapsed}
              isActive={isActiveRoute(item.to)}
              onClick={closeMobileSidebar}
            />
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="sidebar-menu-item w-full text-left hover:bg-red-50 hover:text-red-600 hover:shadow-sm hover:transform hover:scale-105 transition-all duration-300 ease-out group"
          aria-label="Sair da aplicação"
        >
          <LogOut size={20} className="sidebar-icon transition-all duration-200 group-hover:text-red-600" />
          {!collapsed && (
            <span className="transition-all duration-200 group-hover:text-red-600">
              Sair
            </span>
          )}
        </button>
      </div>
    </>
  ), [collapsed, menuItems, isActiveRoute, closeMobileSidebar, handleLogout, toggleSidebar, toggleMobileSidebar]);

  return (
    <>
      {/* Mobile sidebar trigger */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden fixed bottom-4 right-4 z-30 bg-residuall-green text-white p-3 rounded-full shadow-lg hover:bg-residuall-green/90 hover:scale-110 transition-all duration-300 animate-fade-in"
        aria-label="Abrir menu"
      >
        <Menu size={24} />
      </button>

      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMobileSidebar}
      />

      {/* Sidebar */}
      <Suspense fallback={<SidebarLoading />}>
        <aside
          className={`fixed left-0 top-0 bottom-0 z-50 flex flex-col md:relative md:z-0
            sidebar-container
            ${mobileOpen ? "w-64 animate-slide-in-right" : "w-0 md:w-auto"}
            ${collapsed ? "md:w-16" : "md:w-64"}
            transition-all duration-300 ease-out shadow-xl md:shadow-none`}
        >
          <div className={`h-full ${mobileOpen || !collapsed ? 'animate-fade-in' : ''}`}>
            {sidebarContent}
          </div>
        </aside>
      </Suspense>
    </>
  );
});

AnimatedSidebar.displayName = "AnimatedSidebar";

export default AnimatedSidebar;
