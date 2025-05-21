
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
import OverviewPage from "./pages/OverviewPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import MaterialsPage from "./pages/MaterialsPage";
import ReportsPage from "./pages/ReportsPage";
import TeamPage from "./pages/TeamPage";
import ProfilePage from "./pages/ProfilePage";

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
          <Route path="/dashboard" element={<OverviewPage />} />
          <Route path="/dashboard/projetos" element={<ProjectsPage />} />
          <Route path="/dashboard/projetos/:id" element={<ProjectDetailPage />} />
          <Route path="/dashboard/materiais" element={<MaterialsPage />} />
          <Route path="/dashboard/relatorios" element={<ReportsPage />} />
          <Route path="/dashboard/time" element={<TeamPage />} />
          <Route path="/dashboard/perfil" element={<ProfilePage />} />
          
          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
