import { Activity, Calendar, TrendingUp, Eye, MousePointerClick, Coins, Plus, Target, DollarSign, Zap, PenTool, BarChart3, TrendingUp as TrendingUpIcon, Link2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import MetricCard from "@/components/MetricCard";
import CampaignItem from "@/components/CampaignItem";
import UpcomingPost from "@/components/UpcomingPost";
import QuickAction from "@/components/QuickAction";
import InsightCard from "@/components/InsightCard";
import { Button } from "@/components/ui/button";
import { useDemoMode } from "@/contexts/DemoModeContext";

const Index = () => {
  const navigate = useNavigate();
  const { isDemoMode, triggerUpgrade } = useDemoMode();
  const metrics = [
    { title: "활성 캠페인", value: "3", change: "지난주 대비 +2", icon: Activity, color: "text-primary" },
    { title: "예약된 게시물", value: "5", change: "다음: 오늘 14:00", icon: Calendar, color: "text-secondary" },
    { title: "이번 주 게시물", value: "24", change: "지난주 대비 +12%", icon: TrendingUp, color: "text-accent" },
    { title: "총 조회수", value: "132K", change: "지난주 대비 +18%", icon: Eye, color: "text-primary" },
    { title: "총 클릭수", value: "9.8K", change: "지난주 대비 +23%", icon: MousePointerClick, color: "text-secondary" },
    { title: "크레딧 잔액", value: "1,000", change: "프리미엄 플랜", icon: Coins, color: "text-ring" },
  ];

  const campaigns = [
    { name: "여름 세일 캠페인", channels: 3, status: "활성" as const, logo: "S" },
    { name: "신제품 론칭", channels: 5, status: "활성" as const, logo: "N" },
    { name: "브랜드 인지도", channels: 2, status: "일시정지" as const, logo: "B" },
    { name: "할인 프로모션", channels: 4, status: "완료" as const, logo: "H" },
    { name: "Q4 마케팅", channels: 6, status: "초안" as const, logo: "Q" },
  ];

  const upcomingPosts = [
    { channel: "Instagram" as const, campaign: "여름 세일", time: "6월 15일 14:00" },
    { channel: "Facebook" as const, campaign: "신제품 소개", time: "6월 15일 16:00" },
    { channel: "Twitter" as const, campaign: "이벤트 공지", time: "6월 16일 10:00" },
    { channel: "Email" as const, campaign: "뉴스레터", time: "6월 16일 09:00" },
    { channel: "LinkedIn" as const, campaign: "케이스 스터디", time: "6월 17일 11:00" },
  ];

  const quickActions = [
    {
      icon: PenTool,
      iconColor: "text-green-500",
      title: "콘텐츠 생성",
      description: "AI로 다채널 마케팅 콘텐츠 작성",
      gradient: "bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20",
    },
    {
      icon: BarChart3,
      iconColor: "text-blue-500",
      title: "캠페인 관리",
      description: "다중 채널 캠페인 운영 및 예약",
      gradient: "bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20",
    },
    {
      icon: TrendingUpIcon,
      iconColor: "text-purple-500",
      title: "성과 분석",
      description: "실시간 성과 지표 및 인사이트",
      gradient: "bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20",
    },
    {
      icon: Link2,
      iconColor: "text-yellow-500",
      title: "채널 연결",
      description: "9개 마케팅 채널 통합 관리",
      gradient: "bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/20",
    },
  ];

  const insights = [
    {
      icon: Target,
      iconColor: "text-green-500",
      title: "참여율 증가",
      description: "지난 7일간 평균 참여율이 15.3% 증가했습니다.",
      bgColor: "bg-green-500/10",
    },
    {
      icon: DollarSign,
      iconColor: "text-blue-500",
      title: "ROI 개선",
      description: "광고 ROI가 전월 대비 22% 상승했습니다.",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Zap,
      iconColor: "text-purple-500",
      title: "자동화 효율",
      description: "시간을 80% 절약하고 있습니다.",
      bgColor: "bg-purple-500/10",
    },
  ];

  const handleNewContent = () => {
    if (isDemoMode) {
      triggerUpgrade('콘텐츠 생성');
    } else {
      navigate("/content/create");
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "1s" }} />
      <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "2s" }} />

      <Navigation />

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex justify-end mb-8 animate-fade-in">
          <Button
            onClick={handleNewContent}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            새 콘텐츠 생성
          </Button>
        </div>

        {/* Marketing Insights - Moved to Top */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 animate-fade-in">마케팅 인사이트</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insights.map((insight, index) => (
              <div key={insight.title} style={{ animationDelay: `${index * 0.1}s` }}>
                <InsightCard {...insight} />
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {metrics.map((metric, index) => (
            <div key={metric.title} style={{ animationDelay: `${index * 0.1}s` }}>
              <MetricCard {...metric} iconColor={metric.color} />
            </div>
          ))}
        </div>

        {/* Campaign Content Performance */}
        <div className="glass border-border/40 rounded-xl p-6 mb-8 animate-scale-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">진행 중인 캠페인 성과</h2>
            <Button variant="outline" size="sm" onClick={() => navigate("/campaigns")}>
              전체 보기
            </Button>
          </div>
          <div className="space-y-4">
            {/* Campaign: 여름 세일 */}
            <div className="glass border-border/20 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div>
                  <h3 className="font-semibold">여름 세일 캠페인</h3>
                  <p className="text-xs text-muted-foreground">3개 채널 · 5개 콘텐츠</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="p-3 rounded-lg bg-muted/20 border border-border/10">
                  <div className="flex items-center gap-2 mb-2">
                    <img src="/placeholder.svg" alt="" className="w-8 h-8 rounded object-cover" />
                    <span className="text-xs font-medium">Instagram 광고</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">조회수</span>
                      <span className="font-semibold text-primary">12.4K</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">클릭수</span>
                      <span className="font-semibold text-secondary">890</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">참여율</span>
                      <span className="font-semibold text-accent">7.2%</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 border border-border/10">
                  <div className="flex items-center gap-2 mb-2">
                    <img src="/placeholder.svg" alt="" className="w-8 h-8 rounded object-cover" />
                    <span className="text-xs font-medium">Facebook 포스트</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">조회수</span>
                      <span className="font-semibold text-primary">8.9K</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">클릭수</span>
                      <span className="font-semibold text-secondary">654</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">참여율</span>
                      <span className="font-semibold text-accent">7.3%</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 border border-border/10">
                  <div className="flex items-center gap-2 mb-2">
                    <img src="/placeholder.svg" alt="" className="w-8 h-8 rounded object-cover" />
                    <span className="text-xs font-medium">Email 캠페인</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">발송</span>
                      <span className="font-semibold text-primary">5.2K</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">오픈</span>
                      <span className="font-semibold text-secondary">2.1K</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">오픈율</span>
                      <span className="font-semibold text-accent">40.4%</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 border border-border/10">
                  <div className="flex items-center gap-2 mb-2">
                    <img src="/placeholder.svg" alt="" className="w-8 h-8 rounded object-cover" />
                    <span className="text-xs font-medium">Blog 포스트</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">조회수</span>
                      <span className="font-semibold text-primary">3.8K</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">체류시간</span>
                      <span className="font-semibold text-secondary">2m 34s</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">공유</span>
                      <span className="font-semibold text-accent">128</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 border border-border/10">
                  <div className="flex items-center gap-2 mb-2">
                    <img src="/placeholder.svg" alt="" className="w-8 h-8 rounded object-cover" />
                    <span className="text-xs font-medium">Twitter 광고</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">조회수</span>
                      <span className="font-semibold text-primary">15.2K</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">리트윗</span>
                      <span className="font-semibold text-secondary">423</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">참여율</span>
                      <span className="font-semibold text-accent">2.8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign: 신제품 론칭 */}
            <div className="glass border-border/20 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold">
                  N
                </div>
                <div>
                  <h3 className="font-semibold">신제품 론칭</h3>
                  <p className="text-xs text-muted-foreground">5개 채널 · 8개 콘텐츠</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-muted/20 border border-border/10">
                  <div className="flex items-center gap-2 mb-2">
                    <img src="/placeholder.svg" alt="" className="w-8 h-8 rounded object-cover" />
                    <span className="text-xs font-medium">LinkedIn 포스트</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">조회수</span>
                      <span className="font-semibold text-primary">22.1K</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">클릭수</span>
                      <span className="font-semibold text-secondary">1.2K</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">참여율</span>
                      <span className="font-semibold text-accent">5.4%</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 border border-border/10">
                  <div className="flex items-center gap-2 mb-2">
                    <img src="/placeholder.svg" alt="" className="w-8 h-8 rounded object-cover" />
                    <span className="text-xs font-medium">TikTok 영상</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">조회수</span>
                      <span className="font-semibold text-primary">45.6K</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">좋아요</span>
                      <span className="font-semibold text-secondary">3.4K</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">참여율</span>
                      <span className="font-semibold text-accent">7.5%</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 border border-border/10">
                  <div className="flex items-center gap-2 mb-2">
                    <img src="/placeholder.svg" alt="" className="w-8 h-8 rounded object-cover" />
                    <span className="text-xs font-medium">Google Ads</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">노출수</span>
                      <span className="font-semibold text-primary">98.2K</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">클릭수</span>
                      <span className="font-semibold text-secondary">4.5K</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">CTR</span>
                      <span className="font-semibold text-accent">4.6%</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 border border-border/10">
                  <div className="flex items-center gap-2 mb-2">
                    <img src="/placeholder.svg" alt="" className="w-8 h-8 rounded object-cover" />
                    <span className="text-xs font-medium">Naver Ads</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">노출수</span>
                      <span className="font-semibold text-primary">76.3K</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">클릭수</span>
                      <span className="font-semibold text-secondary">3.2K</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">CTR</span>
                      <span className="font-semibold text-accent">4.2%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Campaigns */}
          <div className="glass border-border/40 rounded-xl p-6 animate-scale-in">
            <h2 className="text-xl font-bold mb-4">최근 캠페인</h2>
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <CampaignItem key={campaign.name} {...campaign} />
              ))}
            </div>
          </div>

          {/* Upcoming Posts */}
          <div className="glass border-border/40 rounded-xl p-6 animate-scale-in" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-xl font-bold mb-4">예정된 게시물</h2>
            <div className="space-y-3">
              {upcomingPosts.map((post, index) => (
                <UpcomingPost key={index} {...post} />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 animate-fade-in">빠른 작업</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <div key={action.title} style={{ animationDelay: `${index * 0.1}s` }}>
                <QuickAction {...action} />
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Index;
