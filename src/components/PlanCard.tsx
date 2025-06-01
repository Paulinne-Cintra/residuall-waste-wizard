
import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface PlanCardProps {
  title: string;
  price: string;
  period?: string;
  features: string[];
  buttonText: string;
  highlighted?: boolean;
  image: ReactNode;
}

const PlanCard = ({
  title,
  price,
  period = '/mês',
  features,
  buttonText,
  highlighted = false,
  image
}: PlanCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlanSelection = () => {
    const planData = {
      id: title.toLowerCase().replace(/\s+/g, '-'),
      name: title,
      price: price,
      features: features
    };

    if (user) {
      // Se já estiver logado, vai direto para pagamento
      navigate('/pagamento', { state: { plan: planData } });
    } else {
      // Se não estiver logado, vai para cadastro
      navigate('/cadastro', { state: { plan: planData } });
    }
  };

  return (
    <div 
      className={`relative bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border-2 ${
        highlighted 
          ? 'border-residuall-orange scale-105' 
          : 'border-transparent hover:border-residuall-green/20'
      }`}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-residuall-orange text-white text-center py-2 px-6 rounded-full text-sm font-montserrat font-semibold shadow-lg">
            MAIS POPULAR
          </div>
        </div>
      )}
      
      <div className="p-8">
        <div className="flex justify-center items-center h-24 mb-6">
          {image}
        </div>
        
        <h3 className="font-montserrat font-bold text-2xl text-center text-residuall-green mb-2">
          {title}
        </h3>
        
        <div className="text-center mb-8">
          <div className="flex items-baseline justify-center">
            {price === 'Grátis' ? (
              <span className="text-4xl font-bold text-residuall-green">Grátis</span>
            ) : (
              <>
                <span className="text-lg font-medium text-residuall-gray">R$</span>
                <span className="text-4xl font-bold text-residuall-green mx-1">{price}</span>
                <span className="text-sm text-residuall-gray">{period}</span>
              </>
            )}
          </div>
        </div>
        
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="w-5 h-5 bg-residuall-green/10 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <Check size={14} className="text-residuall-green" />
              </div>
              <span className="text-sm text-residuall-gray leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
        
        <button
          onClick={handlePlanSelection}
          className={`block w-full text-center py-4 px-6 rounded-lg font-montserrat font-semibold transition-all duration-300 hover:scale-105 ${
            highlighted
              ? 'bg-residuall-orange hover:bg-residuall-orange-light text-white shadow-lg'
              : 'bg-residuall-green hover:bg-residuall-green-light text-white shadow-lg'
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default PlanCard;
