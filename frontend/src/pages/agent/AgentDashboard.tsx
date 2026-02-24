import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
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
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { StatusBadge, PriorityBadge } from "../tickets/StatusBadge";
import { TICKETS, USERS } from "../../mock/data";
import { type Ticket } from "../../types/ticket";
import { Search, BarChart3, ArrowRight, BookOpen } from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// El Panel de Control del Agente de Soporte Técnico, con pestañas para gestionar tickets asignados,
// sin asignar, de alta prioridad, en riesgo de SLA y todos los tickets.
// La estructura general del componente se basa en un diseño de pestañas (Tabs)
// que permite al agente navegar entre diferentes vistas de tickets según su estado y prioridad.
//

export function AgentDashboard() {
  //Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  //Estado de pestaña activa, aunque se puede manejar solo con defaultValue en Tabs, lo dejamos para lógica adicional si se necesita
  const [activeTab, setActiveTab] = useState("assigned");
  // Mock de agente logueado, en una implementación real esto vendría del Authcontext o similar
  const [currentAgentId] = useState("a1");
  // Estado para el rango del gráfico, con opciones como semana, mes, año, etc.
  const [chartRange, setChartRange] = useState("week");

  // Para evitar cálculos repetitivos, almacenamos la fecha actual en una variable de estado,
  const [now] = useState(() => Date.now());

  // Métricas clave para el agente, calculadas a partir de los tickets mockeados.
  // Esto después se va a calcular con info de la API
  const metrics = {
    assigned: TICKETS.filter(
      (t) =>
        t.assignedTo === currentAgentId &&
        t.status !== "RESUELTO" &&
        t.status !== "CERRADO",
    ).length,
    resolvedThisWeek: 24,
    avgResolutionTime: "3.2h",
    avgRating: 4.8,
    slaCompliance: 98,
  };

  // Función que se trae el nombre del cliente a partir de un id (asume que id es un string, chequear)
  const getClientName = (id: string) => {
    const user = USERS.find((u) => u.id === id);
    return user ? user.name : "Usuario Desconocido";
  };
  //Función para determinar el estado del SLA de un ticket,
  // basada en el tiempo transcurrido desde su creación y su estado actual.
  // Los estados posibles vienen del type Ticket y pueden ser 'ok' (dentro del SLA),
  // 'warning' (en riesgo de incumplir el SLA) o 'breached' (SLA incumplido).
  const getSLAStatus = (ticket: Ticket) => {
    // Usamos la variable de estado 'now'
    const hoursSinceCreation =
      (now - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60);

    // Si el ticket ya está cerrado o resuelto, consideramos que cumplió el SLA (ok),
    if (ticket.status === "CERRADO" || ticket.status === "RESUELTO")
      return "ok";
    // Si han pasado más de 48 horas desde la creación del ticket,
    // consideramos que el SLA se ha incumplido (breached).
    if (hoursSinceCreation > 48) return "breached";
    // Si han pasado más de 40 horas pero menos de 48,
    // consideramos que el ticket está en riesgo de incumplir el SLA (warning).
    if (hoursSinceCreation > 40) return "warning";
    // Si pasaron menos de 40 horas, estamos dentro del SLA (ok).
    return "ok";
  };

  // Filtramos los tickets según la pestaña activa y el término de búsqueda.
  // Usamos useMemo para evitar cálculos innecesarios en cada renderizado (cacheamos el resultado)
  // Aclaración del useMemo: es un hook que cachea los resultados, y no hace re-render a menos que cambie el
  // arreglo de dependencias (que son las variables que se indican al final)

  const filteredTickets = useMemo(() => {
    // Usamos el array TICKETS
    let result = TICKETS;

    // Dependiendo de la pestaña activa
    switch (activeTab) {
      // En "assigned" mostramos solo los tickets asignados al agente actual que no estén cerrados ni resueltos
      case "assigned":
        result = result.filter(
          (t) =>
            t.assignedTo === currentAgentId &&
            t.status !== "CERRADO" &&
            t.status !== "RESUELTO",
        );
        break;
      // En "unassigned" mostramos los tickets que no tienen asignado ningún agente
      // y que no estén cerrados ni resueltos
      case "unassigned":
        result = result.filter(
          (t) =>
            !t.assignedTo && t.status !== "CERRADO" && t.status !== "RESUELTO",
        );
        break;
      // En "high-priority" mostramos los tickets que tienen prioridad alta o crítica
      // y que no estén cerrados ni resueltos
      case "high-priority":
        result = result.filter(
          (t) =>
            ["high", "critical"].includes(t.priority) &&
            t.status !== "CERRADO" &&
            t.status !== "RESUELTO",
        );
        break;
      // En "sla" mostramos los tickets que están en riesgo de incumplir el SLA o que ya lo incumplieron,
      case "sla":
        result = result.filter(
          (t) =>
            getSLAStatus(t) !== "ok" &&
            t.status !== "CERRADO" &&
            t.status !== "RESUELTO",
        );
        break;
      // En "all" mostramos todos los tickets que no estén cerrados ni resueltos, y es el default también.
      case "all":
      default:
        result = result.filter(
          (t) => t.status !== "CERRADO" && t.status !== "RESUELTO",
        );
        break;
    }

    // Si hay un término de búsqueda, filtramos aún más los resultados
    // para incluir solo aquellos tickets cuyo ID, asunto o nombre del cliente
    // coincidan con el término de búsqueda (ignorando mayúsculas y minúsculas).
    if (searchTerm) {
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          getClientName(t.clientId)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    // Devolvemos el resultado filtrado, que se actualizará automáticamente
    // cada vez que cambie la pestaña activa, el término de búsqueda o el agente actual
    // (aunque este último no cambia en este caso).
    return result;
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, searchTerm, currentAgentId]); // getClientName y getSLAStatus son estables si usamos 'now' state

  // Función que se ejecuta cuando el agente hace clic en "Tomar Ticket" para un ticket sin asignar,
  // Obviamente es simulado, esto tendría que hacer un llamado a la API
  const handleTakeTicket = (id: string) => {
    toast.success(`Ticket ${id} asignado a ti exitosamente`);
  };

  // Datos de ejemplo para el gráfico de rendimiento, que se actualizan según el rango seleccionado
  // (semana, mes, año, etc.)
  const chartData = useMemo(() => {
    switch (chartRange) {
      case "week":
        return [
          { name: "Lun", tickets: 4 },
          { name: "Mar", tickets: 7 },
          { name: "Mie", tickets: 3 },
          { name: "Jue", tickets: 8 },
          { name: "Vie", tickets: 12 },
          { name: "Sab", tickets: 2 },
          { name: "Dom", tickets: 1 },
        ];
      case "month":
        return [
          { name: "Semana 1", tickets: 25 },
          { name: "Semana 2", tickets: 18 },
          { name: "Semana 3", tickets: 30 },
          { name: "Semana 4", tickets: 22 },
        ];
      case "year":
        return [
          { name: "Ene", tickets: 120 },
          { name: "Feb", tickets: 132 },
          { name: "Mar", tickets: 101 },
          { name: "Abr", tickets: 134 },
          { name: "May", tickets: 90 },
          { name: "Jun", tickets: 150 },
          { name: "Jul", tickets: 160 },
          { name: "Ago", tickets: 140 },
          { name: "Sep", tickets: 130 },
          { name: "Oct", tickets: 155 },
          { name: "Nov", tickets: 170 },
          { name: "Dic", tickets: 180 },
        ];
      case "all":
        return [
          { name: "2022-S1", tickets: 450 },
          { name: "2022-S2", tickets: 520 },
          { name: "2023-S1", tickets: 600 },
          { name: "2023-S2", tickets: 580 },
          { name: "2024-S1", tickets: 720 },
        ];
      default:
        return [];
    }
  }, [chartRange]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Panel de Control
          </h1>
          <p className="text-slate-500">
            Bienvenido de nuevo, Soporte Técnico. Tienes {metrics.assigned}{" "}
            tickets pendientes.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/knowledge-base">
            <Button variant="outline">
              <BookOpen className="mr-2 h-4 w-4" /> Panel de Conocimiento
            </Button>
          </Link>
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" /> Reportes
          </Button>
          <Link to="/new-ticket">
            <Button>
              <ArrowRight className="mr-2 h-4 w-4" /> Crear Ticket Interno
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards (Sin cambios, estaban bien) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* ... (Contenido de las cards idéntico al original) ... */}
        {/* Por brevedad, asumo que copia y pega sus Cards aquí */}
        <div className="space-y-4 lg:col-span-1">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500">
                Mis Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {metrics.assigned}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Activos actualmente
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500">
                SLA Cumplido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">
                {metrics.slaCompliance}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Objetivo: &gt;95%
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500">
                Calificación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500 flex items-center">
                {metrics.avgRating}{" "}
                <span className="text-sm text-muted-foreground ml-1 font-normal">
                  / 5.0
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Basado en 40 reseñas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <Card className="lg:col-span-3 border-slate-200 shadow-sm flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">
                Rendimiento de Resolución
              </CardTitle>
              <CardDescription>
                Tickets resueltos en el periodo seleccionado
              </CardDescription>
            </div>
            <Select value={chartRange} onValueChange={setChartRange}>
              <SelectTrigger className="w-[180px] h-8 text-xs">
                <SelectValue placeholder="Periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Última Semana</SelectItem>
                <SelectItem value="month">Último Mes</SelectItem>
                <SelectItem value="year">Último Año</SelectItem>
                <SelectItem value="all">Historial Completo</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <Tooltip
                  cursor={{ fill: "#f1f5f9" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="tickets"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={chartRange === "year" ? 20 : 40}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Main Workspace */}
      <Card className="border-slate-200 shadow-sm">
        <div className="p-2 border-b bg-slate-50/50 rounded-t-lg">
          <Tabs
            defaultValue="assigned"
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2">
              <TabsList>
                <TabsTrigger value="assigned">Mis Asignados</TabsTrigger>
                <TabsTrigger value="unassigned" className="relative">
                  Sin Asignar
                  {TICKETS.filter(
                    (t) =>
                      !t.assignedTo &&
                      t.status !== "CERRADO" &&
                      t.status !== "RESUELTO",
                  ).length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="high-priority">Alta Prioridad</TabsTrigger>
                <TabsTrigger value="sla">Riesgo SLA</TabsTrigger>
                <TabsTrigger value="all">Todos</TabsTrigger>
              </TabsList>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar ticket, cliente..."
                  className="pl-8 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[120px]">ID</TableHead>
                    <TableHead className="w-[250px]">Asunto</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Antigüedad</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => {
                      const slaStatus = getSLAStatus(ticket);
                      return (
                        <TableRow
                          key={ticket.id}
                          className="group hover:bg-slate-50 transition-colors"
                        >
                          <TableCell className="font-mono text-xs font-medium text-slate-600">
                            {ticket.id}
                            {slaStatus === "breached" && (
                              <span
                                className="ml-2 inline-block h-2 w-2 rounded-full bg-red-500"
                                title="SLA Breached"
                              ></span>
                            )}
                            {slaStatus === "warning" && (
                              <span
                                className="ml-2 inline-block h-2 w-2 rounded-full bg-yellow-500"
                                title="SLA Warning"
                              ></span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium truncate max-w-[250px]">
                              {ticket.subject}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {ticket.category}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                {getClientName(ticket.clientId).charAt(0)}
                              </div>
                              <span className="text-sm">
                                {getClientName(ticket.clientId)}
                              </span>
                            </div>
                          </TableCell>

                          {/* CORRECCIÓN 2: Casteo seguro en lugar de 'any' */}
                          {/* Asumimos que PriorityBadge acepta 'low'|'medium'|'high'|'critical' */}
                          <TableCell>
                            <PriorityBadge
                              priority={
                                ticket.priority as
                                  | "BAJA"
                                  | "MEDIA"
                                  | "ALTA"
                                  | "CRÍTICA"
                                  | "URGENTE"
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <StatusBadge
                              status={
                                ticket.status as
                                  | "NUEVO"
                                  | "ASIGNADO"
                                  | "EN PROCESO"
                                  | "EN ESPERA"
                                  | "RESUELTO"
                                  | "CERRADO"
                                  | "REABIERTO"
                              }
                            />
                          </TableCell>

                          <TableCell className="text-sm text-slate-500">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!ticket.assignedTo && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                  onClick={() => handleTakeTicket(ticket.id)}
                                >
                                  Tomar
                                </Button>
                              )}
                              <Link to={`/ticket/${ticket.id}`}>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 text-xs"
                                >
                                  Ver Detalle
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-32 text-center text-muted-foreground"
                      >
                        No se encontraron tickets en esta vista.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
}
