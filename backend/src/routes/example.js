const express = require("express");
const router = express.Router();
const { authenticate, authorize, optionalAuth } = require("../middleware/auth");

// Ejemplo de rutas públicas
router.get("/public", (req, res) => {
  res.json({
    message: "Esta ruta es pública",
  });
});

// Ejemplo de ruta que requiere autenticación (cualquier usuario)
router.get(
  "/profile",
  authenticate,
  (req, res) => {
    res.json({
      message: "Perfil del usuario",
      user: req.user,
    });
  }
);

// Ejemplo de ruta que requiere autenticación y rol específico (ADMIN)
router.get(
  "/admin/dashboard",
  authenticate,
  authorize("ADMIN"),
  (req, res) => {
    res.json({
      message: "Panel de administrador",
      user: req.user,
    });
  }
);

// Ejemplo de ruta que requiere roles múltiples (ADMIN o AGENT)
router.get(
  "/agents/list",
  authenticate,
  authorize("ADMIN", "AGENT"),
  (req, res) => {
    res.json({
      message: "Lista de agentes (solo ADMIN o AGENT)",
      user: req.user,
    });
  }
);

// Ejemplo de ruta con autenticación opcional
router.get(
  "/tickets",
  optionalAuth,
  (req, res) => {
    res.json({
      message: "Lista de tickets",
      user: req.user || "Usuario no autenticado",
    });
  }
);

module.exports = router;
