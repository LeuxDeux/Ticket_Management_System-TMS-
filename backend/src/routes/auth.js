const express = require("express");
const router = express.Router();
const { register, login, getProfile } = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

/**
 * Rutas públicas (sin autenticación)
 */

// POST /api/auth/register - Registrar nuevo usuario
router.post("/register", register);

// POST /api/auth/login - Login de usuario existente
router.post("/login", login);

/**
 * Rutas privadas (requieren autenticación)
 */

// GET /api/auth/profile - Obtener perfil del usuario autenticado
router.get("/profile", authenticate, getProfile);

module.exports = router;
