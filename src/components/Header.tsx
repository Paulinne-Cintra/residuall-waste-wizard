
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-residuall-green">
          RESIDUALL
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          <Link 
            to="/" 
            className={isActiveRoute('/') ? 'nav-link-active' : 'nav-link'}
          >
            HOME
          </Link>
          <Link 
            to="/sobre" 
            className={isActiveRoute('/sobre') ? 'nav-link-active' : 'nav-link'}
          >
            SOBRE
          </Link>
          <Link 
            to="/planos" 
            className={isActiveRoute('/planos') ? 'nav-link-active' : 'nav-link'}
          >
            PLANOS
          </Link>
          <Link 
            to="/login" 
            className="ml-8 px-6 py-2 rounded-lg bg-residuall-green text-white font-medium hover:bg-residuall-green-light transition-colors"
          >
            ENTRAR
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-residuall-gray-dark p-2"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`block py-2 ${isActiveRoute('/') ? 'text-residuall-green font-medium' : 'text-residuall-gray-dark'}`}
              onClick={toggleMenu}
            >
              HOME
            </Link>
            <Link 
              to="/sobre" 
              className={`block py-2 ${isActiveRoute('/sobre') ? 'text-residuall-green font-medium' : 'text-residuall-gray-dark'}`}
              onClick={toggleMenu}
            >
              SOBRE
            </Link>
            <Link 
              to="/planos" 
              className={`block py-2 ${isActiveRoute('/planos') ? 'text-residuall-green font-medium' : 'text-residuall-gray-dark'}`}
              onClick={toggleMenu}
            >
              PLANOS
            </Link>
            <Link 
              to="/login" 
              className="block w-full text-center py-3 rounded-lg bg-residuall-green text-white font-medium hover:bg-residuall-green-light transition-colors"
              onClick={toggleMenu}
            >
              ENTRAR
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
