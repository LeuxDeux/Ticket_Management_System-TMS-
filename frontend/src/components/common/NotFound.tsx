import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center px-4">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">Esta página no existe.</p>

        <Button asChild>
          <Link to="/">Volver al inicio</Link>
        </Button>
      </section>
    </main>
  );
}