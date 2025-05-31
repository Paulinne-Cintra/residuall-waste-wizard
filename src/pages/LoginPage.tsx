
import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const LoginPage = () => {
  const { signIn, user, loading: authLoading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  if (!authLoading && user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: {
      email?: string;
      password?: string;
    } = {};

    if (!email) {
      newErrors.email = 'O e-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Por favor, insira um e-mail válido';
    }

    if (!password) {
      newErrors.password = 'A senha é obrigatória';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await signIn(email, password);
    } catch (error: any) {
      setErrors(prev => ({ ...prev, general: error.message || 'Ocorreu um erro desconhecido.' }));
      console.error('Erro no login:', error);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen login-animated-bg flex items-center justify-center relative overflow-hidden">
      {/* Elementos geométricos animados */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-16 h-16 border-2 border-white opacity-20 rotate-45 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-12 h-12 border-2 border-white opacity-20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 border-2 border-white opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-24 h-24 border-2 border-white opacity-20 rotate-12 animate-pulse"></div>
        
        {/* Formas de construção */}
        <div className="absolute top-1/4 left-10 opacity-10">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="text-white">
            <path d="M30 5L5 25H15V55H45V25H55L30 5Z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 right-10 opacity-10">
          <svg width="50" height="80" viewBox="0 0 50 80" fill="none" className="text-white">
            <rect x="5" y="20" width="40" height="60" stroke="currentColor" strokeWidth="2"/>
            <rect x="10" y="25" width="8" height="12" stroke="currentColor" strokeWidth="1"/>
            <rect x="20" y="25" width="8" height="12" stroke="currentColor" strokeWidth="1"/>
            <rect x="32" y="25" width="8" height="12" stroke="currentColor" strokeWidth="1"/>
          </svg>
        </div>
      </div>
      
      <main className="w-full max-w-md mx-4 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <p className="text-sm font-montserrat font-semibold text-residuall-orange mb-2 uppercase tracking-wide">
                RESIDUALL Login
              </p>
              <h1 className="text-4xl font-montserrat font-bold text-residuall-green mb-2">
                Bem-vindo(a)!
              </h1>
              <p className="text-residuall-gray font-lato">
                Acesse sua conta e continue transformando a construção
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-montserrat font-medium text-residuall-green mb-2">
                  E-mail
                </label>
                <input 
                  id="email" 
                  type="email" 
                  className={`input-modern ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="seu@email.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                />
                {errors.email && <p className="mt-1 text-sm text-red-500 font-lato">{errors.email}</p>}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-montserrat font-medium text-residuall-green mb-2">
                  Senha
                </label>
                <div className="relative">
                  <input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    className={`input-modern pr-12 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="••••••••" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                  />
                  <button 
                    type="button" 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-residuall-gray hover:text-residuall-green transition-colors" 
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500 font-lato">{errors.password}</p>}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input 
                    id="remember-me" 
                    type="checkbox" 
                    className="h-4 w-4 text-residuall-green border-gray-300 rounded focus:ring-residuall-green" 
                    checked={rememberMe} 
                    onChange={() => setRememberMe(!rememberMe)} 
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm font-lato text-residuall-gray">
                    Lembre-se de mim
                  </label>
                </div>
                
                <div className="text-sm">
                  <a href="#" className="text-residuall-orange hover:text-residuall-orange-light font-lato transition-colors">
                    Esqueceu a senha?
                  </a>
                </div>
              </div>
              
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700 font-lato text-center">{errors.general}</p>
                </div>
              )}

              <button 
                type="submit"
                disabled={authLoading} 
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {authLoading ? 'Entrando...' : 'ACESSAR'}
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <span className="text-residuall-gray font-lato">Não tem uma conta?</span>{" "}
              <Link to="/cadastro" className="text-residuall-orange hover:text-residuall-orange-light font-montserrat font-semibold transition-colors">
                Cadastrar-se
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
