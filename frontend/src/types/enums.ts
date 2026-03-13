// Prioridad de los tickets
export type Priority = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRÍTICA' | 'URGENTE'; 

// Estado de los tickets
export type Status = 'NUEVO' | 'ASIGNADO' | 'EN PROCESO' | 'EN ESPERA' | 'RESUELTO' | 'CERRADO' | 'REABIERTO';

// Roles de usuario - Deben coincidir con schema.sql: CLIENT, AGENT, ADMIN
export type UserRole = 'CLIENT' | 'AGENT' | 'ADMIN'; 

// Estados de los artículos de conocimiento
export type ArticleStatus = 'draft' | 'published' | 'archived';

// Visibilidad de los artículos de conocimiento
export type ArticleVisibility = 'public' | 'internal'; 