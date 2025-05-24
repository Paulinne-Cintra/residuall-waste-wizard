import { Link } from 'react-router-dom';
import Header from '../components/Header'; // Você precisará atualizar este Header para ter links de navegação para as seções
import Footer from '../components/Footer';
import { CheckCircle, BarChart, Recycle, Award, Users, Lightbulb, UserCheck, MessageSquareText } from 'lucide-react'; // Adicionei mais ícones para novas seções

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-residuall-gray-light text-residuall-gray-dark"> {/* Fundo geral claro e texto escuro */}
      <Header />

      <main className="flex-grow">
        {/* Seção Principal (Hero Section) - ID: inicio */}
        {/* Inspirado no topo da nova imagem, com foco em uma imagem principal e texto claro */}
        <section id="inicio" className="relative w-full min-h-[70vh] md:min-h-screen flex items-center justify-center text-center overflow-hidden bg-gradient-to-r from-residuall-green via-residuall-green-secondary to-residuall-green-card animate-gradient-move bg-[length:400%_400%] text-white py-24 md:py-32">
          <div className="relative z-10 container mx-auto max-w-6xl px-4">
            {/* O bloco de imagem inspirador que se parece com um collage */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="col-span-1 md:col-span-2 flex items-center justify-center">
                <img
                  src="https://via.placeholder.com/600x400/residuall-green/ffffff?text=Sua+Imagem+Principal" // Substitua pela sua imagem principal
                  alt="Soluções Sustentáveis"
                  className="rounded-xl shadow-2xl object-cover w-full h-auto max-h-96 md:max-h-[500px]"
                />
              </div>
              <div className="hidden md:flex flex-col gap-6">
                <img
                  src="https://via.placeholder.com/300x200/residuall-green-secondary/ffffff?text=Imagem+Detalhe+1" // Substitua
                  alt="Detalhe 1"
                  className="rounded-xl shadow-xl object-cover w-full h-auto"
                />
                <img
                  src="https://via.placeholder.com/300x200/residuall-green-card/ffffff?text=Imagem+Detalhe+2" // Substitua
                  alt="Detalhe 2"
                  className="rounded-xl shadow-xl object-cover w-full h-auto"
                />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-montserrat font-bold mb-4 animate-fade-in drop-shadow-md">
              SOLUÇÕES INOVADORAS, PARA UM FUTURO SUSTENTÁVEL
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto animate-fade-in delay-200 opacity-90">
              Transforme o desperdício em resultados com nossa plataforma de gestão inteligente para a construção civil.
            </p>
            <div className="animate-fade-in delay-400">
              <Link to="/cadastro" className="btn-primary text-lg px-10 py-5 bg-residuall-accent-orange text-white hover:bg-opacity-90"> {/* Usando a nova cor de destaque */}
                CADASTRE-SE GRÁTIS
              </Link>
            </div>
          </div>
        </section>

        {/* Seção de Estatísticas/Experiência - ID: experiencia */}
        {/* Inspirado em "Built on Experience, Driven by Quality" e estatísticas */}
        <section id="experiencia" className="py-24 bg-white text-residuall-gray-dark">
          <div className="container mx-auto px-4 text-center">
            <h2 className="heading-lg text-residuall-gray-dark mb-12">Built on Experience, Driven by Quality</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card de Estatística/Experiência */}
              <div className="bg-residuall-gray-light p-8 rounded-xl shadow-soft-xl text-center">
                <Award size={48} className="text-residuall-accent-orange mx-auto mb-4" /> {/* Ícone com a nova cor */}
                <p className="text-4xl font-bold text-residuall-accent-orange mb-2">100%+</p>
                <h3 className="text-xl font-semibold mb-2">SATISFAÇÃO DO CLIENTE</h3>
                <p className="text-residuall-gray-dark opacity-80">Nosso compromisso é com a excelência e a superação das expectativas.</p>
              </div>
              <div className="bg-residuall-gray-light p-8 rounded-xl shadow-soft-xl text-center">
                <BarChart size={48} className="text-residuall-accent-orange mx-auto mb-4" />
                <p className="text-4xl font-bold text-residuall-accent-orange mb-2">30+</p>
                <h3 className="text-xl font-semibold mb-2">ANOS DE EXPERIÊNCIA</h3>
                <p className="text-residuall-gray-dark opacity-80">Construindo um futuro mais verde com expertise e inovação.</p>
              </div>
              <div className="bg-residuall-gray-light p-8 rounded-xl shadow-soft-xl text-center">
                <CheckCircle size={48} className="text-residuall-accent-orange mx-auto mb-4" />
                <p className="text-4xl font-bold text-residuall-accent-orange mb-2">500+</p>
                <h3 className="text-xl font-semibold mb-2">PROJETOS CONCLUÍDOS</h3>
                <p className="text-residuall-gray-dark opacity-80">Resultados comprovados em gestão de resíduos e sustentabilidade.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Seção Sobre (Agora com mais destaque e estilo da inspiração) - ID: sobre */}
        <section id="sobre" className="py-24 bg-residuall-gray-light">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="heading-lg text-center mb-4 text-residuall-gray-dark">Conheça a Residuall</h2>
              <p className="text-residuall-green text-center font-medium text-xl mb-16 max-w-3xl mx-auto">
                CONSTRUA COM PROPÓSITO, CONSTRUA COM FUTURO.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <p className="text-residuall-gray-dark text-lg leading-relaxed mb-6">
                    A Residuall nasceu da necessidade de transformar a indústria da construção civil em um setor mais sustentável e eficiente. Nossa plataforma SaaS permite que arquitetos, engenheiros e gestores de obras registrem e visualizem dados sobre o desperdício de materiais, identificando oportunidades de melhoria.
                  </p>
                  <p className="text-residuall-gray-dark text-lg leading-relaxed mb-8">
                    Com foco em acessibilidade e usabilidade, criamos uma solução que promove a reutilização de recursos, automatiza relatórios de resíduos e facilita o cumprimento de metas ambientais e econômicas.
                  </p>
                  <Link to="/sobre" className="btn-outline inline-block px-10 py-4 border-residuall-accent-orange text-residuall-accent-orange hover:bg-residuall-accent-orange hover:text-white"> {/* Usando a nova cor de destaque */}
                    SAIBA MAIS SOBRE NÓS
                  </Link>
                </div>

                <div className="flex justify-center">
                  <img
                    src="https://via.placeholder.com/600x400/residuall-gray-dark/ffffff?text=Sobre+Residuall" // Substitua por imagem real da sua empresa
                    alt="Sobre a Residuall"
                    className="rounded-xl shadow-soft-2xl object-cover w-full h-72 lg:h-96" // Usando nova sombra
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção Nosso Processo (Steps) - ID: processo */}
        {/* Inspirado em "Our 4-Step Process" */}
        <section id="processo" className="py-24 bg-white text-residuall-gray-dark">
          <div className="container mx-auto px-4 text-center">
            <h2 className="heading-lg text-residuall-gray-dark mb-4">Nosso Processo em 4 Etapas</h2>
            <p className="text-residuall-green text-lg mb-16 max-w-3xl mx-auto">
              Simplificamos a gestão de resíduos para que você possa focar no que realmente importa.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: '01', icon: <Lightbulb size={40} className="text-residuall-accent-orange" />, title: 'Registro Inteligente', description: 'Registre seus resíduos de forma rápida e intuitiva na plataforma.' },
                { step: '02', icon: <BarChart size={40} className="text-residuall-accent-orange" />, title: 'Análise de Dados', description: 'Obtenha insights detalhados com relatórios e dashboards personalizados.' },
                { step: '03', icon: <Recycle size={40} className="text-residuall-accent-orange" />, title: 'Otimização Contínua', description: 'Identifique oportunidades para reduzir desperdícios e otimizar processos.' },
                { step: '04', icon: <CheckCircle size={40} className="text-residuall-accent-orange" />, title: 'Resultados Comprovados', description: 'Alcance metas de sustentabilidade e veja o impacto positivo nos seus custos.' },
              ].map((item, index) => (
                <div key={index} className="p-6 rounded-xl bg-residuall-gray-light shadow-soft-xl text-left relative overflow-hidden">
                  <span className="absolute top-0 right-0 text-6xl font-bold opacity-10 text-residuall-accent-orange">{item.step}</span>
                  <div className="mb-4 relative z-10">{item.icon}</div>
                  <h3 className="text-2xl font-semibold mb-3 relative z-10">{item.title}</h3>
                  <p className="text-residuall-gray-dark relative z-10">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seção Equipe (Experts) - ID: equipe */}
        {/* Inspirado em "Meet the Experts Behind" */}
        <section id="equipe" className="py-24 bg-residuall-gray-light text-residuall-gray-dark">
          <div className="container mx-auto px-4 text-center">
            <h2 className="heading-lg text-residuall-gray-dark mb-4">Nossos Especialistas</h2>
            <p className="text-residuall-green text-lg mb-16 max-w-3xl mx-auto">
              Conheça a equipe dedicada que impulsiona a inovação na Residuall.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {/* Exemplo de Card de Membro da Equipe */}
              <div className="bg-white p-6 rounded-xl shadow-soft-xl text-center transition-transform duration-300 hover:scale-105">
                <img
                  src="https://via.placeholder.com/180x180/residuall-green/ffffff?text=Membro+1" // Substitua por imagem real do membro
                  alt="Nome do Membro 1"
                  className="w-36 h-36 rounded-full mx-auto mb-4 object-cover border-4 border-residuall-green" // Borda colorida
                />
                <h3 className="text-xl font-semibold text-residuall-gray-dark mb-2">Nome do Membro 1</h3>
                <p className="text-residuall-accent-orange font-medium mb-2">Cargo</p>
                <p className="text-residuall-gray-dark text-sm leading-relaxed">Breve descrição sobre a experiência e paixão do membro pela sustentabilidade.</p>
                {/* Opcional: Links para redes sociais */}
              </div>
              {/* Duplique e personalize este bloco para cada membro da equipe */}
            </div>
          </div>
        </section>

        {/* Seção Depoimentos - ID: depoimentos */}
        {/* Inspirado em "What Our Clients Say" */}
        <section id="depoimentos" className="py-24 bg-white text-residuall-gray-dark">
          <div className="container mx-auto px-4 text-center">
            <h2 className="heading-lg text-residuall-gray-dark mb-4">O Que Nossos Clientes Dizem</h2>
            <p className="text-residuall-green text-lg mb-16 max-w-3xl mx-auto">
              Histórias de sucesso de quem confia na Residuall para uma gestão de resíduos eficiente.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Exemplo de Card de Depoimento */}
              <div className="bg-residuall-gray-light p-8 rounded-xl shadow-soft-xl text-left transition-transform duration-300 hover:scale-105">
                <UserCheck size={36} className="text-residuall-accent-orange mb-4" />
                <p className="text-residuall-gray-dark text-lg mb-4 leading-relaxed italic">
                  "A Residuall transformou completamente a nossa abordagem de resíduos na construção. Conseguimos otimizar processos e reduzir custos de forma que nunca imaginamos ser possível. Recomendo fortemente!"
                </p>
                <div className="font-semibold text-residuall-gray-dark">- Nome do Cliente, Cargo na Empresa</div>
              </div>
              {/* Duplique e personalize este bloco para mais depoimentos */}
            </div>
          </div>
        </section>


        {/* Seção CTA Final - ID: contato */}
        {/* Inspirado em "Ready to Build Your Future?" e "Start Your Project With Us" */}
        <section id="contato" className="bg-residuall-green py-24 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="heading-lg text-white mb-6">
              Pronto para construir um futuro mais sustentável?
            </h2>
            <p className="text-white opacity-90 max-w-3xl mx-auto mb-12 text-xl">
              Junte-se a profissionais que estão inovando com dados, economizando recursos e construindo um legado sustentável.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/cadastro" className="btn-primary bg-residuall-accent-orange text-white hover:bg-opacity-90 px-10 py-5 text-lg"> {/* Usando a nova cor de destaque */}
                COMEÇAR GRATUITAMENTE
              </Link>
              <Link to="/planos" className="btn-outline border-white text-white hover:bg-white hover:text-residuall-green-secondary px-10 py-5 text-lg">
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
