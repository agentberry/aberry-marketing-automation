import { Calendar, Play, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ScheduledPost {
  channel: string;
  campaign: string;
  time: string;
}

interface ActiveCampaign {
  name: string;
  channels: number;
  logo: string;
}

const scheduledPosts: ScheduledPost[] = [
  { channel: "Instagram", campaign: "여름 세일", time: "오늘 14:00" },
  { channel: "Facebook", campaign: "신제품 소개", time: "오늘 16:00" },
  { channel: "Twitter", campaign: "이벤트 공지", time: "내일 10:00" },
];

const activeCampaigns: ActiveCampaign[] = [
  { name: "여름 세일 캠페인", channels: 3, logo: "S" },
  { name: "신제품 론칭", channels: 5, logo: "N" },
];

const TodayTasks = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-scale-in">
      {/* 예약된 게시물 */}
      <div className="glass border-border/40 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">예약된 게시물</h3>
            <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full">
              {scheduledPosts.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => navigate("/content")}
          >
            전체 보기
          </Button>
        </div>
        <div className="space-y-3">
          {scheduledPosts.map((post, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/10 hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-xs font-medium">{post.channel[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">{post.channel}</p>
                  <p className="text-xs text-muted-foreground">{post.campaign}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{post.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 진행 중인 캠페인 */}
      <div className="glass border-border/40 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-secondary" />
            <h3 className="text-lg font-semibold">진행 중인 캠페인</h3>
            <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full">
              {activeCampaigns.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => navigate("/campaigns")}
          >
            전체 보기
          </Button>
        </div>
        <div className="space-y-3">
          {activeCampaigns.map((campaign, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/10 hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => navigate("/campaigns")}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                  {campaign.logo}
                </div>
                <div>
                  <p className="text-sm font-medium">{campaign.name}</p>
                  <p className="text-xs text-muted-foreground">{campaign.channels}개 채널 운영 중</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  진행 중
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodayTasks;
