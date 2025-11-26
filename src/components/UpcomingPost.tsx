import { Instagram, Facebook, Twitter, Mail, Linkedin } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface UpcomingPostProps {
  channel: "Instagram" | "Facebook" | "Twitter" | "Email" | "LinkedIn";
  campaign: string;
  time: string;
}

const channelConfig: Record<string, { icon: LucideIcon; color: string }> = {
  Instagram: { icon: Instagram, color: "text-pink-500" },
  Facebook: { icon: Facebook, color: "text-blue-500" },
  Twitter: { icon: Twitter, color: "text-sky-500" },
  Email: { icon: Mail, color: "text-green-500" },
  LinkedIn: { icon: Linkedin, color: "text-blue-600" },
};

const UpcomingPost = ({ channel, campaign, time }: UpcomingPostProps) => {
  const { icon: Icon, color } = channelConfig[channel];

  return (
    <div className="flex items-center justify-between p-3 glass border border-border/40 rounded-lg hover:border-primary/40 transition-all cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-card border border-border/40 flex items-center justify-center">
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div>
          <p className="font-medium text-sm">{channel}</p>
          <p className="text-xs text-muted-foreground">{campaign}</p>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">{time}</div>
    </div>
  );
};

export default UpcomingPost;
