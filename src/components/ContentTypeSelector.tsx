import { Instagram, Facebook, Twitter, Mail, FileText, Megaphone, Linkedin, Video } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ContentType {
  id: string;
  name: string;
  icon: LucideIcon;
  credits: number;
  color: string;
}

interface ContentTypeSelectorProps {
  selectedType: string;
  onSelectType: (type: string) => void;
}

const contentTypes: ContentType[] = [
  { id: "instagram", name: "Instagram 포스트", icon: Instagram, credits: 3, color: "text-pink-500" },
  { id: "facebook", name: "Facebook 포스트", icon: Facebook, credits: 3, color: "text-blue-500" },
  { id: "twitter", name: "Twitter 포스트", icon: Twitter, credits: 3, color: "text-sky-500" },
  { id: "linkedin", name: "LinkedIn 포스트", icon: Linkedin, credits: 3, color: "text-blue-600" },
  { id: "email", name: "이메일 캠페인", icon: Mail, credits: 5, color: "text-green-500" },
  { id: "blog", name: "블로그 포스트", icon: FileText, credits: 10, color: "text-purple-500" },
  { id: "google-ads", name: "Google 광고", icon: Megaphone, credits: 7, color: "text-red-500" },
  { id: "naver-ads", name: "Naver 광고", icon: Megaphone, credits: 7, color: "text-green-600" },
  { id: "video", name: "비디오 스크립트", icon: Video, credits: 8, color: "text-orange-500" },
];

const ContentTypeSelector = ({ selectedType, onSelectType }: ContentTypeSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contentTypes.map((type) => {
        const isSelected = selectedType === type.id;
        return (
          <div
            key={type.id}
            onClick={() => onSelectType(type.id)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              isSelected
                ? "border-primary bg-primary/10 shadow-[0_10px_30px_hsl(239_84%_67%_/_0.3)]"
                : "glass border-border/40 hover:border-primary/40"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-card border border-border/40 flex items-center justify-center">
                  <type.icon className={`w-5 h-5 ${type.color}`} />
                </div>
                <span className="font-medium">{type.name}</span>
              </div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground">{type.credits} 크레딧 소비</div>
          </div>
        );
      })}
    </div>
  );
};

export default ContentTypeSelector;
