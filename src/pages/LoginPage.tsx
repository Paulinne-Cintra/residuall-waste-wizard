
import { useState, useEffect } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AnimatedArchitecturalBackground from '@/components/AnimatedArchitecturalBackground';

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
      {/* Animated Architectural Background */}
      <AnimatedArchitecturalBackground />
      
      <main className="flex-grow flex items-center justify-center py-12 relative z-10 px-4">
        <div className="w-full max-w-md">
          {/* Frosted Glass Card */}
          <div 
            className="rounded-3xl shadow-2xl overflow-hidden border backdrop-blur-[20px]"
            style={{
              backgroundColor: 'rgba(26, 26, 26, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="p-8 md:p-10">
              {/* Header do formulário */}
              <div className="text-center mb-8">
                <h1 className="brand-text text-3xl text-white mb-2 font-montserrat font-bold tracking-wide">
                  RESIDUALL
                </h1>
                <p className="text-gray-300 font-medium font-lato">
                  Bem-vindo de volta!
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo E-mail */}
                <div>
                  <label htmlFor="email" className="block text-sm font-montserrat font-semibold text-gray-200 mb-2">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
                    <input 
                      id="email" 
                      type="email" 
                      className={`w-full pl-11 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-residuall-green focus:border-transparent transition-all ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-white/20'}`}
                      placeholder="seu@email.com" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                    />
                  </div>
                  {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
                </div>
                
                {/* Campo Senha */}
                <div>
                  <label htmlFor="password" className="block text-sm font-montserrat font-semibold text-gray-200 mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
                    <input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      className={`w-full pl-11 pr-11 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-residuall-green focus:border-transparent transition-all ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-white/20'}`}
                      placeholder="••••••••" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                    />
                    <button 
                      type="button" 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors" 
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-2 text-sm text-red-400">{errors.password}</p>}
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
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300 font-lato">
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
                  <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3">
                    <p className="text-sm text-red-300 text-center">{errors.general}</p>
                  </div>
                )}

                {/* Botão de login com destaque aprimorado */}
                <button 
                  type="submit"
                  disabled={isSubmitting} 
                  className="w-full bg-residuall-green-dark hover:bg-residuall-green text-white font-montserrat font-bold text-lg py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{
                    background: 'linear-gradient(135deg, #1F3127 0%, #2F4A3A 100%)',
                    boxShadow: '0 4px 15px rgba(31, 49, 39, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  {isSubmitting ? 'Entrando...' : 'ACESSAR PLATAFORMA'}
                </button>
              </form>
              
              {/* Link para cadastro */}
              <div className="text-center mt-8 pt-6 border-t border-white/10">
                <span className="text-gray-300 font-lato">Não tem uma conta? </span>
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
