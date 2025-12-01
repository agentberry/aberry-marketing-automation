import { useState, useEffect } from "react";
import { ArrowLeft, AlertCircle, Cloud, Copy, Zap, PenTool, Globe, MessageCircle, Plus, Search, CheckCircle2, XCircle, Loader2, HelpCircle, ExternalLink, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Instagram, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import Navigation from "@/components/Navigation";
import ChannelCard from "@/components/ChannelCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Channel {
  id: string;
  name: string;
  icon: any;
  color: string;
  isConnected: boolean;
  requiresApiKey: boolean;
  followers?: number;
  posts?: number;
  engagement?: string;
  category: "social" | "blog" | "copy-only" | "custom";
  note?: string;
  isCustom?: boolean;
  apiStatus?: "checking" | "supported" | "limited" | "unsupported";
  integrationMethod?: string;
}

// 알려진 플랫폼 API 지원 정보 데이터베이스
const knownPlatformInfo: Record<string, {
  apiSupport: "supported" | "limited" | "unsupported";
  integrationMethod: string;
  note: string;
  category: "social" | "blog" | "copy-only";
  color: string;
}> = {
  pinterest: {
    apiSupport: "supported",
    integrationMethod: "OAuth 2.0",
    note: "비즈니스 계정 필요",
    category: "social",
    color: "text-red-600",
  },
  reddit: {
    apiSupport: "limited",
    integrationMethod: "OAuth 2.0",
    note: "읽기 전용, 직접 게시 권장",
    category: "copy-only",
    color: "text-orange-500",
  },
  tumblr: {
    apiSupport: "supported",
    integrationMethod: "OAuth 1.0a",
    note: "자동 발행 가능",
    category: "blog",
    color: "text-blue-800",
  },
  snapchat: {
    apiSupport: "limited",
    integrationMethod: "Snap Kit",
    note: "비즈니스 계정 필요, 광고만 지원",
    category: "copy-only",
    color: "text-yellow-400",
  },
  twitch: {
    apiSupport: "supported",
    integrationMethod: "OAuth 2.0",
    note: "스트리밍 알림, 클립 공유 가능",
    category: "social",
    color: "text-purple-500",
  },
  discord: {
    apiSupport: "supported",
    integrationMethod: "Webhook / Bot",
    note: "서버 웹훅으로 자동 발행",
    category: "social",
    color: "text-indigo-500",
  },
  slack: {
    apiSupport: "supported",
    integrationMethod: "Webhook / OAuth",
    note: "웹훅으로 채널에 자동 발행",
    category: "social",
    color: "text-purple-600",
  },
  telegram: {
    apiSupport: "supported",
    integrationMethod: "Bot API",
    note: "봇 토큰으로 채널/그룹 자동 발행",
    category: "social",
    color: "text-blue-400",
  },
  whatsapp: {
    apiSupport: "limited",
    integrationMethod: "Cloud API",
    note: "비즈니스 API 필요, 승인 과정 복잡",
    category: "copy-only",
    color: "text-green-500",
  },
  kakao: {
    apiSupport: "limited",
    integrationMethod: "Kakao API",
    note: "카카오톡 채널 발행, 심사 필요",
    category: "copy-only",
    color: "text-yellow-500",
  },
  brunch: {
    apiSupport: "unsupported",
    integrationMethod: "없음",
    note: "공식 API 없음, 복사+직접 게시만",
    category: "copy-only",
    color: "text-emerald-600",
  },
  velog: {
    apiSupport: "unsupported",
    integrationMethod: "없음",
    note: "공식 API 없음, 복사+직접 게시만",
    category: "copy-only",
    color: "text-teal-500",
  },
  notion: {
    apiSupport: "supported",
    integrationMethod: "OAuth / API Key",
    note: "페이지 생성/수정 가능",
    category: "blog",
    color: "text-gray-800",
  },
  ghost: {
    apiSupport: "supported",
    integrationMethod: "API Key",
    note: "자동 발행 가능",
    category: "blog",
    color: "text-slate-700",
  },
  substack: {
    apiSupport: "unsupported",
    integrationMethod: "없음",
    note: "공식 API 없음, 복사+직접 게시만",
    category: "copy-only",
    color: "text-orange-600",
  },
  shopify: {
    apiSupport: "supported",
    integrationMethod: "REST / GraphQL API",
    note: "블로그 포스트 자동 발행 가능",
    category: "blog",
    color: "text-green-600",
  },
  wix: {
    apiSupport: "limited",
    integrationMethod: "Velo API",
    note: "Velo 개발 필요, 제한적",
    category: "copy-only",
    color: "text-black",
  },
  squarespace: {
    apiSupport: "unsupported",
    integrationMethod: "없음",
    note: "공식 API 없음",
    category: "copy-only",
    color: "text-gray-900",
  },
  blogger: {
    apiSupport: "supported",
    integrationMethod: "Google API",
    note: "자동 발행 가능",
    category: "blog",
    color: "text-orange-500",
  },
};

