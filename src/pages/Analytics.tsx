import { useState } from "react";
import { ArrowLeft, Eye, MousePointerClick, Target, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import TrendChart from "@/components/TrendChart";
import ChannelComparisonChart from "@/components/ChannelComparisonChart";
import ConversionFunnelChart from "@/components/ConversionFunnelChart";
import ROICalculator from "@/components/ROICalculator";
import MetricCard from "@/components/MetricCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Analytics = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("daily");

  // Daily data
  const dailyData = [
    { date: "6/10", views: 12400, clicks: 1850, conversions: 320 },
    { date: "6/11", views: 13200, clicks: 1920, conversions: 340 },
    { date: "6/12", views: 14100, clicks: 2100, conversions: 380 },
    { date: "6/13", views: 13800, clicks: 2050, conversions: 365 },
    { date: "6/14", views: 15200, clicks: 2280, conversions: 420 },
    { date: "6/15", views: 16400, clicks: 2450, conversions: 485 },
    { date: "6/16", views: 15800, clicks: 2380, conversions: 460 },
  ];

  // Weekly data
  const weeklyData = [
    { date: "1주차", views: 45200, clicks: 6780, conversions: 1240 },
    { date: "2주차", views: 52100, clicks: 7820, conversions: 1450 },
    { date: "3주차", views: 58900, clicks: 8840, conversions: 1680 },
    { date: "4주차", views: 63400, clicks: 9510, conversions: 1820 },
  ];

  // Monthly data
  const monthlyData = [
    { date: "3월", views: 178000, clicks: 26700, conversions: 4890 },
    { date: "4월", views: 195000, clicks: 29250, conversions: 5460 },
    { date: "5월", views: 219600, clicks: 32950, conversions: 6190 },
  ];

  const channelData = [
    { channel: "Instagram", views: 45200, clicks: 6780, conversions: 1240 },
    { channel: "Facebook", views: 38900, clicks: 5835, conversions: 1050 },
    { channel: "Twitter", views: 28400, clicks: 4260, conversions: 765 },
    { channel: "Email", views: 12300, clicks: 3690, conversions: 820 },
    { channel: "Blog", views: 7540, clicks: 1508, conversions: 302 },
  ];

  const funnelData = [
    { name: "노출 (Impressions)", value: 132340, color: "hsl(239, 84%, 67%)" },
    { name: "클릭 (Clicks)", value: 9823, color: "hsl(258, 90%, 66%)" },
    { name: "랜딩 (Landing)", value: 8245, color: "hsl(189, 94%, 43%)" },
    { name: "가입 (Sign Up)", value: 2187, color: "hsl(158, 64%, 52%)" },
    { name: "전환 (Conversion)", value: 1456, color: "hsl(142, 76%, 36%)" },
  ];

  const getCurrentData = () => {
    switch (timeRange) {
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      default:
        return dailyData;
    }
  };

  const metrics = [
    { title: "총 조회수", value: "132K", change: "지난주 대비 +18%", icon: Eye, color: "text-primary" },
    { title: "총 클릭수", value: "9.8K", change: "지난주 대비 +23%", icon: MousePointerClick, color: "text-secondary" },
    { title: "전환수", value: "1,456", change: "지난주 대비 +15%", icon: Target, color: "text-accent" },
    { title: "평균 CTR", value: "7.4%", change: "지난주 대비 +0.8%", icon: TrendingUp, color: "text-primary" },
  ];

  const insights = [
    {
      icon: "📈",
      title: "Instagram 성과 급상승",
      description: "Instagram 채널의 참여율이 지난 주 대비 28% 증가했습니다. 비주얼 콘텐츠 전략이 효과적입니다.",
      trend: "up",
      bgColor: "bg-green-500/10",
    },
    {
      icon: "⚡",
      title: "Email 전환율 우수",
      description: "Email 캠페인의 전환율이 6.7%로 모든 채널 중 가장 높습니다. 타겟팅이 정확합니다.",
      trend: "up",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: "⚠️",
      title: "Twitter 이탈률 증가",
      description: "Twitter 채널의 이탈률이 증가하고 있습니다. 콘텐츠 형식과 게시 시간 조정이 필요합니다.",
      trend: "down",
      bgColor: "bg-yellow-500/10",
    },
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
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <button
            onClick={() => navigate("/")}
            className="glass border-border/40 hover:border-primary/40 rounded-lg p-2 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-4xl font-bold mb-2">성과 분석</h1>
            <p className="text-muted-foreground">실시간 마케팅 성과를 분석하고 인사이트를 확인하세요</p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, index) => (
            <div key={metric.title} style={{ animationDelay: `${index * 0.1}s` }}>
              <MetricCard {...metric} iconColor={metric.color} />
            </div>
          ))}
        </div>

        {/* Main Chart */}
        <div className="glass border-border/40 rounded-xl p-6 mb-8 animate-scale-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">성과 트렌드</h2>
            <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as typeof timeRange)}>
              <TabsList className="glass border-border/40">
                <TabsTrigger value="daily">일일</TabsTrigger>
                <TabsTrigger value="weekly">주간</TabsTrigger>
                <TabsTrigger value="monthly">월간</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <TrendChart data={getCurrentData()} />
        </div>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Channel Comparison */}
          <div className="glass border-border/40 rounded-xl p-6 animate-scale-in" style={{ animationDelay: "0.5s" }}>
            <h2 className="text-xl font-bold mb-6">채널별 성과 비교</h2>
            <ChannelComparisonChart data={channelData} />
          </div>

          {/* Conversion Funnel */}
          <div className="glass border-border/40 rounded-xl p-6 animate-scale-in" style={{ animationDelay: "0.6s" }}>
            <h2 className="text-xl font-bold mb-6">전환 퍼널</h2>
            <ConversionFunnelChart data={funnelData} />
          </div>
        </div>

        {/* ROI Calculator & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ROI Calculator */}
          <div className="animate-scale-in" style={{ animationDelay: "0.7s" }}>
            <ROICalculator />
          </div>

          {/* Insights */}
          <div className="lg:col-span-2 space-y-4 animate-scale-in" style={{ animationDelay: "0.8s" }}>
            <h2 className="text-xl font-bold">마케팅 인사이트</h2>
            {insights.map((insight, index) => (
              <div key={index} className={`glass border-border/40 rounded-xl p-6 ${insight.bgColor}`}>
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{insight.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{insight.title}</h3>
                      {insight.trend === "up" ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
