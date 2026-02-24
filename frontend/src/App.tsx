import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { Layout } from "./components/common/Layout";
import { LandingPage } from "./components/common/LandingPage";
import { CreateTicket } from "./pages/tickets/CreateTicket";
import { ClientDashboard } from "./pages/client/ClientDashboard";
import { AgentDashboard } from "./pages/agent/AgentDashboard";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { TicketDetail } from "./pages/tickets/TicketDetail";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { KnowledgeBase } from "./pages/article/KnowledgeBase";
import { KnowledgeArticleForm } from "./pages/article/KnowledgeArticleForm";
import { KnowledgeArticleDetail } from "./pages/article/KnowledgeArticleDetail";
import { UnauthorizedPage } from "./components/common/UnauthorizedPage";
import { Toaster } from "sonner";
import { LoadingSkeleton } from "./components/common/LoadingSkeleton";
import NotFound from "./components/common/NotFound";

// Componente que redirige al usuario según su rol
function HomeRedirect() {
  const { user, isLoading } = useAuth();

  // Si está cargando, poner el skeleton de carga
  if (isLoading) return <LoadingSkeleton />;

  // Si hay usuario, redirigir según su rol
  if (user) {
    if (user.role === "CLIENTE") return <Navigate to="/dashboard" replace />;
    if (user.role === "AGENTE")
      return <Navigate to="/agent-dashboard" replace />;
    if (user.role === "ADMIN")
      return <Navigate to="/admin-dashboard" replace />;
  }

  // Si no hay usuario, mostrar landing page
  return <LandingPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomeRedirect />} />

            {/* Rutas públicas */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="unauthorized" element={<UnauthorizedPage />} />

            {/* Rutas protegidas para CLIENTES */}
            <Route element={<ProtectedRoute allowedRoles={["CLIENTE"]} />}>
              <Route path="dashboard" element={<ClientDashboard />} />
            </Route>

            {/* Rutas protegidas para AGENTES y ADMIN */}
            <Route
              element={<ProtectedRoute allowedRoles={["AGENTE", "ADMIN"]} />}
            >
              <Route path="agent-dashboard" element={<AgentDashboard />} />
              <Route path="knowledge-base" element={<KnowledgeBase />} />
              <Route
                path="knowledge-base/new"
                element={<KnowledgeArticleForm />}
              />
              <Route
                path="knowledge-base/:id"
                element={<KnowledgeArticleDetail />}
              />
              <Route
                path="knowledge-base/:id/edit"
                element={<KnowledgeArticleForm />}
              />
            </Route>

            {/* Rutas protegidas solo para ADMIN */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="admin-dashboard" element={<AdminDashboard />} />
            </Route>

            {/* Rutas protegidas para usuarios autenticados (cualquier rol) */}
            <Route element={<ProtectedRoute allowedRoles={["CLIENTE", "AGENTE", "ADMIN"]} />}>
              <Route path="ticket/:id" element={<TicketDetail />} />
              <Route path="new-ticket" element={<CreateTicket />} />
            </Route>

            <Route path="*" element={<NotFound />} />

          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}
