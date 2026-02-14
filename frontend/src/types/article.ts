 import type { ArticleStatus, ArticleVisibility } from "./enums";

 export interface KnowledgeArticle {
  id: string; // ID único del artículo, formato ART-YYYY-XXXXX
  title: string; // Título del artículo
  content: string; // Contenido completo del artículo
  excerpt: string; // Resumen o introducción del artículo
  category: string; // Categoría a la que pertenece el artículo
  status: ArticleStatus; // Estado del artículo: borrador, publicado, archivado
  visibility: ArticleVisibility; // Visibilidad del artículo: público o interno
  tags: string[]; // Etiquetas para facilitar la búsqueda y organización
  keywords: string[]; // Palabras clave para mejorar el SEO y la búsqueda interna
  version: string; // Número de versión del artículo para control de cambios
  authorId: string; // ID del autor del artículo
  createdAt: string; // Fecha de creación del artículo
  updatedAt: string; // Fecha de última actualización del artículo
  views: number; // Número de visualizaciones del artículo
  likes: number; // Número de "me gusta" del artículo
  dislikes: number; // Número de "no me gusta" del artículo
  relatedTicketIds?: string[]; // IDs de tickets relacionados para 
  // vincular el artículo con casos específicos como una referencia futura de solución
} 