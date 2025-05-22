import React from 'react';
// Certifique-se de que o caminho para DashboardHeader esteja correto
import DashboardHeader from '../components/DashboardHeader';

const AjudaPage = () => {
  return (
    <div className="flex-1 p-4 bg-residuall-gray-light min-h-screen">
      {/* O DashboardHeader deve ser o componente que contém o título, busca e perfil do usuário */}
      <DashboardHeader title="Ajuda e Suporte" />
      <main className="container mx-auto py-6">
        <h1 className="text-2xl font-bold text-residuall-gray-dark mb-4">Central de Ajuda</h1>
        <p className="text-lg text-residuall-gray mb-6">
          Encontre respostas para suas perguntas frequentes e obtenha suporte.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-residuall-gray-dark mb-3">Perguntas Frequentes (FAQ)</h2>
            <ul className="list-disc pl-5 text-residuall-gray">
              <li>Como criar um novo projeto?</li>
              <li>Onde encontro meus relatórios?</li>
              <li>Como atualizar meu perfil?</li>
              <li>Problemas de login?</li>
            </ul>
            <button className="mt-4 bg-residuall-green text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300">
              Ver Todas as FAQs
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-residuall-gray-dark mb-3">Fale Conosco</h2>
            <p className="text-residuall-gray mb-3">
              Se você não encontrou o que procurava, entre em contato com nossa equipe de suporte.
            </p>
            <p className="text-residuall-gray">Email: suporte@residuall.com</p>
            <p className="text-residuall-gray">Telefone: (XX) XXXX-XXXX</p>
            <button className="mt-4 bg-residuall-green text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300">
              Abrir um Chamado
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AjudaPage;
