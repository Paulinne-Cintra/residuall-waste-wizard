
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
    } = {};
    
    if (!name) {
      newErrors.name = 'O nome completo é obrigatório';
    }
    
    if (!email) {
      newErrors.email = 'O e-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Por favor, insira um e-mail válido';
    }
    
    if (!password) {
      newErrors.password = 'A senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'A confirmação de senha é obrigatória';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    if (!acceptTerms) {
      newErrors.terms = 'Você deve aceitar os termos de uso';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    console.log('Cadastro com:', { name, email, password });
    window.location.href = '/dashboard';
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden login-animated-bg">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 relative z-10 px-4 pt-20 md:pt-24">
        <div className="w-full max-w-lg">
          {/* Card principal */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
            <div className="p-8 md:p-10">
              {/* Header do formulário */}
              <div className="text-center mb-8">
                <h1 className="brand-text text-3xl text-residuall-green mb-2">
                  RESIDUALL
                </h1>
                <p className="text-residuall-gray font-medium">
                  Crie sua conta e comece gratuitamente
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo Nome */}
                <div>
                  <label htmlFor="name" className="block text-sm font-montserrat font-medium text-residuall-gray mb-2">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-residuall-gray" />
                    <input
                      id="name"
                      type="text"
                      className={`input-modern pl-11 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Seu nome completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
                </div>

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
                      onChange={(e) => setEmail(e.target.value)}
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
                      onChange={(e) => setPassword(e.target.value)}
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
                
                {/* Campo Confirmar Senha */}
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-montserrat font-medium text-residuall-gray mb-2">
                    Confirme a Senha
                  </label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-residuall-gray" />
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      className={`input-modern pl-11 pr-11 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-residuall-gray hover:text-residuall-green transition-colors"
                      onClick={toggleShowConfirmPassword}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-2 text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>

                {/* Termos de uso */}
                <div>
                  <div className="flex items-start">
                    <input 
                      id="accept-terms" 
                      type="checkbox" 
                      className="h-4 w-4 text-residuall-green border-gray-300 rounded focus:ring-residuall-green transition-colors mt-1" 
                      checked={acceptTerms} 
                      onChange={() => setAcceptTerms(!acceptTerms)} 
                    />
                    <label htmlFor="accept-terms" className="ml-3 block text-sm text-residuall-gray leading-relaxed">
                      Eu aceito os{' '}
                      <a href="#" className="text-residuall-green hover:text-residuall-green-light font-medium">
                        termos de uso
                      </a>{' '}
                      e{' '}
                      <a href="#" className="text-residuall-green hover:text-residuall-green-light font-medium">
                        política de privacidade
                      </a>
                    </label>
                  </div>
                  {errors.terms && <p className="mt-2 text-sm text-red-500">{errors.terms}</p>}
                </div>
                
                {/* Botão de cadastro */}
                <button
                  type="submit"
                  className="btn-primary w-full font-montserrat font-semibold text-lg py-4"
                >
                  CRIAR CONTA GRÁTIS
                </button>
              </form>
              
              {/* Link para login */}
              <div className="text-center mt-8 pt-6 border-t border-gray-100">
                <span className="text-residuall-gray">Já tem uma conta? </span>
                <Link to="/login" className="text-residuall-green hover:text-residuall-green-light font-montserrat font-semibold transition-colors">
                  Fazer login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RegisterPage;
