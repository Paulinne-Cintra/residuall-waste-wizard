
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
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: 'linear-gradient(135deg, #E8A87C1A 0%, #4A6C581A 100%), #F4F7F6' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-residuall-green-default"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{ background: 'linear-gradient(135deg, #E8A87C1A 0%, #4A6C581A 100%), #F4F7F6' }}>
      <div className="w-full max-w-md">
        {/* Card principal */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-10">
            {/* Header do formulário com logo */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <img 
                  src="/lovable-uploads/9488f0fd-b9a5-4e50-a2fc-3626b4d9adff.png" 
                  alt="Logo Residuall" 
                  className="h-10 w-auto" 
                />
                <span className="brand-text text-3xl text-residuall-green">
                  RESIDUALL
                </span>
              </div>
              <p className="text-gray-800 font-medium">
                Bem-vindo de volta!
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo E-mail */}
              <div>
                <label htmlFor="email" className="block text-sm font-montserrat font-medium text-gray-800 mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
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
                <label htmlFor="password" className="block text-sm font-montserrat font-medium text-gray-800 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
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
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-residuall-green transition-colors" 
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
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-800">
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
                disabled={isSubmitting} 
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed font-montserrat font-semibold text-lg py-4"
              >
                {isSubmitting ? 'Entrando...' : 'ACESSAR PLATAFORMA'}
              </button>
            </form>
            
            {/* Link para cadastro */}
            <div className="text-center mt-8 pt-6 border-t border-gray-100">
              <span className="text-gray-800">Não tem uma conta? </span>
              <Link to="/cadastro" className="text-residuall-green hover:text-residuall-green-light font-montserrat font-semibold transition-colors">
                Cadastre-se gratuitamente
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
