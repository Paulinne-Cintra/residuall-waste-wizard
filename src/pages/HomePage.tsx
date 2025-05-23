import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CheckCircle, BarChart, Recycle } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section com gradiente animado usando Tailwind */}
        <section className="relative h-screen w-full flex items-center justify-center text-center overflow-hidden text-white bg-gradient-to-r from-residuall-green via-residuall-green-secondary to-residuall-green-card animate-gradient-move bg-[length:400%_400%]">
          <div className="relative z-10 container mx-auto max-w-5xl p-8">
            <h1 className="text-5xl font-montserrat font-bold mb-4 animate-fade-in">
              SOLUÇÕES INOVADORAS, PARA UM FUTURO SUSTENTÁVEL
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto animate-fade-in delay-200">
              Transforme o desperdício em resultados com nossa plataforma de gestão inteligente para a construção civil
            </p>
            <div className="animate-fade-in delay-400">
              <Link to="/cadastro" className="btn-primary text-lg">
                CADASTRE-SE GRÁTIS
              </Link>
            </div>

            {/* Benefícios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in delay-600">
              {[
                {
                  icon: <CheckCircle size={32} className="text-white" />, 
                  title: 'Gestão Inteligente de Resíduos',
                  text: 'Controle e reduza desperdícios com informações detalhadas por projeto e fase da obra.'
                },
                {
                  icon: <BarChart size={32} className="text-white" />, 
                  title: 'Relatórios e Insights Personalizados',
                  text: 'Visualize indicadores de desempenho e receba alertas inteligentes para tomada de decisão.'
                },
                {
                  icon: <Recycle size={32} className="text-white" />, 
                  title: 'Foco em Sustentabilidade e Economia',
                  text: 'Aumente a eficiência da sua obra reaproveitando materiais e reduzindo custos operacionais.'
                }
              ].map((benefit, index) => (
                <div key={index} className="card-benefit text-white">
                  <div className="bg-white bg-opacity-20 p-3 rounded-full mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm opacity-90">{benefit.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seção Sobre */}
        <section className="section-padding bg-white">
          <div className="container mx-auto">
            <div className="max-w-5xl mx-auto">
              <h2 className="heading-lg text-center mb-3">Conheça a Residuall</h2>
              <p className="text-residuall-green text-center font-medium text-lg mb-10">
                CONSTRUA COM PROPÓSITO, CONSTRUA COM FUTURO.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <p className="text-residuall-gray-dark mb-4">
                    A Residuall nasceu da necessidade de transformar a indústria da construção civil em um setor mais sustentável e eficiente. Nossa plataforma SaaS permite que arquitetos, engenheiros e gestores de obras registrem e visualizem dados sobre o desperdício de materiais, identificando oportunidades de melhoria.
                  </p>
                  <p className="text-residuall-gray-dark mb-6">
                    Com foco em acessibilidade e usabilidade, criamos uma solução que promove a reutilização de recursos, automatiza relatórios de resíduos e facilita o cumprimento de metas ambientais e econômicas.
                  </p>
                  <Link to="/sobre" className="btn-outline inline-block">
                    SAIBA MAIS
                  </Link>
                </div>

                <div className="flex justify-center">
                  <div className="rounded-lg overflow-hidden shadow-lg h-64 w-full bg-gray-200 flex items-center justify-center">
                    <svg
                      className="w-32 h-32 text-residuall-gray"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção CTA */}
        <section className="bg-residuall-green py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-white text-3xl font-bold mb-6">
              Comece agora a transformar a gestão de resíduos na sua obra
            </h2>
            <p className="text-white opacity-90 max-w-2xl mx-auto mb-8">
              Junte-se a profissionais que estão inovando com dados, economizando recursos e construindo um legado sustentável.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/cadastro" className="btn-primary bg-white text-residuall-green hover:bg-gray-100">
                COMEÇAR GRATUITAMENTE
              </Link>
              <Link to="/planos" className="btn-outline border-white text-white hover:bg-residuall-green-light hover:border-transparent">
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
