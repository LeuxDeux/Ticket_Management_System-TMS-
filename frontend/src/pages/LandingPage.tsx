import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Search, PlusCircle, CheckCircle } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-slate-900 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Centro de Ayuda</h1>
        <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Estamos aquí para ayudarte. Crea un ticket o consulta el estado de tus solicitudes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/new-ticket">
            <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="mr-2 h-5 w-5" />
              Crear Ticket
            </Button>
          </Link>
          <Link to="/check-ticket">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-black border-white hover:bg-slate-800 hover:text-white">
              <Search className="mr-2 h-5 w-5" />
              Ver Estado
            </Button>
          </Link>
        </div>
      </header>

      {/* Features */}
   <section className="py-16 px-6 bg-slate-50 flex-grow">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-6 w-6 text-blue-600" />
                Soporte Rápido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Envía tus solicitudes sin necesidad de registrarte. Priorizamos tus urgencias.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-6 w-6 text-purple-600" />
                Seguimiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Consulta el estado de tus tickets en tiempo real con tu número de seguimiento.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Atención Experta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Nuestro equipo de expertos está listo para resolver tus dudas técnicas y de facturación.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>© 2026 Support System Inc. Todos los derechos reservados.</p>
        <div className="mt-4 space-x-4">
          <Link to="/login" className="hover:text-white">Acceso Cliente</Link>
          <Link to="/agent" className="hover:text-white">Acceso Agente</Link>
        </div>
      </footer>
    </div>
  );
}
