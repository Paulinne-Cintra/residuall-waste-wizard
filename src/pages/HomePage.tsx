
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CheckCircle, BarChart, Recycle, Award, ChevronLeft, ChevronRight } from 'lucide-react';

const HomePage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      text: "A plataforma Residuall transformou a forma como gerenciamos nossos projetos. Conseguimos reduzir o desperdício de materiais em 25% no primeiro ano de uso, o que representou uma economia significativa para nossa empresa.",
      author: "João Paulo Silva",
      role: "Engenheiro Civil, Construtora Horizonte",
      initials: "JP"
    },
    {
      text: "Como arquiteta, sempre me preocupei com o impacto ambiental dos meus projetos. Com a Residuall, finalmente tenho ferramentas para quantificar e reduzir esse impacto de forma tangível.",
      author: "Carla Mendes",
      role: "Arquiteta, Studio Arquitetura",
      initials: "CM"
    },
    {
      text: "A interface intuitiva e os relatórios detalhados nos ajudaram a implementar práticas mais sustentáveis sem complicar nosso fluxo de trabalho. Recomendo para toda empresa do setor.",
      author: "Ricardo Santos",
      role: "Gestor de Projetos, EcoBuild",
      initials: "RS"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-residuall-gray-light">
      <Header />

      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="bg-residuall-gradient text-white section-padding relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rotate-45"></div>
            <div className="absolute top-32 right-20 w-16 h-16 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-white"></div>
            <div className="absolute bottom-32 right-1/3 w-24 h-24 border-2 border-white rotate-12"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="heading-xl mb-6 animate-fade-in">
              SOLUÇÕES INOVADORAS PARA UM FUTURO SUSTENTÁVEL
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto animate-fade-in opacity-90 font-lato">
              Transforme o desperdício em resultados com nossa plataforma de gestão inteligente para a construção civil.
            </p>
            <div className="animate-fade-in">
              <Link to="/cadastro" className="btn-secondary text-lg px-10 py-4">
                COMEÇAR GRATUITAMENTE
              </Link>
            </div>
          </div>
        </section>

        {/* Nosso Processo */}
        <section className="section-padding bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="heading-lg text-residuall-green mb-4">Nosso Processo em 4 Etapas</h2>
              <p className="text-refined text-residuall-gray max-w-3xl mx-auto">
                Simplificamos a gestão de resíduos para que você possa focar no que realmente importa.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: '01', icon: <Award size={40} className="text-residuall-orange" />, title: 'Registro Inteligente', description: 'Registre seus resíduos de forma rápida e intuitiva na plataforma.' },
                { step: '02', icon: <BarChart size={40} className="text-residuall-orange" />, title: 'Análise de Dados', description: 'Obtenha insights detalhados com relatórios e dashboards personalizados.' },
                { step: '03', icon: <Recycle size={40} className="text-residuall-orange" />, title: 'Otimização Contínua', description: 'Identifique oportunidades para reduzir desperdícios e otimizar processos.' },
                { step: '04', icon: <CheckCircle size={40} className="text-residuall-orange" />, title: 'Resultados Comprovados', description: 'Alcance metas de sustentabilidade e veja o impacto positivo nos seus custos.' },
              ].map((item, index) => (
                <div key={index} className="card-modern text-center relative overflow-hidden group">
                  <span className="absolute top-0 right-0 text-6xl font-bold opacity-5 text-residuall-orange group-hover:opacity-10 transition-opacity">
                    {item.step}
                  </span>
                  <div className="mb-6 relative z-10">{item.icon}</div>
                  <h3 className="text-xl font-montserrat font-semibold mb-4 text-residuall-green relative z-10">
                    {item.title}
                  </h3>
                  <p className="text-residuall-gray relative z-10 font-lato">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Depoimentos Carrossel */}
        <section className="section-padding bg-residuall-gray-light">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="heading-lg text-residuall-green mb-4">O Que Nossos Clientes Dizem</h2>
              <p className="text-refined text-residuall-gray max-w-3xl mx-auto">
                Histórias de sucesso de quem confia na Residuall para uma gestão de resíduos eficiente.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="testimonial-carousel relative">
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-card">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-residuall-green rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-white font-bold text-xl font-montserrat">
                        {testimonials[currentTestimonial].initials}
                      </span>
                    </div>
                    <blockquote className="text-xl md:text-2xl text-residuall-gray italic mb-6 font-lato leading-relaxed">
                      "{testimonials[currentTestimonial].text}"
                    </blockquote>
                    <div className="font-montserrat">
                      <p className="font-semibold text-residuall-green text-lg">
                        {testimonials[currentTestimonial].author}
                      </p>
                      <p className="text-residuall-gray">
                        {testimonials[currentTestimonial].role}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Controles do carrossel */}
                <button 
                  onClick={prevTestimonial}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-card hover:shadow-card-hover transition-all hover:scale-110"
                >
                  <ChevronLeft size={24} className="text-residuall-green" />
                </button>
                <button 
                  onClick={nextTestimonial}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-card hover:shadow-card-hover transition-all hover:scale-110"
                >
                  <ChevronRight size={24} className="text-residuall-green" />
                </button>
                
                {/* Indicadores */}
                <div className="flex justify-center mt-8 space-x-3">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        currentTestimonial === index ? 'bg-residuall-orange' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="bg-residuall-green section-padding text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="heading-lg text-white mb-6">
              Pronto para construir um futuro mais sustentável?
            </h2>
            <p className="text-xl max-w-3xl mx-auto mb-12 opacity-90 font-lato">
              Junte-se a profissionais que estão inovando com dados, economizando recursos e construindo um legado sustentável.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/cadastro" className="btn-secondary px-10 py-4 text-lg">
                COMEÇAR GRATUITAMENTE
              </Link>
              <Link to="/planos" className="btn-outline border-white text-white hover:bg-white hover:text-residuall-green px-10 py-4 text-lg">
                CONHECER PLANOS
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
