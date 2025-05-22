
import React, { useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AjudaPage = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqItems = [
    {
      id: 1,
      question: 'Como criar um novo projeto?',
      answer: 'Para criar um novo projeto, navegue até a página "Projetos", clique no botão "Novo Projeto" e preencha os campos obrigatórios no formulário que será aberto. Após preencher todas as informações necessárias, clique em "Salvar".'
    },
    {
      id: 2,
      question: 'Onde encontro meus relatórios?',
      answer: 'Seus relatórios podem ser encontrados na seção "Relatórios" do menu lateral. Lá você pode filtrar e buscar por diferentes tipos de relatórios gerados no sistema.'
    },
    {
      id: 3,
      question: 'Como atualizar meu perfil?',
      answer: 'Para atualizar seu perfil, clique no seu nome ou foto no canto superior direito da tela e selecione "Meu Perfil". Na página de perfil, você pode editar suas informações pessoais, alterar sua foto e atualizar suas preferências.'
    },
    {
      id: 4,
      question: 'Problemas de login?',
      answer: 'Se estiver tendo problemas para fazer login, verifique se suas credenciais estão corretas. Caso tenha esquecido sua senha, use a opção "Esqueci minha senha" na tela de login. Se o problema persistir, entre em contato com o suporte técnico.'
    },
  ];

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="flex-1 flex flex-col bg-residuall-gray-light min-h-screen">
      <DashboardHeader title="Ajuda e Suporte" />
      
      <main className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-residuall-gray-dark mb-2">Central de Ajuda</h1>
          <p className="text-lg text-residuall-gray">
            Encontre respostas para suas perguntas frequentes e obtenha suporte quando necessário.
          </p>
        </div>

        <div className="flex mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'faq' 
              ? 'text-residuall-green border-b-2 border-residuall-green' 
              : 'text-residuall-gray hover:text-residuall-gray-dark'}`}
            onClick={() => setActiveTab('faq')}
          >
            Perguntas Frequentes
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'support' 
              ? 'text-residuall-green border-b-2 border-residuall-green' 
              : 'text-residuall-gray hover:text-residuall-gray-dark'}`}
            onClick={() => setActiveTab('support')}
          >
            Fale Conosco
          </button>
        </div>

        {activeTab === 'faq' ? (
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Perguntas Frequentes (FAQ)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqItems.map((item) => (
                    <div key={item.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                      <button
                        className="flex justify-between items-center w-full text-left font-medium text-residuall-gray-dark hover:text-residuall-green"
                        onClick={() => toggleFaq(item.id)}
                      >
                        <span>{item.question}</span>
                        <span className="text-xl">{expandedFaq === item.id ? '−' : '+'}</span>
                      </button>
                      {expandedFaq === item.id && (
                        <p className="mt-2 text-residuall-gray text-sm">
                          {item.answer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <button className="bg-residuall-green text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300">
                    Ver Todas as FAQs
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Tutoriais em Vídeo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-200 h-32 flex items-center justify-center">
                        <span className="text-residuall-gray">Miniatura do Vídeo {item}</span>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-residuall-gray-dark">Tutorial {item}</h3>
                        <p className="text-sm text-residuall-gray">Descrição breve do tutorial em vídeo.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Fale Conosco</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-residuall-gray mb-6">
                  Se você não encontrou o que procurava, entre em contato com nossa equipe de suporte. Estamos disponíveis para ajudar.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-medium text-residuall-gray-dark mb-2">Informações de Contato</h3>
                    <p className="text-residuall-gray">Email: suporte@residuall.com</p>
                    <p className="text-residuall-gray">Telefone: (XX) XXXX-XXXX</p>
                    <p className="text-residuall-gray">Horário de Atendimento: Seg-Sex, 9h às 18h</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-residuall-gray-dark mb-2">Suporte Prioritário</h3>
                    <p className="text-residuall-gray">
                      Clientes com planos premium têm acesso ao suporte prioritário com tempo de resposta reduzido.
                    </p>
                  </div>
                </div>
                
                <div className="text-center">
                  <button className="bg-residuall-green text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300">
                    Abrir um Chamado
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Perguntas Recentes da Comunidade</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <li key={item} className="pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                      <p className="font-medium text-residuall-gray-dark">Como faço para exportar relatórios em formato PDF?</p>
                      <p className="text-sm text-residuall-gray mt-1">Perguntado há {item} dia{item !== 1 ? 's' : ''}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default AjudaPage;
