import * as React from "react";

// Hook personalizado que detecta si el dispositivo es móvil o no, 
// utilizando el ancho de la ventana para determinarlo.
// El breakpoint para considerar un dispositivo como móvil es de 768px, 
// lo que es comúnmente utilizado en diseño responsive.

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // El estado isMobile se inicializa como undefined para evitar renderizados incorrectos en el servidor (SSR)
  // Esto es importante porque window.innerWidth no está disponible en el servidor,
  // y queremos evitar que el componente se renderice con un valor incorrecto antes de que se ejecute el efecto.
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    // Configuramos un MediaQueryList para detectar cambios en el ancho de la ventana
    // El listener se encarga de actualizar el estado isMobile cada vez que cambia el ancho de la ventana
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    // La función onChange se ejecuta cada vez que el MediaQueryList detecta un cambio,
    // actualizando el estado isMobile según el nuevo ancho de la ventana
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    // Agregamos el listener al MediaQueryList para detectar cambios en el ancho de la ventana
    mql.addEventListener("change", onChange);
    // Inicializamos el estado isMobile con el valor actual del ancho de la ventana
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    // Limpiamos el listener cuando el componente se desmonta para evitar fugas de memoria
    return () => mql.removeEventListener("change", onChange);
  }, []);
// Devolvemos el valor de isMobile, que será true si el dispositivo es móvil, false si no lo es.
// No devuelve undefined de ninguna manera.
  return !!isMobile;
}
