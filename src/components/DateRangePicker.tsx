import { useState } from 'react';
import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { Calendar, ChevronDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}

type Preset = '7d' | '30d' | 'mtd' | 'last_month' | 'custom';

export function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
  const [activePreset, setActivePreset] = useState<Preset>('mtd');
  const [showCustom, setShowCustom] = useState(false);

  const applyPreset = (preset: Preset) => {
    setActivePreset(preset);
    setShowCustom(false);
    const today = new Date();
    let start: Date, end: Date;

    switch (preset) {
      case '7d':
        start = subDays(today, 6);
        end = today;
        break;
      case '30d':
        start = subDays(today, 29);
        end = today;
        break;
      case 'mtd':
        start = startOfMonth(today);
        end = today;
        break;
      case 'last_month':
        start = startOfMonth(subMonths(today, 1));
        end = endOfMonth(subMonths(today, 1));
        break;
      default:
        setShowCustom(true);
        return;
    }

    onChange(format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd'));
  };

  const presets: { key: Preset; label: string }[] = [
    { key: '7d', label: '7 dias' },
    { key: '30d', label: '30 dias' },
    { key: 'mtd', label: 'Mês atual' },
    { key: 'last_month', label: 'Mês anterior' },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Calendar className="w-4 h-4 text-on-surface-variant hidden sm:block" />
      <div className="flex gap-1 bg-surface-container-high rounded-lg p-1">
        {presets.map((p) => (
          <button
            key={p.key}
            onClick={() => applyPreset(p.key)}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-semibold transition-all',
              activePreset === p.key
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
            )}
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={() => { setActivePreset('custom'); setShowCustom(!showCustom); }}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1',
            activePreset === 'custom'
              ? 'bg-primary-container text-on-primary-container shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
          )}
        >
          Custom
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {showCustom && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onChange(e.target.value, endDate)}
            className="bg-surface-container-high border border-outline-variant/20 text-on-surface text-xs px-3 py-1.5 rounded-lg focus:ring-1 focus:ring-primary"
          />
          <span className="text-on-surface-variant text-xs">→</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onChange(startDate, e.target.value)}
            className="bg-surface-container-high border border-outline-variant/20 text-on-surface text-xs px-3 py-1.5 rounded-lg focus:ring-1 focus:ring-primary"
          />
        </div>
      )}
    </div>
  );
}
