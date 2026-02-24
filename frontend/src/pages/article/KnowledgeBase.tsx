import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
//import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ARTICLES } from '../../mock/data';
import { Search, Plus, BookOpen, Eye, ThumbsUp,  } from 'lucide-react';
//import type { KnowledgeArticle } from '../types/article';
import type { ArticleStatus } from '../../types/enums';

export function KnowledgeBase() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Extraemos las categorías únicas de los artículos para el filtro de categorías
  // Las guardamos en un Array para luego mapearlas en el Select de categorías. 
  // Esto hace que el filtro de categorías sea dinámico y se adapte a las categorías presentes en los artículos.
  // Esto viene del mock pero después hay que traerlo desde la API (getAllCategories o similar)
  const categories = Array.from(new Set(ARTICLES.map(a => a.category)));

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter(article => {
      const matchesSearch = 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase())) ||
        article.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchTerm, statusFilter, categoryFilter]);

  // Calculamos métricas clave para mostrar en el resumen de la base de conocimiento.
  // Estas métricas se muestran en tarjetas al inicio de la página y proporcionan 
  // una visión general rápida del estado de la base de conocimiento.
  // En una aplicación real, estas métricas probablemente vendrían de una API 
  // que las calcularía en el backend, pero aquí las calculamos directamente a partir de los datos mockeados.
  // Si no vamos a usar estas métricas, se pueden eliminar sin problemas. 
  // Las dejé para mostrar cómo se haría un resumen de KPIs en la base de conocimiento.
  const totalViews = ARTICLES.reduce((acc, curr) => acc + curr.views, 0);
  const totalLikes = ARTICLES.reduce((acc, curr) => acc + curr.likes, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-slate-900">Base de Conocimiento</h1>
           <p className="text-slate-500">Gestiona artículos, soluciones y documentación interna.</p>
        </div>
        <Link to="/knowledge-base/new">
           <Button><Plus className="mr-2 h-4 w-4" /> Nuevo Artículo</Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artículos Totales</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ARTICLES.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitas</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilidad (Likes)</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLikes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative w-full md:w-96">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Buscar por título, tags o palabras clave..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        <Select value={statusFilter} onValueChange={(v: ArticleStatus) => setStatusFilter(v)}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="published">Publicados</SelectItem>
                <SelectItem value="draft">Borradores</SelectItem>
                <SelectItem value="archived">Archivados</SelectItem>
            </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>

      {/* Articles Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.length > 0 ? (
            filteredArticles.map(article => (
                <Card key={article.id} className="flex flex-col hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/knowledge-base/${article.id}`)}>
                    <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                             <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                                 {article.status === 'published' ? 'Publicado' : article.status === 'draft' ? 'Borrador' : 'Archivado'}
                             </Badge>
                             {article.visibility === 'internal' && <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">Interno</Badge>}
                        </div>
                        <CardTitle className="line-clamp-2 text-lg">{article.title}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-2">{article.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto pt-0">
                        <div className="flex flex-wrap gap-1 mb-4">
                            {article.tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs font-normal bg-slate-100 text-slate-600">#{tag}</Badge>
                            ))}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                            <span className="flex items-center"><Eye className="h-3 w-3 mr-1" /> {article.views}</span>
                            <span className="flex items-center"><ThumbsUp className="h-3 w-3 mr-1" /> {article.likes}</span>
                            <span>v{article.version}</span>
                        </div>
                    </CardContent>
                </Card>
            ))
        ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground bg-white rounded-lg border border-dashed">
                No se encontraron artículos con los filtros actuales.
            </div>
        )}
      </div>
    </div>
  );
}
