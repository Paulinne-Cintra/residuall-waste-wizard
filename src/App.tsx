
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Páginas principais do site
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import PlansPage from "./pages/PlansPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Páginas do dashboard
import Dashboard from "./pages/Dashboard";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import MaterialsPage from "./pages/MaterialsPage";
import ReportsPage from "./pages/ReportsPage";
import TeamPage from "./pages/TeamPage";
import ProfilePage from "./pages/ProfilePage";
import RecommendationsPage from "./pages/RecommendationsPage";
import SettingsPage from "./pages/SettingsPage";
import ArquivadosPage from "./pages/ArquivadosPage";
import AjudaPage from "./pages/AjudaPage";

import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/planos" element={<PlansPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />
          
          {/* Rotas do dashboard (protegidas) */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="projetos" element={<ProjectsPage />} />
            <Route path="projetos/:id" element={<ProjectDetailPage />} />
            <Route path="materiais" element={<MaterialsPage />} />
            <Route path="relatorios" element={<ReportsPage />} />
            <Route path="time" element={<TeamPage />} />
            <Route path="perfil" element={<ProfilePage />} />
            <Route path="recomendacoes" element={<RecommendationsPage />} />
            <Route path="configuracoes" element={<SettingsPage />} />
            <Route path="arquivados" element={<ArquivadosPage />} />
            <Route path="ajuda" element={<AjudaPage />} />
          </Route>
          
          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
