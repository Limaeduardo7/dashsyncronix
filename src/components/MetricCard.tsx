import { formatCurrency } from '@/src/utils/format';
import { Card } from './ui/Card';
import { Info } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface MetricCardProps {
  label: string;
  value: number;
  variation?: number;
  variationLabel?: string;
  tooltip?: string;
  color?: 'primary' | 'secondary' | 'tertiary' | 'alert';
  isCurrency?: boolean;
}

export function MetricCard({ label, value, variation, variationLabel, tooltip, color = 'primary', isCurrency = true }: MetricCardProps) {
  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    tertiary: 'text-tertiary',
    alert: 'text-yellow-500',
  };

  return (
    <Card>
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{label}</span>
        {tooltip && (
          <div className="group relative">
            <Info className={cn('w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity', colorClasses[color])} />
            <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-surface-container-highest text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <h2 className="text-2xl font-black tabular-nums tracking-tighter text-on-surface">
        {isCurrency ? formatCurrency(value) : value.toFixed(2)}
      </h2>
      {(variation !== undefined || variationLabel) && (
        <div className="mt-2 flex items-center gap-1.5">
          {variation !== undefined && (
            <span className={cn('text-xs font-bold', variation >= 0 ? 'text-secondary' : 'text-tertiary')}>
              {variation >= 0 ? '+' : ''}{variation.toFixed(1)}%
            </span>
          )}
          {variationLabel && <span className="text-[10px] text-on-surface-variant">{variationLabel}</span>}
        </div>
      )}
    </Card>
  );
}
