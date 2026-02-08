const express = require("express");
const router = express.Router();

// Importar rutas
const exampleRoutes = require("./example");

// Usar rutas
router.use("/", exampleRoutes);

module.exports = router;
