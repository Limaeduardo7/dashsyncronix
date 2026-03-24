import { formatCurrency } from '@/src/utils/format';
import { Card } from './ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
  label: string;
  value: number;
  variation?: number;
  tooltip?: string;
  color?: 'primary' | 'secondary' | 'tertiary' | 'alert' | 'blue';
  isCurrency?: boolean;
  large?: boolean;
  sparklineData?: number[];
  icon?: React.ReactNode;
}

const colorConfig = {
  primary: { text: 'text-primary', gradient: 'from-primary/10 to-transparent', stroke: '#818cf8', glow: 'glow-primary' },
  secondary: { text: 'text-secondary', gradient: 'from-secondary/10 to-transparent', stroke: '#34d399', glow: 'glow-green' },
  tertiary: { text: 'text-tertiary', gradient: 'from-tertiary/10 to-transparent', stroke: '#f87171', glow: 'glow-red' },
  alert: { text: 'text-accent-amber', gradient: 'from-accent-amber/10 to-transparent', stroke: '#fbbf24', glow: '' },
  blue: { text: 'text-accent-blue', gradient: 'from-accent-blue/10 to-transparent', stroke: '#38bdf8', glow: '' },
};

export function MetricCard({ label, value, variation, color = 'primary', isCurrency = true, large = false, sparklineData, icon }: MetricCardProps) {
  const cfg = colorConfig[color];
  const sparkData = sparklineData?.map((v, i) => ({ v, i }));

  return (
    <Card variant={large ? 'gradient' : 'default'} className={cn(large && cfg.glow)}>
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50 pointer-events-none rounded-xl', cfg.gradient)} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{label}</span>
          {icon && <span className={cn('opacity-60', cfg.text)}>{icon}</span>}
        </div>
        <h2 className={cn(
          'font-black tabular-nums tracking-tight text-on-surface',
          large ? 'text-3xl' : 'text-xl'
        )}>
          {isCurrency ? formatCurrency(value) : typeof value === 'number' ? value.toFixed(2) : value}
        </h2>
        {variation !== undefined && (
          <div className="mt-2 flex items-center gap-1.5">
            {variation >= 0 ? (
              <TrendingUp className="w-3.5 h-3.5 text-secondary" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-tertiary" />
            )}
            <span className={cn('text-xs font-bold', variation >= 0 ? 'text-secondary' : 'text-tertiary')}>
              {variation >= 0 ? '+' : ''}{variation.toFixed(1)}%
            </span>
          </div>
        )}
        {sparkData && sparkData.length > 1 && (
          <div className="mt-3 h-10 -mx-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData}>
                <defs>
                  <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={cfg.stroke} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={cfg.stroke} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke={cfg.stroke} strokeWidth={1.5} fill={`url(#spark-${color})`} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
}
