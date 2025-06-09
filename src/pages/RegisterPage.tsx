
import { useState, useEffect } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Building, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AnimatedArchitecturalBackground from '@/components/AnimatedArchitecturalBackground';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('RegisterPage - user:', !!user, 'authLoading:', authLoading, 'selectedPlan:', selectedPlan);

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (!authLoading && user) {
      console.log('RegisterPage - User is authenticated, redirecting...');
      // Após cadastro, sempre vai para seleção de plano
      navigate('/pagamento', { replace: true });
    }
  }, [user, authLoading, navigate]);

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
    if (isSubmitting) return;
    
    setErrors({});

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

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
      
      console.log('RegisterPage - Registration completed');
      
      // O redirecionamento será feito pelo useEffect quando o user for atualizado
    } catch (error: any) {
      console.error('RegisterPage - Registration error:', error);
      setErrors({ general: error.message || 'Erro ao criar conta. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostrar loading enquanto a autenticação está sendo verificada
  if (authLoading) {
    return (
      <>
        <AnimatedArchitecturalBackground />
        <div className="min-h-screen flex items-center justify-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
        </div>
      </>
    );
  }

  // Se já estiver autenticado, não renderizar nada (useEffect cuidará do redirect)
  if (user) {
    return null;
  }

  return (
    <>
      <AnimatedArchitecturalBackground />
      <div className="min-h-screen flex items-center justify-center py-12 px-4 relative z-10">
        <div className="w-full max-w-2xl">
          <div 
            className="rounded-xl shadow-2xl overflow-hidden border border-white/10"
            style={{
              background: 'rgba(26, 26, 26, 0.4)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          >
            <div className="p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <img 
                    src="/lovable-uploads/9488f0fd-b9a5-4e50-a2fc-3626b4d9adff.png" 
                    alt="Logo Residuall" 
                    className="h-10 w-auto" 
                  />
                  <span className="brand-text text-3xl text-white">
                    RESIDUALL
                  </span>
                </div>
                <p className="text-gray-300 font-medium">
                  {selectedPlan ? `Cadastre-se para o ${selectedPlan.name}` : 'Criar sua conta'}
                </p>
                {selectedPlan && (
                  <div className="mt-4 p-4 bg-amber-400/20 rounded-lg border border-amber-400/30">
                    <p className="text-sm text-amber-200 font-semibold">
                      Plano selecionado: {selectedPlan.name} - {selectedPlan.price === 'Grátis' ? 'Grátis' : `R$ ${selectedPlan.price}/mês`}
                    </p>
                  </div>
                )}
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-montserrat font-medium text-gray-200 mb-2">
                      Nome Completo *
                    </label>
                    <div className="relative">
                      <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        id="name" 
                        name="name"
                        type="text" 
                        className={`w-full pl-11 pr-4 py-3 bg-white/10 border ${errors.name ? 'border-red-400' : 'border-white/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-white placeholder-gray-400`}
                        placeholder="Seu nome completo" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    {errors.name && <p className="mt-2 text-sm text-red-400">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-montserrat font-medium text-gray-200 mb-2">
                      E-mail *
                    </label>
                    <div className="relative">
                      <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        id="email" 
                        name="email"
                        type="email" 
                        className={`w-full pl-11 pr-4 py-3 bg-white/10 border ${errors.email ? 'border-red-400' : 'border-white/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-white placeholder-gray-400`}
                        placeholder="seu@email.com" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-montserrat font-medium text-gray-200 mb-2">
                      Senha *
                    </label>
                    <div className="relative">
                      <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        id="password" 
                        name="password"
                        type={showPassword ? "text" : "password"} 
                        className={`w-full pl-11 pr-11 py-3 bg-white/10 border ${errors.password ? 'border-red-400' : 'border-white/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-white placeholder-gray-400`}
                        placeholder="••••••••" 
                        value={formData.password} 
                        onChange={handleInputChange} 
                      />
                      <button 
                        type="button" 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-400 transition-colors" 
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-2 text-sm text-red-400">{errors.password}</p>}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-montserrat font-medium text-gray-200 mb-2">
                      Confirmar Senha *
                    </label>
                    <div className="relative">
                      <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        id="confirmPassword" 
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"} 
                        className={`w-full pl-11 pr-11 py-3 bg-white/10 border ${errors.confirmPassword ? 'border-red-400' : 'border-white/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-white placeholder-gray-400`}
                        placeholder="••••••••" 
                        value={formData.confirmPassword} 
                        onChange={handleInputChange} 
                      />
                      <button 
                        type="button" 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-400 transition-colors" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-2 text-sm text-red-400">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-montserrat font-medium text-gray-200 mb-2">
                        Empresa *
                      </label>
                      <div className="relative">
                        <Building size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                          id="company" 
                          name="company"
                          type="text" 
                          className={`w-full pl-11 pr-4 py-3 bg-white/10 border ${errors.company ? 'border-red-400' : 'border-white/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-white placeholder-gray-400`}
                          placeholder="Nome da empresa" 
                          value={formData.company} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      {errors.company && <p className="mt-2 text-sm text-red-400">{errors.company}</p>}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-montserrat font-medium text-gray-200 mb-2">
                        Telefone *
                      </label>
                      <div className="relative">
                        <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                          id="phone" 
                          name="phone"
                          type="tel" 
                          className={`w-full pl-11 pr-4 py-3 bg-white/10 border ${errors.phone ? 'border-red-400' : 'border-white/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-white placeholder-gray-400`}
                          placeholder="(11) 99999-9999" 
                          value={formData.phone} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      {errors.phone && <p className="mt-2 text-sm text-red-400">{errors.phone}</p>}
                    </div>
                  </div>

                <div>
                  <label htmlFor="professionalRole" className="block text-sm font-montserrat font-medium text-gray-200 mb-2">
                    Função Profissional *
                  </label>
                  <select
                    id="professionalRole"
                    name="professionalRole"
                    className={`w-full px-4 py-3 bg-white/10 border ${errors.professionalRole ? 'border-red-400' : 'border-white/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-white`}
                    value={formData.professionalRole}
                    onChange={handleInputChange}
                  >
                    <option value="" className="text-gray-800">Selecione sua função</option>
                    <option value="engenheiro" className="text-gray-800">Engenheiro Civil</option>
                    <option value="arquiteto" className="text-gray-800">Arquiteto</option>
                    <option value="construtor" className="text-gray-800">Construtor</option>
                    <option value="gestor" className="text-gray-800">Gestor de Obras</option>
                    <option value="coordenador" className="text-gray-800">Coordenador</option>
                    <option value="outro" className="text-gray-800">Outro</option>
                  </select>
                  {errors.professionalRole && <p className="mt-2 text-sm text-red-400">{errors.professionalRole}</p>}
                </div>

                <div className="flex items-center">
                  <input 
                    id="accept-terms" 
                    type="checkbox" 
                    className="h-4 w-4 text-amber-400 border-white/20 rounded focus:ring-amber-400 bg-white/10" 
                    checked={acceptTerms} 
                    onChange={(e) => setAcceptTerms(e.target.checked)} 
                  />
                  <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-200">
                    Eu aceito os{' '}
                    <a href="#" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
                      termos e condições
                    </a>{' '}
                    e a{' '}
                    <a href="#" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
                      política de privacidade
                    </a>
                  </label>
                </div>
                {errors.terms && <p className="text-sm text-red-400">{errors.terms}</p>}
                
                {errors.general && (
                  <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-3">
                    <p className="text-sm text-red-300 text-center">{errors.general}</p>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isSubmitting} 
                  className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 font-montserrat font-semibold text-lg rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Criando conta...' : 'CRIAR CONTA'}
                </button>
              </form>
              
              <div className="text-center mt-8 pt-6 border-t border-white/10">
                <span className="text-gray-300">Já tem uma conta? </span>
                <Link to="/login" className="text-amber-400 hover:text-amber-300 font-montserrat font-semibold transition-colors">
                  Faça login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
