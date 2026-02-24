import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import {
  AlertCircle,
  Shield,
  LayoutDashboard,
  Users,
  UserCog,
  BarChart3,
  Settings,
} from "lucide-react";
import { AdminUsers } from "./AdminUsers";
import { AdminAgents } from "./AdminAgents";
import { AdminReports } from "./AdminReports";
import { AdminSettings } from "./AdminSettings";

// Panel de Administración del Administrador, con pestañas para gestionar usuarios, agentes, reportes y configuración.
// La estructura general del componente se basa en un diseño de pestañas (Tabs)
// que permite al administrador navegar entre diferentes secciones de gestión.
// Cada sección (Resumen, Usuarios, Agentes, Reportes, Configuración) se muestra
// como un contenido diferente dentro de las pestañas, lo que facilita la organización
// y el acceso a las diferentes funcionalidades del panel de administración.
// En la sección de Resumen, se muestran tarjetas con métricas clave del sistema,
// como el total de tickets, tiempo de resolución, usuarios activos y satisfacción del cliente (CSAT).
// Las otras secciones (Usuarios, Agentes, Reportes, Configuración) renderizan componentes específicos
// que se encargan de mostrar y gestionar la información correspondiente a cada área,
// como la gestión de usuarios, agentes, generación de reportes y ajustes del sistema.

export function AdminDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Panel de Administración
          </h1>
          <p className="text-slate-500">
            Control total del sistema, usuarios y configuración.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <AlertCircle className="mr-2 h-4 w-4" /> Ver Alertas
          </Button>
          <Button>
            <Shield className="mr-2 h-4 w-4" /> Auditoría
          </Button>
        </div>
      </div>

      {/* Solo usamos defaultValue. Borramos onValueChange={setActiveTab} */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-white p-1 rounded-lg border shadow-sm h-auto">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-slate-100 py-2"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" /> Resumen
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-slate-100 py-2"
          >
            <Users className="mr-2 h-4 w-4" /> Usuarios
          </TabsTrigger>
          <TabsTrigger
            value="agents"
            className="data-[state=active]:bg-slate-100 py-2"
          >
            <UserCog className="mr-2 h-4 w-4" /> Agentes
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="data-[state=active]:bg-slate-100 py-2"
          >
            <BarChart3 className="mr-2 h-4 w-4" /> Reportes
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-slate-100 py-2"
          >
            <Settings className="mr-2 h-4 w-4" /> Configuración
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-4">
            {/* ... Tarjetas de Métricas (Las dejé igual, están perfectas) ... */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,284</div>
                <p className="text-xs text-muted-foreground">
                  +12% vs mes anterior
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Tiempo Resolución
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2h</div>
                <p className="text-xs text-muted-foreground">-8% mejora</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Usuarios Activos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">342</div>
                <p className="text-xs text-muted-foreground">
                  +24 nuevos esta semana
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  CSAT (Satisfacción)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">4.9/5</div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <AdminReports />
          </div>
        </TabsContent>

        <TabsContent value="users">
          <AdminUsers />
        </TabsContent>

        <TabsContent value="agents">
          <AdminAgents />
        </TabsContent>

        <TabsContent value="reports">
          <AdminReports />
        </TabsContent>

        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
