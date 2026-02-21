import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/utils";

// Alert es un componente de alerta que se utiliza para mostrar mensajes importantes al usuario,
// como errores, advertencias o información.
// Como agregado, vemos el uso de variantes, que funcionan como un switch. 
// Esto nos permite definir diferentes estilos para el componente Alert 
// según el tipo de alerta que queremos mostrar (por ejemplo, una alerta destructiva para errores).
// Esta variante se indica en el momento que se define el componente, como una clase adicional, 
// lo que facilita la reutilización del componente con diferentes estilos según el contexto.

// El componente Alert se compone de AlertTitle y AlertDescription, que se utilizan para mostrar el título 
// y la descripción de la alerta, respectivamente.
// Cada uno de estos componentes tiene un "data-slot" que indica su función dentro del Alert, 
// lo que facilita la composición y el estilo de los componentes.

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
