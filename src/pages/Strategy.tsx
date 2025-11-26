import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Lightbulb,
  Target,
  Users,
  TrendingUp,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  MessageCircle,
  Globe,
  PenTool,
  BarChart3,
  Zap,
  DollarSign,
  Clock,
  Star,
} from "lucide-react";

const Strategy = () => {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    businessDescription: "",
    targetAudience: "",
    currentChannels: [] as string[],
    budget: "",
    goals: "",
    competitors: "",
  });

  const industries = [
    "테크/IT",
    "이커머스/쇼핑몰",
    "F&B/음식점",
    "뷰티/화장품",
    "패션/의류",
    "교육/학원",
    "건강/피트니스",
    "부동산",
    "금융/보험",
    "여행/관광",
    "기타",
  ];

  const channels = [
    { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-500" },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-600" },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "text-blue-500" },
    { id: "youtube", name: "YouTube", icon: Youtube, color: "text-red-500" },
    { id: "threads", name: "Threads", icon: MessageCircle, color: "text-foreground" },
    { id: "tiktok", name: "TikTok", icon: Zap, color: "text-cyan-500" },
    { id: "blog", name: "블로그", icon: PenTool, color: "text-green-500" },
    { id: "website", name: "웹사이트", icon: Globe, color: "text-purple-500" },
  ];

  const handleChannelToggle = (channelId: string) => {
    setFormData((prev) => ({
      ...prev,
      currentChannels: prev.currentChannels.includes(channelId)
        ? prev.currentChannels.filter((c) => c !== channelId)
        : [...prev.currentChannels, channelId],
    }));
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  // Mock AI recommendations
  const recommendations = {
    priorityChannels: [
      {
        channel: "Instagram",
        icon: Instagram,
        color: "text-pink-500",
        score: 92,
        reason: "타겟 오디언스의 73%가 활동하는 플랫폼",
        actions: ["릴스 콘텐츠 주 3회", "스토리 일 2회", "피드 주 2회"],
      },
      {
        channel: "LinkedIn",
        icon: Linkedin,
        color: "text-blue-500",
        score: 85,
        reason: "B2B 리드 생성에 최적화",
        actions: ["업계 인사이트 주 2회", "케이스 스터디 월 2회", "네트워킹 콘텐츠"],
      },
      {
        channel: "블로그 (WordPress)",
        icon: PenTool,
        color: "text-green-500",
        score: 78,
        reason: "SEO 장기 자산 구축 및 전문성 확보",
        actions: ["키워드 중심 글 주 1회", "가이드/튜토리얼", "고객 사례"],
      },
    ],
    contentStrategy: [
      {
        type: "교육 콘텐츠",
        percentage: 40,
        description: "업계 트렌드, 팁, 가이드",
        color: "bg-blue-500",
      },
      {
        type: "참여 콘텐츠",
        percentage: 30,
        description: "Q&A, 투표, 비하인드 스토리",
        color: "bg-purple-500",
      },
      {
        type: "프로모션",
        percentage: 20,
        description: "제품/서비스 소개, 이벤트",
        color: "bg-green-500",
      },
      {
        type: "사회적 증거",
        percentage: 10,
        description: "고객 후기, 케이스 스터디",
        color: "bg-orange-500",
      },
    ],
    weeklyCalendar: [
      { day: "월", content: "업계 뉴스/트렌드", channel: "LinkedIn" },
      { day: "화", content: "교육 릴스", channel: "Instagram" },
      { day: "수", content: "블로그 포스트", channel: "WordPress" },
      { day: "목", content: "비하인드 스토리", channel: "Instagram" },
      { day: "금", content: "주간 인사이트", channel: "LinkedIn" },
      { day: "토", content: "참여형 콘텐츠", channel: "Instagram" },
      { day: "일", content: "휴식/리서치", channel: "-" },
    ],
    metrics: {
      expectedReach: "15,000+",
      expectedEngagement: "4.5%",
      estimatedGrowth: "+25%/월",
      roiProjection: "3배",
    },
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "1s" }} />

      <Navigation />

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Lightbulb className="w-10 h-10 text-primary" />
            AI 마케팅 전략 어드바이저
          </h1>
          <p className="text-muted-foreground text-lg">
            비즈니스 정보를 입력하면 AI가 맞춤 오가닉 마케팅 전략을 제안합니다
          </p>
        </div>

        {!analysisComplete ? (
          <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      step >= s
                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-24 md:w-32 h-1 mx-2 rounded-full ${
                        step > s ? "bg-gradient-to-r from-primary to-secondary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="glass border-border/40 rounded-xl p-8 animate-scale-in">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <Target className="w-12 h-12 text-primary mx-auto mb-3" />
                    <h2 className="text-2xl font-bold mb-2">비즈니스 정보</h2>
                    <p className="text-muted-foreground">기본적인 비즈니스 정보를 알려주세요</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">비즈니스/브랜드명</Label>
                      <Input
                        id="businessName"
                        placeholder="예: 에이베리 스튜디오"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">업종</Label>
                      <Select
                        value={formData.industry}
                        onValueChange={(value) => setFormData({ ...formData, industry: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="업종을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessDescription">비즈니스 설명</Label>
                    <Textarea
                      id="businessDescription"
                      placeholder="주요 제품/서비스, 차별점, 브랜드 가치 등을 설명해주세요"
                      rows={4}
                      value={formData.businessDescription}
                      onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">타겟 고객</Label>
                    <Textarea
                      id="targetAudience"
                      placeholder="예: 20-35세 여성, 서울/수도권 거주, 자기계발과 라이프스타일에 관심"
                      rows={3}
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    />
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    onClick={() => setStep(2)}
                  >
                    다음 단계
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <Users className="w-12 h-12 text-secondary mx-auto mb-3" />
                    <h2 className="text-2xl font-bold mb-2">현재 채널 & 목표</h2>
                    <p className="text-muted-foreground">현재 사용 중인 채널과 마케팅 목표를 알려주세요</p>
                  </div>

                  <div className="space-y-4">
                    <Label>현재 사용 중인 마케팅 채널</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {channels.map((channel) => (
                        <button
                          key={channel.id}
                          type="button"
                          onClick={() => handleChannelToggle(channel.id)}
                          className={`p-4 rounded-lg border transition-all ${
                            formData.currentChannels.includes(channel.id)
                              ? "border-primary bg-primary/10"
                              : "border-border/40 hover:border-primary/40"
                          }`}
                        >
                          <channel.icon className={`w-6 h-6 mx-auto mb-2 ${channel.color}`} />
                          <span className="text-sm font-medium">{channel.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">월 마케팅 예산 (선택)</Label>
                    <Select
                      value={formData.budget}
                      onValueChange={(value) => setFormData({ ...formData, budget: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="예산 범위를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">무료 (오가닉만)</SelectItem>
                        <SelectItem value="50">~50만원</SelectItem>
                        <SelectItem value="100">50~100만원</SelectItem>
                        <SelectItem value="300">100~300만원</SelectItem>
                        <SelectItem value="500">300~500만원</SelectItem>
                        <SelectItem value="1000">500만원 이상</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goals">마케팅 목표</Label>
                    <Textarea
                      id="goals"
                      placeholder="예: 브랜드 인지도 향상, 리드 생성, 매출 증가, 커뮤니티 구축 등"
                      rows={3}
                      value={formData.goals}
                      onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      이전
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      onClick={() => setStep(3)}
                    >
                      다음 단계
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <BarChart3 className="w-12 h-12 text-accent mx-auto mb-3" />
                    <h2 className="text-2xl font-bold mb-2">경쟁사 분석 (선택)</h2>
                    <p className="text-muted-foreground">경쟁사 정보를 입력하면 더 정확한 전략을 제안합니다</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="competitors">주요 경쟁사</Label>
                    <Textarea
                      id="competitors"
                      placeholder="경쟁사 이름, 웹사이트, SNS 계정 등을 입력하세요 (각 줄에 하나씩)"
                      rows={4}
                      value={formData.competitors}
                      onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium mb-1">AI가 분석할 내용</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• 비즈니스에 최적화된 마케팅 채널 추천</li>
                          <li>• 콘텐츠 유형 및 주제 제안</li>
                          <li>• 주간 콘텐츠 캘린더 생성</li>
                          <li>• 예상 성과 및 ROI 분석</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                      이전
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                          AI 분석 중...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          AI 전략 분석 시작
                        </>
                      )}
                    </Button>
                  </div>

                  {isAnalyzing && (
                    <div className="space-y-3">
                      <Progress value={66} className="h-2" />
                      <p className="text-sm text-center text-muted-foreground">
                        비즈니스 정보를 분석하고 최적의 마케팅 전략을 수립하고 있습니다...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Analysis Results */
          <div className="space-y-8">
            {/* Summary Header */}
            <div className="glass border-border/40 rounded-xl p-6 animate-scale-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">AI 마케팅 전략 리포트</h2>
                  <p className="text-muted-foreground">{formData.businessName || "귀하의 비즈니스"}를 위한 맞춤 전략</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <TrendingUp className="w-5 h-5 text-green-500 mb-2" />
                  <p className="text-2xl font-bold">{recommendations.metrics.expectedReach}</p>
                  <p className="text-xs text-muted-foreground">예상 월간 도달</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Users className="w-5 h-5 text-blue-500 mb-2" />
                  <p className="text-2xl font-bold">{recommendations.metrics.expectedEngagement}</p>
                  <p className="text-xs text-muted-foreground">예상 참여율</p>
                </div>
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <BarChart3 className="w-5 h-5 text-purple-500 mb-2" />
                  <p className="text-2xl font-bold">{recommendations.metrics.estimatedGrowth}</p>
                  <p className="text-xs text-muted-foreground">예상 성장률</p>
                </div>
                <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <DollarSign className="w-5 h-5 text-orange-500 mb-2" />
                  <p className="text-2xl font-bold">{recommendations.metrics.roiProjection}</p>
                  <p className="text-xs text-muted-foreground">예상 ROI</p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="channels" className="animate-fade-in">
              <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
                <TabsTrigger value="channels">추천 채널</TabsTrigger>
                <TabsTrigger value="content">콘텐츠 전략</TabsTrigger>
                <TabsTrigger value="calendar">주간 캘린더</TabsTrigger>
              </TabsList>

              <TabsContent value="channels" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendations.priorityChannels.map((channel, index) => (
                    <div
                      key={channel.channel}
                      className="glass border-border/40 rounded-xl p-6 animate-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <channel.icon className={`w-8 h-8 ${channel.color}`} />
                          <div>
                            <h3 className="font-bold">{channel.channel}</h3>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm font-medium">{channel.score}점</span>
                            </div>
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                          #{index + 1}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4">{channel.reason}</p>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">추천 활동:</p>
                        {channel.actions.map((action, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="content" className="mt-6">
                <div className="glass border-border/40 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-6">콘텐츠 믹스 전략</h3>
                  <div className="space-y-4">
                    {recommendations.contentStrategy.map((content) => (
                      <div key={content.type} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{content.type}</span>
                          <span className="text-sm text-muted-foreground">{content.percentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${content.color}`}
                            style={{ width: `${content.percentage}%` }}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">{content.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="calendar" className="mt-6">
                <div className="glass border-border/40 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    주간 콘텐츠 캘린더
                  </h3>
                  <div className="grid grid-cols-7 gap-3">
                    {recommendations.weeklyCalendar.map((day) => (
                      <div
                        key={day.day}
                        className={`p-4 rounded-lg border ${
                          day.channel === "-"
                            ? "bg-muted/20 border-border/20"
                            : "bg-primary/5 border-primary/20"
                        }`}
                      >
                        <p className="font-bold text-center mb-2">{day.day}</p>
                        <p className="text-xs text-center mb-1">{day.content}</p>
                        <p className="text-xs text-center text-muted-foreground">{day.channel}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setAnalysisComplete(false);
                  setStep(1);
                }}
              >
                새 분석 시작
              </Button>
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                <PenTool className="w-4 h-4 mr-2" />
                이 전략으로 콘텐츠 생성하기
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Strategy;
