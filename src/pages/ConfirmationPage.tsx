
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Check } from 'lucide-react';
import Header from '../components/Header';
import { useAuth } from '@/hooks/useAuth';

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { plan, paymentMethod } = location.state || {};

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (!plan) {
      navigate('/planos');
    }
  }, [user, plan, navigate]);

  if (!plan) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden login-animated-bg">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 relative z-10 px-4 pt-20 md:pt-24">
        <div className="w-full max-w-2xl">
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
                <div className="w-8 h-8 bg-residuall-green rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  <Check size={16} />
                </div>
                <span className="ml-2 text-sm font-medium text-residuall-green">Pagamento</span>
              </div>
              <div className="w-12 h-0.5 bg-residuall-green"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-residuall-green rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  <Check size={16} />
                </div>
                <span className="ml-2 text-sm font-medium text-residuall-green">Confirmação</span>
              </div>
            </div>
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 md:p-12 text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 bg-residuall-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} className="text-residuall-green" />
              </div>
              
              {/* Success Message */}
              <h1 className="brand-text text-3xl md:text-4xl text-residuall-green mb-4">
                RESIDUALL
              </h1>
              
              <h2 className="font-montserrat font-bold text-2xl md:text-3xl text-residuall-gray mb-6">
                Parabéns, sua assinatura foi concluída com sucesso!
              </h2>
              
              <p className="text-residuall-gray mb-8 text-lg">
                Agora você tem acesso completo ao plano <strong>{plan.name}</strong> da RESIDUALL.
              </p>

              {/* Plan Details */}
              <div className="bg-residuall-gray-light rounded-2xl p-6 mb-8 text-left">
                <h3 className="font-montserrat font-semibold text-lg text-residuall-green mb-4">
                  Detalhes da Assinatura
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-residuall-gray">Plano:</span>
                    <p className="font-semibold text-residuall-green">{plan.name}</p>
                  </div>
                  <div>
                    <span className="text-residuall-gray">Valor:</span>
                    <p className="font-semibold text-residuall-green">
                      {plan.price === 'Grátis' ? 'Grátis' : `R$ ${plan.price}/mês`}
                    </p>
                  </div>
                  <div>
                    <span className="text-residuall-gray">Método de Pagamento:</span>
                    <p className="font-semibold text-residuall-green capitalize">
                      {paymentMethod === 'credit-card' ? 'Cartão de Crédito' : 
                       paymentMethod === 'pix' ? 'PIX' : 'Boleto'}
                    </p>
                  </div>
                  <div>
                    <span className="text-residuall-gray">Status:</span>
                    <p className="font-semibold text-residuall-green">Ativo</p>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 rounded-2xl p-6 mb-8 text-left">
                <h3 className="font-montserrat font-semibold text-lg text-residuall-green mb-4">
                  Próximos Passos
                </h3>
                <ul className="space-y-2 text-sm text-residuall-gray">
                  <li className="flex items-start">
                    <Check size={16} className="text-residuall-green mr-2 mt-0.5 flex-shrink-0" />
                    Acesse seu painel para começar a criar projetos
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="text-residuall-green mr-2 mt-0.5 flex-shrink-0" />
                    Configure seu perfil e dados da empresa
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="text-residuall-green mr-2 mt-0.5 flex-shrink-0" />
                    Convide membros da sua equipe
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/dashboard"
                  className="btn-primary font-montserrat font-semibold text-lg py-4 px-8 inline-flex items-center justify-center"
                >
                  Ir para o Painel
                  <ArrowRight size={20} className="ml-2" />
                </Link>
                
                <Link
                  to="/dashboard/perfil"
                  className="btn-secondary font-montserrat font-semibold text-lg py-4 px-8 inline-flex items-center justify-center"
                >
                  Configurar Perfil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConfirmationPage;
