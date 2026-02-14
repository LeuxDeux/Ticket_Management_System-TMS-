import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// clsx: Combina múltiples clases condicionalmente 
// (por ejemplo, "bg-red-500" solo si una condición es verdadera) 
// y maneja clases dinámicas de manera eficiente. 
// Es útil para construir cadenas de clases en componentes React, 
// donde las clases pueden depender del estado o las props.

// tailwind-merge: Elimina clases duplicadas o conflictivas de Tailwind CSS, 
// asegurando que solo se aplique la clase más específica. 
// Esto es especialmente útil para manejar clases dinámicas en componentes React, 
// donde las clases pueden cambiar según el estado o las props.

// La función cn es una utilidad personalizada que combina clsx y tailwind-merge para
// facilitar la gestión de clases en componentes React, especialmente cuando se utilizan
// clases de Tailwind CSS que pueden ser dinámicas o condicionales.
// Primero, clsx procesa todos los argumentos y genera una cadena de texto única con 
// todas las clases activas. Luego, twMerge recibe esa cadena y elimina las clases 
// duplicadas o contradictorias antes de enviarlas al navegador.
