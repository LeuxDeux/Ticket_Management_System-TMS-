import React, { useState } from "react";
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
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { USERS } from "../../mock/data";
import { type User } from "../../types/user";
import { Edit, Trash2, Key, History, Plus, Search } from "lucide-react";
import { toast } from "sonner";

export function AdminUsers() {
  // Estado para usuarios
  const [users, setUsers] = useState<User[]>(USERS);
  // Estado para búsqueda de términos
  const [searchTerm, setSearchTerm] = useState("");
  // Estado para manejar filtro de roles
  const [roleFilter, setRoleFilter] = useState<string>("all");
  // Estado para manejar el usuario seleccionado
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  // Estado para manejar la apertura del diálogo de edición de usuario
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Filtramos los usuarios según el término de búsqueda y el filtro de rol
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Función para manejar la eliminación (desactivación) de un usuario (mock)
  const handleDeleteUser = (id: string) => {
    if (confirm("¿Estás seguro de desactivar este usuario?")) {
      // Cambiar después a llamada a API
      setUsers(users.filter((u) => u.id !== id));
      toast.success("Usuario desactivado");
    }
  };

  // Simulación de envío de correo para restablecer contraseña
  const handleResetPassword = (email: string) => {
    toast.success(`Correo de restablecimiento enviado a ${email}`);
  };

  // Función para manejar la actualización de un usuario (mock)
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditOpen(false);
    toast.success("Usuario actualizado correctamente");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestión de Usuarios</CardTitle>
            <CardDescription>
              Administra clientes, agentes y administradores del sistema.
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nuevo Usuario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Nombre</Label>
                  <Input className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Email</Label>
                  <Input className="col-span-3" type="email" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Rol</Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLIENT">Cliente</SelectItem>
                      <SelectItem value="AGENT">Agente</SelectItem>
                      <SelectItem value="ADMIN">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => toast.success("Usuario creado")}>
                  Crear Usuario
                </Button>
                <Button onClick={() => toast.warning("Operación cancelada")}>
                  Cancelar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o email..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="CLIENT">Clientes</SelectItem>
                <SelectItem value="AGENT">Agentes</SelectItem>
                <SelectItem value="ADMIN">Administradores</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                        {user.name.charAt(0)}
                      </div>
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === "ADMIN"
                          ? "destructive"
                          : user.role === "AGENT"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.company || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Dialog
                        open={isEditOpen && selectedUser?.id === user.id}
                        onOpenChange={(open) => {
                          setIsEditOpen(open);
                          if (open) setSelectedUser(user);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" title="Editar">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Usuario</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleSaveUser}>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Nombre</Label>
                                <Input
                                  className="col-span-3"
                                  defaultValue={user.name}
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Rol</Label>
                                <Select defaultValue={user.role}>
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="CLIENT">
                                      Cliente
                                    </SelectItem>
                                    <SelectItem value="AGENTE">
                                      Agente
                                    </SelectItem>
                                    <SelectItem value="ADMIN">
                                      Administrador
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit">Guardar Cambios</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="icon"
                        title="Reset Password"
                        onClick={() => handleResetPassword(user.email)}
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Ver Historial"
                        onClick={() =>
                          toast.info("Historial de actividad (Mock)")
                        }
                      >
                        <History className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600"
                        title="Desactivar"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
