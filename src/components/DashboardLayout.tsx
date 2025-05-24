// src/components/DashboardLayout.tsx
import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom'; // Importe useNavigate e Link
import SidebarDashboard from './SidebarDashboard'; // Componente SidebarDashboard que você já tem
import { Search, Bell, ChevronDown, LogOut } from 'lucide-react'; // Ícones para o header do dashboard
import { supabase } from '../lib/supabaseClient'; // Importe o cliente Supabase

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate(); // Inicialize useNavigate

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Erro ao fazer logout:', error.message);
      // Opcional: mostrar uma mensagem de erro para o usuário
    } else {
      console.log('Usuário deslogado com sucesso!');
      navigate('/login'); // Redireciona para a página de login após o logout
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100"> {/* Fundo leve para o dashboard */}
      {/* Sidebar - Onde está o SidebarDashboard que você já tem */}
      <SidebarDashboard /> 

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header do Dashboard */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10">
          <div className="flex items-center flex-grow">
            <Search size={20} className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Buscar projetos, relatórios..."
              className="header-search" // Usando a classe global do index.css
            />
          </div>
          <div className="flex items-center space-x-4 ml-auto"> {/* Alinhado à direita */}
            <button className="p-2 text-gray-600 hover:text-residuall-green transition-colors">
              <Bell size={20} />
            </button>
            <div className="flex items-center cursor-pointer">
              {/* Avatar do Usuário */}
              <img
                src="https://via.placeholder.com/32" // Substitua por uma imagem real do usuário
                alt="User Avatar"
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="text-gray-700 font-medium hidden md:block">
                Engª. Cristiana Soares
              </span>
              <ChevronDown size={16} className="text-gray-500 ml-1 hidden md:block" />
            </div>
            {/* Botão "Publish" conforme a imagem */}
            <button className="bg-residuall-green text-white px-4 py-2 rounded-lg font-medium hover:bg-residuall-green/90 transition-colors hidden md:block">
              Publish
            </button>
            {/* Botão de Logout adicionado aqui */}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center gap-1"
            >
              <LogOut size={18} /> Sair
            </button>
          </div>
        </header>

        {/* Conteúdo específico da página do Dashboard (children via Outlet) */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
