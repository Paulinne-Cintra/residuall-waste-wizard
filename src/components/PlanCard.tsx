
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

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
  return (
    <div 
      className={`bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 border-2 ${
        highlighted 
          ? 'border-residuall-brown relative' 
          : 'border-transparent'
      }`}
    >
      {highlighted && (
        <div className="absolute top-0 left-0 right-0 bg-residuall-brown text-white text-center py-1 text-sm font-medium">
          RECOMENDADO
        </div>
      )}
      
      <div className="p-6 pt-8">
        <div className="flex justify-center items-center h-32 mb-6">
          {image}
        </div>
        
        <h3 className="text-xl font-bold text-center mb-2">{title}</h3>
        
        <div className="text-center mb-6">
          <div className="flex items-center justify-center">
            {price === 'Grátis' ? (
              <span className="text-3xl font-bold text-residuall-green">Grátis</span>
            ) : (
              <>
                <span className="text-lg font-medium">R$</span>
                <span className="text-3xl font-bold text-residuall-green mx-1">{price}</span>
                <span className="text-sm text-residuall-gray">{period}</span>
              </>
            )}
          </div>
        </div>
        
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check size={20} className="text-residuall-green shrink-0 mt-0.5 mr-2" />
              <span className="text-sm text-residuall-gray-dark">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Link
          to="/cadastro" 
          className={`block w-full text-center py-3 px-4 rounded-lg transition-colors ${
            highlighted
              ? 'bg-residuall-brown hover:bg-residuall-brown-light text-white'
              : 'bg-residuall-green hover:bg-residuall-green-light text-white'
          }`}
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

export default PlanCard;
