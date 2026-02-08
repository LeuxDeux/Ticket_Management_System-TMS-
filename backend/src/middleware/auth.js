const { verifyToken } = require("../utils/jwt");

/**
 * Middleware de autenticación
 * Verifica que el usuario sea válido y decodifica el token
 * Genera un error 401 si no hay token o es inválido
 */
const authenticate = (req, res, next) => {
  try {
    // Obtener token del header Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Token no proporcionado",
        message: "Se requiere autenticación",
      });
    }

    // Extraer token (formato: "Bearer <token>")
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    // Verificar token
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        error: "Token inválido o expirado",
        message: "El token no es válido o ha expirado",
      });
    }

    // Pasar el usuario decodificado en la request
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: "Error en autenticación",
      message: err.message,
    });
  }
};

/**
 * Middleware para verificar rol específico
 * @param  {...string} roles - Roles permitidos
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: "Usuario no autenticado",
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          error: "Acceso denegado",
          message: `Solo usuarios con rol ${roles.join(" o ")} pueden acceder`,
          userRole: req.user.role,
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        error: "Error en autorización",
        message: err.message,
      });
    }
  };
};

/**
 * Middleware opcional de autenticación
 * No rechaza si no hay token, solo decodifica si existe
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      req.user = null;
      return next();
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    const decoded = verifyToken(token);
    req.user = decoded || null;
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
};
