import { useState } from "react";
import { Eye, MousePointerClick, TrendingUp, Trophy, ExternalLink, Calendar, X, Share2, Copy, BarChart3, Rocket, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import MetricCard from "@/components/MetricCard";
import ChannelEfficiencyChart from "@/components/ChannelEfficiencyChart";
import CampaignEfficiencyChart from "@/components/CampaignEfficiencyChart";
import TodayTasks from "@/components/TodayTasks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface TopContent {
  id: number;
  title: string;
  channel: string;
  channelColor: string;
  views: number;
  clicks: number;
  ctr: number;
  rank: number;
  // 상세 정보
  publishedAt?: string;
  engagement?: number;
  shares?: number;
  comments?: number;
  avgWatchTime?: string;
  thumbnailUrl?: string;
  contentPreview?: string;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // 콘텐츠 상세 다이얼로그 상태
  const [selectedContent, setSelectedContent] = useState<TopContent | null>(null);
  const [contentDialogOpen, setContentDialogOpen] = useState(false);

  // 현재 기간 표시
  const currentPeriod = "11.25 ~ 12.1";

  // 핵심 지표 3개만 표시 (전문용어 → 쉬운 표현) - 기간 명시
  const metrics = [
    {
      title: "이번 주 총 조회수",
      value: "132,000",
      change: "지난주 대비 +18%",
      icon: Eye,
      color: "text-primary",
      tooltip: "이번 주 모든 채널에서 콘텐츠가 화면에 보인 총 횟수",
    },
    {
      title: "이번 주 총 클릭수",
      value: "9,800",
      change: "지난주 대비 +23%",
      icon: MousePointerClick,
      color: "text-secondary",
      tooltip: "이번 주 콘텐츠를 클릭한 총 횟수",
    },
    {
      title: "이번 달 투자 대비 수익",
      value: "+22%",
      change: "100만원 투자 → 122만원 수익",
      icon: TrendingUp,
      color: "text-accent",
      tooltip: "이번 달 마케팅에 쓴 비용 대비 얼마나 벌었는지",
    },
  ];

  // 이번 주 최고 성과 콘텐츠 목록
  const topContents: TopContent[] = [
    {
      id: 1,
      title: "2024 마케팅 트렌드 총정리",
      channel: "블로그",
      channelColor: "bg-green-500",
      views: 45200,
      clicks: 3400,
      ctr: 7.5,
      rank: 1,
      publishedAt: "11.27",
      engagement: 12.3,
      shares: 890,
      comments: 234,
      contentPreview: "2024년 마케팅 트렌드를 총정리했습니다. AI 마케팅, 숏폼 콘텐츠, 개인화 전략 등 핵심 트렌드를 분석합니다...",
    },
    {
      id: 2,
      title: "신제품 출시 티저 영상",
      channel: "인스타그램",
      channelColor: "bg-gradient-to-r from-purple-500 to-pink-500",
      views: 32100,
      clicks: 2800,
      ctr: 8.7,
      rank: 2,
      publishedAt: "11.28",
      engagement: 15.2,
      shares: 1250,
      comments: 456,
      contentPreview: "드디어 공개합니다! 새로운 제품 라인업을 티저 영상으로 먼저 만나보세요...",
    },
    {
      id: 3,
      title: "고객 후기 인터뷰",
      channel: "유튜브",
      channelColor: "bg-red-500",
      views: 28500,
      clicks: 1900,
      ctr: 6.7,
      rank: 3,
      publishedAt: "11.26",
      engagement: 8.9,
      shares: 320,
      comments: 187,
      avgWatchTime: "4:32",
      contentPreview: "실제 사용자분들의 생생한 후기를 인터뷰 형식으로 담았습니다...",
    },
    {
      id: 4,
      title: "업계 인사이트 공유",
      channel: "링크드인",
      channelColor: "bg-blue-600",
      views: 18200,
      clicks: 1200,
      ctr: 6.6,
      rank: 4,
      publishedAt: "11.29",
      engagement: 9.4,
      shares: 540,
      comments: 89,
      contentPreview: "B2B 마케팅의 새로운 패러다임, 업계 전문가들의 인사이트를 공유합니다...",
    },
    {
      id: 5,
      title: "빠른 팁 시리즈 #12",
      channel: "틱톡",
      channelColor: "bg-black",
      views: 8000,
      clicks: 500,
      ctr: 6.3,
      rank: 5,
      publishedAt: "11.30",
      engagement: 18.5,
      shares: 2100,
      comments: 312,
      avgWatchTime: "0:45",
      contentPreview: "60초 안에 알려드리는 마케팅 꿀팁! 오늘의 주제는 해시태그 전략입니다...",
    },
  ];

  // 콘텐츠 클릭 핸들러
  const handleContentClick = (content: TopContent) => {
    setSelectedContent(content);
    setContentDialogOpen(true);
  };

  // 콘텐츠 복사 핸들러
  const handleCopyContent = () => {
    if (selectedContent) {
      navigator.clipboard.writeText(selectedContent.contentPreview || "");
      toast({
        title: "복사 완료",
        description: "콘텐츠 미리보기가 클립보드에 복사되었습니다.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating Orbs - 배경 효과 */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div
        className="fixed bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float pointer-events-none"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="fixed top-1/2 left-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float pointer-events-none"
        style={{ animationDelay: "2s" }}
      />

      <Navigation />

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold">마케팅 대시보드</h1>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              {currentPeriod} 기준
            </p>
          </div>
        </div>

        {/* 마케팅 시작 가이드 배너 */}
        <div className="mb-8 animate-fade-in">
          <div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/20 p-6 cursor-pointer hover:border-primary/40 transition-all group"
            onClick={() => navigate("/strategy")}
          >
            {/* 배경 효과 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative flex items-center gap-6">
              {/* 아이콘 */}
              <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                <Rocket className="w-8 h-8 text-white" />
              </div>

              {/* 텍스트 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold">마케팅 시작 가이드</h3>
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                    추천
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  3분만 투자하세요. AI가 비즈니스에 맞는 마케팅 전략을 단계별로 안내해드립니다.
                </p>

                {/* 진행 단계 미리보기 */}
                <div className="flex items-center gap-3 mt-3">
                  {[
                    { num: 1, label: "비즈니스 분석" },
                    { num: 2, label: "채널 추천" },
                    { num: 3, label: "콘텐츠 생성" },
                    { num: 4, label: "캠페인 시작" },
                  ].map((step, i) => (
                    <div key={step.num} className="flex items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                          {step.num}
                        </span>
                        <span className="text-xs text-muted-foreground hidden md:inline">{step.label}</span>
                      </div>
                      {i < 3 && <div className="w-4 h-px bg-border/60 mx-1 hidden md:block" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA 버튼 */}
              <Button
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg flex-shrink-0 group-hover:translate-x-1 transition-transform"
              >
                시작하기
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* 섹션 1: 핵심 지표 3개 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {metrics.map((metric, index) => (
            <div
              key={metric.title}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <MetricCard {...metric} iconColor={metric.color} />
            </div>
          ))}
        </div>

        {/* 섹션 2: 효율 비교 차트 (채널 + 캠페인) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChannelEfficiencyChart />
          <CampaignEfficiencyChart />
        </div>

        {/* 섹션 3: 이번 주 최고 성과 콘텐츠 */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-bold">이번 주 최고 성과 콘텐츠</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => navigate("/analytics")}
            >
              전체 보기
              <ExternalLink className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <Card className="bg-card/50 backdrop-blur-sm border-white/10">
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {topContents.map((content, index) => (
                  <div
                    key={content.id}
                    className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors cursor-pointer"
                    style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                    onClick={() => handleContentClick(content)}
                  >
                    {/* 순위 */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      content.rank === 1 ? "bg-yellow-500/20 text-yellow-500" :
                      content.rank === 2 ? "bg-gray-400/20 text-gray-400" :
                      content.rank === 3 ? "bg-orange-600/20 text-orange-600" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {content.rank}
                    </div>

                    {/* 채널 뱃지 */}
                    <Badge className={`${content.channelColor} text-white text-xs px-2 py-0.5 min-w-[70px] justify-center`}>
                      {content.channel}
                    </Badge>

                    {/* 콘텐츠 제목 */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{content.title}</p>
                    </div>

                    {/* 성과 지표 */}
                    <div className="hidden sm:flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-muted-foreground text-xs">조회수</p>
                        <p className="font-medium">{content.views.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground text-xs">클릭수</p>
                        <p className="font-medium">{content.clicks.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground text-xs">클릭률</p>
                        <p className="font-medium text-primary">{content.ctr}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 섹션 4: 오늘 할 일 (예약 게시물 + 진행 캠페인) */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 animate-fade-in">오늘 할 일</h2>
          <TodayTasks />
        </div>
      </main>

      {/* 콘텐츠 상세 다이얼로그 */}
      <Dialog open={contentDialogOpen} onOpenChange={setContentDialogOpen}>
        <DialogContent className="max-w-lg glass border-border/40">
          {selectedContent && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    selectedContent.rank === 1 ? "bg-yellow-500/20 text-yellow-500" :
                    selectedContent.rank === 2 ? "bg-gray-400/20 text-gray-400" :
                    selectedContent.rank === 3 ? "bg-orange-600/20 text-orange-600" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {selectedContent.rank}
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-lg">{selectedContent.title}</DialogTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${selectedContent.channelColor} text-white text-xs`}>
                        {selectedContent.channel}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {selectedContent.publishedAt} 게시
                      </span>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                {/* 성과 지표 그리드 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-muted/20 text-center">
                    <p className="text-xs text-muted-foreground">조회수</p>
                    <p className="text-lg font-bold">{selectedContent.views.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/20 text-center">
                    <p className="text-xs text-muted-foreground">클릭수</p>
                    <p className="text-lg font-bold">{selectedContent.clicks.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10 text-center">
                    <p className="text-xs text-muted-foreground">클릭률</p>
                    <p className="text-lg font-bold text-primary">{selectedContent.ctr}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/10 text-center">
                    <p className="text-xs text-muted-foreground">참여율</p>
                    <p className="text-lg font-bold text-secondary">{selectedContent.engagement}%</p>
                  </div>
                </div>

                {/* 추가 지표 */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedContent.shares?.toLocaleString()} 공유</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">댓글</span>
                    <span>{selectedContent.comments?.toLocaleString()}개</span>
                  </div>
                  {selectedContent.avgWatchTime && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground">평균 시청</span>
                      <span>{selectedContent.avgWatchTime}</span>
                    </div>
                  )}
                </div>

                {/* 콘텐츠 미리보기 */}
                {selectedContent.contentPreview && (
                  <div className="p-4 rounded-lg bg-muted/10 border border-border/20">
                    <p className="text-sm text-muted-foreground mb-2">콘텐츠 미리보기</p>
                    <p className="text-sm">{selectedContent.contentPreview}</p>
                  </div>
                )}

                {/* 액션 버튼 */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleCopyContent}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    콘텐츠 복사
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-primary to-secondary"
                    onClick={() => {
                      setContentDialogOpen(false);
                      navigate("/analytics");
                    }}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    상세 분석
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
