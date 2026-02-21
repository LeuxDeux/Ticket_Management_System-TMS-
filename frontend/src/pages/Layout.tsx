import { Link, Outlet } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { MessageSquare, Shield, LogOut } from 'lucide-react';

export function Layout({ role, setRole }: { role: string, setRole: (r: string) => void }) {
  
  // Función para obtener el nombre de usuario basado en el rol seleccionado.
  // Esto es solo para propósitos de demostración. 
  // En una aplicación real, el nombre del usuario vendría del contexto de autenticación (AuthContext) o de una API.
  const getUserName = () => {
    switch (role) {
      case 'admin': return 'Administrador Sistema';
      case 'agent': return 'Agente de Soporte';
      case 'client': return 'Juan Pérez';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center px-4 max-w-7xl mx-auto">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            <span className="hidden font-bold sm:inline-block">SupportHub</span>
          </Link>
          
          <div className="flex-1 flex justify-center">
             {/* Role Switcher for Demo Purposes */}
             <div className="bg-slate-100 p-1 rounded-lg flex text-xs overflow-x-auto max-w-[200px] sm:max-w-none">
                <button 
                    onClick={() => setRole('guest')}
                    className={`px-3 py-1 rounded-md transition-all whitespace-nowrap ${role === 'guest' ? 'bg-white shadow-sm font-medium' : 'text-slate-500'}`}
                >
                    Público
                </button>
                <button 
                    onClick={() => setRole('client')}
                    className={`px-3 py-1 rounded-md transition-all whitespace-nowrap ${role === 'client' ? 'bg-white shadow-sm font-medium' : 'text-slate-500'}`}
                >
                    Cliente
                </button>
                <button 
                    onClick={() => setRole('agent')}
                    className={`px-3 py-1 rounded-md transition-all whitespace-nowrap ${role === 'agent' ? 'bg-white shadow-sm font-medium' : 'text-slate-500'}`}
                >
                    Agente
                </button>
                <button 
                    onClick={() => setRole('admin')}
                    className={`px-3 py-1 rounded-md transition-all whitespace-nowrap ${role === 'admin' ? 'bg-white shadow-sm font-medium' : 'text-slate-500'}`}
                >
                    Admin
                </button>
             </div>
          </div>

          <div className="ml-auto flex items-center space-x-4">
            {role === 'guest' ? (
                <>
                    <Link to="/login"><Button variant="ghost">Iniciar Sesión</Button></Link>
                                      
                    <Link to="/register"><Button variant="ghost">Registrarse</Button></Link>

                    <Link to="/new-ticket"><Button>Crear Ticket</Button></Link>
                </>
            ) : (
                <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2">
                        {role === 'admin' && <Shield className="h-4 w-4 text-slate-500" />}
                        <span className="text-sm font-medium hidden md:block">
                            {getUserName()}
                        </span>
                     </div>
                     <Button size="icon" variant="ghost" onClick={() => setRole('guest')}>
                         <LogOut className="h-4 w-4" />
                     </Button>
                </div>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
