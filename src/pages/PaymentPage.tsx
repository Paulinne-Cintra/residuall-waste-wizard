import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Shield, ArrowLeft, Check, Home, Building, Building2 } from 'lucide-react';
import Header from '../components/Header';
import { ProgressSteps } from '../components/ProgressSteps';
import { useAuth } from '@/hooks/useAuth';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';

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
  const { markPaymentCompleted, selectedPlan: currentPlan } = usePaymentStatus();
  const { toast } = useToast();
  
  const selectedPlan = location.state?.plan;
  const fromDashboard = location.state?.from?.pathname?.includes('/dashboard');
  const isUpgrade = location.state?.isUpgrade || false;
  const fromProfile = location.state?.fromProfile || false;
  const message = location.state?.message;

  const [currentPlanData, setCurrentPlanData] = useState<Plan | null>(selectedPlan || null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [loading, setLoading] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
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

  // Gerar QR Code PIX quando método PIX for selecionado e há plano
  useEffect(() => {
    if (paymentMethod === 'pix' && currentPlanData && currentPlanData.price !== 'Grátis') {
      generatePixQRCode();
    }
  }, [paymentMethod, currentPlanData]);

  const generatePixQRCode = async () => {
    if (!currentPlanData || currentPlanData.price === 'Grátis') return;

    const pixKey = '73988372697';
    const amount = currentPlanData.price.replace(',', '.');
    const recipientName = 'RESIDUALL LTDA';
    const city = 'SAO PAULO';
    const transactionId = `RESIDUALL${Date.now()}`;

    // Gerar BR Code (PIX code) simplificado
    const pixPayload = generatePixPayload({
      pixKey,
      amount: parseFloat(amount),
      recipientName,
      city,
      transactionId,
      description: `Pagamento ${currentPlanData.name}`
    });

    try {
      const qrCodeUrl = await QRCode.toDataURL(pixPayload, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeDataUrl(qrCodeUrl);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o QR Code PIX.",
        variant: "destructive",
      });
    }
  };

  const generatePixPayload = ({ pixKey, amount, recipientName, city, transactionId, description }: {
    pixKey: string;
    amount: number;
    recipientName: string;
    city: string;
    transactionId: string;
    description: string;
  }) => {
    // Implementação simplificada do BR Code PIX
    const payload = [
      '00020126',
      '580014BR.GOV.BCB.PIX',
      `0136${pixKey}`,
      `52040000`,
      `5303986`,
      `5802BR`,
      `5913${recipientName}`,
      `6009${city}`,
      `62070503***`,
      '6304'
    ].join('');

    return payload;
  };

  const handlePlanSelection = (plan: Plan) => {
    setCurrentPlanData(plan);
    if (plan.price === 'Grátis') {
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
    
    const successMessage = isUpgrade 
      ? `Plano atualizado com sucesso! Aproveite sua nova assinatura ${plan.name}.`
      : `Pagamento realizado com sucesso! Bem-vindo ao ${plan.name}!`;
    
    toast({
      title: successMessage,
    });

    setTimeout(() => {
      if (fromProfile || isUpgrade) {
        navigate('/dashboard/perfil', { 
          replace: true,
          state: { 
            successMessage
          }
        });
      } else {
        navigate('/dashboard', { 
          replace: true,
          state: { 
            welcomeMessage: `Tudo pronto, ${user.user_metadata?.full_name || user.email}! Bem-vindo(a) ao seu painel.`
          }
        });
      }
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPlanData) return;
    
    setLoading(true);
    
    setTimeout(() => {
      handlePaymentCompletion(currentPlanData);
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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Header />
      
      {/* Fundo com degradê dinâmico em tons terrosos - copiado do LoginPage */}
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
      
      <main className="flex-grow flex items-center justify-center py-12 relative z-10 px-4 pt-20 md:pt-24">
        <div className="w-full max-w-6xl">
          {/* Progress Steps */}
          <ProgressSteps currentStep={currentStep} steps={steps} />

          {/* mensagens específicas para upgrade e redirecionamento */}
          {isUpgrade && (
            <div className="bg-residuall-green/10 border border-residuall-green rounded-lg p-4 mb-6 text-center">
              <p className="text-residuall-green font-medium">
                Atualize seu plano atual ({currentPlan}) para acessar mais recursos
              </p>
            </div>
          )}

          {message && (
            <div className="bg-residuall-orange/10 border border-residuall-orange rounded-lg p-4 mb-6 text-center">
              <p className="text-residuall-orange font-medium">{message}</p>
            </div>
          )}

          {!showPaymentForm ? (
            // seleção de planos
            <div>
              <div className="text-center mb-8">
                <h1 className="font-montserrat font-bold text-3xl text-residuall-green mb-4">
                  {isUpgrade ? 'Escolha seu Novo Plano' : 'Escolha seu Plano'}
                </h1>
                <p className="text-residuall-gray">
                  {isUpgrade 
                    ? 'Selecione o plano que melhor atende às suas necessidades'
                    : 'Selecione o plano ideal para suas necessidades'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => {
                  const IconComponent = plan.icon;
                  const isCurrentUserPlan = currentPlan && 
                    (currentPlan.toLowerCase() === plan.id.toLowerCase() || 
                     currentPlan.toLowerCase() === plan.name.toLowerCase().replace('plano ', ''));
                  
                  return (
                    <div 
                      key={plan.id}
                      className={`relative bg-white rounded-2xl shadow-2xl hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border-2 cursor-pointer ${
                        plan.highlighted 
                          ? 'border-residuall-orange scale-105' 
                          : isCurrentUserPlan
                          ? 'border-residuall-green/50'
                          : 'border-transparent hover:border-residuall-green/20'
                      } ${currentPlanData?.id === plan.id ? 'ring-2 ring-residuall-green' : ''}`}
                      onClick={() => !isCurrentUserPlan && handlePlanSelection(plan)}
                    >
                      {plan.highlighted && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <div className="bg-residuall-orange text-white text-center py-2 px-6 rounded-full text-sm font-montserrat font-semibold shadow-lg">
                            MAIS POPULAR
                          </div>
                        </div>
                      )}

                      {isCurrentUserPlan && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <div className="bg-residuall-green text-white text-center py-2 px-6 rounded-full text-sm font-montserrat font-semibold shadow-lg">
                            PLANO ATUAL
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
                          disabled={isCurrentUserPlan}
                          className={`block w-full text-center py-4 px-6 rounded-lg font-montserrat font-semibold transition-all duration-300 hover:scale-105 ${
                            isCurrentUserPlan
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : plan.highlighted
                              ? 'bg-residuall-orange hover:bg-residuall-orange-light text-white shadow-lg'
                              : 'bg-residuall-green hover:bg-residuall-green-light text-white shadow-lg'
                          }`}
                        >
                          {isCurrentUserPlan 
                            ? 'PLANO ATUAL' 
                            : plan.price === 'Grátis' 
                            ? 'ESCOLHER AGORA' 
                            : 'ESCOLHER PLANO'
                          }
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
                
                {currentPlanData && (
                  <div className="border-2 border-residuall-green/20 rounded-2xl p-6">
                    <h3 className="font-montserrat font-bold text-xl text-residuall-green mb-2">
                      {currentPlanData.name}
                    </h3>
                    
                    <div className="flex items-baseline mb-4">
                      {currentPlanData.price === 'Grátis' ? (
                        <span className="text-3xl font-bold text-residuall-green">Grátis</span>
                      ) : (
                        <>
                          <span className="text-lg font-medium text-residuall-gray">R$</span>
                          <span className="text-3xl font-bold text-residuall-green mx-1">{currentPlanData.price}</span>
                          <span className="text-sm text-residuall-gray">/mês</span>
                        </>
                      )}
                    </div>
                    
                    <ul className="space-y-3">
                      {currentPlanData.features.map((feature, index) => (
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

                {/* PIX QR Code */}
                {paymentMethod === 'pix' && currentPlanData && currentPlanData.price !== 'Grátis' && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                    <h4 className="font-semibold text-residuall-green mb-3">
                      Pague com PIX
                    </h4>
                    {qrCodeDataUrl ? (
                      <div className="space-y-3">
                        <img 
                          src={qrCodeDataUrl} 
                          alt="QR Code PIX" 
                          className="mx-auto w-48 h-48 border rounded"
                        />
                        <p className="text-sm text-gray-600">
                          Escaneie o QR Code com seu app bancário
                        </p>
                        <div className="bg-white p-3 rounded border">
                          <p className="text-xs text-gray-500 mb-1">Chave PIX:</p>
                          <p className="font-mono text-sm">73988372697</p>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <p className="text-xs text-gray-500 mb-1">Valor:</p>
                          <p className="font-semibold text-lg text-residuall-green">
                            R$ {currentPlanData.price}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-residuall-green mx-auto"></div>
                    )}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {paymentMethod === 'credit-card' && (
                    <>
                      {/* campos do cartão de crédito */}
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

                  {paymentMethod !== 'pix' && (
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
                  )}

                  {/* Security Message */}
                  <div className="flex items-center p-4 bg-green-50 rounded-lg">
                    <Shield size={20} className="text-residuall-green mr-3" />
                    <p className="text-sm text-residuall-gray">
                      Seus dados estão seguros. Utilizamos criptografia para proteger suas informações.
                    </p>
                  </div>

                  {/* Submit Button */}
                  {paymentMethod === 'pix' ? (
                    <button
                      type="button"
                      onClick={() => handlePaymentCompletion(currentPlanData!)}
                      className="btn-primary w-full font-montserrat font-semibold text-lg py-4 mt-6"
                    >
                      Confirmar Pagamento PIX
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed font-montserrat font-semibold text-lg py-4 mt-6"
                    >
                      {loading ? 'Processando...' : 'Finalizar Assinatura'}
                    </button>
                  )}
                </form>
              </div>
            </div>
          )}
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

export default PaymentPage;
