import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { Target, Eye, Heart, CheckCircle } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        {/* Hero Section with background */}
        <section 
          className="relative py-24 md:py-32 bg-cover bg-center"
          style={{
            backgroundImage: 'linear-gradient(rgba(47, 74, 58, 0.8), rgba(47, 74, 58, 0.8)), url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
          }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h1 className="heading-xl mb-6">Sobre a RESIDUALL</h1>
              <p className="text-refined text-white/90 max-w-3xl mx-auto">
                Transformando a indústria da construção com inovação, tecnologia e compromisso com a sustentabilidade.
              </p>
            </div>
          </div>
        </section>
        
        {/* Nossa História */}
        <section className="section-padding bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="heading-lg text-residuall-green mb-8">Nossa História</h2>
                  
                  <div className="space-y-6 text-refined text-residuall-gray">
                    <p>
                      A RESIDUALL nasceu da observação de um problema crítico na indústria da construção civil: 
                      o desperdício excessivo de materiais e a falta de ferramentas adequadas para gerenciá-lo. 
                      Fundada por um grupo de engenheiros, arquitetos e desenvolvedores apaixonados por sustentabilidade.
                    </p>
                    <p>
                      Desde o início, acreditamos que a combinação de tecnologia e sustentabilidade poderia 
                      transformar um dos setores mais tradicionais do mundo. Nossa plataforma foi concebida 
                      para ser acessível e prática, permitindo que empresas de todos os portes implementem 
                      práticas mais sustentáveis.
                    </p>
                    <p>
                      Hoje, trabalhamos em estreita colaboração com profissionais da construção para 
                      refinar continuamente nossa solução, garantindo que ela atenda às necessidades 
                      reais do mercado com resultados tangíveis.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1460472178825-e5240623afd5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
                    alt="Equipe RESIDUALL trabalhando"
                    className="rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-500 w-full h-96 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Missão, Visão e Valores */}
        <section className="section-padding bg-residuall-gray-light">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="heading-lg text-center text-residuall-green mb-16">
                Nossos Pilares
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card-modern text-center">
                  <div className="w-16 h-16 bg-residuall-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target size={32} className="text-residuall-green" />
                  </div>
                  <h3 className="font-montserrat font-semibold text-xl text-residuall-green mb-4">
                    Missão
                  </h3>
                  <p className="text-residuall-gray leading-relaxed">
                    Transformar a gestão de resíduos na construção civil através de soluções 
                    tecnológicas acessíveis, contribuindo para um setor mais sustentável e 
                    economicamente eficiente.
                  </p>
                </div>
                
                <div className="card-modern text-center">
                  <div className="w-16 h-16 bg-residuall-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Eye size={32} className="text-residuall-orange" />
                  </div>
                  <h3 className="font-montserrat font-semibold text-xl text-residuall-green mb-4">
                    Visão
                  </h3>
                  <p className="text-residuall-gray leading-relaxed">
                    Ser reconhecida como a principal plataforma de gestão de resíduos para 
                    a construção civil no Brasil, contribuindo significativamente para a 
                    redução do impacto ambiental do setor.
                  </p>
                </div>
                
                <div className="card-modern text-center">
                  <div className="w-16 h-16 bg-residuall-beige/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart size={32} className="text-residuall-green" />
                  </div>
                  <h3 className="font-montserrat font-semibold text-xl text-residuall-green mb-4">
                    Valores
                  </h3>
                  <div className="text-left">
                    <ul className="space-y-2 text-residuall-gray">
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-residuall-green mr-2 mt-1 flex-shrink-0" />
                        <span>Sustentabilidade em primeiro lugar</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-residuall-green mr-2 mt-1 flex-shrink-0" />
                        <span>Inovação constante</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-residuall-green mr-2 mt-1 flex-shrink-0" />
                        <span>Simplicidade e acessibilidade</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-residuall-green mr-2 mt-1 flex-shrink-0" />
                        <span>Transparência nos dados</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-residuall-green mr-2 mt-1 flex-shrink-0" />
                        <span>Colaboração com o setor</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* O Problema e Nossa Solução */}
        <section className="section-padding bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="heading-lg text-center text-residuall-green mb-16">
                O Desafio e Nossa Solução
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="card-modern">
                  <h3 className="font-montserrat font-semibold text-2xl text-residuall-orange mb-6">
                    O Desafio
                  </h3>
                  <div className="space-y-4 text-residuall-gray">
                    <p>
                      A indústria da construção civil é responsável por aproximadamente 40% dos resíduos 
                      sólidos gerados globalmente. No Brasil, estima-se que o setor produza mais de 
                      100 milhões de toneladas de resíduos por ano.
                    </p>
                    <p>
                      A falta de ferramentas adequadas para monitoramento e gestão resulta em:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-residuall-orange mr-2 mt-1 flex-shrink-0" />
                        <span>Desperdício financeiro significativo</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-residuall-orange mr-2 mt-1 flex-shrink-0" />
                        <span>Impacto ambiental desnecessário</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-residuall-orange mr-2 mt-1 flex-shrink-0" />
                        <span>Dificuldade em cumprir normas regulatórias</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-residuall-orange mr-2 mt-1 flex-shrink-0" />
                        <span>Perda de oportunidades de reaproveitamento</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="card-modern">
                  <h3 className="font-montserrat font-semibold text-2xl text-residuall-green mb-6">
                    Nossa Solução
                  </h3>
                  <div className="space-y-4 text-residuall-gray">
                    <p>
                      A plataforma RESIDUALL foi desenvolvida para abordar esses desafios de 
                      maneira direta e eficaz. Oferecemos uma solução completa que permite:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-residuall-green mr-2 mt-1 flex-shrink-0" />
                        <span>Registrar e monitorar com precisão o uso de materiais</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-residuall-green mr-2 mt-1 flex-shrink-0" />
                        <span>Visualizar dados através de dashboards intuitivos</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-residuall-green mr-2 mt-1 flex-shrink-0" />
                        <span>Receber recomendações personalizadas</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-residuall-green mr-2 mt-1 flex-shrink-0" />
                        <span>Acompanhar desempenho ambiental e econômico</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-residuall-green mr-2 mt-1 flex-shrink-0" />
                        <span>Gerar relatórios detalhados para stakeholders</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-residuall-green py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="heading-lg text-white mb-6">
              Pronto para fazer parte da transformação?
            </h2>
            <p className="text-refined text-white/90 max-w-3xl mx-auto mb-8">
              Junte-se à comunidade RESIDUALL e comece a construir um futuro mais 
              sustentável e próspero para sua empresa.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/cadastro" className="btn-secondary bg-residuall-orange hover:bg-residuall-orange-light">
                CRIAR UMA CONTA
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

export default AboutPage;
