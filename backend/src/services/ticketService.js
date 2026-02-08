const { prisma } = require("../config/database");

/**
 * Servicio de Tickets
 * Lógica de negocio para tickets
 */
const ticketService = {
  // Constantes
  VALID_STATES: ["NEW", "ASSIGNED", "IN_PROGRESS", "WAITING", "RESOLVED", "CLOSED", "REOPENED"],
  VALID_PRIORITIES: ["LOW", "MEDIUM", "HIGH", "CRITICAL", "URGENT"],

  /**
   * Generar número único de ticket
   * Formato: TKT-YYYY-XXXXX (ej: TKT-2026-00001)
   */
  async generateTicketNumber() {
    const year = new Date().getFullYear();
    const lastTicket = await prisma.ticket.findFirst({
      orderBy: { createdAt: "desc" },
      where: { ticketNumber: { startsWith: `TKT-${year}` } },
      select: { ticketNumber: true },
    });

    let nextNumber = 1;
    if (lastTicket) {
      const lastNumber = parseInt(lastTicket.ticketNumber.split("-")[2]);
      nextNumber = lastNumber + 1;
    }

    return `TKT-${year}-${String(nextNumber).padStart(5, "0")}`;
  },

  /**
   * Validar que el estado sea válido
   */
  validateStatus(status) {
    if (!ticketService.VALID_STATES.includes(status)) {
      throw new Error(
        `Estado inválido. Válidos: ${ticketService.VALID_STATES.join(", ")}`
      );
    }
  },

  /**
   * Validar que la prioridad sea válida
   */
  validatePriority(priority) {
    if (!ticketService.VALID_PRIORITIES.includes(priority)) {
      throw new Error(
        `Prioridad inválida. Válidas: ${ticketService.VALID_PRIORITIES.join(", ")}`
      );
    }
  },

  /**
   * Crear un nuevo ticket
   */
  async createTicket(userId, ticketData) {
    const { title, description, priority = "MEDIUM" } = ticketData;

    // Validaciones básicas
    if (!title || !description) {
      throw new Error("Título y descripción son requeridos");
    }

    ticketService.validatePriority(priority);

    // Generar número único
    const ticketNumber = await ticketService.generateTicketNumber();

    // Crear ticket
    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        title,
        description,
        priority,
        status: "NEW",
        userId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return ticket;
  },

  /**
   * Listar tickets con filtros y paginación
   */
  async getTickets(filters = {}) {
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      userId,
      role,
      searchTerm,
    } = filters;

    const skip = (page - 1) * limit;

    // Construir where clause
    const where = {};

    // Si es CLIENT, solo ver sus tickets
    if (role === "CLIENT" && userId) {
      where.userId = userId;
    }
    // Si es AGENT, puede ver todos excepto si está filtrado por usuario
    if (role === "AGENT" && userId) {
      where.OR = [{ userId }, { assignedAgentId: userId }];
    }

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (searchTerm) {
      where.OR = [
        { ticketNumber: { contains: searchTerm } },
        { title: { contains: searchTerm } },
        { description: { contains: searchTerm } },
      ];
    }

    // Obtener total y tickets
    const total = await prisma.ticket.count({ where });

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        assignedAgent: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    return {
      data: tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Obtener ticket por ID
   */
  async getTicketById(ticketId, userId, role) {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        assignedAgent: {
          select: { id: true, name: true, email: true },
        },
        messages: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
            attachments: true,
          },
          orderBy: { createdAt: "asc" },
        },
        attachments: true,
      },
    });

    if (!ticket) {
      throw new Error("Ticket no encontrado");
    }

    // Validar permisos
    if (role === "CLIENT" && ticket.userId !== userId) {
      throw new Error("No tienes permiso para ver este ticket");
    }

    return ticket;
  },

  /**
   * Actualizar ticket
   */
  async updateTicket(ticketId, userId, role, updateData) {
    const ticket = await ticketService.getTicketById(ticketId, userId, role);

    const updateFields = {};

    // Validar campos permitidos según rol
    if (updateData.title) updateFields.title = updateData.title;
    if (updateData.description) updateFields.description = updateData.description;

    if (updateData.status) {
      ticketService.validateStatus(updateData.status);
      updateFields.status = updateData.status;
    }

    if (updateData.priority) {
      ticketService.validatePriority(updateData.priority);
      updateFields.priority = updateData.priority;
    }

    // Solo agentes y admins pueden asignar/cambiar asignado
    if (updateData.assignedAgentId && (role === "AGENT" || role === "ADMIN")) {
      updateFields.assignedAgentId = updateData.assignedAgentId;
    }

    if (Object.keys(updateFields).length === 0) {
      throw new Error("No hay campos para actualizar");
    }

    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: updateFields,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        assignedAgent: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return updated;
  },

  /**
   * Eliminar ticket (soft delete - cambiar a estado CLOSED)
   */
  async deleteTicket(ticketId, userId, role) {
    const ticket = await ticketService.getTicketById(ticketId, userId, role);

    // Solo ADMIN o creador pueden eliminar
    if (role === "CLIENT" && ticket.userId !== userId) {
      throw new Error("No tienes permiso para eliminar este ticket");
    }

    const deleted = await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: "CLOSED" },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return deleted;
  },

  /**
   * Obtener estadísticas de usuario
   */
  async getUserStats(userId, role) {
    if (role === "CLIENT") {
      const stats = await prisma.ticket.groupBy({
        by: ["status"],
        where: { userId },
        _count: true,
      });

      return stats.reduce((acc, stat) => {
        acc[stat.status] = stat._count;
        return acc;
      }, {});
    }

    // Para agentes y admins
    const stats = await prisma.ticket.groupBy({
      by: ["status"],
      where: {
        OR: [{ userId }, { assignedAgentId: userId }],
      },
      _count: true,
    });

    return stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count;
      return acc;
    }, {});
  },
};

module.exports = ticketService;
