import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { Download, Calendar } from 'lucide-react';

// Datos MOCK para los reportes, en producción vendrían de la API
const ticketVolumeData = [
  { name: 'Lun', tickets: 12 },
  { name: 'Mar', tickets: 19 },
  { name: 'Mie', tickets: 15 },
  { name: 'Jue', tickets: 22 },
  { name: 'Vie', tickets: 28 },
  { name: 'Sab', tickets: 8 },
  { name: 'Dom', tickets: 5 },
];

// Datos MOCK para los tickets por estado, en producción vendrían de la API
const ticketStatusData = [
  { name: 'Abiertos', value: 45, color: '#3b82f6' },
  { name: 'En Proceso', value: 30, color: '#a855f7' },
  { name: 'Resueltos', value: 85, color: '#22c55e' },
  { name: 'Cerrados', value: 20, color: '#64748b' },
];

// Datos MOCK para CSAT y categorías, en producción vendrían de la API
const csatData = [
    { name: 'Sem 1', rating: 4.2 },
    { name: 'Sem 2', rating: 4.5 },
    { name: 'Sem 3', rating: 4.3 },
    { name: 'Sem 4', rating: 4.8 },
];


// Datos MOCK para categorías frecuentes, en producción vendrían de la API
const categoryData = [
  { name: 'Técnico', value: 40, color: '#f59e0b' },
  { name: 'Facturación', value: 25, color: '#ef4444' },
  { name: 'Ventas', value: 20, color: '#3b82f6' },
  { name: 'Otros', value: 15, color: '#10b981' },
];

export function AdminReports() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
            <Select defaultValue="week">
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Periodo" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="day">Hoy</SelectItem>
                    <SelectItem value="week">Esta Semana</SelectItem>
                    <SelectItem value="month">Este Mes</SelectItem>
                    <SelectItem value="year">Este Año</SelectItem>
                </SelectContent>
            </Select>
            <Button variant="outline"><Calendar className="mr-2 h-4 w-4" /> Personalizado</Button>
        </div>
        <div className="flex gap-2">
            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Exportar PDF</Button>
            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Exportar CSV</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Volumen de Tickets</CardTitle>
            <CardDescription>Entrada de tickets por día</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={ticketVolumeData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} />
                 <YAxis axisLine={false} tickLine={false} />
                 <Tooltip cursor={{ fill: '#f1f5f9' }} />
                 <Bar dataKey="tickets" fill="#0f172a" radius={[4, 4, 0, 0]} barSize={40} />
               </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
           <CardHeader>
             <CardTitle>Estado de Tickets</CardTitle>
             <CardDescription>Distribución actual</CardDescription>
           </CardHeader>
           <CardContent className="h-[350px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ticketStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {ticketStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
           </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Satisfacción del Cliente (CSAT)</CardTitle>
                <CardDescription>Evolución semanal del rating promedio</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={csatData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 5]} axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="rating" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>

        <Card>
           <CardHeader>
             <CardTitle>Categorías Frecuentes</CardTitle>
             <CardDescription>Tipos de incidentes más reportados</CardDescription>
           </CardHeader>
           <CardContent className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
