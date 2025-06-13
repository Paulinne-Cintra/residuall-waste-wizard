
import React from 'react';
import DashboardHeader from '../components/DashboardHeader';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Info, HelpCircle } from "lucide-react";
import ExpandableFAQs from '../components/support/ExpandableFAQs';
import SupportTicketForm from '../components/support/SupportTicketForm';
import SupportTicketsList from '../components/support/SupportTicketsList';

const AjudaPage = () => {
  const { toast } = useToast();

  const handleViewFAQs = () => {
    toast({
      title: "Informação",
      description: "Ainda estamos compilando as FAQs!",
      duration: 3000,
    });
  };

  return (
    <div className="flex-1 p-6 bg-residuall-gray-light">
      <DashboardHeader pageTitle="Central de Ajuda" />

      <div className="mt-6 space-y-8">
        {/* Seção de Perguntas Frequentes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-residuall-gray-dark">
            <Info size={20} className="mr-2 text-residuall-green" /> Perguntas Frequentes
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-residuall-gray-dark">Como redefinir minha senha?</h3>
              <p className="text-residuall-gray text-sm">Vá para as configurações de perfil e clique em "Alterar senha".</p>
            </div>
            <div>
              <h3 className="font-medium text-residuall-gray-dark">Onde encontro meus relatórios antigos?</h3>
              <p className="text-residuall-gray text-sm">Seus relatórios antigos podem ser encontrados na página 'Arquivados'.</p>
            </div>
            <div>
              <h3 className="font-medium text-residuall-gray-dark">Como adiciono um novo membro à minha equipe?</h3>
              <p className="text-residuall-gray text-sm">Acesse a página 'Time' e clique no botão "Adicionar Membro" para convidar novos usuários.</p>
            </div>
          </div>
          
          <ExpandableFAQs />
        </div>

        {/* Seção de Suporte Direto */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-residuall-gray-dark">
            <MessageSquare size={20} className="mr-2 text-residuall-green" /> Precisa de Ajuda Direta?
          </h2>
          <p className="text-residuall-gray mb-4">Se você não encontrou a resposta, nossa equipe de suporte está pronta para ajudar.</p>
          <SupportTicketForm />
        </div>

        {/* Seção de Registros de Chamados */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-residuall-gray-dark">
            <HelpCircle size={20} className="mr-2 text-residuall-green" /> Seus Chamados de Suporte
          </h2>
          <SupportTicketsList />
        </div>
      </div>
    </div>
  );
};

export default AjudaPage;
