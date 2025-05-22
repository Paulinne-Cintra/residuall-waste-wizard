import React from 'react';
import DashboardHeader from '../components/DashboardHeader'; // Assumindo que você tem um DashboardHeader

const ArquivadosPage = () => {
  return (
    <div className="flex-1 p-4 bg-residuall-gray-light min-h-screen">
      <DashboardHeader title="Arquivados" /> {/* Inclui o cabeçalho */}
      <main className="container mx-auto py-6">
        <h1 className="text-2xl font-bold text-residuall-gray-dark mb-4">Página de Itens Arquivados</h1>
        <p className="text-lg text-residuall-gray">
          Aqui você encontrará todos os itens que foram arquivados.
        </p>
        {/* Conteúdo específico da página Arquivados virá aqui */}
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-residuall-gray-dark mb-3">Lista de Arquivados (Exemplo)</h2>
          <ul className="list-disc pl-5 text-residuall-gray">
            <li>Projeto X - Arquivado em 01/01/2023</li>
            <li>Relatório Anual - Arquivado em 15/02/2023</li>
            <li>Material Y - Arquivado em 10/03/2023</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default ArquivadosPage;
