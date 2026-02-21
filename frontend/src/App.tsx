import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { LandingPage } from "./pages/LandingPage";
import { CreateTicket } from "./pages/CreateTicket";
import { ClientDashboard } from "./pages/ClientDashboard";
import { AgentDashboard } from "./pages/AgentDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { TicketDetail } from "./pages/TicketDetail";
import { LoginPage } from "./components/auth/LoginPage";
import { RegisterPage } from "./components/auth/RegisterPage";
import { ForgotPasswordPage } from "./components/auth/ForgotPasswordPage";
import { KnowledgeBase } from "./pages/KnowledgeBase";
import { KnowledgeArticleForm } from "./pages/KnowledgeArticleForm";
import { KnowledgeArticleDetail } from "./pages/KnowledgeArticleDetail";
import { Toaster } from "sonner";

interface HomeRedirectProps {
  role: string | null; // O el tipo que tenga su rol
}

const HomeRedirect = ({ role }: HomeRedirectProps) => {
  if (role === "client") return <Navigate to="/dashboard" />;
  if (role === "agent") return <Navigate to="/agent-dashboard" />;
  if (role === "admin") return <Navigate to="/admin-dashboard" />;
  return <LandingPage />;
};

export default function App() {
  const [role, setRole] = useState("guest");

  // Simple redirection logic based on role for the root path

  const isStaff = role === "agent" || role === "admin";

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout role={role} setRole={setRole} />}>
          <Route index element={<HomeRedirect role={role} />} />
          <Route path="new-ticket" element={<CreateTicket />} />

          <Route
            path="check-ticket"
            element={
              <div className="flex items-center justify-center h-[50vh] flex-col gap-4">
                <h2 className="text-xl font-bold">Consultar Estado</h2>
                <input
                  className="border p-2 rounded w-64"
                  placeholder="Ingrese número de ticket (ej. TKT-2023...)"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                  Buscar
                </button>
              </div>
            }
          />

          <Route
            path="dashboard"
            element={
              role === "client" ? <ClientDashboard /> : <Navigate to="/" />
            }
          />

          <Route
            path="agent-dashboard"
            element={
              role === "agent" ? <AgentDashboard /> : <Navigate to="/" />
            }
          />

          <Route
            path="admin-dashboard"
            element={
              role === "admin" ? <AdminDashboard /> : <Navigate to="/" />
            }
          />

          <Route
            path="ticket/:id"
            element={<TicketDetail isAgent={isStaff} />}
          />

          {/* Knowledge Base Routes - Protected for Agents/Admins */}
          <Route
            path="knowledge-base"
            element={isStaff ? <KnowledgeBase /> : <Navigate to="/" />}
          />
          <Route
            path="knowledge-base/new"
            element={isStaff ? <KnowledgeArticleForm /> : <Navigate to="/" />}
          />
          <Route
            path="knowledge-base/:id"
            element={isStaff ? <KnowledgeArticleDetail /> : <Navigate to="/" />}
          />
          <Route
            path="knowledge-base/:id/edit"
            element={isStaff ? <KnowledgeArticleForm /> : <Navigate to="/" />}
          />

          <Route path="login" element={<LoginPage setRole={setRole} />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
