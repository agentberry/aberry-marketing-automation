import { LucideIcon } from "lucide-react";

interface AnalysisTypeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  credits: number;
  isSelected: boolean;
  onClick: () => void;
}

const AnalysisTypeCard = ({
  icon: Icon,
  title,
  description,
  credits,
  isSelected,
  onClick,
}: AnalysisTypeCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border cursor-pointer transition-all ${
        isSelected
          ? "border-primary bg-primary/10 shadow-[0_10px_30px_hsl(239_84%_67%_/_0.3)]"
          : "glass border-border/40 hover:border-primary/40"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
          {credits} 크레딧
        </div>
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default AnalysisTypeCard;
