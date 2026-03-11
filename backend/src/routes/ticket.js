const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getUserStats,
  createPublicTicket,
  checkPublicTicket,
} = require("../controllers/ticketController");

/**
 * RUTAS PÚBLICAS - Sin autenticación (flujo anónimo)
 */

// POST /api/tickets/public - Crear ticket sin registrarse
router.post("/public", createPublicTicket);

// GET /api/tickets/public/:ticketNumber?email=... - Consultar estado de ticket
router.get("/public/:ticketNumber", checkPublicTicket);

/**
 * RUTAS PROTEGIDAS - Requieren autenticación
 */

// GET /api/tickets/stats - Obtener estadísticas del usuario
router.get("/stats", authenticate, getUserStats);

// GET /api/tickets - Listar tickets (con filtros y paginación)
router.get("/", authenticate, getTickets);

// POST /api/tickets - Crear nuevo ticket
router.post("/", authenticate, createTicket);

// GET /api/tickets/:id - Obtener ticket por ID
router.get("/:id", authenticate, getTicketById);

// PUT /api/tickets/:id - Actualizar ticket
router.put("/:id", authenticate, updateTicket);

// DELETE /api/tickets/:id - Eliminar (cerrar) ticket
router.delete("/:id", authenticate, deleteTicket);

module.exports = router;
