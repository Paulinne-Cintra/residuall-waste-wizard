
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ana Silva",
    role: "Arquiteta",
    company: "Studio Sustentável",
    content: "A Residuall transformou completamente nossa abordagem de gestão de resíduos. Conseguimos reduzir 40% do desperdício e aumentar nossa margem de lucro significativamente.",
    rating: 5
  },
  {
    id: 2,
    name: "Carlos Mendes",
    role: "Engenheiro Civil",
    company: "Construtora Verde",
    content: "Uma plataforma intuitiva e poderosa. Os relatórios são detalhados e nos ajudam a tomar decisões mais assertivas sobre sustentabilidade.",
    rating: 5
  },
  {
    id: 3,
    name: "Marina Costa",
    role: "Gestora de Projetos",
    company: "EcoBuild",
    content: "O que mais me impressiona é a facilidade de uso e a precisão dos dados. Recomendo para qualquer empresa que valoriza sustentabilidade e eficiência.",
    rating: 5
  }
];

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div 
      className="testimonial-carousel max-w-4xl mx-auto"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="relative bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-500 p-8 md:p-12">
        {/* Stars */}
        <div className="flex justify-center mb-6">
          {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
            <Star key={i} size={20} className="text-residuall-orange fill-current" />
          ))}
        </div>

        {/* Content */}
        <div className="text-center">
          <p className="text-refined text-residuall-gray mb-8 italic text-xl leading-relaxed">
            "{testimonials[currentIndex].content}"
          </p>
          
          <div className="space-y-2">
            <h4 className="font-montserrat font-semibold text-lg text-residuall-green">
              {testimonials[currentIndex].name}
            </h4>
            <p className="text-residuall-gray text-sm">
              {testimonials[currentIndex].role} • {testimonials[currentIndex].company}
            </p>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevTestimonial}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-residuall-green text-white p-2 rounded-full hover:bg-residuall-green-light transition-all duration-300 hover:scale-110"
          aria-label="Depoimento anterior"
        >
          <ChevronLeft size={20} />
        </button>
        
        <button
          onClick={nextTestimonial}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-residuall-green text-white p-2 rounded-full hover:bg-residuall-green-light transition-all duration-300 hover:scale-110"
          aria-label="Próximo depoimento"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToTestimonial(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-residuall-green scale-125' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Ir para depoimento ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;
