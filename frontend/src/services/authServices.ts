import api from "./api";

// ? Posible implementación de RememberMe:authServices deja 
// de gestionar storage, y AuthContext centraliza todo, cambiando
// lo que pasa actualmente authServices.loginUser guarda el token 
// internamente en localStorage de forma hardcodeada, y 
// validateToken / getToken también leen siempre de localStorage

const authServices = {
  loginUser: async (username: string, password: string) => {
    try {
      // Realizar la solicitud de login al backend
      const response = await api.post("auth", { username, password });
      // Recibe el token como respuesta y lo guarda en el almacenamiento local
      if (response.data.success && response.data.token) {
        localStorage.setItem("token", response.data.token);
        return response.data;
      }
      throw new Error(response.data.error || "Login failed");
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Validar token con el backend y obtener datos del usuario
  validateToken: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      // Llamar al backend para validar el token
      const response = await api.get("auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        return response.data.user;
      }
      throw new Error("Token validation failed");
    } catch (error) {
      // Si el token es inválido, eliminarlo
      localStorage.removeItem("token");
      throw error;
    }
  },
};

export default authServices;
