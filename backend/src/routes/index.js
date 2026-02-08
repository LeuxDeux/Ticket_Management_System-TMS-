const express = require("express");
const router = express.Router();

// Importar rutas
const authRoutes = require("./auth");
const exampleRoutes = require("./example");

// Usar rutas
router.use("/auth", authRoutes);
router.use("/", exampleRoutes);

module.exports = router;
