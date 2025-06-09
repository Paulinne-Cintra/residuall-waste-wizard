import { Link, NavLink } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    user
  } = useAuth();
  const {
    profile
  } = useProfile();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return <header className="w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src="/lovable-uploads/9488f0fd-b9a5-4e50-a2fc-3626b4d9adff.png" alt="Logo Residuall" className="h-10 w-auto" />
          <span className="font-bold text-3xl text-residuall-green object-cover">
            RESIDUALL
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={({
          isActive
        }) => isActive ? "text-residuall-green font-bold" : "text-gray-600 hover:text-residuall-green"}>
            HOME
          </NavLink>
          <NavLink to="/sobre" className={({
          isActive
        }) => isActive ? "text-residuall-green font-bold" : "text-gray-600 hover:text-residuall-green"}>
            SOBRE
          </NavLink>
          <NavLink to="/planos" className={({
          isActive
        }) => isActive ? "text-residuall-green font-bold" : "text-gray-600 hover:text-residuall-green"}>
            PLANOS
          </NavLink>
        </nav>

        {/* Avatar ou botão de ação */}
        <div className="flex items-center">
          {user ? <Link to="/dashboard/perfil" className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || 'Avatar'} />
                <AvatarFallback className="bg-residuall-green text-white">
                  <User size={16} />
                </AvatarFallback>
              </Avatar>
            </Link> : <Link to="/login" className="py-2 px-5 rounded-lg font-bold text-gray-800 transition-all duration-300 hover:scale-105" style={{
          background: 'linear-gradient(to right, #e2c290, #c9ad7f)'
        }}>
              ENTRAR
            </Link>}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 hover:scale-110 transition-transform text-gray-600" onClick={toggleMenu} aria-label="Menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && <div className="md:hidden bg-white shadow-lg animate-fade-in border-t border-gray-100">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <NavLink to="/" className={({
          isActive
        }) => isActive ? "block py-2 text-residuall-green font-medium" : "block py-2 text-residuall-gray hover:text-residuall-green"} onClick={toggleMenu}>
              HOME
            </NavLink>
            <NavLink to="/sobre" className={({
          isActive
        }) => isActive ? "block py-2 text-residuall-green font-medium" : "block py-2 text-residuall-gray hover:text-residuall-green"} onClick={toggleMenu}>
              SOBRE
            </NavLink>
            <NavLink to="/planos" className={({
          isActive
        }) => isActive ? "block py-2 text-residuall-green font-medium" : "block py-2 text-residuall-gray hover:text-residuall-green"} onClick={toggleMenu}>
              PLANOS
            </NavLink>
            
            {/* Avatar ou botões de ação no mobile */}
            {user ? <Link to="/dashboard/perfil" className="flex items-center py-2 text-residuall-gray hover:text-residuall-green" onClick={toggleMenu}>
                <Avatar className="h-6 w-6 mr-3">
                  <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || 'Avatar'} />
                  <AvatarFallback className="bg-residuall-green text-white">
                    <User size={12} />
                  </AvatarFallback>
                </Avatar>
                PERFIL
              </Link> : <Link to="/login" className="btn-secondary text-sm px-6 py-2 text-center" onClick={toggleMenu}>
                ENTRAR
              </Link>}
          </div>
        </div>}
    </header>;
};
export default Header;