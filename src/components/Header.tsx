
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
    // Para a página de login, todos os links do header terão uma cor base branca.
    // Em outras páginas, a cor ativa destacará a rota atual.
    return location.pathname === path;
  };

  // Determinar a cor dos links baseado na página atual
  const linkTextColorClass = location.pathname === '/login' ? 'text-residuall-white' : 'text-residuall-gray-dark';
  const linkHoverColorClass = 'hover:text-residuall-orange-burnt transition-colors';
  const activeLinkClass = 'font-medium text-residuall-orange-burnt'; // Cor de destaque para o link ativo

  return (
    // Aplicando a classe de glassmorphism e removendo as classes antigas de fundo/sombra
    <header className="absolute top-0 w-full z-50 header-glassmorphism"> 
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        {/* Logo - Agora sempre branca no cabeçalho translúcido */}
        <Link to="/" className="text-2xl font-bold text-residuall-white">
          RESIDUALL
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`${linkTextColorClass} ${linkHoverColorClass} ${isActiveRoute('/') ? activeLinkClass : ''}`}
          >
            HOME
          </Link>
          <Link 
            to="/sobre" 
            className={`${linkTextColorClass} ${linkHoverColorClass} ${isActiveRoute('/sobre') ? activeLinkClass : ''}`}
          >
            SOBRE
          </Link>
          <Link 
            to="/planos" 
            className={`${linkTextColorClass} ${linkHoverColorClass} ${isActiveRoute('/planos') ? activeLinkClass : ''}`}
          >
            PLANOS
          </Link>
          {/* REMOVIDO o botão "ENTRAR" */}
        </nav>

        {/* Mobile Menu Button - Ícone branco */}
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
        // Fundo do menu mobile pode ser um verde escuro sólido ou semi-transparente
        <div className="md:hidden bg-residuall-green-default shadow-lg animate-fade-in"> 
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`block py-2 ${isActiveRoute('/') ? activeLinkClass : 'text-residuall-white'}`}
              onClick={toggleMenu}
            >
              HOME
            </Link>
            <Link 
              to="/sobre" 
              className={`block py-2 ${isActiveRoute('/sobre') ? activeLinkClass : 'text-residuall-white'}`}
              onClick={toggleMenu}
            >
              SOBRE
            </Link>
            <Link 
              to="/planos" 
              className={`block py-2 ${isActiveRoute('/planos') ? activeLinkClass : 'text-residuall-white'}`}
              onClick={toggleMenu}
            >
              PLANOS
            </Link>
            {/* REMOVIDO o botão "ENTRAR" do menu mobile */}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
