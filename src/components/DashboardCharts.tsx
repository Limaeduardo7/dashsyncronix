import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card } from './ui/Card';

interface DashboardChartsProps {
  summary: any;
  division: any[];
}

export function DashboardCharts({ summary, division }: DashboardChartsProps) {
  const COLORS = ['#b4c5ff', '#4edea3', '#ffb2b7', '#2563eb', '#ffdadb'];

  const dataPie = division.map((p) => ({
    name: p.nome,
    value: p.valor,
  }));

  const dataBar = [
    { name: 'Faturamento', value: summary.faturamentoTotal, color: '#4edea3' },
    { name: 'Investimento', value: summary.investimentoTotal, color: '#ffb2b7' },
    { name: 'Lucro', value: summary.lucroFinal, color: '#b4c5ff' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="h-80">
        <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-6">Faturamento vs Custo vs Lucro</h3>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={dataBar}>
            <CartesianGrid strokeDasharray="3 3" stroke="#434655" vertical={false} />
            <XAxis dataKey="name" stroke="#c3c6d7" fontSize={10} />
            <YAxis stroke="#c3c6d7" fontSize={10} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f1f1f', border: 'none', borderRadius: '8px' }}
              itemStyle={{ color: '#e2e2e2' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {dataBar.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="h-80">
        <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-6">Divisão entre Sócios</h3>
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie
              data={dataPie}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {dataPie.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#1f1f1f', border: 'none', borderRadius: '8px' }}
              itemStyle={{ color: '#e2e2e2' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
