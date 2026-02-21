import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';


//TODO: Integrar zod y usar inferencia

// Interfaz de Typescript
  interface ForgotPasswordFormData {
  email: string;
}


export function ForgotPasswordPage() {
  // React Hook Form para manejar el formulario de recuperación de contraseña
  const { register, handleSubmit } = useForm<ForgotPasswordFormData>();

  // Función que se ejecuta al enviar el formulario, recibe los datos del formulario (data)
    const onSubmit = (data: ForgotPasswordFormData) => {
    console.log('Recovery email:', data.email);
    toast.success('Si el email existe, recibirás instrucciones...');
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Recuperar Contraseña</CardTitle>
          <CardDescription>Ingresa tu email para recibir un enlace de recuperación.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="nombre@ejemplo.com"
                {...register('email', { required: true })} 
              />
            </div>
            <Button type="submit" className="w-full">Enviar Enlace</Button>
          </form>
        </CardContent>
        <CardFooter>
          <Link to="/login" className="flex items-center text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Iniciar Sesión
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
