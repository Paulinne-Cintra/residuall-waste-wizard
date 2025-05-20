
import Header from '../components/Header';
import Footer from '../components/Footer';
import PlanCard from '../components/PlanCard';
import { Home, Building, Building2 } from 'lucide-react';

const PlansPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-residuall-gray-light py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="heading-xl mb-6">Escolha o plano ideal para a sua obra</h1>
              <p className="text-xl text-residuall-gray-dark">
                Soluções inteligentes para reduzir perdas, otimizar recursos e transformar a sustentabilidade em resultados.
              </p>
            </div>
          </div>
        </section>
        
        {/* Plans Grid */}
        <section className="section-padding">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                image={<Building size={64} className="text-residuall-brown" />}
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
              <h2 className="heading-lg mb-12 text-center">Perguntas Frequentes</h2>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-2">Como funciona o período de teste?</h3>
                  <p className="text-residuall-gray-dark">
                    Todos os planos pagos incluem um período de teste gratuito de 14 dias, sem necessidade de cartão de crédito. Durante esse período, você terá acesso a todas as funcionalidades do plano escolhido para avaliar se ele atende às suas necessidades.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-2">Posso mudar de plano depois?</h3>
                  <p className="text-residuall-gray-dark">
                    Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. Se optar por um plano de valor superior, a mudança será imediata. Caso escolha um plano de valor inferior, a alteração será aplicada no próximo ciclo de faturamento.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-2">Como funcionam os acessos para equipe?</h3>
                  <p className="text-residuall-gray-dark">
                    No plano Básico, apenas o proprietário da conta tem acesso. No plano Profissional, é possível adicionar até 5 membros à equipe, cada um com seu próprio login. Já o plano Empresarial permite acessos ilimitados, com a possibilidade de definir diferentes níveis de permissão para cada usuário.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-2">É possível cancelar a qualquer momento?</h3>
                  <p className="text-residuall-gray-dark">
                    Sim, você pode cancelar sua assinatura a qualquer momento, sem taxas adicionais. Após o cancelamento, sua conta permanecerá ativa até o final do período já pago. Seus dados ficarão disponíveis para exportação por 30 dias após o término da assinatura.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="section-padding">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="heading-lg mb-12 text-center">O que nossos clientes dizem</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-residuall-green">
                  <p className="italic text-residuall-gray-dark mb-4">
                    "A plataforma Residuall transformou a forma como gerenciamos nossos projetos. Conseguimos reduzir o desperdício de materiais em 25% no primeiro ano de uso, o que representou uma economia significativa para nossa empresa."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-residuall-gray-light rounded-full flex items-center justify-center mr-4">
                      <span className="text-residuall-green font-bold">JP</span>
                    </div>
                    <div>
                      <p className="font-medium">João Paulo Silva</p>
                      <p className="text-sm text-residuall-gray">Engenheiro Civil, Construtora Horizonte</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-residuall-green">
                  <p className="italic text-residuall-gray-dark mb-4">
                    "Como arquiteta, sempre me preocupei com o impacto ambiental dos meus projetos. Com a Residuall, finalmente tenho ferramentas para quantificar e reduzir esse impacto de forma tangível. Os relatórios são excelentes para apresentar aos clientes."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-residuall-gray-light rounded-full flex items-center justify-center mr-4">
                      <span className="text-residuall-green font-bold">CM</span>
                    </div>
                    <div>
                      <p className="font-medium">Carla Mendes</p>
                      <p className="text-sm text-residuall-gray">Arquiteta, Studio Arquitetura</p>
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
