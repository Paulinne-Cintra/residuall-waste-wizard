
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Header from '../components/Header';
// import Footer from '../components/Footer'; // REMOVEMOS o Footer

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: {email?: string; password?: string} = {};
    
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
    
    // Aqui seria a integração com a API para login
    console.log('Login com:', { email, password, rememberMe });
    window.location.href = '/dashboard';
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    // Fundo gradiente com o padrão geométrico
    <div className="min-h-screen flex flex-col relative overflow-hidden
                    bg-gradient-to-br from-brand-green-dark to-brand-orange-burnt">
      {/* Camada para o padrão geométrico sutil */}
      <div className="absolute inset-0 geometric-bg z-0"></div>

      <Header />
      
      {/* Conteúdo principal centralizado, acima do padrão geométrico */}
      <main className="flex-grow flex items-center justify-center py-12 relative z-10 px-4">
        <div className="w-full max-w-md bg-neutral-white rounded-3xl shadow-sm overflow-hidden">
          <div className="p-8">
            {/* Títulos estilo Otake */}
            <p className="text-center text-sm font-semibold text-brand-orange-burnt mb-2">
                RESIDUALL Login
            </p>
            <h1 className="text-4xl font-bold text-neutral-gray-dark text-center mb-6">
                Bem-vindo(a)!
            </h1>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-neutral-gray-dark mb-2">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  // Removido 'input-field' e adicionadas classes Tailwind diretas
                  className={`w-full p-3 border border-neutral-gray-light rounded-md 
                              focus:outline-none focus:ring-1 focus:ring-brand-green-dark 
                              ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-neutral-gray-dark mb-2">
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    // Removido 'input-field' e adicionadas classes Tailwind diretas
                    className={`w-full p-3 pr-10 border border-neutral-gray-light rounded-md 
                                focus:outline-none focus:ring-1 focus:ring-brand-green-dark 
                                ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-gray-dark"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>
              
              <div className="flex items-center justify-between mb-6 text-neutral-gray-dark">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    // Ajuste a cor do checkbox para sua paleta
                    className="h-4 w-4 text-brand-green-dark border-neutral-gray-light rounded focus:ring-brand-green-dark"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm">
                    Lembre-se
                  </label>
                </div>
                
                <div className="text-sm">
                  <a href="#" className="text-neutral-gray-dark hover:text-brand-orange-burnt transition-colors">
                    Esqueceu a senha?
                  </a>
                </div>
              </div>
              
              <button
                type="submit"
                // Ajuste a cor do botão principal
                className="w-full bg-brand-green-dark hover:bg-neutral-gray-dark text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Acessar
              </button>
            </form>
            
            <div className="text-center mt-6">
              <span className="text-neutral-gray-dark">Não tem uma conta?</span>{" "}
              <Link to="/cadastro" className="text-brand-orange-burnt hover:text-brand-green-dark font-semibold transition-colors">
                Cadastrar-se
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      {/* REMOVEMOS O FOOTER AQUI */}
      {/* <Footer /> */}
    </div>
  );
};

export default LoginPage;
