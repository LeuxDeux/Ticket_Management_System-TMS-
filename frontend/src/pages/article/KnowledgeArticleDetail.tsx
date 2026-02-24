import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
// Shadcn UI Components
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
// Mock Data
import { ARTICLES, USERS } from "../../mock/data";
// Icons - Corregido: Agregado ArrowRight
import {
  ArrowLeft,
  Edit,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Calendar,
  User,
  Link as LinkIcon,
  Tag,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

// Componente para mostrar el detalle de un artículo de conocimiento.

export function KnowledgeArticleDetail() {
  // El hook useParams extrae el id del artículo de la URL, 
  // lo que nos permite buscar el artículo correspondiente en la lista de artículos.
  // No utilizamos props para pasar el ID a las páginas de detalle porque las vistas 
  // actúan como rutas independientes. Utilizamos useParams para extraer el ID directamente de la URL. 
  // Esto garantiza que la página sobreviva a recargas del navegador (F5), 
  // permita que los enlaces se puedan guardar en favoritos y puedan ser compartidos entre usuarios (Deep Linking). 
  // La URL actúa como nuestra fuente de verdad absoluta.
  const { id } = useParams();
  const navigate = useNavigate();

  // Memorización para evitar búsquedas costosas en cada renderizado
  // Nos traemos los artículos y usuarios de los datos mockeados, pero en una aplicación real esto vendría de una API.
  const article = useMemo(() => ARTICLES.find((a) => a.id === id), [id]);
  const author = useMemo(
    () => (article ? USERS.find((u) => u.id === article.authorId) : null),
    [article],
  );

  // Estado local para feedback (Simulando interacción de UI)
  // Aunque esto podría no ir porque Lautaro mencionó que no es necesario,
  // lo dejo para mostrar cómo se manejaría el estado de feedback (likes/dislikes) en el componente.
  const [feedback, setFeedback] = useState({ liked: false, disliked: false });

  // Validación de existencia con retorno temprano (Early Return)
  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h1 className="text-2xl font-bold">Artículo no encontrado</h1>
        <Button onClick={() => navigate("/knowledge-base")}>Volver</Button>
      </div>
    );
  }

  // Handlers optimizados. Lo mismo de antes, si no es necesario se saca.
  const handleFeedback = (type: "like" | "dislike") => {
    setFeedback((prev) => {
      if (type === "like") {
        if (!prev.liked) toast.success("¡Gracias por tu feedback!");
        return { liked: !prev.liked, disliked: false };
      } else {
        return { liked: false, disliked: !prev.disliked };
      }
    });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 bg-slate-50 min-h-screen text-slate-900">
      {/* Header de navegación */}
      <header className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/knowledge-base")}
          className="pl-0"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate(`/knowledge-base/${id}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" /> Editar
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <main className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-8">
              {/* Badges de Estado */}
              <div className="flex gap-2 mb-6">
                <Badge variant="secondary">{article.category}</Badge>
                {article.status === "published" && (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                    Publicado
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight mb-6">
                {article.title}
              </h1>

              {/* Metadata */}
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-8 pb-6 border-b">
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" /> {author?.name || "Sistema"}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />{" "}
                  {new Date(article.updatedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" /> {article.views}
                </div>
              </div>

              {/* Contenido del Artículo */}
              <article className="prose prose-slate max-w-none">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 italic text-slate-700">
                  {article.excerpt}
                </div>
                <div className="text-lg leading-relaxed">{article.content}</div>
              </article>
            </CardContent>
          </Card>

          {/* Feedback Section */}
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <p className="font-medium text-slate-600">
                ¿Fue útil esta información?
              </p>
              <div className="flex gap-3">
                <Button
                  variant={feedback.liked ? "default" : "outline"}
                  onClick={() => handleFeedback("like")}
                  className={
                    feedback.liked ? "bg-green-600 hover:bg-green-700" : ""
                  }
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />{" "}
                  {article.likes + (feedback.liked ? 1 : 0)}
                </Button>
                <Button
                  variant={feedback.disliked ? "default" : "outline"}
                  onClick={() => handleFeedback("dislike")}
                  className={
                    feedback.disliked ? "bg-red-600 hover:bg-red-700" : ""
                  }
                >
                  <ThumbsDown className="mr-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 space-y-6">
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Etiquetas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-slate-100"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" /> Relacionados
                </h3>
                {/* CORRECCIÓN: Verificamos existencia (&&) antes de la longitud */}
                {article.relatedTicketIds &&
                article.relatedTicketIds.length > 0 ? (
                  <ul className="space-y-3">
                    {article.relatedTicketIds.map((tid) => (
                      <li key={tid}>
                        <Link
                          to={`/ticket/${tid}`}
                          className="group text-sm text-blue-600 hover:text-blue-800 flex items-center justify-between"
                        >
                          <span>Ticket #{tid}</span>
                          <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    No hay tickets vinculados.
                  </p>
                )}
              </section>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
