
import { useState, useEffect } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('LoginPage - user:', !!user, 'authLoading:', authLoading);

  // Redirecionar se já estiver logado
  if (!authLoading && user) {
    console.log('LoginPage - redirecting authenticated user to:', from);
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
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

    setIsSubmitting(true);

    try {
      await signIn(email, password);
    } catch (error: any) {
      setErrors(prev => ({ ...prev, general: error.message || 'Ocorreu um erro desconhecido.' }));
      console.error('Erro no login:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Mostrar loading enquanto a autenticação está sendo verificada
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-residuall-green-default"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Fundo com degradê dinâmico */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(135deg, #2F4A3A 0%, #D87C4A 50%, #2F4A3A 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 12s ease-in-out infinite'
        }}
      />
      
      {/* Película branca translúcida */}
      <div className="absolute inset-0 w-full h-full bg-white/20" />
      
      {/* Elementos arquitetônicos geométricos */}
      <div className="absolute inset-0 w-full h-full opacity-10">
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* Silhueta de prédio 1 */}
          <path
            d="M100 80 L100 20 L140 20 L140 80 M110 30 L130 30 M110 40 L130 40 M110 50 L130 50 M110 60 L130 60"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            className="text-white/30"
          />
          
          {/* Silhueta de casa */}
          <path
            d="M200 80 L200 50 L220 30 L240 50 L240 80 M210 60 L230 60 M215 70 L225 70"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            className="text-white/30"
          />
          
          {/* Linhas técnicas de planta */}
          <g className="text-white/20">
            <line x1="50%" y1="20%" x2="80%" y2="20%" strokeWidth="0.5" stroke="currentColor" strokeDasharray="2,2" />
            <line x1="20%" y1="40%" x2="50%" y2="40%" strokeWidth="0.5" stroke="currentColor" strokeDasharray="2,2" />
            <line x1="60%" y1="60%" x2="90%" y2="60%" strokeWidth="0.5" stroke="currentColor" strokeDasharray="2,2" />
            <line x1="10%" y1="80%" x2="40%" y2="80%" strokeWidth="0.5" stroke="currentColor" strokeDasharray="2,2" />
          </g>
          
          {/* Estruturas geométricas */}
          <g className="text-white/25">
            <circle cx="85%" cy="30%" r="20" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <polygon points="300,200 320,180 340,200 320,220" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          </g>
        </svg>
      </div>
      
      <main className="flex-grow flex items-center justify-center py-12 relative z-10 px-4">
        <div className="w-full max-w-md">
          {/* Card principal */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
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

                {/* Botão de login destacado */}
                <button 
                  type="submit"
                  disabled={isSubmitting} 
                  className="w-full bg-residuall-green-dark hover:bg-residuall-green text-white font-montserrat font-bold text-lg py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? 'Entrando...' : 'ACESSAR PLATAFORMA'}
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
      
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
