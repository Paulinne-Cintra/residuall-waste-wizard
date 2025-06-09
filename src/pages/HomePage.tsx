
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TestimonialCarousel from '../components/TestimonialCarousel';
import { CheckCircle, BarChart, Recycle, Award, ArrowRight, ClipboardList, Monitor, Wrench, Leaf, Building, Target } from 'lucide-react';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Construa com propósito, construa com futuro",
      subtitle: "Transforme a gestão de resíduos da construção civil com inteligência e sustentabilidade",
      image: "/lovable-uploads/a914c69a-7f63-456e-8895-a34d09333659.png"
    },
    {
      title: "Sustentabilidade que faz a diferença",
      subtitle: "Monitore, analise e otimize o desperdício de materiais em tempo real",
      image: "/lovable-uploads/e3e209f2-3395-4fc8-a27f-d932a376ff44.png"
    },
    {
      title: "Inovação para um futuro verde",
      subtitle: "Dashboards inteligentes e relatórios detalhados para decisões sustentáveis",
      image: "/lovable-uploads/bc8267d3-0115-404c-a8c1-b1dcc1b1f9b7.png"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen flex flex-col bg-residuall-gray-light">
      <Header />

      <main className="flex-grow">
        {/* --- Hero Section com Carrossel --- */}
        <section className="relative h-screen overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`carousel-slide ${index === currentSlide ? 'active' : 'inactive'}`}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url("${slide.image}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-start text-left">
                <div className={`max-w-4xl carousel-text ${index === currentSlide ? 'animate-fade-in' : ''}`}>
                  <h1 className="heading-xl text-white mb-6 uppercase" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
                    {slide.title}
                  </h1>
                  <p className="text-refined text-white/95 max-w-3xl leading-relaxed mb-8" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
                    {slide.subtitle}
                  </p>
                  <Link to="/cadastro" className="btn-secondary text-lg px-8 py-4 inline-flex items-center">
                    COMEÇAR AGORA
                    <ArrowRight className="ml-2" size={20} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
          
          {/* Dots de navegação */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="carousel-dots">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`carousel-dot ${index === currentSlide ? 'active' : 'inactive'}`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* --- Seção de Benefícios --- */}
        <section className="section-padding bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="heading-lg text-residuall-green mb-4">
                Por que escolher a RESIDUALL?
              </h2>
              <p className="text-refined text-residuall-gray max-w-3xl mx-auto">
                Nossa plataforma oferece ferramentas poderosas para transformar 
                a gestão de resíduos em uma vantagem competitiva.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card-modern card-hover-effect text-center group">
                <div className="icon-bg w-16 h-16 bg-residuall-green/10 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300">
                  <Leaf size={32} className="icon-svg text-residuall-green transition-all duration-300" />
                </div>
                <h3 className="card-title font-semibold text-xl text-residuall-green mb-4 transition-all duration-300">
                  Sustentabilidade Real
                </h3>
                <p className="text-residuall-gray leading-relaxed">
                  Monitore e reduza o impacto ambiental dos seus projetos com dados precisos e ações efetivas.
                </p>
              </div>

              <div className="card-modern card-hover-effect text-center group">
                <div className="icon-bg w-16 h-16 bg-residuall-orange/10 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300">
                  <BarChart size={32} className="icon-svg text-residuall-orange transition-all duration-300" />
                </div>
                <h3 className="card-title font-semibold text-xl text-residuall-green mb-4 transition-all duration-300">
                  Análises Inteligentes
                </h3>
                <p className="text-residuall-gray leading-relaxed">
                  Dashboards intuitivos e relatórios detalhados para decisões baseadas em dados.
                </p>
              </div>

              <div className="card-modern card-hover-effect text-center group">
                <div className="icon-bg w-16 h-16 bg-residuall-beige/20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300">
                  <Award size={32} className="icon-svg text-residuall-green transition-all duration-300" />
                </div>
                <h3 className="card-title font-semibold text-xl text-residuall-green mb-4 transition-all duration-300">
                  Economia Comprovada
                </h3>
                <p className="text-residuall-gray leading-relaxed">
                  Reduza custos operacionais e desperdícios com gestão eficiente de materiais.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* --- Seção: Como Funciona (4 Passos) --- */}
        <section className="section-padding bg-residuall-gray-light">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="heading-lg text-residuall-green mb-4">
                Comece em 4 Passos Simples
              </h2>
              <p className="text-refined text-residuall-gray max-w-3xl mx-auto">
                Transforme sua gestão de resíduos com a nossa metodologia comprovada.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { 
                  icon: ClipboardList, 
                  title: "Cadastre seu Projeto", 
                  description: "Insira as informações básicas da sua obra para iniciar o monitoramento.",
                  color: "text-residuall-green"
                },
                { 
                  icon: Monitor, 
                  title: "Registe o Desperdício", 
                  description: "Aponte os materiais e as quantidades desperdiçadas em cada etapa.",
                  color: "text-residuall-orange"
                },
                { 
                  icon: BarChart, 
                  title: "Analise os Dados", 
                  description: "Use os nossos dashboards para visualizar os pontos críticos de perda.",
                  color: "text-residuall-green"
                },
                { 
                  icon: Target, 
                  title: "Otimize e Economize", 
                  description: "Aplique as nossas recomendações para reduzir custos e aumentar a sustentabilidade.",
                  color: "text-residuall-orange"
                }
              ].map((item, index) => (
                <div key={index} className="card-modern card-hover-effect group">
                  <div className="icon-bg w-20 h-20 bg-residuall-green/10 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300">
                    <item.icon size={40} className={`icon-svg ${item.color} transition-all duration-300`} />
                  </div>
                  <h3 className="card-title font-semibold text-xl text-residuall-green mb-3 transition-all duration-300">
                    {item.title}
                  </h3>
                  <p className="text-residuall-gray leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Seção de Depoimentos --- */}
        <section className="section-padding bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="heading-lg text-residuall-green mb-4">
                O que os nossos clientes dizem
              </h2>
            </div>
            <TestimonialCarousel />
          </div>
        </section>

        {/* --- Seção CTA Final --- */}
        <section className="bg-residuall-green py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="heading-lg text-white mb-6">
              Pronto para transformar a sua gestão de resíduos?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Junte-se às empresas que já revolucionaram seus processos de construção
            </p>
            <Link to="/cadastro" className="btn-secondary bg-residuall-orange hover:bg-residuall-orange-light inline-flex items-center text-lg px-8 py-4">
              CRIAR CONTA GRÁTIS
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
