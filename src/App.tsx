
// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Importe Navigate

// Auth Provider
import { AuthProvider, useAuth } from "@/hooks/useAuth"; // Importa useAuth para o componente AppRouter
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Páginas principais do site
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import PlansPage from "./pages/PlansPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"; // Assumindo que você tem essa página

// Páginas do dashboard
import Dashboard from "./pages/Dashboard"; // Página inicial do dashboard
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ReportDetailPage from "./pages/ReportDetailPage";
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

// Componente auxiliar para a lógica de roteamento principal
const AppRoutes = () => {
  const { user, loading } = useAuth(); // Usar o useAuth aqui para decidir o redirecionamento inicial

  // Opcional: Um carregamento global enquanto a sessão inicial é verificada
  // Se o useAuth já exibe um spinner em ProtectedRoute, talvez não precise duplicar
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-residuall-green-default"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <HomePage />} /> {/* Ajuste aqui: se logado, vai para dashboard */}
      <Route path="/sobre" element={<AboutPage />} />
      <Route path="/planos" element={<PlansPage />} />
      <Route path="/login" element={<LoginPage />} /> {/* LoginPage já redireciona se o usuário estiver logado */}
      <Route path="/cadastro" element={<RegisterPage />} />
      
      {/* Rotas do dashboard (protegidas) */}
      {/* A rota pai é protegida e usa DashboardLayout para todas as rotas filhas */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} /> {/* Rota padrão para /dashboard */}
        <Route path="projetos" element={<ProjectsPage />} />
        <Route path="projetos/:projectId" element={<ProjectDetailPage />} />
        <Route path="materiais" element={<MaterialsPage />} />
        <Route path="relatorios" element={<ReportsPage />} />
        <Route path="relatorios/:reportId" element={<ReportDetailPage />} />
        <Route path="time" element={<TeamPage />} />
        <Route path="perfil" element={<ProfilePage />} />
        <Route path="recomendacoes" element={<RecommendationsPage />} />
        <Route path="configuracoes" element={<SettingsPage />} />
        <Route path="arquivados" element={<ArquivadosPage />} />
        <Route path="ajuda" element={<AjudaPage />} />
      </Route>
      
      {/* Rota 404 para URLs não correspondentes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider> {/* AuthProvider deve envolver TODO o Router */}
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes /> {/* O componente AppRoutes que contém as rotas */}
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
