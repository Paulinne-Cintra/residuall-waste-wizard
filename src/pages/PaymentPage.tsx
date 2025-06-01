
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Shield, ArrowLeft, Check, Home, Building, Building2 } from 'lucide-react';
import Header from '../components/Header';
import { ProgressSteps } from '../components/ProgressSteps';
import { useAuth } from '@/hooks/useAuth';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';
import { useToast } from '@/hooks/use-toast';

interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
  icon: any;
  highlighted?: boolean;
}

const plans: Plan[] = [
  {
    id: 'basico',
    name: 'Plano Básico',
    price: 'Grátis',
    features: [
      'Cadastro limitado de projetos',
      'Cadastro manual de informações',
      'Relatórios básicos de materiais',
      'Sugestões de reaproveitamento',
      'Suporte por email'
    ],
    icon: Home
  },
  {
    id: 'profissional',
    name: 'Plano Profissional',
    price: '49,90',
    features: [
      'Cadastro ilimitado de projetos',
      'Relatórios personalizados e exportáveis',
      'Dashboard avançado com análises',
      'Equipe com múltiplos acessos (até 5)',
      'Integração com ferramentas externas',
      'Suporte prioritário'
    ],
    icon: Building,
    highlighted: true
  },
  {
    id: 'empresarial',
    name: 'Plano Empresarial',
    price: '99,90',
    features: [
      'Recursos do Plano Profissional',
      'Usuários ilimitados na equipe',
      'Permissões personalizadas por perfil',
      'Relatórios avançados e automatizados',
      'API para integrações customizadas',
      'Consultoria especializada inclusa',
      'Suporte 24/7'
    ],
    icon: Building2
  }
];

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { markPaymentCompleted } = usePaymentStatus();
  const { toast } = useToast();
  
  const selectedPlan = location.state?.plan;
  const fromDashboard = location.state?.from?.pathname?.includes('/dashboard');
  const message = location.state?.message;

  const [currentPlan, setCurrentPlan] = useState<Plan | null>(selectedPlan || null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cpfCnpj: ''
  });

  const steps = ['Cadastro', 'Escolha do Plano', 'Pagamento', 'Acesso Liberado'];
  const currentStep = showPaymentForm ? 3 : 2;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const handlePlanSelection = (plan: Plan) => {
    setCurrentPlan(plan);
    if (plan.price === 'Grátis') {
      // Para plano gratuito, simular conclusão imediata
      handlePaymentCompletion(plan);
    } else {
      setShowPaymentForm(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentCompletion = (plan: Plan) => {
    if (!user) return;

    markPaymentCompleted(plan.id);
    
    toast({
      title: "Pagamento realizado com sucesso!",
      description: `Bem-vindo ao ${plan.name}!`,
    });

    // Redirecionar para o dashboard com mensagem de boas-vindas
    setTimeout(() => {
      navigate('/dashboard', { 
        replace: true,
        state: { 
          welcomeMessage: `Tudo pronto, ${user.user_metadata?.full_name || user.email}! Bem-vindo(a) ao seu painel.`
        }
      });
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPlan) return;
    
    setLoading(true);
    
    // Simular processamento de pagamento
    setTimeout(() => {
      handlePaymentCompletion(currentPlan);
    }, 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-residuall-green-default"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden login-animated-bg">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 relative z-10 px-4 pt-20 md:pt-24">
        <div className="w-full max-w-6xl">
          {/* Progress Steps */}
          <ProgressSteps currentStep={currentStep} steps={steps} />

          {/* Mensagem de redirecionamento se veio do dashboard */}
          {message && (
            <div className="bg-residuall-orange/10 border border-residuall-orange rounded-lg p-4 mb-6 text-center">
              <p className="text-residuall-orange font-medium">{message}</p>
            </div>
          )}

          {!showPaymentForm ? (
            // Seleção de Planos
            <div>
              <div className="text-center mb-8">
                <h1 className="font-montserrat font-bold text-3xl text-residuall-green mb-4">
                  Escolha seu Plano
                </h1>
                <p className="text-residuall-gray">
                  Selecione o plano ideal para suas necessidades
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => {
                  const IconComponent = plan.icon;
                  return (
                    <div 
                      key={plan.id}
                      className={`relative bg-white rounded-2xl shadow-2xl hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border-2 cursor-pointer ${
                        plan.highlighted 
                          ? 'border-residuall-orange scale-105' 
                          : 'border-transparent hover:border-residuall-green/20'
                      } ${currentPlan?.id === plan.id ? 'ring-2 ring-residuall-green' : ''}`}
                      onClick={() => handlePlanSelection(plan)}
                    >
                      {plan.highlighted && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <div className="bg-residuall-orange text-white text-center py-2 px-6 rounded-full text-sm font-montserrat font-semibold shadow-lg">
                            MAIS POPULAR
                          </div>
                        </div>
                      )}
                      
                      <div className="p-8">
                        <div className="flex justify-center items-center h-24 mb-6">
                          <IconComponent size={64} className={plan.highlighted ? "text-residuall-orange" : "text-residuall-green"} />
                        </div>
                        
                        <h3 className="font-montserrat font-bold text-2xl text-center text-residuall-green mb-2">
                          {plan.name}
                        </h3>
                        
                        <div className="text-center mb-8">
                          <div className="flex items-baseline justify-center">
                            {plan.price === 'Grátis' ? (
                              <span className="text-4xl font-bold text-residuall-green">Grátis</span>
                            ) : (
                              <>
                                <span className="text-lg font-medium text-residuall-gray">R$</span>
                                <span className="text-4xl font-bold text-residuall-green mx-1">{plan.price}</span>
                                <span className="text-sm text-residuall-gray">/mês</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <ul className="space-y-4 mb-8">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-5 h-5 bg-residuall-green/10 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                <Check size={14} className="text-residuall-green" />
                              </div>
                              <span className="text-sm text-residuall-gray leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <button
                          className={`block w-full text-center py-4 px-6 rounded-lg font-montserrat font-semibold transition-all duration-300 hover:scale-105 ${
                            plan.highlighted
                              ? 'bg-residuall-orange hover:bg-residuall-orange-light text-white shadow-lg'
                              : 'bg-residuall-green hover:bg-residuall-green-light text-white shadow-lg'
                          }`}
                        >
                          {plan.price === 'Grátis' ? 'COMEÇAR AGORA' : 'ESCOLHER PLANO'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // Formulário de Pagamento
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Plan Summary */}
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <h2 className="font-montserrat font-bold text-2xl text-residuall-green mb-6">
                  Resumo do Plano
                </h2>
                
                {currentPlan && (
                  <div className="border-2 border-residuall-green/20 rounded-2xl p-6">
                    <h3 className="font-montserrat font-bold text-xl text-residuall-green mb-2">
                      {currentPlan.name}
                    </h3>
                    
                    <div className="flex items-baseline mb-4">
                      {currentPlan.price === 'Grátis' ? (
                        <span className="text-3xl font-bold text-residuall-green">Grátis</span>
                      ) : (
                        <>
                          <span className="text-lg font-medium text-residuall-gray">R$</span>
                          <span className="text-3xl font-bold text-residuall-green mx-1">{currentPlan.price}</span>
                          <span className="text-sm text-residuall-gray">/mês</span>
                        </>
                      )}
                    </div>
                    
                    <ul className="space-y-3">
                      {currentPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-4 h-4 bg-residuall-green/10 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <Check size={12} className="text-residuall-green" />
                          </div>
                          <span className="text-sm text-residuall-gray">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Payment Form */}
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <div className="flex items-center mb-6">
                  <button 
                    onClick={() => setShowPaymentForm(false)}
                    className="text-residuall-green hover:text-residuall-green-light transition-colors mr-4"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <h2 className="font-montserrat font-bold text-2xl text-residuall-green">
                    Finalizar Pagamento
                  </h2>
                </div>

                {/* Payment Methods */}
                <div className="mb-6">
                  <h3 className="font-montserrat font-semibold text-lg text-residuall-gray mb-4">
                    Método de Pagamento
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setPaymentMethod('credit-card')}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        paymentMethod === 'credit-card'
                          ? 'border-residuall-green bg-residuall-green/10'
                          : 'border-gray-200 hover:border-residuall-green/50'
                      }`}
                    >
                      <CreditCard size={20} className="mx-auto mb-1" />
                      <span className="text-xs font-medium">Cartão</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('pix')}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        paymentMethod === 'pix'
                          ? 'border-residuall-green bg-residuall-green/10'
                          : 'border-gray-200 hover:border-residuall-green/50'
                      }`}
                    >
                      <span className="text-sm font-bold">PIX</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('boleto')}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        paymentMethod === 'boleto'
                          ? 'border-residuall-green bg-residuall-green/10'
                          : 'border-gray-200 hover:border-residuall-green/50'
                      }`}
                    >
                      <span className="text-xs font-medium">Boleto</span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {paymentMethod === 'credit-card' && (
                    <>
                      <div>
                        <label className="block text-sm font-montserrat font-medium text-residuall-gray mb-2">
                          Nome no Cartão
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className="input-modern"
                          placeholder="Como está escrito no cartão"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-montserrat font-medium text-residuall-gray mb-2">
                          Número do Cartão
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="input-modern"
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-montserrat font-medium text-residuall-gray mb-2">
                            Validade
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            className="input-modern"
                            placeholder="MM/AA"
                            maxLength={5}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-montserrat font-medium text-residuall-gray mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className="input-modern"
                            placeholder="123"
                            maxLength={4}
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-montserrat font-medium text-residuall-gray mb-2">
                      CPF ou CNPJ
                    </label>
                    <input
                      type="text"
                      name="cpfCnpj"
                      value={formData.cpfCnpj}
                      onChange={handleInputChange}
                      className="input-modern"
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>

                  {/* Security Message */}
                  <div className="flex items-center p-4 bg-green-50 rounded-lg">
                    <Shield size={20} className="text-residuall-green mr-3" />
                    <p className="text-sm text-residuall-gray">
                      Seus dados estão seguros. Utilizamos criptografia para proteger suas informações.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed font-montserrat font-semibold text-lg py-4 mt-6"
                  >
                    {loading ? 'Processando...' : 'Finalizar Assinatura'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;
