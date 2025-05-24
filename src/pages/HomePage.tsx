import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CheckCircle, BarChart, Recycle, Users, MessageSquareText } from 'lucide-react'; // Adicionei Users e MessageSquareText para futuras seções

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section - Mantém o gradiente animado e as cores residuall- */}
        {/* Ajustei o padding do container e os estilos dos cards de benefício */}
        <section className="relative h-screen w-full flex items-center justify-center text-center overflow-hidden text-white bg-gradient-to-r from-residuall-green via-residuall-green-secondary to-residuall-green-card animate-gradient-move bg-[length:400%_400%]">
          <div className="relative z-10 container mx-auto max-w-5xl px-8 py-16 md:py-20"> {/* Aumentei o padding vertical */}
            <h1 className="text-5xl font-montserrat font-bold mb-4 animate-fade-in">
              SOLUÇÕES INOVADORAS, PARA UM FUTURO SUSTENTÁVEL
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto animate-fade-in delay-200">
              Transforme o desperdício em resultados com nossa plataforma de gestão inteligente para a construção civil
            </p>
            <div className="animate-fade-in delay-400">
              <Link to="/cadastro" className="btn-primary text-lg px-8 py-4"> {/* Ajustei padding do botão */}
                CADASTRE-SE GRÁTIS
              </Link>
            </div>

            {/* Benefícios - Mantém o espaçamento e os estilos dos cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-fade-in delay-600"> {/* Aumentei o gap */}
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
                // Adicionei shadow e rounded para um visual mais polido, como na inspiração
                <div key={index} className="bg-white bg-opacity-10 p-6 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"> {/* Ajustei opacity, padding, rounded e adicionei hover */}
                  <div className="bg-white bg-opacity-20 p-3 rounded-full mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3> {/* Aumentei tamanho do título */}
                  <p className="text-base opacity-90">{benefit.text}</p> {/* Ajustei tamanho do texto */}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seção Sobre - Mais espaçamento e imagem placeholder com estilo aprimorado */}
        <section className="py-24 bg-residuall-gray-light"> {/* Substituí section-padding por py-24 para controle direto */}
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto"> {/* Aumentei o max-w para mais espaço */}
              <h2 className="heading-lg text-center mb-4 text-residuall-gray-dark">Conheça a Residuall</h2> {/* Corrigi cor do título */}
              <p className="text-residuall-green text-center font-medium text-lg mb-12 max-w-3xl mx-auto"> {/* Aumentei mb, adicionei max-w */}
                CONSTRUA COM PROPÓSITO, CONSTRUA COM FUTURO.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"> {/* Aumentei o gap */}
                <div>
                  <p className="text-residuall-gray-dark text-lg leading-relaxed mb-6"> {/* Aumentei tamanho da fonte e line-height */}
                    A Residuall nasceu da necessidade de transformar a indústria da construção civil em um setor mais sustentável e eficiente. Nossa plataforma SaaS permite que arquitetos, engenheiros e gestores de obras registrem e visualizem dados sobre o desperdício de materiais, identificando oportunidades de melhoria.
                  </p>
                  <p className="text-residuall-gray-dark text-lg leading-relaxed mb-8"> {/* Aumentei tamanho da fonte e line-height */}
                    Com foco em acessibilidade e usabilidade, criamos uma solução que promove a reutilização de recursos, automatiza relatórios de resíduos e facilita o cumprimento de metas ambientais e econômicas.
                  </p>
                  <Link to="/sobre" className="btn-outline inline-block px-8 py-4 border-residuall-green text-residuall-green hover:bg-residuall-green hover:text-white"> {/* Ajustei padding e hover */}
                    SAIBA MAIS
                  </Link>
                </div>

                <div className="flex justify-center">
                  {/* Placeholder de imagem com bordas mais arredondadas e sombra mais proeminente */}
                  {/* Sugiro substituir este SVG por uma imagem real de alta qualidade */}
                  <div className="rounded-xl overflow-hidden shadow-xl h-72 w-full bg-residuall-gray flex items-center justify-center"> {/* Ajustei h, rounded e shadow */}
                    <svg
                      className="w-36 h-36 text-residuall-gray-dark" // Ajustei tamanho e cor do SVG
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

        {/* Nova Seção: Nossa Equipe (Exemplo de como adicionar) */}
        {/* Inspirado na seção de "Expert Crew" do site de inspiração */}
        <section className="py-24 bg-residuall-gray-light">
          <div className="container mx-auto px-4 text-center">
            <h2 className="heading-lg mb-4 text-residuall-gray-dark">Nossa Equipe</h2>
            <p className="text-residuall-green text-center font-medium text-lg mb-12 max-w-3xl mx-auto">
              Conheça os profissionais por trás do sucesso da Residuall.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Exemplo de card de membro da equipe */}
              <div className="bg-white p-6 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105">
                <img
                  src="https://via.placeholder.com/150" // Substitua por imagens reais da equipe
                  alt="Nome do Membro"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-residuall-gray-dark mb-2">Nome do Membro</h3>
                <p className="text-residuall-green font-medium mb-2">Cargo</p>
                <p className="text-residuall-gray-dark text-sm">Breve descrição sobre o membro e suas qualificações.</p>
              </div>
              {/* Duplique o bloco acima para mais membros */}
            </div>
            {/* Opcional: Adicione um botão "Conheça todos" se tiver uma página de equipe dedicada */}
          </div>
        </section>

        {/* Nova Seção: Depoimentos (Exemplo de como adicionar) */}
        {/* Inspirado na seção de "Client Testimonials" do site de inspiração */}
        <section className="py-24 bg-residuall-green-secondary text-white"> {/* Usei uma cor residuall- diferente para o fundo */}
          <div className="container mx-auto px-4 text-center">
            <h2 className="heading-lg mb-4 text-white">O Que Nossos Clientes Dizem</h2>
            <p className="text-residuall-white text-lg mb-12 max-w-3xl mx-auto">
              Veja como a Residuall está transformando a gestão de resíduos para nossos parceiros.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Exemplo de card de depoimento */}
              <div className="bg-residuall-green p-8 rounded-xl shadow-lg text-left"> {/* Fundo com um tom de verde da sua paleta */}
                <p className="text-residuall-white text-lg mb-4 leading-relaxed">
                  "A plataforma da Residuall revolucionou a forma como gerenciamos os resíduos em nossas obras. É intuitiva, eficiente e nos ajudou a reduzir significativamente nossos custos e impacto ambiental."
                </p>
                <div className="font-semibold text-residuall-white">- Nome do Cliente, Cargo na Empresa</div>
              </div>
              {/* Duplique o bloco acima para mais depoimentos */}
            </div>
          </div>
        </section>


        {/* Seção CTA - Mantém as cores residuall- */}
        {/* Aumentei o padding e aprimorei o hover dos botões */}
        <section className="bg-residuall-green py-24"> {/* Aumentei o padding vertical */}
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-white text-4xl font-bold mb-6"> {/* Aumentei tamanho do título */}
              Comece agora a transformar a gestão de resíduos na sua obra
            </h2>
            <p className="text-white opacity-90 max-w-3xl mx-auto mb-10 text-lg"> {/* Aumentei max-w e text-lg */}
              Junte-se a profissionais que estão inovando com dados, economizando recursos e construindo um legado sustentável.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6"> {/* Aumentei o gap */}
              <Link to="/cadastro" className="btn-primary bg-white text-residuall-green hover:bg-gray-100 px-8 py-4 text-lg"> {/* Ajustei padding e text-lg */}
                COMEÇAR GRATUITAMENTE
              </Link>
              <Link to="/planos" className="btn-outline border-white text-white hover:bg-residuall-green-light hover:border-transparent px-8 py-4 text-lg"> {/* Ajustei padding e text-lg */}
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
