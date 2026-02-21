import { useForm, Controller } from 'react-hook-form'; // Importamos Controller
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';

// Definimos la estructura de datos que esperamos del formulario de creación de ticket.
// Después con Zod podríamos validar esta estructura y generar tipos automáticamente, 
// pero por ahora lo hacemos manualmente.
interface CreateTicketValues {
  name: string;
  email: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
  phone?: string;
  company?: string;
  files?: FileList;
}

// Componente para crear un nuevo ticket de soporte.
// El formulario incluye campos para el nombre, email, 
// asunto, categoría, prioridad, descripción, teléfono, empresa y archivos adjuntos.
// Se utiliza react-hook-form para manejar el estado del formulario y la validación de los campos.
export function CreateTicket() {
  const navigate = useNavigate();
  // Configuramos useForm con los tipos de datos que esperamos, lo que nos da autocompletado y validación de tipos.
  const { register, handleSubmit, control, formState: { errors } } = useForm<CreateTicketValues>({
    // Establecemos valores por defecto para los campos controlados (prioridad y categoría)
    // Esto es importante para que los componentes controlados (Select y RadioGroup) tengan un valor inicial,
    // lo que evita problemas de renderizado y validación.
    defaultValues: {
      priority: 'medium', // Valor por defecto para que el RadioGroup empiece marcado
      category: '' // Valor por defecto vacío para que el Select muestre el placeholder inicialmente
    }
  });

  // Función que se ejecuta al enviar el formulario, recibe los datos tipados y 
  // luego se encarga de procesarlos (por ejemplo, enviarlos a una API).
  const onSubmit = (data: CreateTicketValues) => {
    // Muestra en consola los datos recibidos
    console.log('Form Data:', data);
    
    // Creamos una clave única para el nuevo ticket
    const uniqueSegment = self.crypto.randomUUID().split('-')[0].toUpperCase();
    const newTicketId = `TKT-2026-${uniqueSegment}`;
    
    // Acá iría una llamada a la API para crear el ticket en el backend, pasando los datos del formulario.
    // Por ejemplo:
    // api.createTicket(data)
    toast.success(`Ticket creado con éxito: ${newTicketId}`);
    
    // Redirección a la página principal
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Crear Nuevo Ticket</CardTitle>
          <CardDescription>Completa el formulario para recibir asistencia.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Fila 1: Nombre y Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input 
                    id="name" 
                    {...register('name', { required: 'El nombre es obligatorio' })} 
                    placeholder="Ej. Juan Pérez" 
                />
                {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input 
                    id="email" 
                    type="email" 
                    {...register('email', { required: 'El email es obligatorio' })} 
                    placeholder="juan@ejemplo.com" 
                />
                {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
              </div>
            </div>

            {/* Asunto */}
            <div className="space-y-2">
              <Label htmlFor="subject">Asunto *</Label>
              <Input 
                id="subject" 
                {...register('subject', { required: 'El asunto es obligatorio', maxLength: 200 })} 
                placeholder="Resumen del problema" 
              />
              {errors.subject && <span className="text-xs text-destructive">{errors.subject.message}</span>}
            </div>

            {/* Fila 2: Categoría y Prioridad (Componentes Controlados) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoría *</Label>
                {/* Controller es necesario para componentes de UI que no son nativos HTML input */}
                <Controller
                    name="category"
                    control={control}
                    rules={{ required: 'Selecciona una categoría' }}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="technical">Soporte Técnico</SelectItem>
                                <SelectItem value="billing">Facturación</SelectItem>
                                <SelectItem value="sales">Ventas</SelectItem>
                                <SelectItem value="other">Otro</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.category && <span className="text-xs text-destructive">{errors.category.message}</span>}
              </div>

              <div className="space-y-2">
                <Label>Prioridad *</Label>
                <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup 
                            onValueChange={field.onChange} 
                            defaultValue={field.value} 
                            className="flex gap-4 pt-2"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="low" id="low" />
                                <Label htmlFor="low" className="font-normal cursor-pointer">Baja</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="medium" id="medium" />
                                <Label htmlFor="medium" className="font-normal cursor-pointer">Media</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="high" id="high" />
                                <Label htmlFor="high" className="font-normal cursor-pointer">Alta</Label>
                            </div>
                        </RadioGroup>
                    )}
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea 
                id="description" 
                className="min-h-[150px]" 
                {...register('description', { required: 'La descripción es obligatoria' })} 
                placeholder="Detalla tu problema aquí..." 
              />
              {errors.description && <span className="text-xs text-destructive">{errors.description.message}</span>}
            </div>

            {/* Fila 3: Teléfono y Empresa (Corregidos IDs y names) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input 
                        id="phone" 
                        {...register('phone')} 
                        placeholder="Número de Teléfono" 
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="company">Empresa</Label>
                    <Input 
                        id="company" 
                        {...register('company')} 
                        placeholder="Nombre de Empresa" 
                    />
                </div>
            </div>

            {/* Archivos */}
            <div className="space-y-2">
                <Label htmlFor="files">Archivos Adjuntos (Opcional)</Label>
                <Input 
                    id="files" 
                    type="file" 
                    multiple 
                    className="cursor-pointer" 
                    {...register('files')}
                />
                <p className="text-xs text-muted-foreground">Máximo 3 archivos, 10MB cada uno.</p>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/')}>Cancelar</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Enviar Ticket</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}