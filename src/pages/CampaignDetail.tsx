import { useState } from "react";
import { ArrowLeft, Calendar, DollarSign, TrendingUp, Users, Eye, MousePointerClick, Heart, Sparkles, Trophy, Medal, Award, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import TrendChart from "@/components/TrendChart";
import { useContent } from "@/contexts/ContentContext";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  // Mock data
  const [campaign, setCampaign] = useState<Campaign>({
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

  const toggleCampaignActive = () => {
    const newStatus = campaign.status === "활성" ? "일시정지" : "활성";
    setCampaign((prev) => ({ ...prev, status: newStatus }));
    toast({
      title: newStatus === "활성" ? "캠페인이 활성화되었습니다" : "캠페인이 일시정지되었습니다",
      description: newStatus === "활성"
        ? "콘텐츠가 게시되고 광고가 집행됩니다."
        : "모든 광고 집행이 일시 중단됩니다.",
    });
  };

  const performanceMetrics = [
    { title: "총 노출", value: "245,823", icon: Eye, color: "text-primary" },
    { title: "클릭", value: "12,456", icon: MousePointerClick, color: "text-secondary" },
    { title: "전환", value: "1,234", icon: Users, color: "text-accent" },
    { title: "ROI", value: "+156%", icon: TrendingUp, color: "text-green-400" },
  ];

  // AI 인사이트 데이터
  const aiInsights = {
    topPerformingContent: "여름 세일 Instagram 포스트",
    topPerformingReason: "밝은 색상과 한정 시간 메시지가 클릭률을 42% 높였습니다",
    recommendations: [
      "오후 6-8시에 게시하면 참여율이 23% 더 높아집니다",
      "비디오 콘텐츠 추가 시 전환율 35% 상승 예상",
      "현재 예산 대비 성과가 좋아 예산 증액을 권장합니다",
    ],
    weeklyTrend: "상승",
    weeklyChange: "+18%",
  };

  // 콘텐츠를 ROI 기준으로 정렬 (랭킹)
  const sortedContentPerformances = [...contentPerformances].sort((a, b) => {
    const roiA = ((a.conversions * 50000 - a.spend) / a.spend) * 100;
    const roiB = ((b.conversions * 50000 - b.spend) / b.spend) * 100;
    return roiB - roiA;
  });

  const getRankIcon = (rank: number) => {
    if (rank === 0) return <Trophy className="w-5 h-5 text-yellow-400" />;
    if (rank === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    return <Award className="w-5 h-5 text-amber-600" />;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 0) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    if (rank === 1) return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    return "bg-amber-500/20 text-amber-600 border-amber-500/30";
  };

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
        {/* Header with Campaign Toggle */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/campaigns")}
              className="glass border-border/40 hover:border-primary/40 rounded-lg p-2 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold">{campaign.name}</h1>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[campaign.status]}`}>
                  {campaign.status}
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">{campaign.description}</p>
            </div>
            {/* Campaign Active Toggle */}
            <div className="glass border border-border/40 rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-sm font-medium">캠페인 상태</span>
                <span className="text-xs text-muted-foreground">
                  {campaign.status === "활성" ? "광고 집행 중" : "집행 중지됨"}
                </span>
              </div>
              <Switch
                checked={campaign.status === "활성"}
                onCheckedChange={toggleCampaignActive}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-scale-in" style={{ animationDelay: "0.1s" }}>
          {performanceMetrics.map((metric, index) => (
            <Card key={index} className="glass border-border/40 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{metric.title}</span>
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
              </div>
              <p className="text-2xl font-bold">{metric.value}</p>
            </Card>
          ))}
        </div>

        {/* AI Insights Card - Most Important Section */}
        <Card className="glass border-primary/40 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-6 mb-6 animate-scale-in" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    AI 마케팅 인사이트
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                      주간 분석
                    </span>
                  </h3>
                  <p className="text-sm text-muted-foreground">AI가 분석한 캠페인 성과 및 최적화 제안</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                  aiInsights.weeklyTrend === "상승"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}>
                  <TrendingUp className="w-4 h-4" />
                  {aiInsights.weeklyChange} 이번주
                </div>
              </div>

              {/* Top Performing Content */}
              <div className="glass border border-border/40 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium">최고 성과 콘텐츠</span>
                </div>
                <p className="font-bold text-primary mb-1">{aiInsights.topPerformingContent}</p>
                <p className="text-sm text-muted-foreground">{aiInsights.topPerformingReason}</p>
              </div>

              {/* Recommendations */}
              <div>
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  AI 추천 액션
                </p>
                <div className="space-y-2">
                  {aiInsights.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-secondary">{index + 1}</span>
                      </div>
                      <p className="text-muted-foreground">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Budget & Timeline - Compact */}
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

        {/* Content Performance Ranking */}
        <Card className="glass border-border/40 p-6 mb-6 animate-scale-in" style={{ animationDelay: "0.32s" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-500/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">콘텐츠 성과 랭킹</h3>
              <p className="text-sm text-muted-foreground">ROI 기준 효과적인 콘텐츠 순위</p>
            </div>
          </div>

          <div className="space-y-3">
            {sortedContentPerformances.map((perf, index) => {
              const content = contents.find((c) => c.id === perf.contentId);
              if (!content) return null;

              const roi = ((perf.conversions * 50000 - perf.spend) / perf.spend) * 100;
              const ctr = ((perf.clicks / perf.views) * 100).toFixed(2);
              const conversionRate = ((perf.conversions / perf.clicks) * 100).toFixed(2);

              return (
                <div
                  key={perf.contentId}
                  onClick={() => navigate(`/content/${perf.contentId}`)}
                  className={`glass border rounded-xl p-4 transition-all cursor-pointer group ${
                    perf.isActive
                      ? index === 0
                        ? "border-yellow-500/40 bg-yellow-500/5 hover:border-yellow-500/60"
                        : "border-border/40 hover:border-primary/40"
                      : "border-border/20 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Badge */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${getRankBadge(index)}`}>
                      {getRankIcon(index)}
                    </div>

                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl">{content.thumbnail}</span>
                    </div>

                    {/* Content Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold truncate">{content.title}</h4>
                        <div
                          className="flex items-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Switch
                            id={`active-${perf.contentId}`}
                            checked={perf.isActive}
                            onCheckedChange={() => toggleContentActive(perf.contentId)}
                            className="scale-75"
                          />
                          <Label htmlFor={`active-${perf.contentId}`} className="text-xs text-muted-foreground cursor-pointer">
                            {perf.isActive ? "활성" : "정지"}
                          </Label>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{content.description}</p>
                    </div>

                    {/* Performance Metrics */}
                    <div className="hidden md:flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-0.5">노출</p>
                        <p className="font-bold">{(perf.views / 1000).toFixed(0)}K</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-0.5">CTR</p>
                        <p className="font-bold">{ctr}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-0.5">전환율</p>
                        <p className="font-bold">{conversionRate}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-0.5">지출</p>
                        <p className="font-bold">₩{(perf.spend / 10000).toFixed(0)}만</p>
                      </div>
                    </div>

                    {/* ROI Badge */}
                    <div className={`px-3 py-1.5 rounded-full text-sm font-bold border ${
                      roi > 100 ? "bg-green-500/20 text-green-400 border-green-500/30" :
                      roi > 0 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                      "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}>
                      ROI {roi > 0 ? "+" : ""}{roi.toFixed(0)}%
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>

                  {/* Mobile Metrics */}
                  <div className="md:hidden grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-border/40">
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground">노출</p>
                      <p className="text-sm font-bold">{(perf.views / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground">CTR</p>
                      <p className="text-sm font-bold">{ctr}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground">전환율</p>
                      <p className="text-sm font-bold">{conversionRate}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground">지출</p>
                      <p className="text-sm font-bold">₩{(perf.spend / 10000).toFixed(0)}만</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default CampaignDetail;
