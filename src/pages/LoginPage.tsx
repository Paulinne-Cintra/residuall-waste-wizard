// src/pages/LoginPage.tsx
import { useState, useEffect } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Header from '../components/Header';
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

  console.log('LoginPage - user:', !!user, 'authLoading:', authLoading);

  // Redirecionar se já estiver logado (sem loading)
  if (!authLoading && user) {
    console.log('LoginPage - redirecting authenticated user to:', from);
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
    <div className="min-h-screen flex flex-col relative overflow-hidden login-animated-bg">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 relative z-10 px-4">
        <div className="w-full max-w-md bg-residuall-white rounded-3xl shadow-sm overflow-hidden">
          <div className="p-8">
            <p className="text-center text-sm font-semibold text-residuall-orange-burnt mb-2">
                RESIDUALL Login
            </p>
            <h1 className="text-4xl font-bold text-residuall-gray-dark text-center mb-6">
                Bem-vindo(a)!
            </h1>
            
            <form onSubmit={handleSubmit}>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-residuall-gray-dark mb-2">
                  E-mail
                </label>
                <input 
                  id="email" 
                  type="email" 
                  className={`w-full p-3 border border-residuall-gray-default rounded-md 
                              focus:outline-none focus:ring-1 focus:ring-residuall-green-default 
                              ${errors.email ? 'border-red-500' : ''}`} 
                  placeholder="seu@email.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-residuall-gray-dark mb-2">
                  Senha
                </label>
                <div className="relative">
                  <input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    className={`w-full p-3 pr-10 border border-residuall-gray-default rounded-md 
                                focus:outline-none focus:ring-1 focus:ring-residuall-green-default 
                                ${errors.password ? 'border-red-500' : ''}`} 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                  />
                  <button 
                    type="button" 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-residuall-gray-dark" 
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>
              
              <div className="flex items-center justify-between mb-6 text-residuall-gray-dark">
                <div className="flex items-center">
                  <input 
                    id="remember-me" 
                    type="checkbox" 
                    className="h-4 w-4 text-residuall-green-default border-residuall-gray-default rounded focus:ring-residuall-green-default" 
                    checked={rememberMe} 
                    onChange={() => setRememberMe(!rememberMe)} 
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm">
                    Lembre-se
                  </label>
                </div>
                
                <div className="text-sm">
                  <a href="#" className="text-residuall-gray-dark hover:text-residuall-orange-burnt transition-colors">
                    Esqueceu a senha?
                  </a>
                </div>
              </div>
              
              {errors.general && (
                <p className="mt-1 mb-4 text-sm text-red-500 text-center">{errors.general}</p>
              )}

              <button 
                type="submit"
                disabled={authLoading} 
                className="w-full bg-residuall-green-default hover:bg-residuall-gray-dark text-white font-medium py-3 px-4 rounded-lg transition-colors bg-orange-700 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {authLoading ? 'Entrando...' : 'Acessar'}
              </button>
            </form>
            
            <div className="text-center mt-6">
              <span className="text-residuall-gray-dark">Não tem uma conta?</span>{" "}
              <Link to="/cadastro" className="text-residuall-orange-burnt hover:text-residuall-green-default font-semibold transition-colors">
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
