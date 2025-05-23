import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarDashboard from './SidebarDashboard';

const DashboardLayout = () => {
  return (
    // REMOVIDA a classe bg-residuall-gray-light daqui.
    // O fundo do body (com o gradiente animado) agora será visível.
    <div className="flex min-h-screen"> 
      <SidebarDashboard />
      <main className="flex-1 flex flex-col">
        {/* Você pode querer adicionar um padding aqui se suas páginas não tiverem um próprio */}
        {/* <div className="p-6">  <- Exemplo de como adicionar padding se necessário */}
          <Outlet />
        {/* </div> */}
      </main>
    </div>
  );
};

export default DashboardLayout;
