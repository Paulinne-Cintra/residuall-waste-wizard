
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TestimonialCarousel from '../components/TestimonialCarousel';
import { CheckCircle, BarChart, Recycle, Award, ArrowRight, ClipboardList, Monitor, Wrench } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-residuall-gray-light">
      <Header />

      <main className="flex-grow">
        {/* --- Hero Section Redesenhada --- */}
        <section 
          className="relative text-white bg-cover bg-center"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1541976590-713941681591?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80")',
            height: '100vh',
            minHeight: '650px'
          }}
        >
          <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-start text-left pt-20">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold tracking-tight uppercase" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
                Construa com propósito,
                <br />
                construa com futuro.
              </h1>
              <p className="mt-6 text-lg md:text-xl text-white/95 max-w-2xl font-lato" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
                A Residuall nasceu com a necessidade de transformar a forma como o setor da construção civil lida com seus resíduos. Desenvolvemos um software para auxiliar na coleta e visualização de dados sobre o desperdício de materiais na indústria da construção civil, oferecemos uma plataforma intuitiva e inteligente para seu negócio. Queremos facilitar a tomada de decisões, incentivando práticas eficientes, sustentáveis e alinhadas às demandas ambientais de hoje e do futuro.
              </p>
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
        
        {/* --- Nova Seção: Como Funciona --- */}
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
                { icon: ClipboardList, title: "Cadastre seu Projeto", description: "Insira as informações básicas da sua obra para iniciar o monitoramento." },
                { icon: Monitor, title: "Registe o Desperdício", description: "Aponte os materiais e as quantidades desperdiçadas em cada etapa." },
                { icon: BarChart, title: "Analise os Dados", description: "Use os nossos dashboards para visualizar os pontos críticos de perda." },
                { icon: Wrench, title: "Otimize e Economize", description: "Aplique as nossas recomendações para reduzir custos e aumentar a sustentabilidade." }
              ].map((item, index) => (
                <div key={index} className="card-modern">
                  <div className="w-20 h-20 bg-residuall-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <item.icon size={40} className="text-residuall-green" />
                  </div>
                  <h3 className="font-montserrat font-semibold text-xl text-residuall-green mb-3">{item.title}</h3>
                  <p className="text-residuall-gray leading-relaxed text-sm">{item.description}</p>
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
            <Link to="/cadastro" className="btn-secondary bg-residuall-orange hover:bg-residuall-orange-light">
              CRIAR CONTA GRÁTIS
              <ArrowRight className="ml-2" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
