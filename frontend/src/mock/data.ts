import { type Ticket } from '../types/ticket';
import { type User } from '../types/user';
import { type Message } from '../types/message';
import { type KnowledgeArticle } from '../types/article';

// Este archivo contiene datos de ejemplo para usuarios, tickets, mensajes y artículos de conocimiento.
// Estos datos se utilizan para simular la funcionalidad de la aplicación durante el desarrollo, 
// permitiendo probar la interfaz de usuario y la lógica sin necesidad de una conexión 
// a una base de datos real o una API.
// Los datos incluyen diferentes roles de usuarios (clientes, agentes, administradores), 
// así como tickets con distintos estados y prioridades, mensajes asociados a los tickets, 
// y artículos de conocimiento con diferentes categorías y visibilidades.
// Cuando se defina la API real, esto se borra, o se puede dejar para pruebas sin datos reales.

export const USERS: User[] = [
  { id: 'u1', name: 'Juan Pérez', email: 'juan@cliente.com', role: 'CLIENTE', company: 'Tech Corp' },
  { id: 'u2', name: 'Maria Gonzalez', email: 'maria@cliente.com', role: 'CLIENTE', company: 'StartUp Inc' },
  { id: 'a1', name: 'Soporte Técnico', email: 'soporte@helpdesk.com', role: 'AGENTE', avatar: 'https://github.com/shadcn.png' },
  { id: 'ad1', name: 'Admin User', email: 'admin@helpdesk.com', role: 'ADMIN' },
];

export const TICKETS: Ticket[] = [
  {
    id: 'TKT-2023-00001',
    subject: 'Problema al iniciar sesión',
    description: 'No puedo acceder a mi cuenta desde el móvil.',
    category: 'Acceso',
    priority: 'ALTA',
    status: 'CERRADO',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    clientId: 'u1',
    tags: ['bug', 'mobile'],
  },
  {
    id: 'TKT-2023-00002',
    subject: 'Solicitud de factura',
    description: 'Necesito la factura del mes pasado.',
    category: 'Facturación',
    priority: 'BAJA',
    status: 'RESUELTO',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    clientId: 'u2',
    assignedTo: 'a1',
  },
  {
    id: 'TKT-2023-00003',
    subject: 'Error 404 en la página de pagos',
    description: 'Al intentar pagar sale error.',
    category: 'Pagos',
    priority: 'CRÍTICA',
    status: 'EN PROCESO',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    clientId: 'u1',
    assignedTo: 'a1',
  },
];

export const MESSAGES: Message[] = [
  {
    id: 'm1',
    ticketId: 'TKT-2023-00001',
    senderId: 'u1',
    senderType: 'client',
    content: 'Hola, intento entrar y me sale error de credenciales.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'm2',
    ticketId: 'TKT-2023-00003',
    senderId: 'u1',
    senderType: 'client',
    content: 'Ayuda, no puedo pagar.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'm3',
    ticketId: 'TKT-2023-00003',
    senderId: 'a1',
    senderType: 'agent',
    content: 'Estamos revisando los logs del servidor.',
    createdAt: new Date(Date.now() - 2000000).toISOString(),
  },
  {
    id: 'm4',
    ticketId: 'TKT-2023-00003',
    senderId: 'a1',
    senderType: 'agent',
    content: 'Parece ser un problema de la pasarela.',
    createdAt: new Date(Date.now() - 1900000).toISOString(),
    internal: true,
  },
];

export const ARTICLES: KnowledgeArticle[] = [
  {
    id: 'KB-001',
    title: 'Cómo restablecer tu contraseña',
    content: 'Para restablecer tu contraseña, ve a la página de inicio de sesión y haz clic en "¿Olvidaste tu contraseña?". Sigue las instrucciones enviadas a tu correo electrónico.\n\nPasos detallados:\n1. Ve a /login\n2. Click en recuperar\n3. Revisa tu inbox',
    excerpt: 'Guía paso a paso para recuperar el acceso a tu cuenta.',
    category: 'Acceso',
    status: 'published',
    visibility: 'public',
    tags: ['password', 'login', 'acceso'],
    keywords: ['contraseña', 'recuperar', 'olvido'],
    version: '1.0',
    authorId: 'a1',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    views: 1250,
    likes: 475,
    dislikes: 2,
    relatedTicketIds: ['TKT-2023-00001']
  },
  {
    id: 'KB-002',
    title: 'Errores comunes de pago',
    content: 'Lista de códigos de error de pago y sus soluciones:\n- 101: Fondos insuficientes\n- 102: Tarjeta expirada\n- 404: Pasarela no encontrada (Internal)',
    excerpt: 'Solución a códigos de error frecuentes en la pasarela de pagos.',
    category: 'Pagos',
    status: 'published',
    visibility: 'internal',
    tags: ['pagos', 'errores', 'stripe'],
    keywords: ['error', 'tarjeta', 'fondos'],
    version: '2.1',
    authorId: 'a1',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    views: 340,
    likes: 80,
    dislikes: 0,
    relatedTicketIds: ['TKT-2023-00003']
  }
];
