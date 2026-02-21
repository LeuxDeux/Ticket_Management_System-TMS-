import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { Trash2, Plus, Save } from "lucide-react";
import { toast } from "sonner";

export function AdminSettings() {
  // Estados para manejar las categorías dinámicamente.
  // En producción, esto vendría de la API y se actualizaría con llamadas a la API
  const [categories, setCategories] = useState([
    "Soporte Técnico",
    "Facturación",
    "Ventas",
    "Reclamos",
  ]);
  // Estado para manejar la nueva categoría a agregar (por defecto vacío)
  const [newCat, setNewCat] = useState("");

  // Función para agregar una nueva categoría a la lista (mock)
  // Si detecta una nueva función, copia (spread operator) el array actual y le agrega la nueva categoría,
  // luego limpia el input y muestra un toast de éxito
  const handleAddCategory = () => {
    if (newCat) {
      setCategories([...categories, newCat]);
      setNewCat("");
      toast.success("Categoría agregada");
    }
  };

  // Función para eliminar una categoría de la lista (mock)
  // Recibe el nombre de la categoría a eliminar, filtra el array para excluirla y actualiza el estado,
  // luego muestra un toast de éxito
  const handleRemoveCategory = (cat: string) => {
    setCategories(categories.filter((c) => c !== cat));
    toast.success("Categoría eliminada");
  };

  const handleSave = () => {
    toast.success("Configuración guardada correctamente");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
          <TabsTrigger value="automation">Automatización</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Portal</CardTitle>
              <CardDescription>
                Configuración básica del sistema visible para los usuarios.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre del Sistema</Label>
                <Input defaultValue="SupportHub Help Center" />
              </div>
              <div className="space-y-2">
                <Label>Email de Soporte Principal</Label>
                <Input defaultValue="support@company.com" />
              </div>
              <div className="space-y-2">
                <Label>Zona Horaria</Label>
                <Input defaultValue="UTC-5 (Bogota, Lima, Quito)" />
              </div>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> Guardar Cambios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Categorías</CardTitle>
              <CardDescription>
                Define las opciones disponibles al crear tickets.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-w-md">
                {categories.map((cat, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 border rounded bg-slate-50"
                  >
                    <span>{cat}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCategory(cat)}
                    >
                      <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="Nueva categoría..."
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                  />
                  <Button onClick={handleAddCategory}>
                    <Plus className="h-4 w-4" /> Agregar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Reglas de Asignación y SLA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-asignación Round Robin</Label>
                  <p className="text-xs text-muted-foreground">
                    Asignar tickets equitativamente entre agentes disponibles.
                  </p>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label>Tiempo SLA Prioridad Alta (Horas)</Label>
                <Input type="number" defaultValue="4" className="w-32" />
              </div>
              <div className="space-y-2">
                <Label>Tiempo SLA Prioridad Baja (Horas)</Label>
                <Input type="number" defaultValue="48" className="w-32" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-cierre de tickets resueltos</Label>
                  <p className="text-xs text-muted-foreground">
                    Cerrar tickets resueltos después de 7 días de inactividad.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button onClick={handleSave}>Guardar Configuración</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Plantillas de Correo</CardTitle>
              <CardDescription>
                Personaliza los correos automáticos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Asunto (Nuevo Ticket)</Label>
                <Input defaultValue="[Ticket #{ticket_id}] Hemos recibido tu solicitud" />
              </div>
              <div className="space-y-2">
                <Label>Cuerpo del Correo</Label>
                <Textarea
                  className="h-32 font-mono text-sm"
                  defaultValue={`Hola {user_name},\n\nHemos recibido tu ticket "{ticket_subject}". Un agente lo revisará pronto.\n\nPuedes ver el estado aquí: {ticket_link}\n\nGracias,\nEl Equipo de Soporte`}
                />
              </div>
              <Button onClick={handleSave}>Guardar Plantilla</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
