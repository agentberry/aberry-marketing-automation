import { Instagram, Facebook, Twitter, Mail, FileText, Megaphone, Linkedin, Video, MessageSquare } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Channel {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
}

interface ChannelSelectorProps {
  selectedChannels: string[];
  onSelectChannel: (channels: string[]) => void;
}

const channels: Channel[] = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-500" },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-500" },
  { id: "twitter", name: "Twitter", icon: Twitter, color: "text-sky-500" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "text-blue-600" },
  { id: "tiktok", name: "TikTok", icon: Video, color: "text-purple-500" },
  { id: "email", name: "Email", icon: Mail, color: "text-green-500" },
  { id: "blog", name: "Blog", icon: FileText, color: "text-orange-500" },
  { id: "google-ads", name: "Google Ads", icon: Megaphone, color: "text-red-500" },
  { id: "naver-ads", name: "Naver Ads", icon: MessageSquare, color: "text-green-600" },
];

const ChannelSelector = ({ selectedChannels, onSelectChannel }: ChannelSelectorProps) => {
  const toggleChannel = (channelId: string) => {
    if (selectedChannels.includes(channelId)) {
      onSelectChannel(selectedChannels.filter((id) => id !== channelId));
    } else {
      onSelectChannel([...selectedChannels, channelId]);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {channels.map((channel) => {
        const isSelected = selectedChannels.includes(channel.id);
        return (
          <div
            key={channel.id}
            onClick={() => toggleChannel(channel.id)}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              isSelected
                ? "border-primary bg-primary/10 shadow-[0_10px_30px_hsl(239_84%_67%_/_0.3)]"
                : "glass border-border/40 hover:border-primary/40"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-card border border-border/40 flex items-center justify-center">
                <channel.icon className={`w-4 h-4 ${channel.color}`} />
              </div>
              <span className="text-sm font-medium">{channel.name}</span>
              {isSelected && (
                <div className="ml-auto w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChannelSelector;
