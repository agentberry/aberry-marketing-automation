import { Calendar, DollarSign, TrendingUp, MoreVertical, Play, Pause, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Campaign {
  id: string;
  name: string;
  description: string;
  channels: string[];
  budget: number;
  status: "활성" | "일시정지" | "완료" | "초안";
  startDate: Date;
  endDate: Date;
  contentIds: string[];
}

interface CampaignCardProps {
  campaign: Campaign;
  onStatusChange: (id: string, status: Campaign["status"]) => void;
  onDelete: (id: string) => void;
}

const statusColors = {
  활성: "bg-green-500/10 text-green-500 border-green-500/20",
  일시정지: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  완료: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  초안: "bg-primary/10 text-primary border-primary/20",
};

const CampaignCard = ({ campaign, onStatusChange, onDelete }: CampaignCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    // 드롭다운 메뉴나 버튼 클릭 시 카드 클릭 이벤트 무시
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/campaigns/${campaign.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="glass border-border/40 hover:border-primary/40 rounded-xl p-6 transition-all animate-scale-in cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1">{campaign.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[campaign.status]}`}>
            {campaign.status}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border-border/40">
              {campaign.status === "활성" ? (
                <DropdownMenuItem onClick={() => onStatusChange(campaign.id, "일시정지")}>
                  <Pause className="w-4 h-4 mr-2" />
                  일시정지
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => onStatusChange(campaign.id, "활성")}>
                  <Play className="w-4 h-4 mr-2" />
                  활성화
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onStatusChange(campaign.id, "완료")}>
                <Calendar className="w-4 h-4 mr-2" />
                완료 처리
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(campaign.id)} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="glass border border-border/40 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">채널</span>
          </div>
          <p className="text-lg font-bold">{campaign.channels.length}개</p>
        </div>
        <div className="glass border border-border/40 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-secondary" />
            <span className="text-xs text-muted-foreground">예산</span>
          </div>
          <p className="text-lg font-bold">
            {campaign.budget > 0 ? `₩${(campaign.budget / 10000).toFixed(0)}만` : "미설정"}
          </p>
        </div>
        <div className="glass border border-border/40 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-xs text-muted-foreground">ROI</span>
          </div>
          <p className="text-lg font-bold">
            {Math.floor(Math.random() * 100) + 100}%
          </p>
        </div>
      </div>

      {/* Channels */}
      <div className="flex flex-wrap gap-2">
        {campaign.channels.slice(0, 5).map((channel) => (
          <div
            key={channel}
            className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20"
          >
            {channel}
          </div>
        ))}
        {campaign.channels.length > 5 && (
          <div className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
            +{campaign.channels.length - 5}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignCard;
