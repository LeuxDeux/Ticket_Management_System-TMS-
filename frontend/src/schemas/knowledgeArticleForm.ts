import { z } from "zod";

const knowledgeArticleFormSchema = z
  .object({
    title: z
      .string()
      .min(1, "El título es requerido")
      .min(5, "El título debe tener al menos 5 caracteres"),
    content: z
      .string()
      .min(1, "El contenido es requerido")
      .min(20, "El contenido debe tener al menos 20 caracteres"),
    excerpt: z
      .string()
      .min(1, "El extracto es requerido")
      .max(300, "El extracto no debe exceder 300 caracteres"),
    category: z.string().min(1, "Selecciona una categoría"),
    status: z.enum(["draft", "published", "archived"], {
      message: "Selecciona un estado válido",
    }),
    visibility: z.enum(["public", "internal"], {
      message: "Selecciona una visibilidad válida",
    }),
    // Tags y keywords como strings que se transformarán a arrays
    tagsInput: z.string().optional(),
    keywordsInput: z.string().optional(),
    version: z.string().default("1.0"),
  })
  .transform((data) => {
    // Transformamos los strings de tags y keywords a arrays
    const tags = data.tagsInput
      ? data.tagsInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const keywords = data.keywordsInput
      ? data.keywordsInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    return {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      category: data.category,
      status: data.status,
      visibility: data.visibility,
      tags,
      keywords,
      version: data.version,
    };
  });

export { knowledgeArticleFormSchema };
