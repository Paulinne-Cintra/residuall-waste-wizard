
import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PaymentProtectedRoute } from "@/components/PaymentProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";

// Lazy loading das páginas para melhor performance
const Index = lazy(() => import("./pages/Index"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const PlansPage = lazy(() => import("./pages/PlansPage"));
const ConfirmationPage = lazy(() => import("./pages/ConfirmationPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));

// Dashboard pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const CreateProjectPage = lazy(() => import("./pages/CreateProjectPage"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage"));
const MaterialsPage = lazy(() => import("./pages/MaterialsPage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const ReportDetailPage = lazy(() => import("./pages/ReportDetailPage"));
const TeamPage = lazy(() => import("./pages/TeamPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const RecommendationsPage = lazy(() => import("./pages/RecommendationsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const ArquivadosPage = lazy(() => import("./pages/ArquivadosPage"));
const AjudaPage = lazy(() => import("./pages/AjudaPage"));
const SearchResultsPage = lazy(() => import("./pages/SearchResultsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-residuall-green"></div>
          </div>}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cadastro" element={<RegisterPage />} />
              <Route path="/planos" element={<PlansPage />} />
              <Route path="/sobre" element={<AboutPage />} />
              
              {/* Protected routes that require authentication */}
              <Route path="/pagamento" element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              } />
              
              <Route path="/confirmacao" element={
                <ProtectedRoute>
                  <ConfirmationPage />
                </ProtectedRoute>
              } />

              {/* Dashboard routes - require both authentication and payment */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <PaymentProtectedRoute>
                    <DashboardLayout />
                  </PaymentProtectedRoute>
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="projetos" element={<ProjectsPage />} />
                <Route path="projetos/novo" element={<CreateProjectPage />} />
                <Route path="projetos/:id" element={<ProjectDetailPage />} />
                <Route path="materiais" element={<MaterialsPage />} />
                <Route path="relatorios" element={<ReportsPage />} />
                <Route path="relatorios/:id" element={<ReportDetailPage />} />
                <Route path="time" element={<TeamPage />} />
                <Route path="perfil" element={<ProfilePage />} />
                <Route path="recomendacoes" element={<RecommendationsPage />} />
                <Route path="configuracoes" element={<SettingsPage />} />
                <Route path="arquivados" element={<ArquivadosPage />} />
                <Route path="ajuda" element={<AjudaPage />} />
                <Route path="busca" element={<SearchResultsPage />} />
              </Route>

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
