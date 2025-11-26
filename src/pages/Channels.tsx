import { useState, useEffect } from "react";
import { ArrowLeft, Network, AlertCircle, CheckCircle2, Cloud, Copy, Zap, PenTool, Globe, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Instagram, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import Navigation from "@/components/Navigation";
import ChannelCard from "@/components/ChannelCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

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
  category: "social" | "blog" | "copy-only";
  note?: string;
}

const Channels = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const connectedCount = channels.filter((c) => c.isConnected).length;
  const totalCount = channels.length;

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
          <div className="glass border-border/40 rounded-full px-6 py-3">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-primary" />
              <div className="text-right">
                <div className="text-sm text-muted-foreground">연결된 채널</div>
                <div className="text-xl font-bold text-primary">
                  {connectedCount}/{totalCount}
                </div>
              </div>
            </div>
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

        {/* Connection Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass border-border/40 rounded-xl p-6 animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{connectedCount}</div>
                <div className="text-sm text-muted-foreground">연결된 채널</div>
              </div>
            </div>
          </div>

          <div className="glass border-border/40 rounded-xl p-6 animate-scale-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-3 mb-2">
              <Network className="w-8 h-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{channels.filter(c => c.category !== "copy-only").length}</div>
                <div className="text-sm text-muted-foreground">자동 발행 채널</div>
              </div>
            </div>
          </div>

          <div className="glass border-border/40 rounded-xl p-6 animate-scale-in" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-3 mb-2">
              <Copy className="w-8 h-8 text-secondary" />
              <div>
                <div className="text-2xl font-bold">{channels.filter(c => c.category === "copy-only").length}</div>
                <div className="text-sm text-muted-foreground">복사+직접 게시</div>
              </div>
            </div>
          </div>
        </div>

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
              .filter((channel) => channel.category === "copy-only")
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
      </main>
    </div>
  );
};

export default Channels;
