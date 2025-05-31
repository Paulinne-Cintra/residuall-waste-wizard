
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-residuall-gray-light">
      <Header />
      
      <main className="pt-16 md:pt-20">
        {/* Hero Section com imagem de fundo */}
        <section className="relative min-h-[60vh] flex items-center justify-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-residuall-gradient"></div>
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rotate-45"></div>
            <div className="absolute top-40 right-32 w-24 h-24 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-32 left-1/4 w-20 h-20 border-2 border-white"></div>
            <div className="absolute bottom-20 right-1/4 w-36 h-36 border-2 border-white rotate-12"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="heading-xl mb-6 animate-fade-in">Sobre a RESIDUALL</h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto animate-fade-in font-lato">
              Transformando a indústria da construção com inovação e sustentabilidade
            </p>
          </div>
        </section>
        
        {/* Nossa História */}
        <section className="section-padding bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="heading-lg mb-12 text-center text-residuall-green">Nossa História</h2>
              
              <div className="space-y-8 text-refined text-residuall-gray">
                <p>
                  A RESIDUALL nasceu da observação de um problema crítico na indústria da construção civil: o desperdício excessivo de materiais e a falta de ferramentas adequadas para gerenciá-lo. Fundada por um grupo de engenheiros, arquitetos e desenvolvedores de software, nossa empresa tem como missão revolucionar a forma como a indústria lida com seus resíduos.
                </p>
                <p>
                  Desde o início, acreditamos que a combinação de tecnologia e sustentabilidade poderia transformar um dos setores mais tradicionais e que mais geram resíduos no mundo. Nossa plataforma foi concebida para ser acessível e prática, permitindo que empresas de todos os portes possam implementar práticas mais sustentáveis em seus projetos.
                </p>
                <p>
                  Ao longo dos anos, temos trabalhado em estreita colaboração com profissionais da construção para refinar nossa solução e garantir que ela atenda às necessidades reais do mercado. O resultado é uma plataforma intuitiva que não apenas ajuda a reduzir o desperdício, mas também proporciona benefícios econômicos tangíveis aos nossos clientes.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Missão, Visão e Valores */}
        <section className="section-padding bg-residuall-gray-light">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="heading-lg mb-16 text-center text-residuall-green">Missão, Visão e Valores</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card-modern text-center">
                  <div className="w-16 h-16 bg-residuall-green rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white font-bold text-xl font-montserrat">M</span>
                  </div>
                  <h3 className="text-2xl font-montserrat font-bold mb-4 text-residuall-green">Missão</h3>
                  <p className="text-residuall-gray font-lato">
                    Transformar a gestão de resíduos na construção civil através de soluções tecnológicas acessíveis, contribuindo para um setor mais sustentável e economicamente eficiente.
                  </p>
                </div>
                
                <div className="card-modern text-center">
                  <div className="w-16 h-16 bg-residuall-orange rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white font-bold text-xl font-montserrat">V</span>
                  </div>
                  <h3 className="text-2xl font-montserrat font-bold mb-4 text-residuall-green">Visão</h3>
                  <p className="text-residuall-gray font-lato">
                    Ser reconhecida como a principal plataforma de gestão de resíduos para a construção civil, presente em projetos de todo o Brasil, e contribuir significativamente para a redução do impacto ambiental do setor.
                  </p>
                </div>
                
                <div className="card-modern text-center">
                  <div className="w-16 h-16 bg-residuall-beige rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-residuall-green font-bold text-xl font-montserrat">V</span>
                  </div>
                  <h3 className="text-2xl font-montserrat font-bold mb-4 text-residuall-green">Valores</h3>
                  <ul className="text-residuall-gray font-lato text-left space-y-2">
                    <li className="flex items-center"><span className="w-2 h-2 bg-residuall-orange rounded-full mr-3"></span>Sustentabilidade em primeiro lugar</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-residuall-orange rounded-full mr-3"></span>Inovação constante</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-residuall-orange rounded-full mr-3"></span>Simplicidade e acessibilidade</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-residuall-orange rounded-full mr-3"></span>Transparência nos dados</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-residuall-orange rounded-full mr-3"></span>Colaboração com o setor</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* O Problema e Nossa Solução */}
        <section className="section-padding bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="heading-lg mb-16 text-center text-residuall-green">O Problema e Nossa Solução</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="card-modern">
                  <h3 className="text-2xl font-montserrat font-bold mb-6 text-residuall-orange">O Problema</h3>
                  <div className="space-y-4 text-residuall-gray font-lato">
                    <p>
                      A indústria da construção civil é responsável por aproximadamente 40% dos resíduos sólidos gerados globalmente. No Brasil, estima-se que o setor produza mais de 100 milhões de toneladas de resíduos por ano, sendo que grande parte desse volume poderia ser reutilizada ou reciclada.
                    </p>
                    <p>
                      No entanto, a falta de ferramentas adequadas para o monitoramento e gestão desses resíduos dificulta a implementação de práticas mais sustentáveis. Muitas empresas ainda utilizam métodos manuais e ineficientes para controlar seus materiais, o que resulta em:
                    </p>
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-center"><span className="w-2 h-2 bg-residuall-orange rounded-full mr-3"></span>Desperdício financeiro significativo</li>
                      <li className="flex items-center"><span className="w-2 h-2 bg-residuall-orange rounded-full mr-3"></span>Impacto ambiental desnecessário</li>
                      <li className="flex items-center"><span className="w-2 h-2 bg-residuall-orange rounded-full mr-3"></span>Dificuldade em cumprir normas regulatórias</li>
                      <li className="flex items-center"><span className="w-2 h-2 bg-residuall-orange rounded-full mr-3"></span>Perda de oportunidades de reaproveitamento</li>
                    </ul>
                  </div>
                </div>
                
                <div className="card-modern">
                  <h3 className="text-2xl font-montserrat font-bold mb-6 text-residuall-green">Nossa Solução</h3>
                  <div className="space-y-4 text-residuall-gray font-lato">
                    <p>
                      A plataforma RESIDUALL foi desenvolvida para abordar esses desafios de maneira direta e eficaz. Oferecemos uma solução SaaS completa que permite:
                    </p>
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-center"><span className="w-2 h-2 bg-residuall-green rounded-full mr-3"></span>Registrar e monitorar com precisão o uso de materiais em projetos de construção</li>
                      <li className="flex items-center"><span className="w-2 h-2 bg-residuall-green rounded-full mr-3"></span>Visualizar dados de desperdício através de dashboards intuitivos</li>
                      <li className="flex items-center"><span className="w-2 h-2 bg-residuall-green rounded-full mr-3"></span>Receber recomendações personalizadas para redução de resíduos</li>
                      <li className="flex items-center"><span className="w-2 h-2 bg-residuall-green rounded-full mr-3"></span>Acompanhar o desempenho ambiental e econômico dos projetos</li>
                      <li className="flex items-center"><span className="w-2 h-2 bg-residuall-green rounded-full mr-3"></span>Gerar relatórios detalhados para stakeholders e órgãos reguladores</li>
                    </ul>
                    <p>
                      Nossa abordagem não se limita apenas a identificar problemas, mas também a propor soluções práticas que podem ser implementadas de imediato, resultando em economia de recursos e redução do impacto ambiental.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-residuall-gradient section-padding text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="heading-lg text-white mb-6">
              Pronto para transformar seus projetos?
            </h2>
            <p className="text-xl max-w-3xl mx-auto mb-12 opacity-90 font-lato">
              Junte-se à comunidade RESIDUALL e comece a gerenciar seus resíduos de forma inteligente hoje mesmo.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/cadastro" className="btn-secondary px-10 py-4 text-lg">
                CRIAR UMA CONTA
              </Link>
              <Link to="/planos" className="btn-outline border-white text-white hover:bg-white hover:text-residuall-green px-10 py-4 text-lg">
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

export default AboutPage;
