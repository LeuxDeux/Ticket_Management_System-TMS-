import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { toast } from 'sonner';

//TODO: Corregir PropDrilling (usar AuthContext), cambiar lógica de roles en onSubmit

// 1. Definimos la interfaz de los datos del formulario. 
// Identificamos email como string y password como string opcional (aunque en un caso real debería ser obligatorio). 
// Esto nos permite tener tipado seguro en el formulario.
interface LoginFormValues {
  email: string;
  password?: string; // Opcional porque en el mock no la valida, pero debería ser obligatoria
}

// Definimos las props que el componente LoginPage recibirá. 
// En este caso, una función setRole para actualizar el rol del usuario en el estado global o contexto.
interface LoginPageProps {
  setRole: (role: string) => void;
}

export function LoginPage({ setRole }: LoginPageProps) {
  // Usamos el hook useNavigate para redirigir al usuario después del login exitoso
  const navigate = useNavigate();
  // Usamos el hook de form, pasando la interfaz LoginFormValues para tener tipado seguro en los datos del formulario
  const { register, handleSubmit } = useForm<LoginFormValues>();

  // Función que se ejecuta al enviar el formulario, recibe los datos del formulario (data) 
  // con tipado seguro gracias a la interfaz.
  const onSubmit = (data: LoginFormValues) => {
    console.log('Login attempt:', data);
    
    // Lógica de roles simulada: si el email contiene "admin", se asigna el rol de admin;
    // Por ejemplo juan@admin.com. Si contiene "help", se asigna el rol de agente; por ejemplo
    if (data.email.includes('admin')) {
        setRole('admin');
        toast.success('Bienvenido Administrador');
    } else if (data.email.includes('help')) {
        setRole('agent');
        toast.success('Bienvenido Agente');
    } else {
        setRole('client');
        toast.success('Bienvenido Cliente');
    }
    // Idependientemente del rol, se navega a la página principal después del login
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Iniciar Sesión</CardTitle>
          <CardDescription>Accede a tu cuenta de SupportHub</CardDescription>
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                {...register('password', { required: true })} 
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal">Recordarme</Label>
            </div>

            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800">
              Ingresar
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-4">
             <Separator className="flex-1" />
             <span className="text-xs text-muted-foreground uppercase">O</span>
             <Separator className="flex-1" />
          </div>

          <div className="mt-6">
            <Link to="/register">
                <Button variant="outline" className="w-full">
                    Registrarse
                </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Demo Tools */}
      <div className="mt-8 p-4 bg-slate-100 rounded-lg text-xs text-slate-500 max-w-md w-full text-center">
        <p className="font-semibold mb-2">Credenciales de Demo:</p>
        <p>Cliente: cualquier email (ej. juan@gmail.com)</p>
        <p>Agente: incluir "help" (ej. help@soporte.com)</p>
        <p>Admin: incluir "admin" (ej. admin@hub.com)</p>
        <p className="mt-2 text-muted-foreground">O usa los botones rápidos:</p>
         <div className="flex justify-center gap-2 mt-1">
            <button onClick={() => { setRole('client'); navigate('/'); }} className="underline hover:text-blue-600">Cliente</button>
            <button onClick={() => { setRole('agent'); navigate('/'); }} className="underline hover:text-blue-600">Agente</button>
            <button onClick={() => { setRole('admin'); navigate('/'); }} className="underline hover:text-blue-600">Admin</button>
         </div>
      </div>
    </div>
  );
}
