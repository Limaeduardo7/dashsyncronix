import { cn } from '@/src/lib/utils';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('bg-surface-container-low p-5 rounded-xl border border-outline-variant/5 group hover:bg-surface-container-high transition-all relative overflow-hidden', className)}>
      {children}
    </div>
  );
}
