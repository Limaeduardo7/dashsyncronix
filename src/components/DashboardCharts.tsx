import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { Card } from './ui/Card';
import { formatCurrency } from '@/src/utils/format';

const tooltipStyle = {
  contentStyle: { backgroundColor: '#111631', border: '1px solid #2e3560', borderRadius: '10px', fontSize: '12px' },
  itemStyle: { color: '#e8eaf6' },
  labelStyle: { color: '#9ca3c4', fontWeight: 600, marginBottom: 4 },
};

const axisProps = { stroke: '#9ca3c4', fontSize: 10, tickLine: false, axisLine: false };

// Daily Revenue Area Chart
export function DailyRevenueChart({ metrics }: { metrics: any[] }) {
  const data = metrics.map((m) => ({
    date: m.date?.slice(5, 10),
    hotmart: m.faturamentoHotmart,
  }));

  return (
    <Card variant="gradient" className="h-[360px]">
      <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">
        Faturamento Diário
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradHotmart" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e3560" vertical={false} />
          <XAxis dataKey="date" {...axisProps} />
          <YAxis {...axisProps} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip {...tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
          <Area type="monotone" dataKey="hotmart" name="Hotmart" stroke="#818cf8" strokeWidth={2} fill="url(#gradHotmart)" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Waterfall Chart
export function WaterfallChart({ summary }: { summary: any }) {
  const data = [
    { name: 'Faturamento', value: summary.faturamentoTotal, fill: '#818cf8' },
    { name: 'Investimento', value: -summary.investimentoTotal, fill: '#f87171' },
    { name: 'Impostos', value: -summary.impostoFaturamento, fill: '#fb7185' },
    { name: 'Custos', value: -summary.custoFixoProporcional, fill: '#fbbf24' },
    { name: 'Reserva', value: -summary.reserva, fill: '#9ca3c4' },
    { name: 'Lucro Final', value: summary.lucroFinal, fill: '#34d399' },
  ];

  return (
    <Card variant="gradient" className="h-[340px]">
      <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">
        Fluxo de Receita → Lucro
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e3560" vertical={false} />
          <XAxis dataKey="name" {...axisProps} />
          <YAxis {...axisProps} tickFormatter={(v) => `${(Math.abs(v) / 1000).toFixed(0)}k`} />
          <Tooltip {...tooltipStyle} formatter={(v: number) => formatCurrency(Math.abs(v))} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Partner Pie (Donut)
export function PartnerPieChart({ division }: { division: any[] }) {
  const COLORS = ['#818cf8', '#34d399', '#f87171', '#38bdf8', '#fbbf24', '#a78bfa'];
  const data = division.map((p) => ({ name: p.nome, value: p.valor, pct: p.percentual }));

  const renderLabel = ({ name, pct }: any) => `${name} (${pct}%)`;

  return (
    <Card variant="gradient" className="h-[340px]">
      <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">
        Divisão entre Sócios
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            label={renderLabel}
            labelLine={{ stroke: '#9ca3c4', strokeWidth: 1 }}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip {...tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ROAS Gauge (SVG)
export function ROASGauge({ roas }: { roas: number }) {
  const clampedRoas = Math.min(Math.max(roas, 0), 5);
  const angle = (clampedRoas / 5) * 180;
  const color = roas < 1 ? '#f87171' : roas < 2 ? '#fbbf24' : '#34d399';

  const describeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
    const rad = (a: number) => ((a - 180) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(rad(startAngle));
    const y1 = cy + r * Math.sin(rad(startAngle));
    const x2 = cx + r * Math.cos(rad(endAngle));
    const y2 = cy + r * Math.sin(rad(endAngle));
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  return (
    <Card variant="highlight" className="flex flex-col items-center justify-center h-[340px]">
      <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-2">ROAS</h3>
      <svg viewBox="0 0 200 120" className="w-48 h-28">
        <path d={describeArc(100, 100, 70, 0, 180)} fill="none" stroke="#2e3560" strokeWidth="12" strokeLinecap="round" />
        <path d={describeArc(100, 100, 70, 0, angle)} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}66)` }} />
        <text x="100" y="95" textAnchor="middle" fill={color} fontSize="28" fontWeight="800" fontFamily="Inter">{roas.toFixed(2)}</text>
        <text x="100" y="112" textAnchor="middle" fill="#9ca3c4" fontSize="9">
          {roas < 1 ? 'PREJUÍZO' : roas < 2 ? 'MODERADO' : 'EXCELENTE'}
        </text>
      </svg>
      <div className="flex gap-4 text-[10px] text-on-surface-variant mt-2">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tertiary inline-block" /> &lt;1</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-amber inline-block" /> 1-2</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary inline-block" /> &gt;2</span>
      </div>
    </Card>
  );
}

// Cumulative Revenue Chart
export function CumulativeChart({ metrics }: { metrics: any[] }) {
  let cumulative = 0;
  const data = metrics.map((m) => {
    cumulative += m.faturamentoHotmart;
    return { date: m.date?.slice(5, 10), cumulative };
  });

  return (
    <Card variant="gradient" className="h-[340px]">
      <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">
        Faturamento Acumulado
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e3560" vertical={false} />
          <XAxis dataKey="date" {...axisProps} />
          <YAxis {...axisProps} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip {...tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
          <Line type="monotone" dataKey="cumulative" name="Acumulado" stroke="#38bdf8" strokeWidth={2.5} dot={false}
            style={{ filter: 'drop-shadow(0 0 4px #38bdf866)' }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Legacy export for backward compatibility
export function DashboardCharts({ summary, division }: { summary: any; division: any[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <WaterfallChart summary={summary} />
      <PartnerPieChart division={division} />
    </div>
  );
}
