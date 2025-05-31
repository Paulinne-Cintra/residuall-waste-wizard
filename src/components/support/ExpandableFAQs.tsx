
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronDown, ChevronUp } from "lucide-react";

const ExpandableFAQs = () => {
  const [showAll, setShowAll] = useState(false);

  const faqCategories = [
    {
      category: "Relatórios",
      questions: [
        {
          question: "Como gerar um relatório de desperdício?",
          answer: "Acesse a página 'Relatórios' e clique em 'Gerar Novo Relatório'. Selecione o projeto e o período desejado para visualizar os dados de desperdício."
        },
        {
          question: "Posso exportar os relatórios em PDF?",
          answer: "Sim, todos os relatórios podem ser exportados em formato PDF clicando no botão 'Exportar' no canto superior direito do relatório."
        },
        {
          question: "Como interpretar os gráficos de desperdício?",
          answer: "Os gráficos mostram a evolução do desperdício ao longo do tempo. As cores indicam diferentes categorias de materiais e a intensidade representa o volume desperdiçado."
        }
      ]
    },
    {
      category: "Projetos",
      questions: [
        {
          question: "Como criar um novo projeto?",
          answer: "Vá para a página 'Projetos' e clique em 'Novo Projeto'. Preencha as informações básicas como nome, localização, tipo e orçamento."
        },
        {
          question: "Posso arquivar projetos antigos?",
          answer: "Sim, projetos finalizados podem ser arquivados através do menu de ações do projeto. Eles continuarão acessíveis na seção 'Arquivados'."
        },
        {
          question: "Como definir etapas de um projeto?",
          answer: "Nas configurações do projeto, você pode definir as etapas principais como fundação, estrutura, acabamento, etc."
        }
      ]
    },
    {
      category: "Time",
      questions: [
        {
          question: "Como convidar membros para o time?",
          answer: "Na página 'Time', clique em 'Convidar Membro' e digite o email da pessoa. Ela receberá um convite por email para se juntar ao seu time."
        },
        {
          question: "Quais são os níveis de permissão?",
          answer: "Temos três níveis: Visualizador (apenas leitura), Editor (pode editar dados) e Administrador (controle total do projeto)."
        },
        {
          question: "Como remover um membro do time?",
          answer: "Vá para a página 'Time', encontre o membro e clique nas opções ao lado do nome. Selecione 'Remover do Time'."
        }
      ]
    },
    {
      category: "Materiais",
      questions: [
        {
          question: "Como cadastrar novos tipos de materiais?",
          answer: "Na página 'Materiais', clique em 'Adicionar Material' e preencha as informações como nome, unidade de medida e categoria."
        },
        {
          question: "Posso importar uma lista de materiais?",
          answer: "Sim, oferecemos a opção de importar via arquivo CSV. Use o modelo disponível na página de materiais."
        },
        {
          question: "Como rastrear o uso de materiais?",
          answer: "O sistema rastreia automaticamente quando você registra entradas de desperdício, calculando o uso efetivo versus o planejado."
        }
      ]
    }
  ];

  return (
    <div>
      {showAll && (
        <div className="mt-6 space-y-6">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h4 className="text-lg font-semibold text-residuall-gray-dark mb-3">
                {category.category}
              </h4>
              <Accordion type="single" collapsible className="space-y-2">
                {category.questions.map((faq, index) => (
                  <AccordionItem 
                    key={`${categoryIndex}-${index}`} 
                    value={`${categoryIndex}-${index}`}
                    className="border border-gray-200 rounded-lg px-4"
                  >
                    <AccordionTrigger className="text-left hover:no-underline">
                      <span className="font-medium text-residuall-gray-dark">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-residuall-gray pb-2">
                        {faq.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      )}
      
      <Button 
        onClick={() => setShowAll(!showAll)} 
        variant="outline"
        className="mt-4 text-residuall-green border-residuall-green hover:bg-residuall-green hover:text-white"
      >
        {showAll ? (
          <>
            <ChevronUp size={16} className="mr-2" />
            Mostrar Menos FAQs
          </>
        ) : (
          <>
            <ChevronDown size={16} className="mr-2" />
            Ver Todas as FAQs
          </>
        )}
      </Button>
    </div>
  );
};

export default ExpandableFAQs;
