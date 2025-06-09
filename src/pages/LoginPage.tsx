
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
      {/* Fundo com degradê dinâmico em tons terrosos */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(135deg, #556B2F 0%, #D2691E 50%, #556B2F 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 15s ease-in-out infinite'
        }}
      />
      
      {/* Película branca translúcida como véu */}
      <div className="absolute inset-0 w-full h-full bg-white/25 backdrop-blur-[0.5px]" />
      
      {/* Elementos arquitetônicos geométricos de baixa opacidade */}
      <div className="absolute inset-0 w-full h-full opacity-8">
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* Silhuetas de prédios */}
          <g className="text-white/15">
            <rect x="8%" y="25%" width="4%" height="50%" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <rect x="8.5%" y="35%" width="1%" height="3%" fill="none" stroke="currentColor" strokeWidth="0.3" />
            <rect x="10%" y="35%" width="1%" height="3%" fill="none" stroke="currentColor" strokeWidth="0.3" />
            <rect x="8.5%" y="45%" width="1%" height="3%" fill="none" stroke="currentColor" strokeWidth="0.3" />
            <rect x="10%" y="45%" width="1%" height="3%" fill="none" stroke="currentColor" strokeWidth="0.3" />
            
            <rect x="85%" y="20%" width="6%" height="55%" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <rect x="86%" y="30%" width="1.5%" height="4%" fill="none" stroke="currentColor" strokeWidth="0.3" />
            <rect x="88.5%" y="30%" width="1.5%" height="4%" fill="none" stroke="currentColor" strokeWidth="0.3" />
            <rect x="86%" y="45%" width="1.5%" height="4%" fill="none" stroke="currentColor" strokeWidth="0.3" />
            <rect x="88.5%" y="45%" width="1.5%" height="4%" fill="none" stroke="currentColor" strokeWidth="0.3" />
          </g>
          
          {/* Plantas técnicas e linhas de construção */}
          <g className="text-white/12">
            <line x1="15%" y1="15%" x2="40%" y2="15%" strokeWidth="0.5" stroke="currentColor" strokeDasharray="3,2" />
            <line x1="15%" y1="18%" x2="35%" y2="18%" strokeWidth="0.3" stroke="currentColor" strokeDasharray="2,2" />
            <circle cx="45%" cy="16.5%" r="1.5" fill="none" stroke="currentColor" strokeWidth="0.3" />
            
            <line x1="60%" y1="85%" x2="85%" y2="85%" strokeWidth="0.5" stroke="currentColor" strokeDasharray="3,2" />
            <line x1="65%" y1="88%" x2="80%" y2="88%" strokeWidth="0.3" stroke="currentColor" strokeDasharray="2,2" />
            <rect x="70%" y="82%" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="0.3" />
          </g>
          
          {/* Estruturas geométricas sutis */}
          <g className="text-white/10">
            <polygon points="150,100 170,80 190,100 170,120" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="92%" cy="25%" r="15" fill="none" stroke="currentColor" strokeWidth="0.4" />
            
            {/* Padrão de tijolos */}
            <g transform="translate(5%, 60%)">
              <rect width="20" height="8" fill="none" stroke="currentColor" strokeWidth="0.3" />
              <rect x="10" y="8" width="20" height="8" fill="none" stroke="currentColor" strokeWidth="0.3" />
              <rect y="16" width="20" height="8" fill="none" stroke="currentColor" strokeWidth="0.3" />
            </g>
          </g>
        </svg>
      </div>
      
      <main className="flex-grow flex items-center justify-center py-12 relative z-10 px-4">
        <div className="w-full max-w-md">
          {/* Card principal com sombra aprimorada */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/30">
            <div className="p-8 md:p-10">
              {/* Header do formulário */}
              <div className="text-center mb-8">
                <h1 className="brand-text text-3xl text-residuall-green mb-2 font-montserrat font-bold tracking-wide">
                  RESIDUALL
                </h1>
                <p className="text-residuall-gray font-medium font-lato">
                  Bem-vindo de volta!
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo E-mail */}
                <div>
                  <label htmlFor="email" className="block text-sm font-montserrat font-semibold text-residuall-gray mb-2">
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
                  <label htmlFor="password" className="block text-sm font-montserrat font-semibold text-residuall-gray mb-2">
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
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-residuall-gray font-lato">
                      Lembrar-me
                    </label>
                  </div>
                  
                  <div className="text-sm">
                    <a href="#" className="text-residuall-green hover:text-residuall-green-light transition-colors font-medium font-lato">
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

                {/* Botão de login com destaque aprimorado */}
                <button 
                  type="submit"
                  disabled={isSubmitting} 
                  className="w-full bg-residuall-green-dark hover:bg-residuall-green text-white font-montserrat font-bold text-lg py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{
                    background: 'linear-gradient(135deg, #1F3127 0%, #2F4A3A 100%)',
                    boxShadow: '0 4px 15px rgba(31, 49, 39, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {isSubmitting ? 'Entrando...' : 'ACESSAR PLATAFORMA'}
                </button>
              </form>
              
              {/* Link para cadastro */}
              <div className="text-center mt-8 pt-6 border-t border-gray-100">
                <span className="text-residuall-gray font-lato">Não tem uma conta? </span>
                <Link to="/cadastro" className="text-residuall-green hover:text-residuall-green-light font-montserrat font-semibold transition-colors">
                  Cadastre-se gratuitamente
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <style>{`
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
