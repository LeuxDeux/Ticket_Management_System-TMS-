import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { Separator } from "../../components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { TICKETS, MESSAGES } from "../../mock/data";
import { StatusBadge, PriorityBadge } from "./StatusBadge";
import {
  User,
  Send,
  Paperclip,
  Clock,
  ArrowLeft,
  Check,
  CheckCheck,
  Download,
  FileText,
  Star,
  X,
  RefreshCw,
  File,
  Timer,
  AlertCircle,
  History,
  Tag,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import type { Priority, Status } from "../../types/enums";

// Este componente TicketDetail muestra el detalle de un ticket específico,
// incluyendo su historial de mensajes, estado, prioridad
// y permite a los usuarios interactuar con el ticket (enviar mensajes, adjuntar archivos, etc.).

// Respuestas predefinidas para agentes, con placeholders para personalización.
// Esto permite a los agentes responder rápidamente con mensajes comunes,
// mientras que los placeholders se reemplazan dinámicamente con información relevante del cliente o agente.
const CANNED_RESPONSES = [
  {
    label: "Saludo Inicial",
    text: "Hola {nombre_cliente}, gracias por contactar a soporte. Mi nombre es {agente} y estaré atendiendo tu solicitud.",
  },
  {
    label: "Solicitar más info",
    text: "Para poder investigar mejor el problema, ¿podrías proporcionarnos capturas de pantalla o pasos para reproducir el error?",
  },
  {
    label: "Investigando",
    text: "Entendido, estoy revisando los logs del sistema. Te daré una actualización en breve.",
  },
  {
    label: "Cierre de ticket",
    text: "Me alegra confirmar que el problema ha sido resuelto. Procederé a cerrar el ticket. ¡Que tengas un buen día!",
  },
];

export function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAgent, isAdmin } = useAuth();

  // isStaff es true si el usuario es AGENTE o ADMIN
  const isStaff = isAgent || isAdmin;

  // Inicializamos el estado del ticket buscando el ticket correspondiente en los datos mockeados.
  // Esto después va a ser una llamada a la API
  const [ticket, setTicket] = useState(TICKETS.find((t) => t.id === id));

  // Nos guardamos la fecha actual en un estado para evitar problemas de sincronización con el tiempo transcurrido.
  const [now] = useState(() => Date.now());

  // Filtramos los mensajes relacionados con este ticket
  // y los ordenamos por fecha de creación para mostrarlos en orden cronológico.
  const messages = MESSAGES.filter((m) => m.ticketId === id).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  // Estados para el formulario de nuevo mensaje
  const [newMessage, setNewMessage] = useState("");
  // Estado para manejar los archivos adjuntos. Es un array de archivos.
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  // Estado para saber si un mensaje es una nota interna (no la ve el usuario común)
  const [isInternalNote, setIsInternalNote] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Estado para manejar la calificación del cliente (1 a 5 estrellas)
  const [rating, setRating] = useState(0);

  // Estado para manejar el timer de trabajo del agente.
  // Esto es útil para que el agente pueda llevar un control del tiempo dedicado a resolver el ticket.
  // Se usa para calcular el SLA restante, aunque en este ejemplo el SLA es fijo para simplificar.
  const [timerActive, setTimerActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Estado para mostrar/ocultar las respuestas predefinidas (canned responses) para agentes
  const [showCanned, setShowCanned] = useState(false);

  useEffect(() => {
    // SOLUCIÓN 2 (No Explicit Any): Usamos ReturnType para inferir el tipo correcto
    // sea en navegador (number) o entorno node (Timeout object).
    let interval: ReturnType<typeof setInterval>;

    if (timerActive) {
      interval = setInterval(() => setTimeElapsed((prev) => prev + 1), 1000);
    }
    // TypeScript sabe que clearInterval acepta undefined, así que esto es seguro
    return () => clearInterval(interval);
  }, [timerActive]);

  if (!ticket) {
    return <div className="p-8">Ticket no encontrado</div>;
  }

  // Función para formatear el tiempo transcurrido en formato HH:mm:ss.
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Manejadores de eventos optimizados para enviar mensajes, manejar archivos adjuntos, reabrir tickets, etc.
  const handleSendMessage = () => {
    // Validación simple para evitar enviar mensajes vacíos sin archivos adjuntos.
    if (!newMessage.trim() && attachedFiles.length === 0) return;

    // Aquí se simula el envío del mensaje.
    // En una aplicación real, esto implicaría una llamada a la API
    // para guardar el mensaje en la base de datos.
    if (isInternalNote && isStaff) {
      toast.success("Nota interna guardada (visible solo para agentes)");
    } else {
      toast.success("Mensaje enviado exitosamente");
    }

    // Reseteamos el formulario después de enviar el mensaje
    setNewMessage("");
    setAttachedFiles([]);
    setIsInternalNote(false);
  };

  // Manejadores para seleccionar archivos adjuntos
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (attachedFiles.length + newFiles.length > 3) {
        toast.error("Máximo 3 archivos permitidos");
        return;
      }
      setAttachedFiles([...attachedFiles, ...newFiles]);
    }
  };

  // Manejador para eliminar un archivo adjunto seleccionado antes de enviar el mensaje
  const removeFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  // Manejador para reabrir un ticket cerrado o resuelto.
  // Igualmente la idea sería que fuese una solicitud y no una reapertura directa.
  const handleReopen = () => {
    toast.success("Ticket reabierto");
    setTicket({ ...ticket, status: "REABIERTO" });
  };

  // Manejador para descargar el historial de chat en formato PDF
  // Haría una llamada a la API para guardar en formato pdf y después ejecutar la descarga
  const handleExportPDF = () => {
    toast.success("Descargando historial en PDF...");
  };

  // Sirve para calificar el servicio (se puede quitar)
  const handleRate = (stars: number) => {
    setRating(stars);
    toast.success(`Has calificado el servicio con ${stars} estrellas`);
  };

  // Calculamos el tiempo que pasó desde la fecha actual hasta la fecha de apertura del ticket.
  const getElapsedTime = (start: string) => {
    const diff = now - new Date(start).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} días`;
    return `${hours} horas`;
  };

  // Función para aplicar respuestas predefinidas (canned responses) al campo de nuevo mensaje.

  const applyCannedResponse = (text: string) => {
    const processed = text
      .replace("{nombre_cliente}", "Cliente")
      .replace("{agente}", "Soporte");
    setNewMessage(processed);
    setShowCanned(false);
  };

  // Función que asigna un ticket a un agente.
  // Habría que cambiar el assignedTo para hacerlo dinámico y hacer llamada a la API
  // para guardar el agente asignado
  const handleAssignSelf = () => {
    setTicket({ ...ticket, assignedTo: "a1" });
    toast.success("Ticket asignado a ti");
  };

  // Manejador del estado del ticket.
  const handleStatusChange = (status: string) => {
    setTicket({ ...ticket, status: status as Status });
    toast.success(`Estado cambiado a ${status}`);
  };

  // Manejador de la prioridad del ticket
  const handlePriorityChange = (priority: string) => {
    setTicket({ ...ticket, priority: priority as Priority });
    toast.success(`Prioridad cambiada a ${priority}`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:flex-row bg-slate-50">
      {/* Sidebar / Info */}
      <div className="w-full md:w-80 bg-white border-r p-6 overflow-y-auto shrink-0 flex flex-col gap-6">
        <div>
          <Button
            variant="ghost"
            className="mb-4 pl-0 hover:pl-2 transition-all -ml-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver
          </Button>

          <h2 className="text-2xl font-bold break-all">{ticket.id}</h2>
          <div className="flex flex-col gap-1 mt-2">
            <p className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" /> Creado:{" "}
              {new Date(ticket.createdAt).toLocaleDateString()}
            </p>
            <p className="text-xs text-muted-foreground flex items-center">
              <RefreshCw className="h-3 w-3 mr-1" /> Actualizado:{" "}
              {new Date(ticket.updatedAt).toLocaleDateString()}
            </p>
            {!isStaff && (
              <p className="text-xs font-medium text-blue-600 mt-1">
                Tiempo transcurrido: {getElapsedTime(ticket.createdAt)}
              </p>
            )}
          </div>
        </div>

        {isStaff && (
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase flex items-center">
                <Timer className="h-3 w-3 mr-1" /> Timer
              </span>
              <span className="font-mono text-sm font-medium">
                {formatTime(timeElapsed)}
              </span>
            </div>
            <Button
              size="sm"
              variant={timerActive ? "destructive" : "default"}
              className="w-full h-8"
              onClick={() => setTimerActive(!timerActive)}
            >
              {timerActive ? "Detener Timer" : "Iniciar Trabajo"}
            </Button>

            <Separator className="my-2" />

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" /> SLA Restante
              </span>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-[70%]"></div>
              </div>
              <span className="text-xs text-muted-foreground block text-right">
                3h 20m restantes
              </span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {isStaff ? (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Estado
                </label>
                <Select
                  onValueChange={handleStatusChange}
                  value={ticket.status}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue>
                      <StatusBadge status={ticket.status as Status} />
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NUEVO">Nuevo</SelectItem>
                    <SelectItem value="ASIGNADO">Asignado</SelectItem>
                    <SelectItem value="EN PROCESO">En Proceso</SelectItem>
                    <SelectItem value="RESUELTO">Resuelto</SelectItem>
                    <SelectItem value="CERRADO">Cerrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Prioridad
                </label>
                <Select
                  onValueChange={handlePriorityChange}
                  value={ticket.priority}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue>
                      <PriorityBadge priority={ticket.priority as Priority} />
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BAJA">Baja</SelectItem>
                    <SelectItem value="MEDIA">Media</SelectItem>
                    <SelectItem value="ALTA">Alta</SelectItem>
                    <SelectItem value="CRÍTICA">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Estado
                </label>
                <div className="mt-1">
                  <StatusBadge status={ticket.status as Status} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Prioridad
                </label>
                <div className="mt-1">
                  <PriorityBadge priority={ticket.priority as Priority} />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">
              Categoría
            </label>
            <div className="mt-1 text-sm font-medium">{ticket.category}</div>
          </div>

          {isStaff && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Etiquetas
              </label>
              <div className="flex flex-wrap gap-1 mt-1">
                {ticket.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs px-1.5 h-5"
                  >
                    {tag}
                  </Badge>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-5 w-5 rounded-full"
                >
                  <Tag className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <Separator />

        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase">
            Asignación
          </label>
          {isStaff ? (
            <div className="mt-2 space-y-2">
              {!ticket.assignedTo && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start border-dashed"
                  onClick={handleAssignSelf}
                >
                  <User className="mr-2 h-4 w-4" /> Tomar Ticket
                </Button>
              )}
              <Select value={ticket.assignedTo || "unassigned"}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Sin asignar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Sin asignar</SelectItem>
                  <SelectItem value="a1">Yo (Soporte Técnico)</SelectItem>
                  <SelectItem value="a2">María Agente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="flex items-center gap-3 mt-3">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-white shadow-sm">
                <User className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <span className="text-sm font-medium block">
                  {ticket.assignedTo ? "Soporte Técnico" : "Sin asignar"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Equipo de Ayuda
                </span>
              </div>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            Acciones
          </h4>

          {(ticket.status === "RESUELTO" || ticket.status === "CERRADO") && (
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={handleReopen}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Reabrir Ticket
            </Button>
          )}

          {ticket.status !== "RESUELTO" && !isStaff && (
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <Check className="mr-2 h-4 w-4" /> Marcar Resuelto
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={handleExportPDF}
          >
            <Download className="mr-2 h-4 w-4" /> Exportar PDF
          </Button>

          {isStaff && (
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <History className="mr-2 h-4 w-4" /> Ver Log de Auditoría
            </Button>
          )}
        </div>
      </div>

      {/* Conversation Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 shadow-sm">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold truncate">{ticket.subject}</h1>
              {isStaff && (
                <Badge variant="outline" className="text-[10px] h-5">
                  ID: {ticket.id}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {ticket.description}
            </p>
          </div>

          {ticket.status === "RESUELTO" && !isStaff && (
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border">
              <span className="text-xs font-medium text-slate-600">
                Calificar atención:
              </span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    className="hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {messages.map((msg, index) => {
            if (msg.internal && !isStaff) return null;

            const isMe = isStaff
              ? msg.senderType === "agent"
              : msg.senderType === "client";

            return (
              <div
                key={msg.id}
                className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isMe ? "items-end" : "items-start"}`}
                >
                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl p-4 shadow-sm relative group ${
                      msg.internal
                        ? "bg-amber-50 border-amber-200 border text-amber-900 rounded-bl-none"
                        : isMe
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white border text-slate-800 rounded-bl-none"
                    }`}
                  >
                    {/* Header inside bubble */}
                    <div className="flex items-center justify-between gap-4 mb-2">
                      {!isMe && !msg.internal && (
                        <span className="text-xs font-bold text-slate-500">
                          {msg.senderType === "client"
                            ? "Cliente"
                            : "Soporte Técnico"}
                        </span>
                      )}
                      {msg.internal && (
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-700">
                          <Lock className="h-3 w-3" /> NOTA INTERNA
                        </span>
                      )}
                    </div>

                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>

                    {/* Attachments Mock */}
                    {msg.attachments && (
                      <div className="mt-3 space-y-2">
                        {/* SOLUCIÓN 3 (Unused Var): Usamos _ para indicar variable ignorada */}
                        {msg.attachments.map((_att, i) => (
                          <div
                            key={i}
                            className={`flex items-center gap-2 p-2 rounded ${isMe ? "bg-blue-700/50" : "bg-slate-100"} text-xs`}
                          >
                            <FileText className="h-4 w-4" />
                            <span className="truncate max-w-[150px]">
                              archivo_adjunto_{i + 1}.pdf
                            </span>
                            <Download className="h-3 w-3 ml-auto cursor-pointer opacity-70 hover:opacity-100" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Metadata below bubble */}
                  <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isMe && !msg.internal && (
                      <span className="ml-1">
                        {index === messages.length - 1 ? (
                          <Check className="h-3 w-3 text-slate-400" />
                        ) : (
                          <CheckCheck className="h-3 w-3 text-blue-500" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div
          className={`p-4 border-t transition-colors ${isInternalNote ? "bg-amber-50/50" : "bg-white"}`}
        >
          {/* Agent Tools Bar */}
          {isStaff && (
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-2">
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant={isInternalNote ? "default" : "outline"}
                    className={`h-7 text-xs ${isInternalNote ? "bg-amber-500 hover:bg-amber-600 text-white border-transparent" : "text-slate-600"}`}
                    onClick={() => setIsInternalNote(!isInternalNote)}
                  >
                    <Lock className="mr-1.5 h-3 w-3" />
                    {isInternalNote ? "Modo Nota Interna" : "Nota Interna"}
                  </Button>
                </div>
              </div>

              <div className="relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs text-slate-500"
                  onClick={() => setShowCanned(!showCanned)}
                >
                  <FileText className="mr-1.5 h-3 w-3" /> Plantillas
                </Button>

                {showCanned && (
                  <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-lg border p-1 z-20">
                    <div className="p-2 text-xs font-semibold text-muted-foreground border-b mb-1">
                      Respuestas Rápidas
                    </div>
                    {CANNED_RESPONSES.map((cr, i) => (
                      <button
                        key={i}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-slate-100 rounded flex flex-col gap-0.5"
                        onClick={() => applyCannedResponse(cr.text)}
                      >
                        <span className="font-medium text-slate-700">
                          {cr.label}
                        </span>
                        <span className="text-slate-500 truncate">
                          {cr.text}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Attachments Preview */}
          {attachedFiles.length > 0 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              {attachedFiles.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-medium border"
                >
                  <File className="h-3 w-3 text-slate-500" />
                  <span className="max-w-[120px] truncate">{file.name}</span>
                  <button
                    onClick={() => removeFile(i)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative flex gap-2">
            <input
              type="file"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,.pdf,.doc,.docx"
            />

            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 h-[44px] w-[44px] rounded-full hover:bg-slate-100"
              onClick={() => fileInputRef.current?.click()}
              title="Adjuntar archivos (Máx 3)"
            >
              <Paperclip className="h-5 w-5 text-slate-500" />
            </Button>

            <div className="flex-1 relative">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={
                  isInternalNote
                    ? "Escribe una nota privada para el equipo..."
                    : "Escribe tu respuesta..."
                }
                className={`min-h-[44px] max-h-[200px] py-3 pr-12 resize-none rounded-2xl border-slate-300 focus:ring-2 ${isInternalNote ? "focus:ring-amber-500 focus:border-amber-500 bg-white" : "focus:ring-blue-500 focus:border-blue-500"}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                className={`absolute bottom-1 right-1 h-8 w-8 rounded-full transition-all ${
                  newMessage.trim() || attachedFiles.length > 0
                    ? isInternalNote
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "bg-blue-600 hover:bg-blue-700"
                    : "bg-slate-200 hover:bg-slate-300 text-slate-500"
                }`}
                disabled={!newMessage.trim() && attachedFiles.length === 0}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 text-center">
            Presiona Enter para enviar. Shift + Enter para nueva línea.
          </div>
        </div>
      </div>
    </div>
  );
}
