import { LucideIcon } from "lucide-react";

interface QuickActionProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
  gradient: string;
}

const QuickAction = ({ icon: Icon, iconColor, title, description, gradient }: QuickActionProps) => {
  return (
    <div className={`p-6 rounded-xl border ${gradient} hover:opacity-90 transition-all cursor-pointer animate-scale-in`}>
      <div className="flex items-center gap-3 mb-3">
        <Icon className={`w-8 h-8 ${iconColor}`} />
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

export default QuickAction;
