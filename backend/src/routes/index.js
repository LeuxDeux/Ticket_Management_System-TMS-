const express = require("express");
const router = express.Router();

// Importar rutas
const authRoutes = require("./auth");
const ticketRoutes = require("./ticket");

// Usar rutas
router.use("/auth", authRoutes);
router.use("/tickets", ticketRoutes);

module.exports = router;
