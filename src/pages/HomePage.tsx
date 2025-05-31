
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TestimonialCarousel from '../components/TestimonialCarousel';
import { CheckCircle, BarChart, Recycle, Award, ArrowRight } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-residuall-gray-light">
      <Header />

      <main className="flex-grow pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="relative bg-hero-gradient text-white py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h1 className="heading-xl text-white mb-6 animate-fade-in">
              TRANSFORME RESÍDUOS EM{' '}
              <span className="text-residuall-beige">RESULTADOS</span>
            </h1>
            <p className="text-refined text-white/90 max-w-3xl mx-auto mb-8 animate-fade-in">
              Plataforma inteligente para gestão sustentável de resíduos na construção civil. 
              Reduza desperdícios, economize recursos e construa um futuro mais verde.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link to="/cadastro" className="btn-secondary">
                COMEÇAR GRATUITAMENTE
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <Link to="/planos" className="btn-outline border-white text-white hover:bg-white hover:text-residuall-green">
                CONHECER PLANOS
              </Link>
            </div>
          </div>
        </section>

        {/* Benefícios */}
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
              <div className="card-modern text-center">
                <div className="w-16 h-16 bg-residuall-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Recycle size={32} className="text-residuall-green" />
                </div>
                <h3 className="font-montserrat font-semibold text-xl text-residuall-green mb-4">
                  Sustentabilidade Real
                </h3>
                <p className="text-residuall-gray leading-relaxed">
                  Monitore e reduza o impacto ambiental dos seus projetos com dados precisos e ações efetivas.
                </p>
              </div>

              <div className="card-modern text-center">
                <div className="w-16 h-16 bg-residuall-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart size={32} className="text-residuall-orange" />
                </div>
                <h3 className="font-montserrat font-semibold text-xl text-residuall-green mb-4">
                  Análises Inteligentes
                </h3>
                <p className="text-residuall-gray leading-relaxed">
                  Dashboards intuitivos e relatórios detalhados para decisões baseadas em dados.
                </p>
              </div>

              <div className="card-modern text-center">
                <div className="w-16 h-16 bg-residuall-beige/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award size={32} className="text-residuall-green" />
                </div>
                <h3 className="font-montserrat font-semibold text-xl text-residuall-green mb-4">
                  Economia Comprovada
                </h3>
                <p className="text-residuall-gray leading-relaxed">
                  Reduza custos operacionais e desperdícios com gestão eficiente de materiais.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Como Funciona */}
        <section className="section-padding bg-residuall-gray-light">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="heading-lg text-residuall-green mb-4">
                Como funciona em 4 passos simples
              </h2>
              <p className="text-refined text-residuall-gray max-w-3xl mx-auto">
                Transforme sua gestão de resíduos com nossa metodologia comprovada.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Cadastre seu Projeto",
                  description: "Registre informações básicas do seu projeto de construção na plataforma."
                },
                {
                  step: "02", 
                  title: "Monitore Materiais",
                  description: "Acompanhe o uso e desperdício de materiais em tempo real."
                },
                {
                  step: "03",
                  title: "Analise Resultados", 
                  description: "Visualize dados e insights através de dashboards intuitivos."
                },
                {
                  step: "04",
                  title: "Otimize Processos",
                  description: "Implemente melhorias baseadas nas recomendações da plataforma."
                }
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300">
                    <div className="w-12 h-12 bg-residuall-orange text-white rounded-full flex items-center justify-center font-montserrat font-bold text-lg mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-montserrat font-semibold text-lg text-residuall-green mb-3">
                      {item.title}
                    </h3>
                    <p className="text-residuall-gray leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight size={24} className="text-residuall-orange" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section className="section-padding bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="heading-lg text-residuall-green mb-4">
                O que nossos clientes dizem
              </h2>
              <p className="text-refined text-residuall-gray max-w-3xl mx-auto">
                Histórias reais de sucesso com a plataforma RESIDUALL.
              </p>
            </div>

            <TestimonialCarousel />
          </div>
        </section>

        {/* CTA Final */}
        <section className="bg-residuall-green py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="heading-lg text-white mb-6">
              Pronto para transformar sua gestão de resíduos?
            </h2>
            <p className="text-refined text-white/90 max-w-3xl mx-auto mb-8">
              Junte-se a centenas de profissionais que já estão construindo 
              um futuro mais sustentável com a RESIDUALL.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cadastro" className="btn-secondary bg-residuall-orange hover:bg-residuall-orange-light">
                CRIAR CONTA GRÁTIS
              </Link>
              <Link to="/planos" className="btn-outline border-white text-white hover:bg-white hover:text-residuall-green">
                VER NOSSOS PLANOS
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
