import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
const AboutPage = () => {
  return <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-residuall-gray-light py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="heading-xl mb-6">Sobre a Residuall</h1>
              <p className="text-xl text-residuall-gray-dark">
                Transformando a indústria da construção com inovação e sustentabilidade
              </p>
            </div>
          </div>
        </section>
        
        {/* Nossa História */}
        <section className="section-padding bg-[sidebar-item-active-text] bg-sidebar-ring">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="heading-lg mb-8 text-center">Nossa História</h2>
              
              <div className="prose prose-lg max-w-none">
                <p className="mb-4">
                  A Residuall nasceu da observação de um problema crítico na indústria da construção civil: o desperdício excessivo de materiais e a falta de ferramentas adequadas para gerenciá-lo. Fundada por um grupo de engenheiros, arquitetos e desenvolvedores de software, nossa empresa tem como missão revolucionar a forma como a indústria lida com seus resíduos.
                </p>
                <p className="mb-4">
                  Desde o início, acreditamos que a combinação de tecnologia e sustentabilidade poderia transformar um dos setores mais tradicionais e que mais geram resíduos no mundo. Nossa plataforma foi concebida para ser acessível e prática, permitindo que empresas de todos os portes possam implementar práticas mais sustentáveis em seus projetos.
                </p>
                <p className="mb-4">
                  Ao longo dos anos, temos trabalhado em estreita colaboração com profissionais da construção para refinar nossa solução e garantir que ela atenda às necessidades reais do mercado. O resultado é uma plataforma intuitiva que não apenas ajuda a reduzir o desperdício, mas também proporciona benefícios econômicos tangíveis aos nossos clientes.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Missão, Visão e Valores */}
        <section className="section-padding bg-residuall-gray-light">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="heading-lg mb-12 text-center">Missão, Visão e Valores</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-residuall-green">Missão</h3>
                  <p className="text-residuall-gray-dark">
                    Transformar a gestão de resíduos na construção civil através de soluções tecnológicas acessíveis, contribuindo para um setor mais sustentável e economicamente eficiente.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-residuall-green">Visão</h3>
                  <p className="text-residuall-gray-dark">
                    Ser reconhecida como a principal plataforma de gestão de resíduos para a construção civil, presente em projetos de todo o Brasil, e contribuir significativamente para a redução do impacto ambiental do setor.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-residuall-green">Valores</h3>
                  <ul className="text-residuall-gray-dark list-disc pl-5 space-y-2">
                    <li>Sustentabilidade em primeiro lugar</li>
                    <li>Inovação constante</li>
                    <li>Simplicidade e acessibilidade</li>
                    <li>Transparência nos dados</li>
                    <li>Colaboração com o setor</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* O Problema e Nossa Solução */}
        <section className="section-padding">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="heading-lg mb-12 text-center">O Problema e Nossa Solução</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-residuall-brown">O Problema</h3>
                  <p className="text-residuall-gray-dark mb-4">
                    A indústria da construção civil é responsável por aproximadamente 40% dos resíduos sólidos gerados globalmente. No Brasil, estima-se que o setor produza mais de 100 milhões de toneladas de resíduos por ano, sendo que grande parte desse volume poderia ser reutilizada ou reciclada.
                  </p>
                  <p className="text-residuall-gray-dark mb-4">
                    No entanto, a falta de ferramentas adequadas para o monitoramento e gestão desses resíduos dificulta a implementação de práticas mais sustentáveis. Muitas empresas ainda utilizam métodos manuais e ineficientes para controlar seus materiais, o que resulta em:
                  </p>
                  <ul className="text-residuall-gray-dark list-disc pl-5 space-y-2 mb-4">
                    <li>Desperdício financeiro significativo</li>
                    <li>Impacto ambiental desnecessário</li>
                    <li>Dificuldade em cumprir normas regulatórias</li>
                    <li>Perda de oportunidades de reaproveitamento</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-residuall-green">Nossa Solução</h3>
                  <p className="text-residuall-gray-dark mb-4">
                    A plataforma Residuall foi desenvolvida para abordar esses desafios de maneira direta e eficaz. Oferecemos uma solução SaaS completa que permite:
                  </p>
                  <ul className="text-residuall-gray-dark list-disc pl-5 space-y-2 mb-4">
                    <li>Registrar e monitorar com precisão o uso de materiais em projetos de construção</li>
                    <li>Visualizar dados de desperdício através de dashboards intuitivos</li>
                    <li>Receber recomendações personalizadas para redução de resíduos</li>
                    <li>Acompanhar o desempenho ambiental e econômico dos projetos</li>
                    <li>Gerar relatórios detalhados para stakeholders e órgãos reguladores</li>
                  </ul>
                  <p className="text-residuall-gray-dark">
                    Nossa abordagem não se limita apenas a identificar problemas, mas também a propor soluções práticas que podem ser implementadas de imediato, resultando em economia de recursos e redução do impacto ambiental.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-residuall-green py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-white text-3xl font-bold mb-6">
              Pronto para transformar seus projetos?
            </h2>
            <p className="text-white opacity-90 max-w-2xl mx-auto mb-8">
              Junte-se à comunidade Residuall e comece a gerenciar seus resíduos de forma inteligente hoje mesmo.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/cadastro" className="btn-primary bg-white text-residuall-green hover:bg-gray-100">
                CRIAR UMA CONTA
              </Link>
              <Link to="/planos" className="btn-outline border-white text-white hover:bg-residuall-green-light hover:border-transparent">
                VER NOSSOS PLANOS
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};
export default AboutPage;