import { cn } from '@/src/lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  variant?: 'default' | 'highlight' | 'gradient';
}

export function Card({ className, children, variant = 'default' }: CardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-outline-variant/10 p-5 transition-all duration-300',
        variant === 'default' && 'bg-surface-container-low hover:border-outline-variant/25',
        variant === 'highlight' && 'bg-surface-container-low glow-primary hover:border-primary/30',
        variant === 'gradient' && 'bg-gradient-to-br from-surface-container-low to-surface-container gradient-border hover:border-primary/20',
        className
      )}
    >
      {children}
    </div>
  );
}
