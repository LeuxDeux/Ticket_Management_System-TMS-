// Importar React y hooks necesarios de React
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";
// Importar el servicio de autenticación que maneja las peticiones al backend
import authServices from "../services/authServices";
import type { User } from "@/types/user"; // Importar el tipo User para tipar el estado del usuario
import { USERS, MOCK_CREDENTIALS } from "../mock/data";

// ! Modo MOCK: Esta flag se encarga de activar el uso de datos simulados
// Cuando la API esté lista, se cambia a falso y se usan llamadas reales al backend
const USE_MOCK = true;

// Tipos para el contexto de autenticación
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: () => boolean;
  loading: boolean;
  isLoading: boolean; // Alias para loading (mejor semántica)
  isAdmin: boolean;
  isAgent: boolean;
  isClient: boolean;
}

// Props para el AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Crear el contexto de autenticación
// Este contexto permitirá compartir el estado de autenticación en toda la aplicación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto de autenticación
// Este componente envuelve la aplicación y proporciona el estado y funciones de autenticación
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Estado para almacenar la información del usuario actual (id, username, role)
  // Inicialmente es null porque no hay usuario autenticado
  const [user, setUser] = useState<User | null>(null);

  // Estado para indicar si estamos cargando la información de autenticación
  // Esto previene que se muestre contenido antes de verificar la autenticación
  const [loading, setLoading] = useState<boolean>(true);

  // Estado para almacenar el token de autenticación JWT
  // El token se usa para autenticar peticiones al backend
  const [token, setToken] = useState<string | null>(null);

  // useEffect se ejecuta cuando el componente se monta
  // Verifica si hay un token guardado en localStorage y lo valida con el backend
  useEffect(() => {
    // Función asíncrona para verificar si el usuario tiene una sesión activa
    const checkAuth = async () => {
      // ! Modo MOCK: cargar el usuario simulado desde localStorage
      if (USE_MOCK) {
        const storedUser = localStorage.getItem("mock-user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setToken("mock-token");
        }
        setLoading(false);
        return;
      }

      try {
        // Intentar obtener el token guardado en localStorage
        const storedToken = authServices.getToken();

        // Si existe un token guardado
        if (storedToken) {
          // Guardar el token en el estado
          setToken(storedToken);

          // Validar el token con el backend llamando al endpoint /auth/me
          // Esto verifica que el token sea válido y no haya expirado
          const userData = await authServices.validateToken();

          // Si la validación es exitosa, guardar los datos del usuario
          // El backend devuelve: id, username, role
          setUser(userData);
        }
      } catch (error) {
        // Si el token es inválido o ha expirado
        console.error("Error validando token:", error);
        // Limpiar el token y usuario del estado
        setToken(null);
        setUser(null);
        // El servicio ya eliminó el token de localStorage en caso de error
      } finally {
        // Finalizar el estado de carga sin importar si fue exitoso o no
        // Esto permite que la aplicación se renderice después de verificar la autenticación
        setLoading(false);
      }
    };

    // Ejecutar la función de verificación
    checkAuth();
  }, []); // Array vacío [] significa que solo se ejecuta una vez al montar el componente

  // Función para iniciar sesión
  // Recibe username y password del formulario de login
  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    // ! Modo MOCK: buscar el usuario simulado en el array USERS
    if (USE_MOCK) {
      const found = USERS.find((u) => u.email === username);
      if (found && MOCK_CREDENTIALS[username] === password) {
        setUser(found);
        setToken("mock-token");
        localStorage.setItem("mock-user", JSON.stringify(found));
        return true;
      }
      return false;
    }

    try {
      // Llamar al servicio de autenticación para hacer login
      // authServices.loginUser hace una petición POST a /auth/login
      // El backend valida las credenciales y devuelve un token JWT
      const response = await authServices.loginUser(username, password);

      // Si el login es exitoso (el backend devuelve success: true)
      if (response.success && response.token) {
        // Guardar el token en el estado
        setToken(response.token);

        // Validar el token inmediatamente para obtener los datos completos del usuario
        // Esto llama al endpoint /auth/me con el token recién obtenido
        try {
          const userData = await authServices.validateToken();
          // Guardar la información completa del usuario en el estado
          // userData contiene: { id, email, role }
          setUser(userData);
          // Retornar true para indicar que el login fue exitoso
          return true;
        } catch (validateError) {
          // Si por alguna razón falla la validación después del login
          console.error(
            "Error validando token después del login:",
            validateError,
          );
          // Limpiar estados
          setToken(null);
          setUser(null);
          return false;
        }
      }

      // Si la respuesta no tiene success o token, retornar false
      return false;
    } catch (error) {
      // Si hay un error (credenciales incorrectas, error de red, servidor caído, etc.)
      console.error("Error en login:", error);
      // Retornar false para indicar que el login falló
      return false;
    }
  };

  // Función para cerrar sesión
  const logout = (): void => {
    // ! Modo MOCK: eliminar el usuario simulado del localStorage
    if (USE_MOCK) {
      localStorage.removeItem("mock-user");
    } else {
      // Llamar al servicio para eliminar el token de localStorage
      // Esto ejecuta: localStorage.removeItem('token')
      authServices.logout();
    }
    // Limpiar el token del estado
    setToken(null);
    // Limpiar el usuario del estado
    setUser(null);
  };

  // Función para verificar si el usuario está autenticado
  // Retorna true si hay un usuario y un token válidos, false en caso contrario
  const isAuthenticated = (): boolean => {
    // Usando el operador !! para convertir a booleano
    // Retorna true solo si ambos (user y token) existen
    return !!user && !!token;
  };

  // El valor que se compartirá con todos los componentes que consuman este contexto
  // Estos valores y funciones estarán disponibles en cualquier componente hijo
  const value: AuthContextType = {
    user, // Información del usuario actual: { id, email, role }
    token, // Token JWT de autenticación
    login, // Función para iniciar sesión: login(email, password)
    logout, // Función para cerrar sesión: logout()
    isAuthenticated, // Función para verificar si está autenticado: isAuthenticated()
    loading, // Estado de carga: true mientras se valida el token inicial
    isLoading: loading, // Alias para loading (mejor semántica)
    isAdmin: user?.role === "ADMIN",
    isAgent: user?.role === "AGENTE",
    isClient: user?.role === "CLIENTE",
  };

  // Renderizar el proveedor del contexto
  // Todos los componentes children tendrán acceso al valor del contexto
  // No renderizar los children mientras loading sea true para evitar flickering
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto de autenticación
// Este hook facilita el uso del contexto en otros componentes
// Uso: const { user, login, logout } = useAuth();
export const useAuth = (): AuthContextType => {
  // Obtener el contexto usando useContext
  const context = useContext(AuthContext);

  // Si el contexto es undefined, significa que el hook se está usando
  // fuera del AuthProvider, lo cual es un error de implementación
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }

  // Retornar el contexto para que el componente pueda usar sus valores y funciones
  return context;
};

// Exportar el contexto por si se necesita usar directamente (caso raro)
export default AuthContext;
