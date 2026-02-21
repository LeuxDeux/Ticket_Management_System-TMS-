import { useState, useMemo } from 'react'; // Agregamos useMemo, borramos useEffect
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { ARTICLES } from '../mock/data';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { type KnowledgeArticle } from '../types/article';
import { type ArticleStatus, type ArticleVisibility } from '../types/enums';

// Tipo auxiliar para decir qué campos del artículo estamos editando en el formulario,
// excluyendo los que no se editan directamente (id, timestamps, authorId, etc).
type ArticleFormData = Omit<KnowledgeArticle, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'dislikes' | 'authorId' | 'relatedTicketIds'>;

export function KnowledgeArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Determinamos si estamos en modo edición o creación según la presencia del ID en la URL.
  const isEditMode = !!id;

  // Si estamos creando un artículo, no hay artículo existente, así que existingArticle será null.
  // Si estamos editando, buscamos el artículo correspondiente en la lista de artículos mockeados.
  // Usamos useMemo para evitar hacer esta búsqueda en cada renderizado, 
  // solo se hará cuando cambie el ID o el modo de edición.
  const existingArticle = useMemo(() => {
    if (!isEditMode) return null;
    return ARTICLES.find(a => a.id === id);
  }, [id, isEditMode]);

  // 2. CORRECCIÓN PRINCIPAL: Inicialización "Lazy" del estado.
  // Pasamos una FUNCIÓN al useState. Esto se ejecuta solo la primera vez.
  // Así evitamos el useEffect y el error de "setState in effect".

  //Cuando implementos Zod y React Hook Form, esta lógica de estado se simplifica mucho,
  // porque React Hook Form se encarga de manejar el estado del formulario y la validación,
  // y Zod se encarga de la validación de los datos.
  // El useState desaparece y es reemplazado por esto, que es muy clean 
  // Nota: DEFAULT_ARTICLE_FORM es un objeto con los valores por defecto 
  // para un nuevo artículo, que se define fuera del componente.
  /*const { register, handleSubmit, control } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema), 
    defaultValues: existingArticle ? mapArticleToForm(existingArticle) : DEFAULT_ARTICLE_FORM 
  });*/
  const [formData, setFormData] = useState<ArticleFormData>(() => {
    if (existingArticle) {
        // Mapeo explícito: Esto soluciona los errores de "Unused vars".
        // En lugar de desestructurar y excluir, seleccionamos lo que queremos.
        return {
            title: existingArticle.title,
            content: existingArticle.content,
            excerpt: existingArticle.excerpt,
            category: existingArticle.category,
            status: existingArticle.status,
            visibility: existingArticle.visibility,
            tags: existingArticle.tags,
            keywords: existingArticle.keywords,
            version: existingArticle.version
        };
    }
    // Valores por defecto si es modo creación
    return {
        title: '',
        content: '',
        excerpt: '',
        category: '',
        status: 'draft',
        visibility: 'public',
        tags: [],
        keywords: [],
        version: '1.0'
    };
  });

  // Inicializamos los inputs auxiliares de forma Lazy. Si existe el artículo busco sus tags, sino dejo vacío.
  const [tagsInput, setTagsInput] = useState(() => 
    existingArticle ? existingArticle.tags.join(', ') : ''
  );

  const [keywordsInput, setKeywordsInput] = useState(() => 
    existingArticle ? existingArticle.keywords.join(', ') : ''
  );

  // Función que se ejecuta al enviar el formulario, recibe los datos tipados y
  // luego se encarga de procesarlos (por ejemplo, enviarlos a una API).
  // Cuando integremos Zod y RHF se simplifica a:
  /*
    const { register, handleSubmit: rhfHandleSubmit } = useForm<ArticleFormData>(...);
  const onSubmit = (data: ArticleFormData) => {
   Si esta línea se ejecuta, es porque Zod ya garantizó que "data" es perfecta.
    console.log(data); 
    toast.success(isEditMode ? 'Artículo actualizado' : 'Artículo creado');
    navigate('/knowledge-base');
};
  Y eliminamos handleChange, tagsInput, keywordsInput, y el estado formData, porque RHF se encarga de todo eso.
  Zod transforma tagsInput y keywordInput de string a string[] automáticamente, 
  y RHF maneja el estado del formulario, así que no necesitamos handleChange ni el estado local para formData
*/
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success(isEditMode ? 'Artículo actualizado correctamente' : 'Artículo creado correctamente');
    navigate('/knowledge-base');
  };

  const handleChange = (field: keyof ArticleFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
        <h1 className="text-2xl font-bold">{isEditMode ? 'Editar Artículo' : 'Nuevo Artículo'}</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input 
                id="title" 
                value={formData.title} 
                onChange={e => handleChange('title', e.target.value)} 
                placeholder="Ej: Cómo reiniciar el servidor..."
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select value={formData.category} onValueChange={v => handleChange('category', v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Acceso">Acceso</SelectItem>
                            <SelectItem value="Pagos">Pagos</SelectItem>
                            <SelectItem value="Facturación">Facturación</SelectItem>
                            <SelectItem value="Técnico">Técnico</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="version">Versión</Label>
                    <Input 
                        id="version" 
                        value={formData.version} 
                        onChange={e => handleChange('version', e.target.value)} 
                    />
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Extracto (Resumen corto)</Label>
              <Textarea 
                id="excerpt" 
                value={formData.excerpt} 
                onChange={e => handleChange('excerpt', e.target.value)} 
                placeholder="Breve descripción que aparecerá en los resultados de búsqueda..."
                className="h-20 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenido del Artículo</Label>
              <Textarea 
                id="content" 
                value={formData.content} 
                onChange={e => handleChange('content', e.target.value)} 
                className="min-h-[300px] font-mono text-sm"
                placeholder="Escribe aquí el contenido detallado..."
              />
              <p className="text-xs text-muted-foreground">Soporta Markdown básico (simulado).</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="tags">Tags (separados por coma)</Label>
                    <Input 
                        id="tags" 
                        value={tagsInput} 
                        onChange={e => {
                            setTagsInput(e.target.value);
                            const tagsArray = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                            handleChange('tags', tagsArray);
                        }} 
                        placeholder="login, error, tutorial"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="keywords">Palabras Clave (SEO interno)</Label>
                    <Input 
                        id="keywords" 
                        value={keywordsInput} 
                        onChange={e => {
                            setKeywordsInput(e.target.value);
                            const keywordsArray = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                            handleChange('keywords', keywordsArray);
                        }} 
                        placeholder="restablecer, password, cuenta"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select value={formData.status} onValueChange={v => handleChange('status', v as ArticleStatus)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Borrador</SelectItem>
                            <SelectItem value="published">Publicado</SelectItem>
                            <SelectItem value="archived">Archivado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="visibility">Visibilidad</Label>
                    <Select value={formData.visibility} onValueChange={v => handleChange('visibility', v as ArticleVisibility)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="public">Público (Clientes)</SelectItem>
                            <SelectItem value="internal">Interno (Solo Agentes)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/knowledge-base')}>Cancelar</Button>
                <Button type="submit"><Save className="mr-2 h-4 w-4" /> Guardar Artículo</Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}