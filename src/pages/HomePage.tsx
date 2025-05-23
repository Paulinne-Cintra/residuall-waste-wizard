import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CheckCircle, BarChart, Recycle } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section - AGORA COM VÍDEO DE FUNDO */}
        <section className="relative h-screen w-full flex items-center justify-center text-center overflow-hidden">
          {/* Elemento de vídeo de fundo */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline // Importante para autoplay em mobile
            className="absolute inset-0 w-full h-full object-cover z-0"
            src="/assets/hero-video.mp4" // <-- ATENÇÃO: VOCÊ PRECISA FORNECER ESTE VÍDEO!
          >
            Seu navegador não suporta a tag de vídeo.
          </video>
          
          {/* Overlay para escurecer o vídeo e melhorar a legibilidade do texto */}
          {/* Você pode ajustar a cor (bg-residuall-green-secondary) e a opacidade (opacity-70) */}
          <div className="absolute inset-0 bg-residuall-green-secondary opacity-70 z-1"></div>

          {/* Conteúdo da seção Hero */}
          <div className="relative z-10 container mx-auto max-w-5xl text-white"> 
            <h1 className="text-5xl font-montserrat font-bold mb-4 animate-fade-in">
              SOLUÇÕES INOVADORAS, PARA UM FUTURO SUSTENTÁVEL
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Transforme o desperdício em resultados com nossa plataforma de gestão inteligente para a construção civil
            </p>
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link to="/cadastro" className="btn-primary text-lg">
                CADASTRE-SE GRÁTIS
              </Link>
            </div>
            
            {/* Benefits - Mantido com fundo transparente para o vídeo aparecer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="card-benefit text-white">
                <div className="bg-white bg-opacity-20 p-3 rounded-full mb-4">
                  <CheckCircle size={32} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Gestão Inteligente de resíduos</h3>
                <p className="text-sm opacity-90">
                  Acompanhe e gerencie os resíduos da sua obra de forma simples e eficiente
                </p>
              </div>
              
              <div className="card-benefit text-white">
                <div className="bg-white bg-opacity-20 p-3 rounded-full mb-4">
                  <BarChart size={32} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Análises em tempo real</h3>
                <p className="text-sm opacity-90">
                  Visualize dados e obtenha insights para tomadas de decisão mais eficientes
                </p>
              </div>
              
              <div className="card-benefit text-white">
                <div className="bg-white bg-opacity-20 p-3 rounded-full mb-4">
                  <Recycle size={32} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Materiais sustentáveis</h3>
                <p className="text-sm opacity-90">
                  Identifique oportunidades de reaproveitamento e reduza custos operacionais
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* About Section - permanece o mesmo */}
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
                    Acreditamos que a tecnologia pode ser uma aliada poderosa na redução do impacto ambiental da construção, ao mesmo tempo em que promove economia de recursos e aumento da eficiência operacional.
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
        
        {/* CTA Section - permanece o mesmo */}
        <section className="bg-residuall-green py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-white text-3xl font-bold mb-6">
              Comece agora a transformar a gestão de resíduos na sua obra
            </h2>
            <p className="text-white opacity-90 max-w-2xl mx-auto mb-8">
              Junte-se a centenas de profissionais que já estão economizando recursos e contribuindo para um futuro mais sustentável com a Residuall.
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
