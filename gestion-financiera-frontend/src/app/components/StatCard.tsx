import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'destructive' | 'warning';
}

export function StatCard({ title, value, icon: Icon, trend, variant = 'default' }: StatCardProps) {
  const variantStyles = {
    default: {
      bg: 'bg-card',
      iconBg: 'bg-muted',
      iconColor: 'text-muted-foreground',
      valueColor: 'text-foreground',
    },
    primary: {
      bg: 'bg-card',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      valueColor: 'text-primary',
    },
    destructive: {
      bg: 'bg-card',
      iconBg: 'bg-destructive/10',
      iconColor: 'text-destructive',
      valueColor: 'text-destructive',
    },
    warning: {
      bg: 'bg-card',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      valueColor: 'text-orange-600',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={`${styles.bg} p-5 rounded-xl border border-border hover:shadow-lg transition-shadow`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-muted-foreground">{title}</span>
        <div className={`w-10 h-10 ${styles.iconBg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${styles.iconColor}`} />
        </div>
      </div>
      
      <div className="flex items-baseline justify-between">
        <p className={`text-3xl ${styles.valueColor}`}>{value}</p>
        
        {trend && (
          <span className={`text-sm ${trend.isPositive ? 'text-primary' : 'text-destructive'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
