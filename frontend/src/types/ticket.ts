import type { Priority, Status } from './enums';

export interface Ticket {
  id: string; // Formato TKT-YYYY-XXXXX
  subject: string;
  description: string;
  category: string;
  priority: Priority;
  status: Status;
  createdAt: string;
  updatedAt: string;
  clientId: string; 
  assignedTo?: string; 
  tags?: string[];
  slaExpiresAt?: string; // Para el escalado automático mencionado en el plan
}

