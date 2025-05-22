import React from 'react';
import DashboardHeader from '../components/DashboardHeader';
import SidebarDashboard from '../components/SidebarDashboard';
import { Button } from '@/components/ui/button';
import { toast } from "@/components/ui/use-toast";
import { MessageCircle, FileText, Phone, Mail, HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const AjudaPage = () => {
  const handleFaqClick = () => {
    toast({
      title: "Em desenvolvimento",
      description: "Ainda estamos compilando as FAQs!",
      variant: "default",
      className: "bg-yellow-50 border-yellow-200 text-yellow-800",
    });
  };

  const handleContactClick = () => {
    toast({
      title: "Em breve",
      description: "Formulário de contato em breve!",
      variant: "default",
      className: "bg-blue-50 border-blue-200 text-blue-800",
    });
  };

  const faqs = [
    {
      id: 1,
      question: "Como cadastrar um novo projeto?",
      answer: "Para cadastrar um novo projeto, acesse o menu 'Projetos' e clique no botão 'Novo Projeto'. Preencha todos os campos obrigatórios e clique em 'Salvar'."
    },
    {
      id: 2,
      question: "Como gerar um relatório?",
      answer: "Para gerar um relatório, acesse o menu 'Relatórios' e clique no botão '+ Novo Relatório'. Selecione o tipo de relatório desejado, defina os filtros e clique em 'Gerar'."
    },
    {
      id: 3,
      question: "Como adicionar um novo membro à equipe?",
      answer: "Para adicionar um novo membro à equipe, acesse o menu 'Time', clique em 'Adicionar Membro' e preencha o formulário com os dados do novo colaborador."
    }
  ];

  return (
    <div className="flex min-h-screen bg-residuall-gray-light">
      <SidebarDashboard />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="Ajuda e Suporte" />

        <main className="container mx-auto py-6 px-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-residuall-gray-dark mb-2">Centro de Ajuda</h1>
            <p className="text-lg text-residuall-gray">
              Encontre respostas para suas dúvidas ou entre em contato com nossa equipe de suporte.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-residuall-green bg-opacity-10 p-3 rounded-full">
                  <HelpCircle className="text-residuall-green" size={24} />
                </div>
                <h2 className="text-xl font-semibold text-residuall-gray-dark ml-3">Perguntas Frequentes</h2>
              </div>
              <p className="text-residuall-gray mb-4">
                Consulte nossa base de conhecimento para encontrar respostas rápidas para suas dúvidas mais comuns.
              </p>
              <Button 
                className="w-full bg-residuall-green hover:bg-residuall-green-light"
                onClick={handleFaqClick}
              >
                Ver Todas as FAQs
              </Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-residuall-brown bg-opacity-10 p-3 rounded-full">
                  <MessageCircle className="text-residuall-brown" size={24} />
                </div>
                <h2 className="text-xl font-semibold text-residuall-gray-dark ml-3">Fale Conosco</h2>
              </div>
              <p className="text-residuall-gray mb-4">
                Não encontrou o que procurava? Entre em contato com nossa equipe de suporte para obter ajuda personalizada.
              </p>
              <Button 
                className="w-full bg-residuall-brown hover:bg-residuall-brown-light"
                onClick={handleContactClick}
              >
                Abrir um Chamado
              </Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-blue-500 bg-opacity-10 p-3 rounded-full">
                  <FileText className="text-blue-500" size={24} />
                </div>
                <h2 className="text-xl font-semibold text-residuall-gray-dark ml-3">Documentação</h2>
              </div>
              <p className="text-residuall-gray mb-4">
                Acesse guias detalhados, tutoriais e documentação técnica sobre o uso da plataforma Residuall.
              </p>
              <Button 
                className="w-full bg-blue-500 hover:bg-blue-600"
                onClick={handleFaqClick}
              >
                Ver Documentação
              </Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold text-residuall-gray-dark mb-4">Perguntas Frequentes</h2>
            <Accordion type="multiple" className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
                  <AccordionTrigger className="text-residuall-gray-dark font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-residuall-gray">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                onClick={handleFaqClick}
                className="border-residuall-green text-residuall-green hover:bg-residuall-green hover:text-white"
              >
                Ver mais perguntas frequentes
              </Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-residuall-gray-dark mb-4">Contatos Úteis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="bg-residuall-gray-light p-3 rounded-full mr-3">
                  <Phone size={20} className="text-residuall-gray-dark" />
                </div>
                <div>
                  <h3 className="font-medium text-residuall-gray-dark">Suporte Técnico</h3>
                  <p className="text-residuall-gray">(11) 1234-5678</p>
                  <p className="text-sm text-residuall-gray">Seg-Sex: 8h às 18h</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-residuall-gray-light p-3 rounded-full mr-3">
                  <Mail size={20} className="text-residuall-gray-dark" />
                </div>
                <div>
                  <h3 className="font-medium text-residuall-gray-dark">Email de Contato</h3>
                  <p className="text-residuall-gray">suporte@residuall.com</p>
                  <p className="text-sm text-residuall-gray">Resposta em até 24h</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AjudaPage;
