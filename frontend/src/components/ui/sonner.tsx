"use client";

//Componente Toaster para notificaciones, utilizando la librería Sonner y adaptando el tema según 
// el tema actual de la aplicación (claro, oscuro o sistema).
//El componente Toaster se encarga de mostrar notificaciones emergentes en la interfaz de usuario, 
// y se adapta automáticamente al tema actual para mantener la coherencia visual.

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
