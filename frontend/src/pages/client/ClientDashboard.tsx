import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { StatusBadge, PriorityBadge } from "../tickets/StatusBadge";
import { TICKETS } from "../../mock/data";
import {
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
} from "lucide-react";
import { type Ticket } from "../../types/ticket"; // Asegúrese de que este import sea correcto
import { toast } from "sonner";
import type { Priority, Status } from "@/types/enums";

// El ClientDashboard es la vista principal para los usuarios con rol de cliente,
// donde pueden ver y gestionar sus tickets de soporte.
// La estructura del componente incluye un encabezado con el título y un botón
// para crear un nuevo ticket, seguido de una sección de estadísticas rápidas
// que muestra información clave sobre los tickets del cliente,
// como el número de tickets abiertos, resueltos, el tiempo promedio de respuesta
// y el total histórico de tickets.
// Luego, hay una sección de filtros y acciones que permite al cliente
// buscar tickets específicos, filtrar por estado y ordenar los resultados por fecha, prioridad o estado.
// Finalmente, se muestra una tabla con los tickets paginados, donde
// cada fila representa un ticket con información relevante
// como el número de ticket, asunto, estado, prioridad, última actualización y antigüedad.
// También hay acciones disponibles para cada ticket, como ver detalles
// o solicitar la reapertura de un ticket cerrado o resuelto.
export function ClientDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "priority" | "status">("date");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Nos guardamos la fecha actual en un estado
  const [now] = useState(() => Date.now());

  // Filtramos los tickets del cliente (en este caso, el cliente con id 'u1')
  // Después va a ser una llamada a API
  const rawTickets = TICKETS.filter((t) => t.clientId === "u1");

  // Filtramos los tickets del cliente que elegimos en el filtro anterior
  //  y luego aplicamos los filtros de búsqueda, estado y ordenamiento.
  const filteredTickets = useMemo(() => {
    const result = rawTickets.filter((t) => {
      // Búsqueda por coincidencia de texto en ID o asunto, ignorando mayúsculas y minúsculas
      const matchesSearch =
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchTerm.toLowerCase());
      // Filtro por estado, con lógica ajustada a los estados reales de los tickets
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "open"
            ? ["ABIERTO", "EN_PROGRESO", "ESPERANDO_CLIENTE"].includes(t.status) // Basado en los tipos en ticket.ts
            : t.status === statusFilter;
      // Devolvemos true solo si el ticket coincide con ambos filtros (búsqueda y estado)
      return matchesSearch && matchesStatus;
    });

    // Ordenamiento de resultados según el criterio seleccionado
    return result.sort((a: Ticket, b: Ticket) => {
      // Ordena por fecha de actualización (más reciente primero)
      if (sortBy === "date")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      // Ordena por prioridad, usando un orden definido (CRÍTICA > ALTA > MEDIA > BAJA)
      if (sortBy === "priority") {
        const priorityOrder: Record<string, number> = {
          critical: 3,
          high: 2,
          medium: 1,
          low: 0,
        };
        return (
          (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
        );
      }
      // Ordena por estado, usando un orden alfabético simple (esto se puede ajustar según necesidades)
      if (sortBy === "status")
        return (a.status || "").localeCompare(b.status || "");
      return 0;
    });
    // El arreglo de dependencias depende de
    // los tickets, el término de búsqueda, el filtro de estado y el criterio de ordenamiento.
  }, [rawTickets, searchTerm, statusFilter, sortBy]);

  // Lógica de paginación: calculamos
  // el número total de páginas y los tickets que se mostrarán en la página actual.
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Función para manejar la solicitud de reapertura de un ticket, que muestra una notificación de éxito.
  // En una implementación real, aquí se haría una llamada a la API para solicitar la reapertura del ticket,
  // y luego se actualizaría la lista de tickets para reflejar el cambio de estado.
  // La idea es que un usuario disconforme pueda solicitar una revisión del ticket, y que el mismo pueda
  // ser rechazado, derivado a otra persona o aceptado
  const handleReopen = (id: string) => {
    toast.success(`Solicitud de reapertura enviada para el ticket ${id}`);
  };

  // Función para calcular la antigüedad de un ticket en días, a partir de su fecha de creación.
  // Se utiliza la fecha actual almacenada en el estado 'now' para evitar cálculos repetitivos
  // cada vez que se renderiza la tabla, lo que mejora el rendimiento.
  const getDaysElapsed = (dateStr: string) => {
    const diff = now - new Date(dateStr).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Tickets</h1>
          <p className="text-muted-foreground">
            Gestiona y consulta el estado de tus solicitudes de soporte.
          </p>
        </div>
        <Link to="/new-ticket">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Ticket
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tickets Abiertos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Ajustado filtro a enums reales */}
            <div className="text-2xl font-bold">
              {
                rawTickets.filter(
                  (t) => !["CERRADO", "RESUELTO"].includes(t.status),
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resueltos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rawTickets.filter((t) => t.status === "RESUELTO").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Promedio Respuesta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.5h</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Histórico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rawTickets.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID o asunto..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Estado" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="open">Abiertos / En Proceso</SelectItem>
              <SelectItem value="RESUELTO">Resueltos</SelectItem>
              <SelectItem value="CERRADO">Cerrados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Ordenar por:
          </span>
          {/* CORRECCIÓN 4: Tipado en el onChange del select */}
          <Select
            value={sortBy}
            onValueChange={(v) =>
              setSortBy(v as "date" | "priority" | "status")
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Fecha Reciente</SelectItem>
              <SelectItem value="priority">Prioridad</SelectItem>
              <SelectItem value="status">Estado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Asunto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Última Actualización</TableHead>
              <TableHead>Antigüedad</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTickets.length > 0 ? (
              paginatedTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell
                    className="max-w-[200px] truncate"
                    title={ticket.subject}
                  >
                    {ticket.subject}
                  </TableCell>
                  {/* CORRECCIÓN 5: Casteo seguro */}
                  <TableCell>
                    <StatusBadge status={ticket.status as Status} />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={ticket.priority as Priority} />
                  </TableCell>
                  <TableCell>
                    {new Date(ticket.updatedAt).toLocaleDateString()}{" "}
                    {new Date(ticket.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>{getDaysElapsed(ticket.createdAt)} días</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link to={`/ticket/${ticket.id}`}>
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                    </Link>
                    {(ticket.status === "RESUELTO" ||
                      ticket.status === "CERRADO") && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleReopen(ticket.id)}
                        title="Reabrir Ticket"
                      >
                        <RefreshCw className="h-4 w-4 text-orange-600" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No se encontraron tickets con los filtros actuales.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end space-x-2 p-4 border-t">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground mx-2">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
