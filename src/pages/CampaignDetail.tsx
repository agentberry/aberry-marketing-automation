import { useState } from "react";
import { ArrowLeft, Calendar, DollarSign, TrendingUp, Users, Eye, MousePointerClick, Heart, MessageCircle, Play, Pause } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import TrendChart from "@/components/TrendChart";
import { useContent } from "@/contexts/ContentContext";

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

interface ContentPerformance {
  contentId: string;
  isActive: boolean;
  views: number;
  clicks: number;
  conversions: number;
  engagement: number;
  spend: number;
}

const statusColors = {
  활성: "bg-green-500/10 text-green-500 border-green-500/20",
  일시정지: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  완료: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  초안: "bg-primary/10 text-primary border-primary/20",
};

const CampaignDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { contents } = useContent();

  // Mock data
  const [campaign] = useState<Campaign>({
    id: id || "1",
    name: "여름 세일 캠페인",
    description: "6월 여름 시즌 특별 할인 프로모션을 위한 통합 마케팅 캠페인입니다. Instagram, Facebook, Twitter를 통해 타겟 고객에게 도달하고 브랜드 인지도를 높이는 것을 목표로 합니다.",
    channels: ["Instagram", "Facebook", "Twitter"],
    budget: 5000000,
    status: "활성",
    startDate: new Date("2024-06-01"),
    endDate: new Date("2024-06-30"),
    contentIds: ["1", "2"],
  });

  const [contentPerformances, setContentPerformances] = useState<ContentPerformance[]>([
    {
      contentId: "1",
      isActive: true,
      views: 120000,
      clicks: 6000,
      conversions: 300,
      engagement: 5.0,
      spend: 1500000,
    },
    {
      contentId: "2",
      isActive: true,
      views: 85000,
      clicks: 4200,
      conversions: 210,
      engagement: 4.9,
      spend: 1100000,
    },
  ]);

  const toggleContentActive = (contentId: string) => {
    setContentPerformances((prev) =>
      prev.map((perf) =>
        perf.contentId === contentId ? { ...perf, isActive: !perf.isActive } : perf
      )
    );
  };

  const performanceMetrics = [
    { title: "총 노출", value: "245,823", icon: Eye, color: "text-primary" },
    { title: "클릭", value: "12,456", icon: MousePointerClick, color: "text-secondary" },
    { title: "참여율", value: "5.07%", icon: Heart, color: "text-accent" },
    { title: "전환", value: "1,234", icon: Users, color: "text-purple-400" },
  ];

  const channelPerformance = [
    { channel: "Instagram", views: 120000, clicks: 6000, engagement: "5.0%" },
    { channel: "Facebook", views: 85000, clicks: 4200, engagement: "4.9%" },
    { channel: "Twitter", views: 40823, clicks: 2256, engagement: "5.5%" },
  ];

  const budgetUsed = 3200000;
  const budgetProgress = (budgetUsed / campaign.budget) * 100;

  const daysTotal = Math.ceil((campaign.endDate.getTime() - campaign.startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.ceil((new Date().getTime() - campaign.startDate.getTime()) / (1000 * 60 * 60 * 24));
  const timeProgress = (daysElapsed / daysTotal) * 100;

  const trendData = [
    { date: "6/1", views: 5200, clicks: 280, conversions: 28 },
    { date: "6/5", views: 7800, clicks: 420, conversions: 42 },
    { date: "6/10", views: 9500, clicks: 510, conversions: 51 },
    { date: "6/15", views: 12000, clicks: 630, conversions: 63 },
    { date: "6/20", views: 15600, clicks: 820, conversions: 82 },
    { date: "6/25", views: 18200, clicks: 950, conversions: 95 },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div
        className="fixed bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float pointer-events-none"
        style={{ animationDelay: "1s" }}
      />

      <Navigation />

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate("/campaigns")}
              className="glass border-border/40 hover:border-primary/40 rounded-lg p-2 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{campaign.name}</h1>
              <p className="text-muted-foreground">{campaign.description}</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium border ${statusColors[campaign.status]}`}>
              {campaign.status}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-scale-in" style={{ animationDelay: "0.1s" }}>
          {performanceMetrics.map((metric, index) => (
            <Card key={index} className="glass border-border/40 p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{metric.title}</span>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <p className="text-3xl font-bold">{metric.value}</p>
            </Card>
          ))}
        </div>

        {/* Budget & Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="glass border-border/40 p-6 animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">예산 사용</h3>
                <p className="text-sm text-muted-foreground">
                  ₩{(budgetUsed / 10000).toFixed(0)}만 / ₩{(campaign.budget / 10000).toFixed(0)}만
                </p>
              </div>
            </div>
            <Progress value={budgetProgress} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">{budgetProgress.toFixed(1)}% 사용됨</p>
          </Card>

          <Card className="glass border-border/40 p-6 animate-scale-in" style={{ animationDelay: "0.25s" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">캠페인 진행</h3>
                <p className="text-sm text-muted-foreground">
                  {daysElapsed}일 / {daysTotal}일 경과
                </p>
              </div>
            </div>
            <Progress value={timeProgress} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {campaign.startDate.toLocaleDateString()} - {campaign.endDate.toLocaleDateString()}
            </p>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className="glass border-border/40 p-6 mb-8 animate-scale-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">성과 추이</h3>
              <p className="text-sm text-muted-foreground">지난 30일간의 캠페인 성과</p>
            </div>
          </div>
          <TrendChart data={trendData} />
        </Card>

        {/* Content Performance Comparison */}
        <Card className="glass border-border/40 p-6 mb-8 animate-scale-in" style={{ animationDelay: "0.35s" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">콘텐츠별 성과 비교</h3>
              <p className="text-sm text-muted-foreground">A/B 테스트 결과 및 개별 콘텐츠 관리</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {contentPerformances.map((perf) => {
              const content = contents.find((c) => c.id === perf.contentId);
              if (!content) return null;

              const roi = ((perf.conversions * 50000 - perf.spend) / perf.spend) * 100;

              return (
                <div
                  key={perf.contentId}
                  onClick={() => navigate(`/content/${perf.contentId}`)}
                  className={`glass border rounded-xl overflow-hidden transition-all cursor-pointer ${
                    perf.isActive ? "border-border/40 hover:border-primary/40" : "border-border/20 opacity-60"
                  }`}
                >
                  {/* Header with Thumbnail and Status */}
                  <div className="relative h-32 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center">
                    <div className="text-6xl">{content.thumbnail}</div>
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <div className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-xl ${
                        roi > 100 ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                        roi > 0 ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" :
                        "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}>
                        ROI {roi > 0 ? "+" : ""}{roi.toFixed(0)}%
                      </div>
                    </div>
                    <div className="absolute top-3 left-3">
                      <div 
                        className="flex items-center gap-2 backdrop-blur-xl bg-background/20 rounded-full px-3 py-1.5 border border-border/40"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Label htmlFor={`active-${perf.contentId}`} className="text-xs cursor-pointer font-medium">
                          {perf.isActive ? "활성" : "정지"}
                        </Label>
                        <Switch
                          id={`active-${perf.contentId}`}
                          checked={perf.isActive}
                          onCheckedChange={() => toggleContentActive(perf.contentId)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="p-5">
                    <h4 className="font-bold text-lg mb-2">{content.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{content.description}</p>

                    {/* Performance Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="glass border border-border/40 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Eye className="w-3.5 h-3.5 text-primary" />
                          <p className="text-xs text-muted-foreground">노출</p>
                        </div>
                        <p className="text-xl font-bold">{perf.views.toLocaleString()}</p>
                      </div>
                      <div className="glass border border-border/40 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <MousePointerClick className="w-3.5 h-3.5 text-secondary" />
                          <p className="text-xs text-muted-foreground">클릭</p>
                        </div>
                        <p className="text-xl font-bold">{perf.clicks.toLocaleString()}</p>
                      </div>
                      <div className="glass border border-border/40 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Users className="w-3.5 h-3.5 text-accent" />
                          <p className="text-xs text-muted-foreground">전환</p>
                        </div>
                        <p className="text-xl font-bold">{perf.conversions.toLocaleString()}</p>
                      </div>
                      <div className="glass border border-border/40 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Heart className="w-3.5 h-3.5 text-purple-400" />
                          <p className="text-xs text-muted-foreground">참여율</p>
                        </div>
                        <p className="text-xl font-bold">{perf.engagement.toFixed(1)}%</p>
                      </div>
                    </div>

                    {/* Spend */}
                    <div className="glass border border-primary/40 bg-primary/5 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">총 지출</span>
                      </div>
                      <span className="text-lg font-bold text-primary">₩{(perf.spend / 10000).toFixed(0)}만</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Channel Performance */}
        <Card className="glass border-border/40 p-6 animate-scale-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">채널별 성과</h3>
              <p className="text-sm text-muted-foreground">각 채널의 상세 통계</p>
            </div>
          </div>
          <div className="space-y-4">
            {channelPerformance.map((channel, index) => (
              <div
                key={index}
                className="glass border border-border/40 rounded-lg p-4 hover:border-primary/40 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{channel.channel}</h4>
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                    {channel.engagement} 참여율
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">노출</p>
                    <p className="text-lg font-bold">{channel.views.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">클릭</p>
                    <p className="text-lg font-bold">{channel.clicks.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default CampaignDetail;
