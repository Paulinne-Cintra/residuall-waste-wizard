
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Shield, ArrowLeft, Check } from 'lucide-react';
import Header from '../components/Header';
import { useAuth } from '@/hooks/useAuth';

interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
}

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const selectedPlan = location.state?.plan as Plan;

  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cpfCnpj: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (!selectedPlan) {
      navigate('/planos');
    }
  }, [user, selectedPlan, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular processamento de pagamento
    setTimeout(() => {
      navigate('/confirmacao', { 
        state: { 
          plan: selectedPlan,
          paymentMethod 
        } 
      });
    }, 2000);
  };

  if (!selectedPlan) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden login-animated-bg">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 relative z-10 px-4 pt-20 md:pt-24">
        <div className="w-full max-w-4xl">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-residuall-green rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  <Check size={16} />
                </div>
                <span className="ml-2 text-sm font-medium text-residuall-green">Cadastro</span>
              </div>
              <div className="w-12 h-0.5 bg-residuall-green"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-residuall-orange rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-residuall-orange">Pagamento</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-semibold">
                  3
                </div>
                <span className="ml-2 text-sm font-medium text-gray-600">Confirmação</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Plan Summary */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h2 className="font-montserrat font-bold text-2xl text-residuall-green mb-6">
                Resumo do Plano
              </h2>
              
              <div className="border-2 border-residuall-green/20 rounded-2xl p-6">
                <h3 className="font-montserrat font-bold text-xl text-residuall-green mb-2">
                  {selectedPlan.name}
                </h3>
                
                <div className="flex items-baseline mb-4">
                  {selectedPlan.price === 'Grátis' ? (
                    <span className="text-3xl font-bold text-residuall-green">Grátis</span>
                  ) : (
                    <>
                      <span className="text-lg font-medium text-residuall-gray">R$</span>
                      <span className="text-3xl font-bold text-residuall-green mx-1">{selectedPlan.price}</span>
                      <span className="text-sm text-residuall-gray">/mês</span>
                    </>
                  )}
                </div>
                
                <ul className="space-y-3">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-4 h-4 bg-residuall-green/10 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <Check size={12} className="text-residuall-green" />
                      </div>
                      <span className="text-sm text-residuall-gray">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="flex items-center mb-6">
                <Link 
                  to="/planos" 
                  className="text-residuall-green hover:text-residuall-green-light transition-colors mr-4"
                >
                  <ArrowLeft size={24} />
                </Link>
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
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;
