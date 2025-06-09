
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { profile } = useProfile();
    
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 w-full z-50 header-glass">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="logo-hover flex items-center">
          <img
            src="/lovable-uploads/97cfa9a1-97a5-40dd-8412-f0c969634261.png"
            alt="Logo Residuall"
            className="h-8 md:h-10 w-auto mr-3"
          />
          <span className="brand-text text-2xl md:text-3xl text-residuall-green">
            RESIDUALL
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`nav-link ${isActiveRoute('/') ? 'nav-link-active' : ''}`}
          >
            HOME
          </Link>
          <Link 
            to="/sobre" 
            className={`nav-link ${isActiveRoute('/sobre') ? 'nav-link-active' : ''}`}
          >
            SOBRE
          </Link>
          <Link 
            to="/planos" 
            className={`nav-link ${isActiveRoute('/planos') ? 'nav-link-active' : ''}`}
          >
            PLANOS
          </Link>
          
          {/* Avatar ou botão de login */}
          {user ? (
            <Link to="/dashboard/perfil" className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || 'Avatar'} />
                <AvatarFallback className="bg-residuall-green text-white">
                  <User size={16} />
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="btn-secondary text-sm px-6 py-2"
            >
              ENTRAR
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-residuall-green p-2 hover:scale-110 transition-transform"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-fade-in border-t border-gray-100">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`block py-2 ${isActiveRoute('/') ? 'text-residuall-green font-medium' : 'text-residuall-gray hover:text-residuall-green'}`}
              onClick={toggleMenu}
            >
              HOME
            </Link>
            <Link 
              to="/sobre" 
              className={`block py-2 ${isActiveRoute('/sobre') ? 'text-residuall-green font-medium' : 'text-residuall-gray hover:text-residuall-green'}`}
              onClick={toggleMenu}
            >
              SOBRE
            </Link>
            <Link 
              to="/planos" 
              className={`block py-2 ${isActiveRoute('/planos') ? 'text-residuall-green font-medium' : 'text-residuall-gray hover:text-residuall-green'}`}
              onClick={toggleMenu}
            >
              PLANOS
            </Link>
            
            {/* Avatar ou botão de login no mobile */}
            {user ? (
              <Link 
                to="/dashboard/perfil" 
                className="flex items-center py-2 text-residuall-gray hover:text-residuall-green"
                onClick={toggleMenu}
              >
                <Avatar className="h-6 w-6 mr-3">
                  <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || 'Avatar'} />
                  <AvatarFallback className="bg-residuall-green text-white">
                    <User size={12} />
                  </AvatarFallback>
                </Avatar>
                PERFIL
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="btn-secondary text-sm px-6 py-2 text-center"
                onClick={toggleMenu}
              >
                ENTRAR
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
