import { Package2 } from 'lucide-react';

// Este componente Navbar es un ejemplo básico de una barra de navegación que se puede usar en la aplicación.
// Contiene un ícono y el nombre de la aplicación, 
// y está diseñado para ser sticky (pegajoso) en la parte superior de la página.
// El diseño es responsive, con estilos que se adaptan a diferentes tamaños de pantalla.

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
      <nav className="flex items-center gap-2 text-lg font-semibold md:text-base">
        <Package2 className="h-6 w-6" />
        <span className="sr-only">Inventory Inc</span>
        <span>Inventory Dashboard</span>
      </nav>
      <div className="ml-auto w-full flex-1 sm:w-auto">
        {/* Placeholder for search or user profile */}
      </div>
    </header>
  );
}
