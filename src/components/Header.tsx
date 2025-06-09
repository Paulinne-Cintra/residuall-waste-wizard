import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from './ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Adiciona o fundo quando o scroll passar de 50px
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Limpa o evento quando o componente é desmontado
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link ${isActive ? 'nav-link-active' : 'text-white/90 hover:text-white'}`;

  const scrolledNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link ${isActive ? 'nav-link-active' : 'text-residuall-gray hover:text-residuall-green'}`;

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg header-glass' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="Logo Residuall" className="h-10 w-auto logo-hover" />
        </Link>

        {/* Navegação */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={isScrolled ? scrolledNavLinkClass : navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/sobre" className={isScrolled ? scrolledNavLinkClass : navLinkClass}>
            Sobre
          </NavLink>
          <NavLink to="/planos" className={isScrolled ? scrolledNavLinkClass : navLinkClass}>
            Planos
          </NavLink>
        </nav>

        {/* Botão de Ação */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" asChild className={isScrolled ? 'text-residuall-green hover:bg-residuall-green/10' : 'text-white hover:bg-white/10'}>
            <Link to="/login">Entrar</Link>
          </Button>
          <Button asChild className="btn-secondary bg-residuall-orange hover:bg-residuall-orange-light">
            <Link to="/cadastro">Criar Conta</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
