import { z } from "zod";

const createTicketSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Ingresa un email válido"),
  subject: z
    .string()
    .min(1, "El asunto es obligatorio")
    .max(200, "El asunto no debe exceder 200 caracteres"),
  category: z.string().min(1, "Selecciona una categoría"),
  priority: z.enum(["low", "medium", "high"], {
    errorMap: () => ({ message: "Selecciona una prioridad válida" }),
  }),
  description: z
    .string()
    .min(1, "La descripción es obligatoria")
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  phone: z.string().optional(),
  company: z.string().optional(),
  // FileList se maneja de forma especial, lo dejamos como opcional
  files: z.any().optional(),
});

export { createTicketSchema };
