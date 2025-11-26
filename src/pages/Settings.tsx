import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Bell, Key, Coins, Globe, Palette, Shield, Trash2 } from "lucide-react";
import { toast } from "sonner";
import ApiKeyDialog from "@/components/ApiKeyDialog";

const Settings = () => {
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "사용자",
    email: "user@example.com",
    company: "마케팅 에이전시",
  });

  const [notifications, setNotifications] = useState({
    campaignAlerts: true,
    performanceReports: true,
    budgetWarnings: true,
    weeklyDigest: false,
  });

  const handleSaveProfile = () => {
    toast.success("프로필이 저장되었습니다.");
  };

  const handleSaveNotifications = () => {
    toast.success("알림 설정이 저장되었습니다.");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <Navigation />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold gradient-text">설정</h1>
            <p className="text-muted-foreground">계정 및 애플리케이션 설정을 관리하세요</p>
          </div>

          {/* Profile Settings */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                프로필 설정
              </CardTitle>
              <CardDescription>기본 프로필 정보를 관리하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="glass"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="glass"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">회사명</Label>
                <Input
                  id="company"
                  value={profileData.company}
                  onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                  className="glass"
                />
              </div>
              <Button onClick={handleSaveProfile} className="w-full">
                프로필 저장
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                알림 설정
              </CardTitle>
              <CardDescription>받고 싶은 알림을 선택하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>캠페인 알림</Label>
                  <p className="text-sm text-muted-foreground">캠페인 시작, 종료 알림</p>
                </div>
                <Switch
                  checked={notifications.campaignAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, campaignAlerts: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>성과 리포트</Label>
                  <p className="text-sm text-muted-foreground">일일 성과 요약 리포트</p>
                </div>
                <Switch
                  checked={notifications.performanceReports}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, performanceReports: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>예산 경고</Label>
                  <p className="text-sm text-muted-foreground">예산 80% 소진 시 알림</p>
                </div>
                <Switch
                  checked={notifications.budgetWarnings}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, budgetWarnings: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>주간 요약</Label>
                  <p className="text-sm text-muted-foreground">매주 월요일 성과 요약</p>
                </div>
                <Switch
                  checked={notifications.weeklyDigest}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, weeklyDigest: checked })
                  }
                />
              </div>
              <Button onClick={handleSaveNotifications} className="w-full">
                알림 설정 저장
              </Button>
            </CardContent>
          </Card>

          {/* API Keys */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                API 키 관리
              </CardTitle>
              <CardDescription>AI 서비스 API 키를 관리하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowApiKeyDialog(true)} variant="outline" className="w-full">
                API 키 설정
              </Button>
            </CardContent>
          </Card>

          {/* Credits Info */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                크레딧 정보
              </CardTitle>
              <CardDescription>현재 크레딧 사용량 및 충전</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 glass rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">사용 가능한 크레딧</p>
                  <p className="text-3xl font-bold text-primary">1,000</p>
                </div>
                <Button>크레딧 충전</Button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">이번 달 사용량</span>
                  <span className="font-semibold">2,450 크레딧</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">평균 일일 사용량</span>
                  <span className="font-semibold">82 크레딧</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                환경 설정
              </CardTitle>
              <CardDescription>언어 및 테마 설정</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  언어
                </Label>
                <Select defaultValue="ko">
                  <SelectTrigger id="language" className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ko">한국어</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme">테마</Label>
                <Select defaultValue="dark">
                  <SelectTrigger id="theme" className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">다크 모드</SelectItem>
                    <SelectItem value="light">라이트 모드</SelectItem>
                    <SelectItem value="auto">시스템 설정</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                보안
              </CardTitle>
              <CardDescription>비밀번호 및 계정 보안 설정</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                비밀번호 변경
              </Button>
              <Button variant="outline" className="w-full">
                2단계 인증 설정
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="glass border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="w-5 h-5" />
                위험 구역
              </CardTitle>
              <CardDescription>계정 삭제 및 데이터 초기화</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="destructive" className="w-full">
                모든 데이터 삭제
              </Button>
              <Button variant="destructive" className="w-full">
                계정 삭제
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <ApiKeyDialog 
        open={showApiKeyDialog} 
        onOpenChange={setShowApiKeyDialog}
        channelName="AI 서비스"
        onSave={(apiKey) => {
          console.log("API Key saved:", apiKey);
          toast.success("API 키가 저장되었습니다.");
          setShowApiKeyDialog(false);
        }}
      />
    </div>
  );
};

export default Settings;
