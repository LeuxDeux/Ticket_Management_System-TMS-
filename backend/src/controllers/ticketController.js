const ticketService = require("../services/ticketService");

/**
 * Crear nuevo ticket
 * POST /api/tickets
 */
const createTicket = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        error: "Campos requeridos",
        message: "Título y descripción son obligatorios",
      });
    }

    const ticket = await ticketService.createTicket(req.user.id, {
      title,
      description,
      priority,
    });

    res.status(201).json({
      message: "Ticket creado exitosamente",
      ticket,
    });
  } catch (err) {
    res.status(400).json({
      error: "Error al crear ticket",
      message: err.message,
    });
  }
};

/**
 * Listar tickets con filtros
 * GET /api/tickets?status=NEW&priority=HIGH&page=1&limit=20
 */
const getTickets = async (req, res) => {
  try {
    const { status, priority, page, limit, search } = req.query;

    const filters = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      status,
      priority,
      userId: req.user.id,
      role: req.user.role,
      searchTerm: search,
    };

    const result = await ticketService.getTickets(filters);

    res.json({
      message: "Tickets obtenidos",
      ...result,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error al obtener tickets",
      message: err.message,
    });
  }
};

/**
 * Obtener ticket por ID
 * GET /api/tickets/:id
 */
const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await ticketService.getTicketById(
      id,
      req.user.id,
      req.user.role,
    );

    res.json({
      message: "Ticket obtenido",
      ticket,
    });
  } catch (err) {
    if (err.message === "No tienes permiso para ver este ticket") {
      return res.status(403).json({
        error: "Acceso denegado",
        message: err.message,
      });
    }

    if (err.message === "Ticket no encontrado") {
      return res.status(404).json({
        error: "No encontrado",
        message: err.message,
      });
    }

    res.status(500).json({
      error: "Error al obtener ticket",
      message: err.message,
    });
  }
};

/**
 * Actualizar ticket
 * PUT /api/tickets/:id
 */
const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const ticket = await ticketService.updateTicket(
      id,
      req.user.id,
      req.user.role,
      updateData,
    );

    res.json({
      message: "Ticket actualizado",
      ticket,
    });
  } catch (err) {
    if (err.message === "No tienes permiso para ver este ticket") {
      return res.status(403).json({
        error: "Acceso denegado",
        message: err.message,
      });
    }

    if (err.message === "Ticket no encontrado") {
      return res.status(404).json({
        error: "No encontrado",
        message: err.message,
      });
    }

    res.status(400).json({
      error: "Error al actualizar ticket",
      message: err.message,
    });
  }
};

/**
 * Eliminar ticket (cerrar)
 * DELETE /api/tickets/:id
 */
const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await ticketService.deleteTicket(
      id,
      req.user.id,
      req.user.role,
    );

    res.json({
      message: "Ticket eliminado (cerrado)",
      ticket,
    });
  } catch (err) {
    if (err.message === "No tienes permiso para ver este ticket") {
      return res.status(403).json({
        error: "Acceso denegado",
        message: err.message,
      });
    }

    if (err.message === "Ticket no encontrado") {
      return res.status(404).json({
        error: "No encontrado",
        message: err.message,
      });
    }

    res.status(500).json({
      error: "Error al eliminar ticket",
      message: err.message,
    });
  }
};

/**
 * Obtener estadísticas del usuario
 * GET /api/tickets/stats
 */
const getUserStats = async (req, res) => {
  try {
    const stats = await ticketService.getUserStats(req.user.id, req.user.role);

    res.json({
      message: "Estadísticas obtenidas",
      stats,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error al obtener estadísticas",
      message: err.message,
    });
  }
};

/**
 * Crear ticket público (sin sesión)
 * POST /api/tickets/public
 */
const createPublicTicket = async (req, res) => {
  try {
    const { name, email, phone, company, title, description, priority } =
      req.body;

    const ticket = await ticketService.createPublicTicket(
      { name, email, phone, company },
      { title, description, priority },
    );

    res.status(201).json({
      message: "Ticket creado exitosamente",
      ticket,
    });
  } catch (err) {
    res.status(400).json({
      error: "Error al crear ticket",
      message: err.message,
    });
  }
};

/**
 * Consultar ticket por número (flujo público)
 * GET /api/tickets/public/:ticketNumber?email=...
 */
const checkPublicTicket = async (req, res) => {
  try {
    const { ticketNumber } = req.params;
    const { email } = req.query;

    const ticket = await ticketService.getPublicTicketByNumber(
      ticketNumber,
      email,
    );

    res.json({
      message: "Ticket encontrado",
      ticket,
    });
  } catch (err) {
    if (err.message === "Ticket no encontrado") {
      return res.status(404).json({
        error: "No encontrado",
        message: err.message,
      });
    }
    res.status(400).json({
      error: "Error al consultar ticket",
      message: err.message,
    });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getUserStats,
  createPublicTicket,
  checkPublicTicket,
};
