const express = require("express");
const router = express.Router();

// Importar rutas
const authRoutes = require("./auth");

// Usar rutas
router.use("/auth", authRoutes);

module.exports = router;
