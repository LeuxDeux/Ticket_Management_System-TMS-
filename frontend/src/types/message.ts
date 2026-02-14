export interface Message {
  id: string; // Formato MSG-YYYY-XXXXX
  ticketId: string; // ID del ticket al que pertenece el mensaje
  senderId: string; // ID del usuario que envió el mensaje
  senderType: "client" | "agent" | "system"; // Para diferenciar entre mensajes de clientes, agentes y del sistema
  content: string; // Contenido del mensaje
  createdAt: string; // Fecha y hora de creación del mensaje
  attachments?: string[]; // URLs de archivos adjuntos, si los hay
  internal?: boolean; // Mensaje que solo es visible para agentes (no para el cliente)
}
