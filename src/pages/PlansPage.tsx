
import Header from '../components/Header';
import Footer from '../components/Footer';
import PlanCard from '../components/PlanCard';
import { Home, Building, Building2, Check, Star } from 'lucide-react';

const PlansPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-16 md:pt-20">
        {/* Hero Section */}
        <section 
          className="relative py-24 md:py-32 bg-cover bg-center"
          style={{
            backgroundImage: 'linear-gradient(rgba(47, 74, 58, 0.85), rgba(47, 74, 58, 0.85)), url("https://images.unsplash.com/photo-1541976590-713941681591?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80")'
          }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h1 className="heading-xl mb-6">Escolha o plano ideal para sua obra</h1>
              <p className="text-refined text-white/90 max-w-3xl mx-auto">
                Soluções inteligentes para reduzir perdas, otimizar recursos e transformar 
                a sustentabilidade em resultados concretos para seu negócio.
              </p>
            </div>
          </div>
        </section>
        
        {/* Plans Grid */}
        <section className="section-padding bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              <PlanCard
                title="Plano Básico"
                price="Grátis"
                features={[
                  "Cadastro limitado de projetos",
                  "Cadastro manual de informações",
                  "Relatórios básicos de materiais",
                  "Sugestões de reaproveitamento",
                  "Suporte por email"
                ]}
                buttonText="COMEÇAR GRÁTIS"
                image={<Home size={64} className="text-residuall-green" />}
              />
              
              <PlanCard
                title="Plano Profissional"
                price="49,90"
                features={[
                  "Cadastro ilimitado de projetos",
                  "Relatórios personalizados e exportáveis",
                  "Dashboard avançado com análises",
                  "Equipe com múltiplos acessos (até 5)",
                  "Integração com ferramentas externas",
                  "Suporte prioritário"
                ]}
                buttonText="ASSINAR PLANO"
                highlighted={true}
                image={<Building size={64} className="text-residuall-orange" />}
              />
              
              <PlanCard
                title="Plano Empresarial"
                price="99,90"
                features={[
                  "Recursos do Plano Profissional",
                  "Usuários ilimitados na equipe",
                  "Permissões personalizadas por perfil",
                  "Relatórios avançados e automatizados",
                  "API para integrações customizadas",
                  "Consultoria especializada inclusa",
                  "Suporte 24/7"
                ]}
                buttonText="ASSINAR PLANO"
                image={<Building2 size={64} className="text-residuall-green" />}
              />
            </div>
          </div>
        </section>
        
        {/* Comparação de Recursos */}
        <section className="section-padding bg-residuall-gray-light">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="heading-lg text-center text-residuall-green mb-16">
                Compare nossos recursos
              </h2>
              
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-residuall-green text-white">
                      <tr>
                        <th className="px-6 py-4 text-left font-montserrat font-semibold">Recursos</th>
                        <th className="px-6 py-4 text-center font-montserrat font-semibold">Básico</th>
                        <th className="px-6 py-4 text-center font-montserrat font-semibold">Profissional</th>
                        <th className="px-6 py-4 text-center font-montserrat font-semibold">Empresarial</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { feature: "Número de projetos", basic: "3", pro: "Ilimitado", enterprise: "Ilimitado" },
                        { feature: "Usuários por conta", basic: "1", pro: "5", enterprise: "Ilimitado" },
                        { feature: "Relatórios exportáveis", basic: "❌", pro: "✅", enterprise: "✅" },
                        { feature: "Dashboard avançado", basic: "❌", pro: "✅", enterprise: "✅" },
                        { feature: "API de integração", basic: "❌", pro: "❌", enterprise: "✅" },
                        { feature: "Consultoria especializada", basic: "❌", pro: "❌", enterprise: "✅" },
                        { feature: "Suporte", basic: "Email", pro: "Prioritário", enterprise: "24/7" }
                      ].map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-residuall-gray">{row.feature}</td>
                          <td className="px-6 py-4 text-center text-residuall-gray">{row.basic}</td>
                          <td className="px-6 py-4 text-center text-residuall-gray">{row.pro}</td>
                          <td className="px-6 py-4 text-center text-residuall-gray">{row.enterprise}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="section-padding bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="heading-lg text-center text-residuall-green mb-16">
                Perguntas Frequentes
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    question: "Como funciona o período de teste?",
                    answer: "Todos os planos pagos incluem um período de teste gratuito de 14 dias, sem necessidade de cartão de crédito. Durante esse período, você terá acesso a todas as funcionalidades do plano escolhido."
                  },
                  {
                    question: "Posso mudar de plano depois?",
                    answer: "Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. Se optar por um plano superior, a mudança será imediata. Para planos inferiores, a alteração será aplicada no próximo ciclo de faturamento."
                  },
                  {
                    question: "Como funcionam os acessos para equipe?",
                    answer: "No plano Básico, apenas o proprietário da conta tem acesso. O Profissional permite até 5 membros, cada um com seu próprio login. O Empresarial oferece acessos ilimitados com diferentes níveis de permissão."
                  },
                  {
                    question: "É possível cancelar a qualquer momento?",
                    answer: "Sim, você pode cancelar sua assinatura a qualquer momento, sem taxas adicionais. Sua conta permanecerá ativa até o final do período pago, e os dados ficarão disponíveis para exportação por 30 dias após o término."
                  }
                ].map((faq, index) => (
                  <div key={index} className="card-modern">
                    <h3 className="font-montserrat font-semibold text-lg text-residuall-green mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-residuall-gray leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="section-padding bg-residuall-gray-light">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="heading-lg text-center text-residuall-green mb-16">
                O que nossos clientes dizem
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    name: "João Paulo Silva",
                    role: "Engenheiro Civil",
                    company: "Construtora Horizonte",
                    content: "A plataforma RESIDUALL transformou a forma como gerenciamos nossos projetos. Conseguimos reduzir o desperdício de materiais em 25% no primeiro ano de uso.",
                    rating: 5
                  },
                  {
                    name: "Carla Mendes",
                    role: "Arquiteta",
                    company: "Studio Arquitetura",
                    content: "Como arquiteta, sempre me preocupei com o impacto ambiental. Com a RESIDUALL, finalmente tenho ferramentas para quantificar e reduzir esse impacto de forma tangível.",
                    rating: 5
                  }
                ].map((testimonial, index) => (
                  <div key={index} className="card-modern">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={20} className="text-residuall-orange fill-current" />
                      ))}
                    </div>
                    <p className="text-residuall-gray italic mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-residuall-green/10 rounded-full flex items-center justify-center mr-4">
                        <span className="text-residuall-green font-semibold text-lg">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-montserrat font-semibold text-residuall-green">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-residuall-gray">
                          {testimonial.role} • {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
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
