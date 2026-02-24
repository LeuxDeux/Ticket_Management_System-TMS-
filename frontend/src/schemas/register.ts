import { z } from "zod";

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "El nombre completo es requerido")
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .regex(/^[a-zA-Z\s]+$/, "El nombre solo puede contener letras y espacios"),
    email: z
      .string()
      .min(1, "El email es requerido")
      .email("Ingresa un email válido"),
    company: z.string().optional(),
    phone: z.string().optional(),
    password: z
      .string()
      .min(1, "La contraseña es requerida")
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Debes confirmar tu contraseña"),
    terms: z.boolean().refine((val) => val === true, {
      message: "Debes aceptar los términos y condiciones",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export { registerSchema };
