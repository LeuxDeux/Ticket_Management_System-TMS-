import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Clock, User, AlertCircle } from "lucide-react";

import api from "../../services/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { toast } from "sonner";

const checkTicketSchema = z.object({
  ticketNumber: z
    .string()
    .min(1, "Ingresá el número de ticket")
    .regex(/^TKT-\d{4}-\d{5}$/, "Formato esperado: TKT-YYYY-NNNNN"),
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Ingresá un email válido"),
});

type CheckTicketValues = z.infer<typeof checkTicketSchema>;

const STATUS_LABELS: Record<string, string> = {
  NEW: "Nuevo",
  ASSIGNED: "Asignado",
  IN_PROGRESS: "En Proceso",
  WAITING: "En Espera",
  RESOLVED: "Resuelto",
  CLOSED: "Cerrado",
  REOPENED: "Reabierto",
};

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800",
  ASSIGNED: "bg-purple-100 text-purple-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  WAITING: "bg-orange-100 text-orange-800",
  RESOLVED: "bg-green-100 text-green-800",
  CLOSED: "bg-slate-100 text-slate-700",
  REOPENED: "bg-red-100 text-red-800",
};

const PRIORITY_LABELS: Record<string, string> = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",
  CRITICAL: "Crítica",
  URGENT: "Urgente",
};

interface TicketResult {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  assignedAgent: { name: string } | null;
  messages: {
    id: string;
    content: string;
    createdAt: string;
    user: { name: string; role: string };
  }[];
}

export function CheckTicket() {
  const [ticket, setTicket] = useState<TicketResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CheckTicketValues>({
    resolver: zodResolver(checkTicketSchema),
    defaultValues: { ticketNumber: "", email: "" },
  });

  const onSubmit = async (data: CheckTicketValues) => {
    setIsLoading(true);
    setTicket(null);
    try {
      const response = await api.get(
        `/tickets/public/${data.ticketNumber}?email=${encodeURIComponent(data.email)}`,
      );
      setTicket(response.data.ticket);
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message || "Ticket no encontrado";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        {/* Search form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              Consultar Estado de Ticket
            </CardTitle>
            <CardDescription>
              Ingresá el número de ticket y el email con el que lo creaste.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="ticketNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Ticket</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="TKT-2026-00001"
                          autoComplete="off"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="tu@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Buscando..." : "Consultar"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Result */}
        {ticket && (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-sm text-slate-500 font-mono">
                    {ticket.ticketNumber}
                  </p>
                  <CardTitle className="text-lg mt-1">{ticket.title}</CardTitle>
                </div>
                <Badge
                  className={
                    STATUS_COLORS[ticket.status] ??
                    "bg-slate-100 text-slate-700"
                  }
                >
                  {STATUS_LABELS[ticket.status] ?? ticket.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Meta */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>
                    Prioridad:{" "}
                    <strong>
                      {PRIORITY_LABELS[ticket.priority] ?? ticket.priority}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="h-4 w-4 shrink-0" />
                  <span>
                    Agente:{" "}
                    <strong>
                      {ticket.assignedAgent?.name ?? "Sin asignar"}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 col-span-2">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>
                    Creado:{" "}
                    <strong>
                      {new Date(ticket.createdAt).toLocaleString("es-AR")}
                    </strong>
                  </span>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Descripción
                </p>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">
                  {ticket.description}
                </p>
              </div>

              {/* Messages */}
              {ticket.messages.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-3">
                      Historial de mensajes
                    </p>
                    <div className="space-y-3">
                      {ticket.messages.map((msg) => {
                        const isStaff =
                          msg.user.role === "AGENT" ||
                          msg.user.role === "ADMIN";
                        return (
                          <div
                            key={msg.id}
                            className={`rounded-lg p-3 text-sm ${
                              isStaff
                                ? "bg-blue-50 border border-blue-100"
                                : "bg-slate-50 border border-slate-200"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-slate-800">
                                {msg.user.name}
                                {isStaff && (
                                  <span className="ml-2 text-xs text-blue-600 font-normal">
                                    Soporte
                                  </span>
                                )}
                              </span>
                              <span className="text-xs text-slate-400">
                                {new Date(msg.createdAt).toLocaleString(
                                  "es-AR",
                                )}
                              </span>
                            </div>
                            <p className="text-slate-700 whitespace-pre-wrap">
                              {msg.content}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* CTA to register */}
              <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600 text-center">
                ¿Querés seguir tus tickets más fácilmente?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Creá una cuenta
                </Link>{" "}
                con el mismo email y todos tus tickets quedarán vinculados.
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
