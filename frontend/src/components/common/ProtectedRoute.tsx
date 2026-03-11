import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // La llave que creamos antes
import { LoadingSkeleton } from "./LoadingSkeleton";
import type { UserRole } from "@/types/enums";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  // 1. ESTADO DE CARGA: El guardia está verificando la lista.
  // Si no esperamos a que termine de leer el localStorage, echaríamos a usuarios legítimos.
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // 2. AUTENTICACIÓN: ¿Tiene pasaporte?
  // Si el usuario es null (la billetera está vacía), lo expulsamos a la calle (Login).
  if (!user) {
    // El atributo 'replace' borra el intento fallido del historial del navegador.
    // Así, si el usuario presiona el botón "Atrás", no vuelve a esta ruta protegida.
    return <Navigate to="/login" replace />;
  }

  // 3. AUTORIZACIÓN (Opcional): ¿Tiene el nivel de acceso correcto?
  // Si la ruta exige roles específicos y el rol del usuario no está en la lista, se le niega el paso.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
    // O lo redirigimos a su dashboard correspondiente según su rol.
  }

  // 4. ACCESO CONCEDIDO: Pase a la bóveda.
  // <Outlet /> es un componente especial de React Router que significa:
  // "Renderiza cualquier componente hijo que esté anidado dentro de esta ruta".
  return <Outlet />;
}
