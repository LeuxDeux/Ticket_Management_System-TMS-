// Prioridad de los tickets
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'URGENT'; 

// Estado de los tickets
export type Status = 'NEW' | 'ASSIGNED' | 'REOPENED' | 'WAITING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

// Roles de usuario - Deben coincidir con schema.sql: CLIENT, AGENT, ADMIN
export type UserRole = 'CLIENT' | 'AGENT' | 'ADMIN' | 'GUEST'; // Agregado GUEST para usuarios no autenticados

// Estados de los artículos de conocimiento
export type ArticleStatus = 'draft' | 'published' | 'archived';

// Visibilidad de los artículos de conocimiento
export type ArticleVisibility = 'public' | 'internal'; 


