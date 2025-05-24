
// src/components/Header.tsx
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
    // Retorna true se a rota atual é o caminho, OU se é a página de login
    // para que os links tenham a cor branca no cabeçalho da página de login.
    return location.pathname === path || location.pathname === '/login';
  };

  return (
    // Removendo sticky, bg-white e shadow-sm para fundo transparente e sem sombra
    <header className="absolute top-0 w-full z-50"> {/* Usamos absolute para flutuar sobre o gradiente */}
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        {/* Usando text-residuall-white para a logo no cabeçalho transparente */}
        <Link to="/" className="text-2xl font-bold text-residuall-white">
          RESIDUALL
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6"> {/* Aumentado space-x para espaçamento mais arejado */}
          <Link 
            to="/" 
            // Usando text-residuall-white para todos os links na página de login
            className={isActiveRoute('/') ? 'font-medium text-residuall-white' : 'text-residuall-white hover:text-residuall-orange-burnt transition-colors'}
          >
            HOME
          </Link>
          <Link 
            to="/sobre" 
            className={isActiveRoute('/sobre') ? 'font-medium text-residuall-white' : 'text-residuall-white hover:text-residuall-orange-burnt transition-colors'}
          >
            SOBRE
          </Link>
          <Link 
            to="/planos" 
            className={isActiveRoute('/planos') ? 'font-medium text-residuall-white' : 'text-residuall-white hover:text-residuall-orange-burnt transition-colors'}
          >
            PLANOS
          </Link>
          {/* REMOVIDO o botão "ENTRAR" que era específico para a página de login */}
          {/* <Link 
            to="/login" 
            className="ml-8 px-6 py-2 rounded-lg bg-residuall-green text-white font-medium hover:bg-residuall-green-light transition-colors"
          >
            ENTRAR
          </Link>
          */}
        </nav>

        {/* Mobile Menu Button */}
        {/* Usando text-residuall-white para o ícone do menu */}
        <button 
          className="md:hidden text-residuall-white p-2"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        // Fundo do menu mobile pode ser semi-transparente ou uma cor sólida escura
        <div className="md:hidden bg-residuall-green-default shadow-lg animate-fade-in"> {/* Fundo escuro para o menu mobile */}
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`block py-2 ${isActiveRoute('/') ? 'text-residuall-orange-burnt font-medium' : 'text-residuall-white'}`}
              onClick={toggleMenu}
            >
              HOME
            </Link>
            <Link 
              to="/sobre" 
              className={`block py-2 ${isActiveRoute('/sobre') ? 'text-residuall-orange-burnt font-medium' : 'text-residuall-white'}`}
              onClick={toggleMenu}
            >
              SOBRE
            </Link>
            <Link 
              to="/planos" 
              className={`block py-2 ${isActiveRoute('/planos') ? 'text-residuall-orange-burnt font-medium' : 'text-residuall-white'}`}
              onClick={toggleMenu}
            >
              PLANOS
            </Link>
            {/* REMOVIDO o botão "ENTRAR" do menu mobile também */}
            {/* <Link 
              to="/login" 
              className="block w-full text-center py-3 rounded-lg bg-residuall-green text-white font-medium hover:bg-residuall-green-light transition-colors"
              onClick={toggleMenu}
            >
              ENTRAR
            </Link>
            */}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
