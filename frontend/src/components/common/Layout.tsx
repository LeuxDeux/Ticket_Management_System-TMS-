import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { MessageSquare, Shield, LogOut, User } from "lucide-react";

export function Layout() {
  const { user, logout, isLoading } = useAuth();

  // Mostrar navbar simplificada mientras carga
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
        <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="container flex h-16 items-center px-4 max-w-7xl mx-auto">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              <span className="hidden font-bold sm:inline-block">
                SupportHub
              </span>
            </Link>
          </div>
        </nav>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center px-4 max-w-7xl mx-auto">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            <span className="hidden font-bold sm:inline-block">SupportHub</span>
          </Link>

          <div className="flex-1" />

          <div className="ml-auto flex items-center space-x-4">
            {!user ? (
              <>
                <Link to="/login">
                  <Button variant="ghost">Iniciar Sesión</Button>
                </Link>
                <Link to="/register">
                  <Button variant="ghost">Registrarse</Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {user.role === "ADMIN" && (
                    <Shield className="h-4 w-4 text-blue-600" />
                  )}
                  {user.role === "AGENTE" && (
                    <User className="h-4 w-4 text-green-600" />
                  )}
                  <span className="text-sm font-medium hidden md:block">
                    {user.name || user.email}
                  </span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={logout}
                  title="Cerrar sesión"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
