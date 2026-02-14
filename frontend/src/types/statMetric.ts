 export interface StatMetric {
  label: string; // Descripción de la métrica, por ejemplo "Tickets Resueltos"
  value: string | number; // Valor de la métrica, puede ser un número o una cadena (por ejemplo, "15%" para tasas de resolución)
  change?: string; // Cambio porcentual o absoluto respecto a un período anterior, por ejemplo "+5%" o "-3"
  trend?: 'up' | 'down' | 'neutral'; // Indica la tendencia de la métrica, puede ser "up" para aumento, "down" para disminución o "neutral" para sin cambio significativo
} 