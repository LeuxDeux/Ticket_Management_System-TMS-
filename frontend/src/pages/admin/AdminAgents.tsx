import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
//import { Switch } from '../ui/switch';
import { USERS } from "../../mock/data";
import { type User } from "../../types/user";
import { Users, BarChart3, Bell, Clock, Briefcase } from "lucide-react";
import { toast } from "sonner";

// Datos MOCK de Agente (podrían estar en /mock/data), después vienen de la API
const AGENT_METRICS = [
  {
    id: "a1",
    load: 85,
    activeTickets: 12,
    avgTime: "2.5h",
    online: true,
    shift: "09:00 - 18:00",
  },
  {
    id: "a2",
    load: 45,
    activeTickets: 5,
    avgTime: "1.8h",
    online: false,
    shift: "14:00 - 22:00",
  }, // Mock agent
];

// Componente principal para la gestión de agentes en el panel de administración
export function AdminAgents() {
  // Filtramos los usuarios para obtener solo los agentes (esto es un mock, en producción vendría de la API)
  const agents = USERS.filter((u: User) => u.role === "AGENT");

  // Función para manejar la reasignación masiva de tickets de un agente (mock)
  const handleReassign = (agentId: string) => {
    // Al incluir agentId en el string, TypeScript ya lo considera "usado"
    toast.success(`Tickets del agente ${agentId} reasignados masivamente`);
  };

  return (
    // Estructura del dashboard con métricas clave y tabla de agentes. Datos hardcodeados
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Agentes Activos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.length}</div>
            <p className="text-xs text-muted-foreground">
              1 online actualmente
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Carga Promedio
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65%</div>
            <p className="text-xs text-muted-foreground">
              Capacidad operativa saludable
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tiempo Respuesta Avg
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1h</div>
            <p className="text-xs text-muted-foreground">
              -15% vs mes anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Desempeño y Gestión de Agentes</CardTitle>
          <CardDescription>
            Monitoreo de carga de trabajo, disponibilidad y rendimiento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Carga de Trabajo</TableHead>
                <TableHead>Tickets Activos</TableHead>
                <TableHead>Tiempo Res.</TableHead>
                <TableHead>Horario</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Cargamos las métricas del agente. En este caso está hardcodeado */}
              {agents.map((agent: User) => {
                const metrics =
                  AGENT_METRICS.find((m) => m.id === agent.id) ||
                  AGENT_METRICS[0];
                return (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                          {agent.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {agent.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {agent.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={metrics.online ? "default" : "secondary"}
                        className={
                          metrics.online
                            ? "bg-green-500 hover:bg-green-600"
                            : ""
                        }
                      >
                        {metrics.online ? "Online" : "Offline"}
                      </Badge>
                    </TableCell>
                    <TableCell className="w-[200px]">
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">
                          {metrics.load}% Capacidad
                        </span>
                        <Progress
                          value={metrics.load}
                          className={metrics.load > 80 ? "bg-red-100" : ""}
                        />
                      </div>
                    </TableCell>
                    <TableCell>{metrics.activeTickets}</TableCell>
                    <TableCell>{metrics.avgTime}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {metrics.shift}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReassign(agent.id)}
                      >
                        Reasignar
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Bell className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
