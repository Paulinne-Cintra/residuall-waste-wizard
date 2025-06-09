import { Link, NavLink } from 'react-router-dom';
import { Button } from './ui/button';

const Header = () => {
  // Classe base para os links de navegação
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link ${isActive ? 'nav-link-active' : 'text-residuall-gray hover:text-residuall-green'}`;

  return (
    <header 
      className="w-full z-50 bg-white shadow-md"
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-20">
        {/* Logo como Texto */}
        <Link to="/" className="flex items-center">
          <span className="font-montserrat font-bold text-2xl text-residuall-green logo-hover">
            Residuall
          </span>
        </Link>

        {/* Navegação */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/sobre" className={navLinkClass}>
            Sobre
          </NavLink>
          <NavLink to="/planos" className={navLinkClass}>
            Planos
          </NavLink>
        </nav>

        {/* Botão de Ação */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" asChild className="text-residuall-green hover:bg-residuall-green/10">
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
