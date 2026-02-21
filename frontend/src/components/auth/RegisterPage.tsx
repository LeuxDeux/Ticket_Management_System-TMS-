import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { toast } from "sonner";

//TODO: Integrar zod y usar inferencia, usar AuthContext

// 1. Definimos la estructura de datos que esperamos
// En este caso, esperamos que el formulario reciba nombre, email, empresa (opcional),
//  teléfono (opcional), contraseña y confirmación de contraseña.

interface RegisterFormValues {
  fullName: string;
  email: string;
  company?: string;
  phone?: string;
  password: string;
  confirmPassword?: string; // Es opcional en la interfaz de datos, pero obligatorio en el form
}

export function RegisterPage() {
  //  Usamos useNavigate para redirigir después del registro
  const navigate = useNavigate();
  //  Configuramos useForm con el tipo de datos que esperamos, lo que nos da autocompletado y validación de tipos
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>();

  //  onSubmit recibe datos tipado, después hay que llamar a la API
  const onSubmit = (data: RegisterFormValues) => {
    console.log("Register data:", data);

    // Simulación de éxito
    toast.success("Cuenta creada exitosamente. Por favor inicia sesión.");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Crear Cuenta</CardTitle>
          <CardDescription>
            Regístrate para gestionar tus tickets de soporte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre Completo *</Label>
              <Input
                id="fullName"
                {...register("fullName", {
                  required: "Este campo es obligatorio",
                })}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500">
                  {errors.fullName.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email requerido",
                  pattern: /^\S+@\S+$/i,
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-500">Email inválido</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Empresa (Opcional)</Label>
                <Input id="company" {...register("company")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono (Opcional)</Label>
                <Input id="phone" type="tel" {...register("phone")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Contraseña requerida",
                  minLength: { value: 8, message: "Mínimo 8 caracteres" },
                })}
              />
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">
                  {errors.confirmPassword.message as string}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="terms" required />
              <Label htmlFor="terms" className="text-sm font-normal">
                Acepto los{" "}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  términos y condiciones
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Registrarse
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Inicia Sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
