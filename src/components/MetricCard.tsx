import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  iconColor?: string;
}

const MetricCard = ({ title, value, change, icon: Icon, iconColor = "text-primary" }: MetricCardProps) => {
  return (
    <div className="glass border-border/40 hover:border-primary/40 transition-all duration-300 hover:shadow-[0_20px_40px_hsl(239_84%_67%_/_0.15)] hover:-translate-y-1 rounded-lg animate-scale-in">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <div className="px-6 pb-6">
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{change}</p>
      </div>
    </div>
  );
};

export default MetricCard;
