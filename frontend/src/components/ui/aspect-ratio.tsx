import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

// AspectRatio es un componente que se utiliza para mantener una relación de aspecto constante en su contenido,
// independientemente del tamaño del contenedor. 
// Esto es útil para asegurarse de que el contenido, como imágenes o videos, se muestre correctamente sin distorsión.
// El componente AspectRatio se compone de un solo subcomponente, que es el propio AspectRatioPrimitive.Root, 
// y se le asigna un "data-slot" para indicar su función dentro del componente.

// ¿Para qué sirve ...props?
// El operador ...props se utiliza para pasar todas las propiedades restantes a un componente. 
// Esto es útil para evitar tener que enumerar cada propiedad individualmente, 
// lo que hace que el código sea más limpio y fácil de mantener. 
// En este caso, se pasan todas las propiedades restantes a AspectRatioPrimitive.Root, 
// lo que permite que el componente sea flexible y reutilizable en diferentes contextos 
// sin necesidad de modificar su código.
// Es como decirle "agarra todas las propiedades que no he mencionado y pásalas a este componente".

// También lo vemos dentro del return, pero en este caso es una inyección de propiedades. 
// Es como decirle "toma todas estas propiedades y metelas en AspectRatioPrimitive.Root".

// typeof AspectRatioPrimitive.Root se utiliza para obtener el tipo de las propiedades que acepta el componente AspectRatioPrimitive.Root. 
// Esto es útil para asegurarse de que el componente AspectRatio acepte las mismas propiedades que AspectRatioPrimitive.Root, 
// lo que garantiza la compatibilidad y la reutilización del código. 
// Al usar React.ComponentProps<typeof AspectRatioPrimitive.Root>, estamos diciendo que el componente AspectRatio debe aceptar todas las propiedades que acepta AspectRatioPrimitive.Root, 
// lo que hace que nuestro componente sea más flexible y fácil de usar en diferentes contextos.
// El tipo AspectRatioProps.Root viene de la definición de tipos de Radix.

// data-slot es un atributo personalizado que se utiliza para identificar el propósito de un componente 
// dentro de una composición.
// En este caso, se asigna data-slot="aspect-ratio" a AspectRatioPrimitive.Root para indicar 
// que este componente es el contenedor principal del aspecto de relación.
// Esto es útil para aplicar estilos específicos o para facilitar la identificación del componente 
// en pruebas o depuración.
// No hay una lista predefinida de data-slots, sino que se pueden definir según las necesidades 
// del proyecto para organizar y estructurar los componentes de manera clara y coherente.
function AspectRatio({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };
