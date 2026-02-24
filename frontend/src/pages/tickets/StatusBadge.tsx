import { cva } from 'class-variance-authority';
import type { Status, Priority } from '../../types/enums';
import { cn } from '@/utils/utils'; 

// 1. DICCIONARIOS GLOBALES FUERA DEL COMPONENTE
// Se instancian una sola vez en memoria.
const STATUS_LABELS: Record<Status, string> = {
  'NUEVO': 'Nuevo',
  'ASIGNADO': 'Asignado',
  'EN PROCESO': 'En Proceso',
  'EN ESPERA': 'En Espera',
  'RESUELTO': 'Resuelto',
  'CERRADO': 'Cerrado',
  'REABIERTO': 'Reabierto',
};

const PRIORITY_LABELS: Record<Priority, string> = {
  'BAJA': 'Baja',
  'MEDIA': 'Media',
  'ALTA': 'Alta',
  'CRÍTICA': 'Crítica',
  'URGENTE': 'Urgente',
};

// 2. USO DE CVA PARA ESTANDARIZAR (Igual que en los botones)
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      status: {
        'NUEVO': 'bg-blue-100 text-blue-800 border-blue-200',
        'ASIGNADO': 'bg-indigo-100 text-indigo-800 border-indigo-200',
        'EN PROCESO': 'bg-purple-100 text-purple-800 border-purple-200',
        'EN ESPERA': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'RESUELTO': 'bg-green-100 text-green-800 border-green-200',
        'CERRADO': 'bg-slate-100 text-slate-800 border-slate-200',
        'REABIERTO': 'bg-orange-100 text-orange-800 border-orange-200',
        'DEFAULT': 'bg-gray-100 text-gray-800 border-gray-200', // El fallback seguro
      },
      priority: {
        'BAJA': 'bg-slate-100 text-slate-800 border-slate-200',
        'MEDIA': 'bg-blue-100 text-blue-800 border-blue-200',
        'ALTA': 'bg-orange-100 text-orange-800 border-orange-200',
        'CRÍTICA': 'bg-red-100 text-red-800 border-red-200',
        'URGENTE': 'bg-rose-100 text-rose-900 border-rose-300 font-bold',
        'DEFAULT': 'bg-gray-100 text-gray-800 border-gray-200',
      }
    }
  }
);

// 3. COMPONENTES LIMPIOS Y RÁPIDOS
interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  // Lógica línea por línea:
  // - Buscamos la etiqueta que recibimos por parámetro en el diccionario. 
  // Si no existe (undefined), mostramos el valor crudo.
  const labelText = STATUS_LABELS[status] || status;
  
  // - Pasamos el estado al motor de CVA. Si el estado no está en las variantes, 
  //   no se romperá gracias a que la librería ignora valores no mapeados, 
  //   pero para ser estrictos, podríamos forzar el fallback si lo deseamos.
  return (
    <span className={cn(badgeVariants({ status: status || 'DEFAULT' }))}>
      {labelText}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: Priority;
  className?: string; // Permite inyectar márgenes o estilos desde el padre
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  // Buscamos el texto legible en nuestro diccionario O(1) de memoria estática
  const labelText = PRIORITY_LABELS[priority] || priority;

  return (
    <span 
      className={cn(
        badgeVariants({ priority: priority || 'DEFAULT' }), 
        className
      )}
    >
      {labelText}
    </span>
  );
}