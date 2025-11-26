import { LucideIcon } from "lucide-react";

interface InsightCardProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
  bgColor: string;
}

const InsightCard = ({ icon: Icon, iconColor, title, description, bgColor }: InsightCardProps) => {
  return (
    <div className={`p-6 rounded-xl ${bgColor} border border-border/20 animate-fade-in`}>
      <div className="flex items-center gap-3 mb-3">
        <Icon className={`w-8 h-8 ${iconColor}`} />
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

export default InsightCard;
