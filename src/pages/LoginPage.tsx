
import { useState, useEffect } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
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

  // Redirecionar se já estiver logado
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
      
      <main className="flex-grow flex items-center justify-center py-12 relative z-10 px-4 pt-20 md:pt-24">
        <div className="w-full max-w-md">
          {/* Card principal */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
            <div className="p-8 md:p-10">
              {/* Header do formulário */}
              <div className="text-center mb-8">
                <h1 className="brand-text text-3xl text-residuall-green mb-2">
                  RESIDUALL
                </h1>
                <p className="text-residuall-gray font-medium">
                  Bem-vindo de volta!
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo E-mail */}
                <div>
                  <label htmlFor="email" className="block text-sm font-montserrat font-medium text-residuall-gray mb-2">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-residuall-gray" />
                    <input 
                      id="email" 
                      type="email" 
                      className={`input-modern pl-11 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="seu@email.com" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                    />
                  </div>
                  {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
                </div>
                
                {/* Campo Senha */}
                <div>
                  <label htmlFor="password" className="block text-sm font-montserrat font-medium text-residuall-gray mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-residuall-gray" />
                    <input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      className={`input-modern pl-11 pr-11 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="••••••••" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                    />
                    <button 
                      type="button" 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-residuall-gray hover:text-residuall-green transition-colors" 
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password}</p>}
                </div>
                
                {/* Opções extras */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input 
                      id="remember-me" 
                      type="checkbox" 
                      className="h-4 w-4 text-residuall-green border-gray-300 rounded focus:ring-residuall-green transition-colors" 
                      checked={rememberMe} 
                      onChange={() => setRememberMe(!rememberMe)} 
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-residuall-gray">
                      Lembrar-me
                    </label>
                  </div>
                  
                  <div className="text-sm">
                    <a href="#" className="text-residuall-green hover:text-residuall-green-light transition-colors font-medium">
                      Esqueceu a senha?
                    </a>
                  </div>
                </div>
                
                {/* Mensagem de erro geral */}
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600 text-center">{errors.general}</p>
                  </div>
                )}

                {/* Botão de login */}
                <button 
                  type="submit"
                  disabled={authLoading} 
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed font-montserrat font-semibold text-lg py-4"
                >
                  {authLoading ? 'Entrando...' : 'ACESSAR PLATAFORMA'}
                </button>
              </form>
              
              {/* Link para cadastro */}
              <div className="text-center mt-8 pt-6 border-t border-gray-100">
                <span className="text-residuall-gray">Não tem uma conta? </span>
                <Link to="/cadastro" className="text-residuall-green hover:text-residuall-green-light font-montserrat font-semibold transition-colors">
                  Cadastre-se gratuitamente
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
