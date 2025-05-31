
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';

// Pages
import Index from './pages/Index';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PlansPage from './pages/PlansPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import OverviewPage from './pages/OverviewPage';
import ProjectsPage from './pages/ProjectsPage';
import CreateProjectPage from './pages/CreateProjectPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import MaterialsPage from './pages/MaterialsPage';
import ReportsPage from './pages/ReportsPage';
import ReportDetailPage from './pages/ReportDetailPage';
import RecommendationsPage from './pages/RecommendationsPage';
import TeamPage from './pages/TeamPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import AjudaPage from './pages/AjudaPage';
import ArquivadosPage from './pages/ArquivadosPage';
import NotFound from './pages/NotFound';

// Components
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/sobre" element={<AboutPage />} />
              <Route path="/planos" element={<PlansPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cadastro" element={<RegisterPage />} />
              
              {/* Protected Dashboard Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
                <Route index element={<OverviewPage />} />
                <Route path="projetos" element={<ProjectsPage />} />
                <Route path="projetos/novo" element={<CreateProjectPage />} />
                <Route path="projetos/:id" element={<ProjectDetailPage />} />
                <Route path="materiais" element={<MaterialsPage />} />
                <Route path="relatorios" element={<ReportsPage />} />
                <Route path="relatorios/:id" element={<ReportDetailPage />} />
                <Route path="recomendacoes" element={<RecommendationsPage />} />
                <Route path="equipe" element={<TeamPage />} />
                <Route path="configuracoes" element={<SettingsPage />} />
                <Route path="perfil" element={<ProfilePage />} />
                <Route path="ajuda" element={<AjudaPage />} />
                <Route path="arquivados" element={<ArquivadosPage />} />
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
