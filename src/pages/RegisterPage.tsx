
import { useState, useEffect } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Building, Phone } from 'lucide-react';
import Header from '../components/Header';
import { useAuth } from '@/hooks/useAuth';

const RegisterPage = () => {
  const { signUp, user, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPlan = location.state?.plan;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    phone: '',
    professionalRole: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  console.log('RegisterPage - user:', !!user, 'authLoading:', authLoading);

  // Redirecionar se já estiver logado
  if (!authLoading && user) {
    if (selectedPlan) {
      console.log('RegisterPage - redirecting to payment with plan:', selectedPlan);
      return <Navigate to="/pagamento" state={{ plan: selectedPlan }} replace />;
    } else {
      console.log('RegisterPage - redirecting to dashboard');
      return <Navigate to="/dashboard" replace />;
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro específico quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome completo é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não conferem';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Nome da empresa é obrigatório';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    if (!formData.professionalRole) {
      newErrors.professionalRole = 'Função profissional é obrigatória';
    }

    if (!acceptTerms) {
      newErrors.terms = 'É necessário aceitar os termos e condições';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      console.log('RegisterPage - Starting registration process...');
      await signUp(
        formData.email, 
        formData.password, 
        {
          full_name: formData.name,
          company_name: formData.company,
          phone_number: formData.phone,
          professional_role: formData.professionalRole
        }
      );
      
      console.log('RegisterPage - Registration successful, checking plan...');
      
      // Após cadastro bem-sucedido, redirecionar baseado no plano
      if (selectedPlan) {
        console.log('RegisterPage - Redirecting to payment with plan:', selectedPlan);
        navigate('/pagamento', { state: { plan: selectedPlan } });
      } else {
        console.log('RegisterPage - No plan selected, redirecting to dashboard');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('RegisterPage - Registration error:', error);
      setErrors({ general: error.message || 'Erro ao criar conta. Tente novamente.' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden login-animated-bg">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 relative z-10 px-4 pt-20 md:pt-24">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
            <div className="p-8 md:p-10">
              <div className="text-center mb-8">
                <h1 className="brand-text text-3xl text-residuall-green mb-2">
                  RESIDUALL
                </h1>
                <p className="text-residuall-gray font-medium">
                  {selectedPlan ? `Cadastre-se para o ${selectedPlan.name}` : 'Criar sua conta'}
                </p>
                {selectedPlan && (
                  <div className="mt-4 p-4 bg-residuall-green/10 rounded-lg">
                    <p className="text-sm text-residuall-green font-semibold">
                      Plano selecionado: {selectedPlan.name} - {selectedPlan.price === 'Grátis' ? 'Grátis' : `R$ ${selectedPlan.price}/mês`}
                    </p>
                  </div>
                )}
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-montserrat font-medium text-residuall-gray mb-2">
                      Nome Completo *
                    </label>
                    <div className="relative">
                      <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-residuall-gray" />
                      <input 
                        id="name" 
                        name="name"
                        type="text" 
                        className={`input-modern pl-11 ${errors.name ? 'border-red-500' : ''}`}
                        placeholder="Seu nome completo" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-montserrat font-medium text-residuall-gray mb-2">
                      E-mail *
                    </label>
                    <div className="relative">
                      <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-residuall-gray" />
                      <input 
                        id="email" 
                        name="email"
                        type="email" 
                        className={`input-modern pl-11 ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="seu@email.com" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-montserrat font-medium text-residuall-gray mb-2">
                      Senha *
                    </label>
                    <div className="relative">
                      <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-residuall-gray" />
                      <input 
                        id="password" 
                        name="password"
                        type={showPassword ? "text" : "password"} 
                        className={`input-modern pl-11 pr-11 ${errors.password ? 'border-red-500' : ''}`}
                        placeholder="••••••••" 
                        value={formData.password} 
                        onChange={handleInputChange} 
                      />
                      <button 
                        type="button" 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-residuall-gray hover:text-residuall-green transition-colors" 
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password}</p>}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-montserrat font-medium text-residuall-gray mb-2">
                      Confirmar Senha *
                    </label>
                    <div className="relative">
                      <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-residuall-gray" />
                      <input 
                        id="confirmPassword" 
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"} 
                        className={`input-modern pl-11 pr-11 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                        placeholder="••••••••" 
                        value={formData.confirmPassword} 
                        onChange={handleInputChange} 
                      />
                      <button 
                        type="button" 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-residuall-gray hover:text-residuall-green transition-colors" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-2 text-sm text-red-500">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-montserrat font-medium text-residuall-gray mb-2">
                      Empresa *
                    </label>
                    <div className="relative">
                      <Building size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-residuall-gray" />
                      <input 
                        id="company" 
                        name="company"
                        type="text" 
                        className={`input-modern pl-11 ${errors.company ? 'border-red-500' : ''}`}
                        placeholder="Nome da empresa" 
                        value={formData.company} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    {errors.company && <p className="mt-2 text-sm text-red-500">{errors.company}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-montserrat font-medium text-residuall-gray mb-2">
                      Telefone *
                    </label>
                    <div className="relative">
                      <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-residuall-gray" />
                      <input 
                        id="phone" 
                        name="phone"
                        type="tel" 
                        className={`input-modern pl-11 ${errors.phone ? 'border-red-500' : ''}`}
                        placeholder="(11) 99999-9999" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    {errors.phone && <p className="mt-2 text-sm text-red-500">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="professionalRole" className="block text-sm font-montserrat font-medium text-residuall-gray mb-2">
                    Função Profissional *
                  </label>
                  <select
                    id="professionalRole"
                    name="professionalRole"
                    className={`input-modern ${errors.professionalRole ? 'border-red-500' : ''}`}
                    value={formData.professionalRole}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione sua função</option>
                    <option value="engenheiro">Engenheiro Civil</option>
                    <option value="arquiteto">Arquiteto</option>
                    <option value="construtor">Construtor</option>
                    <option value="gestor">Gestor de Obras</option>
                    <option value="coordenador">Coordenador</option>
                    <option value="outro">Outro</option>
                  </select>
                  {errors.professionalRole && <p className="mt-2 text-sm text-red-500">{errors.professionalRole}</p>}
                </div>

                <div className="flex items-center">
                  <input 
                    id="accept-terms" 
                    type="checkbox" 
                    className="h-4 w-4 text-residuall-green border-gray-300 rounded focus:ring-residuall-green transition-colors" 
                    checked={acceptTerms} 
                    onChange={(e) => setAcceptTerms(e.target.checked)} 
                  />
                  <label htmlFor="accept-terms" className="ml-2 block text-sm text-residuall-gray">
                    Eu aceito os{' '}
                    <a href="#" className="text-residuall-green hover:text-residuall-green-light transition-colors font-medium">
                      termos e condições
                    </a>{' '}
                    e a{' '}
                    <a href="#" className="text-residuall-green hover:text-residuall-green-light transition-colors font-medium">
                      política de privacidade
                    </a>
                  </label>
                </div>
                {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}
                
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600 text-center">{errors.general}</p>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={authLoading} 
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed font-montserrat font-semibold text-lg py-4"
                >
                  {authLoading ? 'Criando conta...' : 'CRIAR CONTA'}
                </button>
              </form>
              
              <div className="text-center mt-8 pt-6 border-t border-gray-100">
                <span className="text-residuall-gray">Já tem uma conta? </span>
                <Link to="/login" className="text-residuall-green hover:text-residuall-green-light font-montserrat font-semibold transition-colors">
                  Faça login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
