
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
      className={`card-modern relative overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
        highlighted 
          ? 'border-residuall-orange shadow-lg' 
          : 'border-transparent'
      }`}
    >
      {highlighted && (
        <div className="absolute top-0 left-0 right-0 bg-residuall-orange text-white text-center py-2 text-sm font-montserrat font-semibold">
          RECOMENDADO
        </div>
      )}
      
      <div className={`${highlighted ? 'pt-10' : 'pt-6'}`}>
        <div className="flex justify-center items-center h-32 mb-6">
          {image}
        </div>
        
        <h3 className="text-2xl font-montserrat font-bold text-center mb-4 text-residuall-green">{title}</h3>
        
        <div className="text-center mb-8">
          <div className="flex items-center justify-center">
            {price === 'Grátis' ? (
              <span className="text-3xl font-montserrat font-bold text-residuall-green">Grátis</span>
            ) : (
              <>
                <span className="text-lg font-montserrat font-medium text-residuall-gray">R$</span>
                <span className="text-4xl font-montserrat font-bold text-residuall-green mx-1">{price}</span>
                <span className="text-sm text-residuall-gray font-lato">{period}</span>
              </>
            )}
          </div>
        </div>
        
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check size={20} className="text-residuall-green shrink-0 mt-0.5 mr-3" />
              <span className="text-sm text-residuall-gray font-lato leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Link
          to="/cadastro" 
          className={`block w-full text-center py-3 px-4 rounded-lg transition-all duration-300 font-montserrat font-semibold hover:scale-105 ${
            highlighted
              ? 'bg-residuall-orange hover:bg-residuall-orange-light text-white shadow-residuall hover:shadow-residuall-hover'
              : 'bg-residuall-green hover:bg-residuall-green-secondary text-white shadow-residuall hover:shadow-residuall-hover'
          }`}
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

export default PlanCard;
