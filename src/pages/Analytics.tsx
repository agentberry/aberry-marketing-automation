import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Zap,
  Crown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Calculator,
  PiggyBank,
  BarChart3,
  Lightbulb,
  Sparkles,
  Clock,
  Users,
  Eye,
  MousePointerClick,
  Heart,
  Share2,
  MessageSquare,
  ChevronRight,
  Info,
  Percent,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { Instagram, Facebook, Linkedin, Youtube } from "lucide-react";

// 채널별 실제 비용 효율 데이터
interface ChannelEfficiency {
  id: string;
  name: string;
  icon: any;
  color: string;
  // 오가닉 성과
  organic: {
    reach: number;
    engagement: number;
    conversions: number;
    timeInvested: number; // 시간 (분/주)
    costPerConversion: number; // 시간을 비용으로 환산
  };
  // 유료 광고 성과 (있을 경우)
  paid?: {
    spend: number;
    reach: number;
    clicks: number;
    conversions: number;
    cpc: number;
    cpa: number;
    roas: number;
  };
  // 추천 액션
  recommendation: {
    type: "scale" | "optimize" | "reduce" | "start";
    message: string;
    action: string;
  };
  grade: "A" | "B" | "C" | "D";
}

const Analytics = () => {
  const navigate = useNavigate();
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [budgetInput, setBudgetInput] = useState("500000");
  const [hourlyRate, setHourlyRate] = useState("30000"); // 시간당 비용 (인건비)

  // 채널별 효율 데이터
  const channelEfficiencies: ChannelEfficiency[] = [
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "text-pink-500",
      organic: {
        reach: 15420,
        engagement: 1850,
        conversions: 42,
        timeInvested: 180, // 주 3시간
        costPerConversion: 12857, // (180/60 * 30000) / 42
      },
      paid: {
        spend: 150000,
        reach: 45000,
        clicks: 2250,
        conversions: 28,
        cpc: 67,
        cpa: 5357,
        roas: 2.8,
      },
      recommendation: {
        type: "scale",
        message: "오가닉 성과가 매우 좋습니다. 릴스 콘텐츠를 늘리세요.",
        action: "릴스 주 5회로 증가",
      },
      grade: "A",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      color: "text-blue-500",
      organic: {
        reach: 8930,
        engagement: 720,
        conversions: 18,
        timeInvested: 120, // 주 2시간
        costPerConversion: 20000,
      },
      recommendation: {
        type: "optimize",
        message: "B2B 리드 품질이 높습니다. 포스팅 빈도를 늘리세요.",
        action: "주 3회 → 5회",
      },
      grade: "B",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "text-blue-600",
      organic: {
        reach: 5200,
        engagement: 380,
        conversions: 8,
        timeInvested: 90,
        costPerConversion: 33750,
      },
      paid: {
        spend: 200000,
        reach: 62000,
        clicks: 1860,
        conversions: 22,
        cpc: 108,
        cpa: 9091,
        roas: 1.6,
      },
      recommendation: {
        type: "reduce",
        message: "오가닉 도달이 계속 감소 중입니다. 유료 광고 효율도 낮습니다.",
        action: "예산을 Instagram으로 재배치",
      },
      grade: "C",
    },
    {
      id: "blog",
      name: "블로그 (SEO)",
      icon: BarChart3,
      color: "text-green-500",
      organic: {
        reach: 12500,
        engagement: 890,
        conversions: 35,
        timeInvested: 240, // 주 4시간 (글 작성)
        costPerConversion: 20571,
      },
      recommendation: {
        type: "scale",
        message: "검색 유입이 꾸준히 증가 중입니다. 장기 자산으로 가치 높음.",
        action: "주 1회 → 2회 발행",
      },
      grade: "A",
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: Youtube,
      color: "text-red-500",
      organic: {
        reach: 3200,
        engagement: 180,
        conversions: 5,
        timeInvested: 300, // 주 5시간 (영상 제작)
        costPerConversion: 180000,
      },
      recommendation: {
        type: "optimize",
        message: "제작 시간 대비 전환이 낮습니다. Shorts로 전환하세요.",
        action: "롱폼 → Shorts 중심",
      },
      grade: "D",
    },
  ];

  // 전체 통계 계산
  const totalStats = {
    totalReach: channelEfficiencies.reduce((sum, c) => sum + c.organic.reach + (c.paid?.reach || 0), 0),
    totalConversions: channelEfficiencies.reduce((sum, c) => sum + c.organic.conversions + (c.paid?.conversions || 0), 0),
    totalSpend: channelEfficiencies.reduce((sum, c) => sum + (c.paid?.spend || 0), 0),
    totalTimeHours: channelEfficiencies.reduce((sum, c) => sum + c.organic.timeInvested, 0) / 60,
    organicConversions: channelEfficiencies.reduce((sum, c) => sum + c.organic.conversions, 0),
    paidConversions: channelEfficiencies.reduce((sum, c) => sum + (c.paid?.conversions || 0), 0),
  };

  // 시간 비용 환산
  const timeCost = totalStats.totalTimeHours * parseInt(hourlyRate);
  const totalCost = totalStats.totalSpend + timeCost;
  const avgCostPerConversion = totalStats.totalConversions > 0 ? totalCost / totalStats.totalConversions : 0;

  // 오가닉 vs 유료 비교
  const organicCPA = totalStats.organicConversions > 0 ? timeCost / totalStats.organicConversions : 0;
  const paidCPA = totalStats.paidConversions > 0 ? totalStats.totalSpend / totalStats.paidConversions : 0;

  // 예산 최적화 시뮬레이션
  const budgetValue = parseInt(budgetInput) || 500000;
  const optimizedAllocation = [
    { channel: "Instagram 오가닉", allocation: 0, reason: "무료 - 시간 투자만", expected: "전환 42건+" },
    { channel: "Instagram 광고", allocation: Math.round(budgetValue * 0.4), reason: "ROAS 2.8로 최고 효율", expected: `전환 ${Math.round((budgetValue * 0.4) / 5357)}건` },
    { channel: "블로그 SEO", allocation: 0, reason: "무료 - 장기 자산 구축", expected: "전환 35건+" },
    { channel: "LinkedIn 오가닉", allocation: 0, reason: "무료 - B2B 고품질 리드", expected: "전환 18건+" },
    { channel: "LinkedIn 광고", allocation: Math.round(budgetValue * 0.35), reason: "B2B 타겟팅 정확", expected: `전환 ${Math.round((budgetValue * 0.35) / 8000)}건` },
    { channel: "리타겟팅 광고", allocation: Math.round(budgetValue * 0.25), reason: "방문자 재전환", expected: `전환 ${Math.round((budgetValue * 0.25) / 3000)}건` },
  ];

  // 이번 주 해야 할 것들
  const weeklyActions = [
    {
      priority: 1,
      action: "Instagram 릴스 5개 제작",
      impact: "예상 도달 +40%",
      effort: "3시간",
      cost: "무료",
      icon: Instagram,
    },
    {
      priority: 2,
      action: "블로그 SEO 포스트 2개 발행",
      impact: "검색 유입 +25%",
      effort: "4시간",
      cost: "무료",
      icon: BarChart3,
    },
    {
      priority: 3,
      action: "Facebook 광고 예산 Instagram으로 이동",
      impact: "같은 예산으로 전환 +50%",
      effort: "30분",
      cost: "재배치",
      icon: RefreshCw,
    },
    {
      priority: 4,
      action: "LinkedIn 캐러셀 3개 발행",
      impact: "B2B 리드 +30%",
      effort: "2시간",
      cost: "무료",
      icon: Linkedin,
    },
  ];

  // 낭비되고 있는 비용
  const wastedBudget = [
    {
      area: "Facebook 오가닉",
      amount: 45000, // 시간 비용
      reason: "알고리즘 변화로 도달률 급감",
      suggestion: "시간을 Instagram/LinkedIn으로 재배치",
    },
    {
      area: "Facebook 광고",
      amount: 120000,
      reason: "CPA가 Instagram 대비 70% 높음",
      suggestion: "예산의 60%를 Instagram으로 이동",
    },
    {
      area: "YouTube 롱폼",
      amount: 150000, // 시간 비용
      reason: "제작 시간 대비 전환 효율 최하위",
      suggestion: "Shorts 중심으로 전환 (제작 시간 80% 감소)",
    },
  ];

  const totalWasted = wastedBudget.reduce((sum, w) => sum + w.amount, 0);

  // 채널 등급 색상
  const gradeColors = {
    A: "bg-green-500/10 text-green-600 border-green-500/20",
    B: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    C: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    D: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "1s" }} />

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
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Calculator className="w-10 h-10 text-primary" />
              비용 효율 분석
            </h1>
            <p className="text-muted-foreground">
              어디에 돈과 시간을 쓰면 가장 효율적인지 분석해드립니다
            </p>
          </div>
        </div>

        {/* 핵심 인사이트 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass border-border/40 p-4 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <PiggyBank className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">오가닉 전환당 비용</p>
                <p className="text-xl font-bold">₩{Math.round(organicCPA).toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="glass border-border/40 p-4 animate-scale-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">유료 광고 전환당 비용</p>
                <p className="text-xl font-bold">₩{Math.round(paidCPA).toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="glass border-border/40 p-4 animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">낭비 중인 비용</p>
                <p className="text-xl font-bold text-red-500">₩{totalWasted.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="glass border-border/40 p-4 animate-scale-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">총 전환</p>
                <p className="text-xl font-bold">{totalStats.totalConversions}건</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 핵심 메시지 */}
        <Card className="glass border-green-500/40 bg-green-500/5 p-6 mb-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">핵심 인사이트</h2>
              <p className="text-muted-foreground mb-4">
                현재 <strong className="text-foreground">오가닉 마케팅이 유료 광고보다 {Math.round((paidCPA / organicCPA - 1) * 100)}% 더 효율적</strong>입니다.
                시간 투자 대비 전환율이 높으니 <strong className="text-foreground">Instagram 릴스와 블로그 SEO에 집중</strong>하세요.
                Facebook은 효율이 낮아 예산 재배치를 권장합니다.
              </p>
              <div className="flex gap-3">
                <Button size="sm" onClick={() => navigate("/content/generate")}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  릴스 콘텐츠 만들기
                </Button>
                <Button size="sm" variant="outline" onClick={() => navigate("/strategy")}>
                  전략 리포트 보기
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="efficiency" className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto mb-6">
            <TabsTrigger value="efficiency">채널별 효율</TabsTrigger>
            <TabsTrigger value="waste">낭비 분석</TabsTrigger>
            <TabsTrigger value="optimize">예산 최적화</TabsTrigger>
            <TabsTrigger value="actions">이번 주 할 일</TabsTrigger>
          </TabsList>

          {/* 채널별 효율 탭 */}
          <TabsContent value="efficiency">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">채널별 비용 효율 순위</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Info className="w-4 h-4" />
                  시간당 인건비: ₩{parseInt(hourlyRate).toLocaleString()} 기준
                </div>
              </div>

              {channelEfficiencies
                .sort((a, b) => a.organic.costPerConversion - b.organic.costPerConversion)
                .map((channel, index) => (
                <Card
                  key={channel.id}
                  className={`glass border-border/40 p-6 cursor-pointer transition-all hover:border-primary/40 ${
                    selectedChannel === channel.id ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setSelectedChannel(selectedChannel === channel.id ? null : channel.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl glass border-border/40 flex items-center justify-center">
                          <channel.icon className={`w-6 h-6 ${channel.color}`} />
                        </div>
                        <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${gradeColors[channel.grade]}`}>
                          {channel.grade}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold">{channel.name}</h4>
                          {index === 0 && (
                            <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs">
                              <Crown className="w-3 h-3 mr-1" />
                              최고 효율
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          오가닉 전환당 비용: <strong className="text-foreground">₩{Math.round(channel.organic.costPerConversion).toLocaleString()}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <span className="text-sm text-muted-foreground">전환</span>
                        <span className="font-bold">{channel.organic.conversions}건</span>
                        {channel.paid && (
                          <span className="text-xs text-muted-foreground">+{channel.paid.conversions}건(유료)</span>
                        )}
                      </div>
                      <Badge className={`text-xs ${
                        channel.recommendation.type === "scale" ? "bg-green-500/10 text-green-600" :
                        channel.recommendation.type === "optimize" ? "bg-blue-500/10 text-blue-600" :
                        channel.recommendation.type === "reduce" ? "bg-red-500/10 text-red-600" :
                        "bg-gray-500/10 text-gray-600"
                      }`}>
                        {channel.recommendation.type === "scale" ? "확대 추천" :
                         channel.recommendation.type === "optimize" ? "최적화 필요" :
                         channel.recommendation.type === "reduce" ? "축소 검토" : "시작 추천"}
                      </Badge>
                    </div>
                  </div>

                  {selectedChannel === channel.id && (
                    <div className="mt-6 pt-6 border-t border-border/40 space-y-6 animate-fade-in">
                      {/* 상세 성과 */}
                      <div className="grid grid-cols-2 gap-6">
                        {/* 오가닉 성과 */}
                        <div className="space-y-3">
                          <h5 className="font-medium flex items-center gap-2">
                            <PiggyBank className="w-4 h-4 text-green-500" />
                            오가닉 성과 (무료)
                          </h5>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-muted/30">
                              <p className="text-xs text-muted-foreground">도달</p>
                              <p className="font-bold">{channel.organic.reach.toLocaleString()}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/30">
                              <p className="text-xs text-muted-foreground">참여</p>
                              <p className="font-bold">{channel.organic.engagement.toLocaleString()}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/30">
                              <p className="text-xs text-muted-foreground">전환</p>
                              <p className="font-bold">{channel.organic.conversions}건</p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/30">
                              <p className="text-xs text-muted-foreground">투자 시간</p>
                              <p className="font-bold">주 {Math.round(channel.organic.timeInvested / 60)}시간</p>
                            </div>
                          </div>
                        </div>

                        {/* 유료 광고 성과 */}
                        {channel.paid ? (
                          <div className="space-y-3">
                            <h5 className="font-medium flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-blue-500" />
                              유료 광고 성과
                            </h5>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 rounded-lg bg-muted/30">
                                <p className="text-xs text-muted-foreground">광고비</p>
                                <p className="font-bold">₩{channel.paid.spend.toLocaleString()}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-muted/30">
                                <p className="text-xs text-muted-foreground">CPA</p>
                                <p className="font-bold">₩{Math.round(channel.paid.cpa).toLocaleString()}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-muted/30">
                                <p className="text-xs text-muted-foreground">전환</p>
                                <p className="font-bold">{channel.paid.conversions}건</p>
                              </div>
                              <div className="p-3 rounded-lg bg-muted/30">
                                <p className="text-xs text-muted-foreground">ROAS</p>
                                <p className={`font-bold ${channel.paid.roas >= 2 ? "text-green-500" : channel.paid.roas >= 1 ? "text-yellow-500" : "text-red-500"}`}>
                                  {channel.paid.roas}x
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <h5 className="font-medium flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-muted-foreground" />
                              유료 광고
                            </h5>
                            <div className="p-6 rounded-lg bg-muted/20 text-center">
                              <p className="text-sm text-muted-foreground mb-2">아직 유료 광고를 집행하지 않았습니다</p>
                              <Button size="sm" variant="outline">
                                광고 시작하기
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 추천 액션 */}
                      <div className={`p-4 rounded-lg border ${
                        channel.recommendation.type === "scale" ? "bg-green-500/10 border-green-500/20" :
                        channel.recommendation.type === "optimize" ? "bg-blue-500/10 border-blue-500/20" :
                        channel.recommendation.type === "reduce" ? "bg-red-500/10 border-red-500/20" :
                        "bg-gray-500/10 border-gray-500/20"
                      }`}>
                        <div className="flex items-start gap-3">
                          <Lightbulb className={`w-5 h-5 mt-0.5 ${
                            channel.recommendation.type === "scale" ? "text-green-500" :
                            channel.recommendation.type === "optimize" ? "text-blue-500" :
                            channel.recommendation.type === "reduce" ? "text-red-500" :
                            "text-gray-500"
                          }`} />
                          <div>
                            <p className="font-medium mb-1">{channel.recommendation.message}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">추천 액션:</span>
                              <Badge variant="outline">{channel.recommendation.action}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex gap-3">
                        <Button
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/content/generate");
                          }}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          {channel.name} 콘텐츠 만들기
                        </Button>
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/campaigns");
                          }}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          캠페인 예약
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 낭비 분석 탭 */}
          <TabsContent value="waste">
            <Card className="glass border-red-500/40 bg-red-500/5 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">월 ₩{totalWasted.toLocaleString()} 낭비 중</h3>
                  <p className="text-muted-foreground">아래 항목들을 개선하면 같은 비용으로 더 많은 전환을 얻을 수 있습니다</p>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              {wastedBudget.map((waste, index) => (
                <Card key={index} className="glass border-border/40 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <div>
                        <h4 className="font-bold">{waste.area}</h4>
                        <p className="text-sm text-muted-foreground">{waste.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-red-500">-₩{waste.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">월간</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">해결 방법</p>
                        <p className="text-sm text-muted-foreground">{waste.suggestion}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="glass border-green-500/40 bg-green-500/5 p-6 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold mb-1">위 문제들을 해결하면</h4>
                  <p className="text-sm text-muted-foreground">
                    같은 비용으로 약 <strong className="text-foreground">전환 30-40% 증가</strong> 예상
                  </p>
                </div>
                <Button onClick={() => navigate("/strategy")}>
                  전략 수정하기
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* 예산 최적화 탭 */}
          <TabsContent value="optimize">
            <Card className="glass border-border/40 p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">예산 최적화 시뮬레이터</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label>월간 마케팅 예산</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₩</span>
                    <Input
                      type="number"
                      value={budgetInput}
                      onChange={(e) => setBudgetInput(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>시간당 인건비 (오가닉 비용 계산용)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₩</span>
                    <Input
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="font-medium">AI 추천 예산 배분</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  현재 채널별 성과를 기반으로 ₩{budgetValue.toLocaleString()} 예산의 최적 배분을 제안합니다
                </p>
              </div>

              <div className="space-y-3">
                {optimizedAllocation.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg border border-border/40">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{item.channel}</span>
                        {item.allocation === 0 && (
                          <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600">무료</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{item.reason}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {item.allocation > 0 ? `₩${item.allocation.toLocaleString()}` : "₩0"}
                      </p>
                      <p className="text-xs text-green-600">{item.expected}</p>
                    </div>
                    {item.allocation > 0 && (
                      <div className="w-16">
                        <Progress value={(item.allocation / budgetValue) * 100} className="h-2" />
                        <p className="text-xs text-center text-muted-foreground mt-1">
                          {Math.round((item.allocation / budgetValue) * 100)}%
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">예상 총 전환</p>
                    <p className="text-sm text-muted-foreground">오가닉 + 유료 합산</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {95 + Math.round(budgetValue / 5000)}건
                    </p>
                    <p className="text-sm text-muted-foreground">
                      평균 CPA: ₩{Math.round(budgetValue / (95 + budgetValue / 5000)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* 이번 주 할 일 탭 */}
          <TabsContent value="actions">
            <Card className="glass border-border/40 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold">이번 주 우선순위 액션</h3>
                  <p className="text-sm text-muted-foreground">비용 대비 효과가 가장 높은 순서로 정렬</p>
                </div>
                <Badge className="bg-primary/10 text-primary">
                  <Clock className="w-3 h-3 mr-1" />
                  총 {weeklyActions.reduce((sum, a) => sum + parseFloat(a.effort), 0)}시간
                </Badge>
              </div>

              <div className="space-y-4">
                {weeklyActions.map((action, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border/40 hover:border-primary/40 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                      {action.priority}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <action.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{action.action}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-green-600">{action.impact}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{action.effort}</span>
                        <span className="text-muted-foreground">•</span>
                        <Badge variant="outline" className={`text-xs ${
                          action.cost === "무료" ? "bg-green-500/10 text-green-600" : ""
                        }`}>
                          {action.cost}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        if (action.action.includes("릴스") || action.action.includes("블로그") || action.action.includes("캐러셀")) {
                          navigate("/content/generate");
                        } else {
                          navigate("/channels");
                        }
                      }}
                    >
                      시작하기
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="glass border-primary/40 bg-primary/5 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-2">이번 주 목표</h4>
                  <p className="text-muted-foreground mb-4">
                    위 액션들을 모두 완료하면 예상 결과:
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-background/50">
                      <p className="text-xs text-muted-foreground">예상 도달 증가</p>
                      <p className="text-lg font-bold text-green-600">+35%</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50">
                      <p className="text-xs text-muted-foreground">예상 전환 증가</p>
                      <p className="text-lg font-bold text-green-600">+25건</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50">
                      <p className="text-xs text-muted-foreground">절감 비용</p>
                      <p className="text-lg font-bold text-green-600">₩120,000</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Analytics;
