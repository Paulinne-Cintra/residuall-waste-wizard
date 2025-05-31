
import Header from '../components/Header';
import Footer from '../components/Footer';
import PlanCard from '../components/PlanCard';
import { Home, Building, Building2 } from 'lucide-react';

const PlansPage = () => {
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
            <h1 className="heading-xl mb-6 animate-fade-in">Escolha o plano ideal para a sua obra</h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto animate-fade-in opacity-90 font-lato">
              Soluções inteligentes para reduzir perdas, otimizar recursos e transformar a sustentabilidade em resultados.
            </p>
          </div>
        </section>
        
        {/* Plans Grid */}
        <section className="section-padding bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <PlanCard
                title="Plano Básico"
                price="Grátis"
                features={[
                  "Cadastro limitado de projetos",
                  "Cadastro manual de informações",
                  "Relatórios de materiais",
                  "Sugestões de reaproveitamento"
                ]}
                buttonText="ASSINAR PLANO"
                image={<Home size={64} className="text-residuall-green" />}
              />
              
              <PlanCard
                title="Plano Profissional"
                price="20,00"
                features={[
                  "Cadastro de Projetos limitado",
                  "Relatórios Personalizados e Exportáveis",
                  "Dashboard Personalizados com Ampliação de Análises",
                  "Equipe com Múltiplos Acessos"
                ]}
                buttonText="ASSINAR PLANO"
                highlighted={true}
                image={<Building size={64} className="text-residuall-orange" />}
              />
              
              <PlanCard
                title="Plano Empresarial"
                price="50,00"
                features={[
                  "Cadastro ilimitado de projetos",
                  "Gestão de Equipe com Múltiplos Usuários",
                  "Permissões Personalizadas por Perfil",
                  "Relatórios Personalizados e Avançados"
                ]}
                buttonText="ASSINAR PLANO"
                image={<Building2 size={64} className="text-residuall-green" />}
              />
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="section-padding bg-residuall-gray-light">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="heading-lg mb-16 text-center text-residuall-green">Perguntas Frequentes</h2>
              
              <div className="space-y-6">
                <div className="card-modern">
                  <h3 className="text-xl font-montserrat font-bold mb-4 text-residuall-green">Como funciona o período de teste?</h3>
                  <p className="text-residuall-gray font-lato">
                    Todos os planos pagos incluem um período de teste gratuito de 14 dias, sem necessidade de cartão de crédito. Durante esse período, você terá acesso a todas as funcionalidades do plano escolhido para avaliar se ele atende às suas necessidades.
                  </p>
                </div>
                
                <div className="card-modern">
                  <h3 className="text-xl font-montserrat font-bold mb-4 text-residuall-green">Posso mudar de plano depois?</h3>
                  <p className="text-residuall-gray font-lato">
                    Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. Se optar por um plano de valor superior, a mudança será imediata. Caso escolha um plano de valor inferior, a alteração será aplicada no próximo ciclo de faturamento.
                  </p>
                </div>
                
                <div className="card-modern">
                  <h3 className="text-xl font-montserrat font-bold mb-4 text-residuall-green">Como funcionam os acessos para equipe?</h3>
                  <p className="text-residuall-gray font-lato">
                    No plano Básico, apenas o proprietário da conta tem acesso. No plano Profissional, é possível adicionar até 5 membros à equipe, cada um com seu próprio login. Já o plano Empresarial permite acessos ilimitados, com a possibilidade de definir diferentes níveis de permissão para cada usuário.
                  </p>
                </div>
                
                <div className="card-modern">
                  <h3 className="text-xl font-montserrat font-bold mb-4 text-residuall-green">É possível cancelar a qualquer momento?</h3>
                  <p className="text-residuall-gray font-lato">
                    Sim, você pode cancelar sua assinatura a qualquer momento, sem taxas adicionais. Após o cancelamento, sua conta permanecerá ativa até o final do período já pago. Seus dados ficarão disponíveis para exportação por 30 dias após o término da assinatura.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="section-padding bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="heading-lg mb-16 text-center text-residuall-green">O que nossos clientes dizem</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card-modern border-l-4 border-residuall-green">
                  <blockquote className="italic text-residuall-gray mb-6 font-lato text-lg">
                    "A plataforma RESIDUALL transformou a forma como gerenciamos nossos projetos. Conseguimos reduzir o desperdício de materiais em 25% no primeiro ano de uso, o que representou uma economia significativa para nossa empresa."
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-residuall-green rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold font-montserrat">JP</span>
                    </div>
                    <div>
                      <p className="font-montserrat font-semibold text-residuall-green">João Paulo Silva</p>
                      <p className="text-sm text-residuall-gray font-lato">Engenheiro Civil, Construtora Horizonte</p>
                    </div>
                  </div>
                </div>
                
                <div className="card-modern border-l-4 border-residuall-orange">
                  <blockquote className="italic text-residuall-gray mb-6 font-lato text-lg">
                    "Como arquiteta, sempre me preocupei com o impacto ambiental dos meus projetos. Com a RESIDUALL, finalmente tenho ferramentas para quantificar e reduzir esse impacto de forma tangível. Os relatórios são excelentes para apresentar aos clientes."
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-residuall-orange rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold font-montserrat">CM</span>
                    </div>
                    <div>
                      <p className="font-montserrat font-semibold text-residuall-green">Carla Mendes</p>
                      <p className="text-sm text-residuall-gray font-lato">Arquiteta, Studio Arquitetura</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default PlansPage;
