import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Eye, MousePointerClick, Users, Heart, ExternalLink, TrendingUp, Zap, Edit3, Save, X, Sparkles, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TrendChart from "@/components/TrendChart";
import { useContent } from "@/contexts/ContentContext";
import { useToast } from "@/hooks/use-toast";

const ContentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { contents, updateContent } = useContent();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");

  const content = contents.find((c) => c.id === id);

  // Initialize edited content when content loads
  useEffect(() => {
    if (content?.generatedContent) {
      setEditedContent(content.generatedContent);
    }
  }, [content?.generatedContent]);

  const handleSave = () => {
    if (!id) return;
    
    updateContent(id, { generatedContent: editedContent });
    setIsEditing(false);
    toast({
      title: "저장 완료",
      description: "콘텐츠가 성공적으로 업데이트되었습니다.",
    });
  };

  const handleCancel = () => {
    setEditedContent(content?.generatedContent || "");
    setIsEditing(false);
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || !id) return;

    setIsGeneratingImage(true);
    // UI only - 실제 이미지 생성 기능은 구현 예정
    setTimeout(() => {
      setIsGeneratingImage(false);
      toast({
        title: "이미지 생성 기능",
        description: "이미지 생성 기능은 곧 구현될 예정입니다.",
      });
    }, 1500);
  };

  if (!content) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">콘텐츠를 찾을 수 없습니다</h2>
          <Button onClick={() => navigate("/content")}>콘텐츠 목록으로</Button>
        </div>
      </div>
    );
  }

  const typeLabels: Record<string, string> = {
    instagram: "인스타그램",
    facebook: "페이스북",
    twitter: "트위터",
    linkedin: "LinkedIn",
    tiktok: "TikTok",
    email: "이메일",
    blog: "블로그",
    "google-ads": "구글 광고",
    "naver-ads": "네이버 광고",
    video: "비디오",
  };

  const typeColors: Record<string, string> = {
    instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
    facebook: "bg-blue-600",
    twitter: "bg-sky-500",
    linkedin: "bg-blue-700",
    tiktok: "bg-black",
    email: "bg-indigo-600",
    blog: "bg-emerald-600",
    "google-ads": "bg-green-600",
    "naver-ads": "bg-green-700",
    video: "bg-red-600",
  };

  const statusLabels: Record<string, string> = {
    draft: "초안",
    published: "게시됨",
    scheduled: "예약됨",
  };

  const statusColors: Record<string, string> = {
    draft: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    published: "bg-green-500/10 text-green-500 border-green-500/20",
    scheduled: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  };

  // Mock campaign data
  const usedInCampaigns = [
    { id: "1", name: "여름 세일 캠페인", status: "활성" as const },
    { id: "2", name: "신제품 런칭", status: "완료" as const },
  ];

  // Mock performance data over time
  const trendData = [
    { date: "1일", views: 2400, clicks: 120, conversions: 12 },
    { date: "2일", views: 3200, clicks: 160, conversions: 16 },
    { date: "3일", views: 4100, clicks: 205, conversions: 21 },
    { date: "4일", views: 5500, clicks: 275, conversions: 28 },
    { date: "5일", views: 6800, clicks: 340, conversions: 34 },
    { date: "6일", views: 8200, clicks: 410, conversions: 41 },
    { date: "7일", views: 9500, clicks: 475, conversions: 48 },
  ];

  // Channel breakdown
  const channelPerformance = [
    { channel: "Instagram", views: 45000, clicks: 2250, engagement: "5.0%", color: "from-purple-500 to-pink-500" },
    { channel: "Facebook", views: 32000, clicks: 1600, engagement: "5.0%", color: "from-blue-600 to-blue-500" },
    { channel: "Twitter", views: 18000, clicks: 900, engagement: "5.0%", color: "from-sky-500 to-sky-400" },
  ];

  const performanceMetrics = [
    { title: "총 노출", value: content.performance.views.toLocaleString(), icon: Eye, color: "text-primary" },
    { title: "클릭", value: content.performance.clicks.toLocaleString(), icon: MousePointerClick, color: "text-secondary" },
    { title: "참여율", value: `${content.performance.engagement}%`, icon: Heart, color: "text-accent" },
    { title: "전환", value: content.performance.conversions.toLocaleString(), icon: Users, color: "text-purple-400" },
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
          <div className="flex items-start gap-4 mb-6">
            <button
              onClick={() => navigate("/content")}
              className="glass border-border/40 hover:border-primary/40 rounded-lg p-2 transition-all mt-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-5xl">{content.thumbnail}</div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">{content.title}</h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={`${typeColors[content.type]} text-white border-0`}>
                      {typeLabels[content.type]}
                    </Badge>
                    <Badge className={`${statusColors[content.status]} border`}>
                      {statusLabels[content.status]}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {content.createdAt.toLocaleDateString("ko-KR")}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-lg">{content.description}</p>
              {content.targetUrl && (
                <a
                  href={content.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  랜딩 페이지 보기
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Media Section */}
        {(content?.mediaUrl || content?.type === "video" || content?.type === "instagram" || content?.type === "google-ads") && (
          <Card className="glass border-border/40 p-8 mb-8 animate-scale-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">미디어</h2>
              <div className="flex gap-2">
                <Button
                  onClick={() => setImagePrompt(content?.description || "")}
                  variant="outline"
                  className="glass border-border/40"
                  size="sm"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI 이미지 재생성
                </Button>
              </div>
            </div>

            {content?.mediaUrl ? (
              <div className="relative rounded-lg overflow-hidden bg-background/50 border border-border/40">
                {content.type === "video" ? (
                  <video
                    src={content.mediaUrl}
                    controls
                    className="w-full h-auto max-h-[600px] object-contain"
                  >
                    브라우저가 비디오 재생을 지원하지 않습니다.
                  </video>
                ) : (
                  <img
                    src={content.mediaUrl}
                    alt={content.title}
                    className="w-full h-auto max-h-[600px] object-contain"
                  />
                )}
              </div>
            ) : (
              <div className="glass border border-border/40 rounded-lg p-8 text-center">
                <p className="text-muted-foreground mb-4">아직 생성된 이미지가 없습니다</p>
                <div className="max-w-xl mx-auto space-y-4">
                  <div>
                    <Label htmlFor="imagePrompt" className="text-left block mb-2">
                      이미지 생성 프롬프트
                    </Label>
                    <Textarea
                      id="imagePrompt"
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder="생성할 이미지를 설명해주세요... (예: 여름 해변에서 석양을 즐기는 사람들)"
                      className="glass border-border/40 min-h-[100px]"
                    />
                  </div>
                  <Button
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage || !imagePrompt.trim()}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        생성 중...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        이미지 생성하기
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {content?.mediaUrl && (
              <div className="mt-4 p-4 glass border border-border/40 rounded-lg">
                <Label htmlFor="regeneratePrompt" className="block mb-2">
                  이미지 재생성
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="regeneratePrompt"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="새로운 이미지 프롬프트..."
                    className="glass border-border/40"
                  />
                  <Button
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage || !imagePrompt.trim()}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
                  >
                    {isGeneratingImage ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Content Body */}
        <Card className="glass border-border/40 p-8 mb-8 animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">콘텐츠 본문</h2>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="glass border-border/40"
                    size="sm"
                  >
                    <X className="w-4 h-4 mr-2" />
                    취소
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
                    size="sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    저장
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="glass border-border/40"
                  size="sm"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  편집
                </Button>
              )}
            </div>
          </div>
          
          {isEditing ? (
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="glass border-border/40 min-h-[300px] text-base leading-relaxed"
              placeholder="콘텐츠 내용을 입력하세요..."
            />
          ) : (
            <div className="glass border border-border/40 rounded-lg p-6 bg-background/50">
              {content?.generatedContent ? (
                <pre className="whitespace-pre-wrap text-base leading-relaxed font-sans">
                  {content.generatedContent}
                </pre>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>생성된 콘텐츠가 없습니다</p>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="mt-4 glass border-border/40"
                    size="sm"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    콘텐츠 작성하기
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-scale-in" style={{ animationDelay: "0.3s" }}>
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

        {/* Performance Chart */}
        <Card className="glass border-border/40 p-6 mb-8 animate-scale-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">성과 추이</h3>
              <p className="text-sm text-muted-foreground">최근 7일간의 성과 변화</p>
            </div>
          </div>
          <TrendChart data={trendData} />
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Channel Performance */}
          <Card className="glass border-border/40 p-6 animate-scale-in" style={{ animationDelay: "0.45s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
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

          {/* Used in Campaigns */}
          <Card className="glass border-border/40 p-6 animate-scale-in" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">사용 중인 캠페인</h3>
                <p className="text-sm text-muted-foreground">이 콘텐츠가 포함된 캠페인</p>
              </div>
            </div>
            <div className="space-y-3">
              {usedInCampaigns.length > 0 ? (
                usedInCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    onClick={() => navigate(`/campaigns/${campaign.id}`)}
                    className="glass border border-border/40 rounded-lg p-4 hover:border-primary/40 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{campaign.name}</h4>
                      <Badge
                        className={
                          campaign.status === "활성"
                            ? "bg-green-500/10 text-green-500 border-green-500/20 border"
                            : "bg-blue-500/10 text-blue-500 border-blue-500/20 border"
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">아직 캠페인에 사용되지 않았습니다</p>
                  <Button
                    onClick={() => navigate("/campaigns")}
                    variant="outline"
                    className="mt-4 glass border-border/40"
                    size="sm"
                  >
                    캠페인 만들기
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ContentDetail;