const Channels = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // 커스텀 채널 추가 모달 상태
  const [addChannelOpen, setAddChannelOpen] = useState(false);
  const [customChannelInput, setCustomChannelInput] = useState("");
  const [isCheckingApi, setIsCheckingApi] = useState(false);
  const [apiCheckResult, setApiCheckResult] = useState<{
    name: string;
    apiSupport: "supported" | "limited" | "unsupported" | "unknown";
    integrationMethod: string;
    note: string;
    category: "social" | "blog" | "copy-only";
    color: string;
  } | null>(null);

  const [channels, setChannels] = useState<Channel[]>([
    // Phase 1: 즉시 연동 가능
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      color: "text-blue-500",
      isConnected: false,
      requiresApiKey: false,
      category: "social",
    },
    {
      id: "wordpress",
      name: "WordPress",
      icon: Globe,
      color: "text-blue-400",
      isConnected: false,
      requiresApiKey: true,
      category: "blog",
    },
    {
      id: "medium",
      name: "Medium",
      icon: PenTool,
      color: "text-foreground",
      isConnected: false,
      requiresApiKey: true,
      category: "blog",
      note: "API 유지보수 모드",
    },
    // Phase 2: Meta 앱 검토 필요
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "text-pink-500",
      isConnected: true,
      requiresApiKey: false,
      followers: 15420,
      posts: 248,
      engagement: "4.2%",
      category: "social",
      note: "Meta 앱 검토 필요",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "text-blue-600",
      isConnected: true,
      requiresApiKey: false,
      followers: 8930,
      posts: 186,
      engagement: "3.8%",
      category: "social",
      note: "Meta 앱 검토 필요",
    },
    {
      id: "threads",
      name: "Threads",
      icon: MessageCircle,
      color: "text-foreground",
      isConnected: false,
      requiresApiKey: false,
      category: "social",
      note: "Meta 앱 검토 필요",
    },
    // Phase 3: TikTok, YouTube
    {
      id: "tiktok",
      name: "TikTok",
      icon: Zap,
      color: "text-cyan-500",
      isConnected: false,
      requiresApiKey: false,
      category: "social",
      note: "앱 감사 전 비공개 모드",
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: Youtube,
      color: "text-red-500",
      isConnected: false,
      requiresApiKey: false,
      category: "social",
      note: "분석만 지원",
    },
    // Phase 4: 복사+직접 게시만
    {
      id: "twitter",
      name: "X (Twitter)",
      icon: Twitter,
      color: "text-foreground",
      isConnected: false,
      requiresApiKey: false,
      category: "copy-only",
      note: "API 유료화 - 복사+직접 게시",
    },
    {
      id: "tistory",
      name: "티스토리",
      icon: PenTool,
      color: "text-orange-500",
      isConnected: false,
      requiresApiKey: false,
      category: "copy-only",
      note: "API 종료 - 복사+직접 게시",
    },
    {
      id: "naver",
      name: "네이버 블로그",
      icon: PenTool,
      color: "text-green-500",
      isConnected: false,
      requiresApiKey: false,
      category: "copy-only",
      note: "정책 위반 - 복사+직접 게시",
    },
  ]);


  // Load connection status from localStorage
  useEffect(() => {
    const savedConnections = localStorage.getItem("channelConnections");
    if (savedConnections) {
      try {
        const connections = JSON.parse(savedConnections);
        setChannels((prev) =>
          prev.map((channel) => ({
            ...channel,
            isConnected: connections[channel.id] || channel.isConnected,
          }))
        );
      } catch (error) {
        console.error("Failed to load channel connections:", error);
      }
    }
  }, []);

  const saveConnections = (updatedChannels: Channel[]) => {
    const connections = updatedChannels.reduce((acc, channel) => {
      acc[channel.id] = channel.isConnected;
      return acc;
    }, {} as Record<string, boolean>);
    localStorage.setItem("channelConnections", JSON.stringify(connections));
  };

  const handleConnect = (id: string) => {
    const channel = channels.find((c) => c.id === id);
    
    // Simulate OAuth flow
    toast({
      title: "연결 중...",
      description: `${channel?.name} OAuth 인증 창이 열립니다.`,
    });

    // Simulate successful connection after 1 second
    setTimeout(() => {
      const updatedChannels = channels.map((c) =>
        c.id === id
          ? {
              ...c,
              isConnected: true,
              followers: Math.floor(Math.random() * 20000) + 5000,
              posts: Math.floor(Math.random() * 300) + 50,
              engagement: `${(Math.random() * 5 + 2).toFixed(1)}%`,
            }
          : c
      );
      setChannels(updatedChannels);
      saveConnections(updatedChannels);

      toast({
        title: "연결 완료",
        description: `${channel?.name}이(가) 성공적으로 연결되었습니다.`,
      });
    }, 1000);
  };

  const handleDisconnect = (id: string) => {
    const channel = channels.find((c) => c.id === id);
    const updatedChannels = channels.map((c) =>
      c.id === id
        ? { ...c, isConnected: false, followers: undefined, posts: undefined, engagement: undefined }
        : c
    );
    setChannels(updatedChannels);
    saveConnections(updatedChannels);

    toast({
      title: "연결 해제",
      description: `${channel?.name} 연결이 해제되었습니다.`,
    });
  };

  const handleSaveApiKey = (id: string, apiKey: string) => {
    // Save API key to localStorage (in production, this should be in Supabase secrets)
    localStorage.setItem(`${id}_api_key`, apiKey);

    const channel = channels.find((c) => c.id === id);
    const updatedChannels = channels.map((c) =>
      c.id === id
        ? {
            ...c,
            isConnected: true,
            followers: Math.floor(Math.random() * 10000) + 1000,
            posts: Math.floor(Math.random() * 200) + 20,
            engagement: `${(Math.random() * 10 + 5).toFixed(1)}%`,
          }
        : c
    );
    setChannels(updatedChannels);
    saveConnections(updatedChannels);

    toast({
      title: "API 키 저장 완료",
      description: `${channel?.name}이(가) 성공적으로 연결되었습니다.`,
    });
  };

  // 채널명으로 API 지원 여부 확인
  const checkChannelApiSupport = (channelName: string) => {
    setIsCheckingApi(true);
    setApiCheckResult(null);

    // 입력된 이름을 정규화 (소문자, 공백 제거)
    const normalizedName = channelName.toLowerCase().trim().replace(/\s+/g, '');

    // 시뮬레이션: 1.5초 후 결과 반환
    setTimeout(() => {
      // 알려진 플랫폼인지 확인
      const knownPlatform = Object.entries(knownPlatformInfo).find(([key]) =>
        normalizedName.includes(key) || key.includes(normalizedName)
      );

      if (knownPlatform) {
        const [, info] = knownPlatform;
        setApiCheckResult({
          name: channelName,
          apiSupport: info.apiSupport,
          integrationMethod: info.integrationMethod,
          note: info.note,
          category: info.category,
          color: info.color,
        });
      } else {
        // 알려지지 않은 플랫폼
        setApiCheckResult({
          name: channelName,
          apiSupport: "unknown",
          integrationMethod: "확인 필요",
          note: "공식 API 문서를 확인하거나, 복사+직접 게시 방식을 사용하세요",
          category: "copy-only",
          color: "text-gray-500",
        });
      }
      setIsCheckingApi(false);
    }, 1500);
  };

  // 커스텀 채널 추가
  const addCustomChannel = () => {
    if (!apiCheckResult) return;

    const newChannel: Channel = {
      id: `custom-${Date.now()}`,
      name: apiCheckResult.name,
      icon: Globe, // 기본 아이콘
      color: apiCheckResult.color,
      isConnected: false,
      requiresApiKey: apiCheckResult.apiSupport === "supported",
      category: apiCheckResult.category,
      note: apiCheckResult.note,
      isCustom: true,
      apiStatus: apiCheckResult.apiSupport === "unknown" ? "checking" : apiCheckResult.apiSupport,
      integrationMethod: apiCheckResult.integrationMethod,
    };

    setChannels([...channels, newChannel]);

    toast({
      title: "채널 추가 완료",
      description: `${apiCheckResult.name}이(가) 채널 목록에 추가되었습니다.`,
    });

    // 모달 초기화
    setAddChannelOpen(false);
    setCustomChannelInput("");
    setApiCheckResult(null);
  };

  // 커스텀 채널 삭제
  const removeCustomChannel = (id: string) => {
    setChannels(channels.filter(c => c.id !== id));
    toast({
      title: "채널 삭제",
      description: "커스텀 채널이 삭제되었습니다.",
    });
  };

  // 커스텀 채널 필터
  const customChannels = channels.filter(c => c.isCustom);

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
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">채널 연결 관리</h1>
            <p className="text-muted-foreground">마케팅 채널을 연결하고 통합 관리하세요</p>
          </div>
        </div>

        {/* Security Alert */}
        <Alert className="glass border-border/40 mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-start justify-between gap-4">
              <div>
                <strong className="block mb-1">보안 알림</strong>
                <span className="text-sm">
                  현재 API 키는 브라우저에 임시 저장됩니다. 프로덕션 환경에서는 Lovable Cloud를 연결하여 
                  Supabase Secrets에 안전하게 저장하는 것을 강력히 권장합니다.
                </span>
              </div>
              <Cloud className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            </div>
          </AlertDescription>
        </Alert>

        {/* Social Media Channels */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            소셜 미디어 채널
          </h2>
          <p className="text-muted-foreground mb-6">OAuth 인증으로 자동 발행 가능</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {channels
              .filter((channel) => channel.category === "social")
              .map((channel, index) => (
                <div key={channel.id} style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                  <ChannelCard
                    {...channel}
                    onConnect={handleConnect}
                    onDisconnect={handleDisconnect}
                    onSaveApiKey={handleSaveApiKey}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Blog Channels */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 animate-fade-in" style={{ animationDelay: "0.9s" }}>
            블로그 플랫폼
          </h2>
          <p className="text-muted-foreground mb-6">API 키 또는 토큰으로 자동 발행</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {channels
              .filter((channel) => channel.category === "blog")
              .map((channel, index) => (
                <div key={channel.id} style={{ animationDelay: `${1.0 + index * 0.1}s` }}>
                  <ChannelCard
                    {...channel}
                    onConnect={handleConnect}
                    onDisconnect={handleDisconnect}
                    onSaveApiKey={handleSaveApiKey}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Copy-Only Channels */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 animate-fade-in" style={{ animationDelay: "1.2s" }}>
            복사 + 직접 게시
          </h2>
          <p className="text-muted-foreground mb-6">API 제한으로 콘텐츠 복사 후 직접 게시가 필요합니다</p>
          <Alert className="glass border-yellow-500/40 mb-6 animate-fade-in" style={{ animationDelay: "1.3s" }}>
            <Copy className="h-4 w-4 text-yellow-500" />
            <AlertDescription>
              <span className="text-sm">
                아래 플랫폼들은 API 정책 제한으로 자동 발행이 불가능합니다.
                콘텐츠 생성 후 클립보드에 복사하여 직접 게시해주세요.
              </span>
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {channels
              .filter((channel) => channel.category === "copy-only" && !channel.isCustom)
              .map((channel, index) => (
                <div key={channel.id} style={{ animationDelay: `${1.4 + index * 0.1}s` }}>
                  <ChannelCard
                    {...channel}
                    onConnect={handleConnect}
                    onDisconnect={handleDisconnect}
                    onSaveApiKey={handleSaveApiKey}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Custom Channels Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 animate-fade-in" style={{ animationDelay: "1.5s" }}>
                내 채널 추가
              </h2>
              <p className="text-muted-foreground">원하는 채널을 직접 추가하고 API 지원 여부를 확인하세요</p>
            </div>
            <Button
              onClick={() => setAddChannelOpen(true)}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              채널 추가
            </Button>
          </div>

          {customChannels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customChannels.map((channel, index) => (
                <div
                  key={channel.id}
                  className="glass border-border/40 rounded-xl p-6 animate-scale-in relative group"
                  style={{ animationDelay: `${1.6 + index * 0.1}s` }}
                >
                  {/* 삭제 버튼 */}
                  <button
                    onClick={() => removeCustomChannel(channel.id)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded-lg"
                  >
                    <XCircle className="w-4 h-4 text-destructive" />
                  </button>

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl glass border-border/40 flex items-center justify-center`}>
                      <channel.icon className={`w-6 h-6 ${channel.color}`} />
                    </div>
                    <div>
                      <h3 className="font-bold">{channel.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`text-xs ${
                            channel.apiStatus === "supported"
                              ? "bg-green-500/10 text-green-600 border-green-500/20"
                              : channel.apiStatus === "limited"
                              ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                              : "bg-gray-500/10 text-gray-600 border-gray-500/20"
                          }`}
                        >
                          {channel.apiStatus === "supported"
                            ? "API 지원"
                            : channel.apiStatus === "limited"
                            ? "제한적 지원"
                            : "수동 게시"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {channel.integrationMethod && (
                    <div className="text-sm text-muted-foreground mb-2">
                      <span className="font-medium">연동 방식:</span> {channel.integrationMethod}
                    </div>
                  )}

                  {channel.note && (
                    <p className="text-xs text-muted-foreground">{channel.note}</p>
                  )}

                  <div className="mt-4">
                    {channel.apiStatus === "supported" ? (
                      <Button size="sm" className="w-full" onClick={() => handleConnect(channel.id)}>
                        연동하기
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="w-full">
                        <Copy className="w-4 h-4 mr-2" />
                        복사+직접 게시
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass border-border/40 border-dashed rounded-xl p-12 text-center animate-fade-in" style={{ animationDelay: "1.6s" }}>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold mb-2">원하는 채널을 추가하세요</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Pinterest, Discord, Telegram 등 다양한 채널을 추가하고<br />
                API 지원 여부를 자동으로 확인할 수 있습니다.
              </p>
              <Button onClick={() => setAddChannelOpen(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                첫 번째 채널 추가
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* 채널 추가 모달 */}
      <Dialog open={addChannelOpen} onOpenChange={setAddChannelOpen}>
        <DialogContent className="max-w-lg glass border-border/40">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              새 채널 추가
            </DialogTitle>
            <DialogDescription>
              추가하고 싶은 채널명이나 플랫폼 이름을 입력하세요. AI가 API 지원 여부를 분석해드립니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* 채널명 입력 */}
            <div className="space-y-2">
              <Label>채널/플랫폼 이름</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="예: Pinterest, Discord, Telegram..."
                  value={customChannelInput}
                  onChange={(e) => setCustomChannelInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customChannelInput.trim()) {
                      checkChannelApiSupport(customChannelInput);
                    }
                  }}
                />
                <Button
                  onClick={() => checkChannelApiSupport(customChannelInput)}
                  disabled={!customChannelInput.trim() || isCheckingApi}
                >
                  {isCheckingApi ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* 분석 중 상태 */}
            {isCheckingApi && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 animate-pulse">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  <div>
                    <p className="font-medium">API 지원 여부 분석 중...</p>
                    <p className="text-sm text-muted-foreground">
                      {customChannelInput}의 공식 API 문서를 확인하고 있습니다
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 분석 결과 */}
            {apiCheckResult && !isCheckingApi && (
              <div className="space-y-4 animate-fade-in">
                <div
                  className={`p-4 rounded-lg border ${
                    apiCheckResult.apiSupport === "supported"
                      ? "bg-green-500/10 border-green-500/20"
                      : apiCheckResult.apiSupport === "limited"
                      ? "bg-yellow-500/10 border-yellow-500/20"
                      : apiCheckResult.apiSupport === "unsupported"
                      ? "bg-red-500/10 border-red-500/20"
                      : "bg-gray-500/10 border-gray-500/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {apiCheckResult.apiSupport === "supported" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    ) : apiCheckResult.apiSupport === "limited" ? (
                      <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    ) : apiCheckResult.apiSupport === "unsupported" ? (
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    ) : (
                      <HelpCircle className="w-5 h-5 text-gray-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold">{apiCheckResult.name}</h4>
                        <Badge
                          className={`text-xs ${
                            apiCheckResult.apiSupport === "supported"
                              ? "bg-green-500/10 text-green-600 border-green-500/20"
                              : apiCheckResult.apiSupport === "limited"
                              ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                              : apiCheckResult.apiSupport === "unsupported"
                              ? "bg-red-500/10 text-red-600 border-red-500/20"
                              : "bg-gray-500/10 text-gray-600 border-gray-500/20"
                          }`}
                        >
                          {apiCheckResult.apiSupport === "supported"
                            ? "자동화 가능"
                            : apiCheckResult.apiSupport === "limited"
                            ? "제한적 지원"
                            : apiCheckResult.apiSupport === "unsupported"
                            ? "API 미지원"
                            : "확인 필요"}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">연동 방식:</span>
                          <span className="font-medium">{apiCheckResult.integrationMethod}</span>
                        </div>
                        <p className="text-muted-foreground">{apiCheckResult.note}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 연동 방식 설명 */}
                <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                    이 채널은 어떻게 사용하나요?
                  </h4>
                  {apiCheckResult.apiSupport === "supported" ? (
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 채널 추가 후 "연동하기" 버튼으로 계정 연결</li>
                      <li>• 연동 완료 후 콘텐츠 자동 발행 가능</li>
                      <li>• 성과 분석 및 예약 발행 지원</li>
                    </ul>
                  ) : apiCheckResult.apiSupport === "limited" ? (
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 일부 기능만 자동화 가능</li>
                      <li>• 비즈니스 계정 또는 추가 승인 필요할 수 있음</li>
                      <li>• 복사+직접 게시 방식 병행 권장</li>
                    </ul>
                  ) : (
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Aberry에서 콘텐츠 생성 후 복사</li>
                      <li>• 해당 플랫폼에서 직접 붙여넣기하여 게시</li>
                      <li>• 채널 추가하면 콘텐츠 복사 시 해당 플랫폼 최적화</li>
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* 액션 버튼 */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setAddChannelOpen(false);
                  setCustomChannelInput("");
                  setApiCheckResult(null);
                }}
              >
                취소
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-primary to-secondary"
                onClick={addCustomChannel}
                disabled={!apiCheckResult}
              >
                <Plus className="w-4 h-4 mr-2" />
                채널 추가
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Channels;
