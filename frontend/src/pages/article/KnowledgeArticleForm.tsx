import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../../components/ui/form";
import { ARTICLES } from "../../mock/data";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { knowledgeArticleFormSchema } from "../../schemas/knowledgeArticleForm";

// Inferencia de tipos desde Zod - tipo del formulario antes de la transformación
type KnowledgeArticleFormValues = z.input<typeof knowledgeArticleFormSchema>;

export function KnowledgeArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Buscamos el artículo existente si estamos en modo edición
  const existingArticle = useMemo(() => {
    if (!isEditMode) return null;
    return ARTICLES.find((a) => a.id === id);
  }, [id, isEditMode]);

  // React Hook Form con Zod resolver
  const form = useForm<KnowledgeArticleFormValues>({
    resolver: zodResolver(knowledgeArticleFormSchema),
    defaultValues: {
      title: existingArticle?.title ?? "",
      content: existingArticle?.content ?? "",
      excerpt: existingArticle?.excerpt ?? "",
      category: existingArticle?.category ?? "",
      status: existingArticle?.status ?? "draft",
      visibility: existingArticle?.visibility ?? "public",
      tagsInput: existingArticle?.tags.join(", ") ?? "",
      keywordsInput: existingArticle?.keywords.join(", ") ?? "",
      version: existingArticle?.version ?? "1.0",
    },
  });

  // onSubmit recibe los datos ya transformados en runtime (Zod aplica .transform())
  // TypeScript muestra el tipo de input, pero los datos reales incluyen tags/keywords como arrays
  const onSubmit = (data: KnowledgeArticleFormValues) => {
    // En runtime: data contiene tags: string[] y keywords: string[] (no tagsInput/keywordsInput)
    const transformedData = data as z.output<typeof knowledgeArticleFormSchema>;
    console.log("Article data:", transformedData);
    toast.success(
      isEditMode
        ? "Artículo actualizado correctamente"
        : "Artículo creado correctamente",
    );
    navigate("/knowledge-base");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Editar Artículo" : "Nuevo Artículo"}
        </h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Cómo reiniciar el servidor..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Acceso">Acceso</SelectItem>
                          <SelectItem value="Pagos">Pagos</SelectItem>
                          <SelectItem value="Facturación">
                            Facturación
                          </SelectItem>
                          <SelectItem value="Técnico">Técnico</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Versión</FormLabel>
                      <FormControl>
                        <Input placeholder="1.0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Extracto (Resumen corto)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Breve descripción que aparecerá en los resultados de búsqueda..."
                        className="h-20 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contenido del Artículo</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[300px] font-mono text-sm"
                        placeholder="Escribe aquí el contenido detallado..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Soporta Markdown básico (simulado).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tagsInput"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (separados por coma)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="login, error, tutorial"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keywordsInput"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Palabras Clave (SEO interno)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="restablecer, password, cuenta"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Borrador</SelectItem>
                          <SelectItem value="published">Publicado</SelectItem>
                          <SelectItem value="archived">Archivado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visibilidad</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="public">
                            Público (Clientes)
                          </SelectItem>
                          <SelectItem value="internal">
                            Interno (Solo Agentes)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/knowledge-base")}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" /> Guardar Artículo
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
