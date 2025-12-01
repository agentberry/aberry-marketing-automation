import Link from 'next/link';
import Image from 'next/image';
import {
  PenTool,
  TrendingUp,
  Check,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  FileText,
  Target,
  Clock,
  Users,
  ArrowRight,
  MessageCircle,
  Megaphone,
  MessageSquare
} from 'lucide-react';
import { PricingSection } from '@/components/pricing/PricingSection';

// 커스텀 TikTok 아이콘 (공식 로고 기반)
const TikTokIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1Z"/>
  </svg>
);

const channels = [
  { name: 'Instagram', icon: Instagram, color: '#E4405F' },
  { name: 'Facebook', icon: Facebook, color: '#1877F2' },
  { name: 'Twitter', icon: Twitter, color: '#1DA1F2' },
  { name: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
  { name: 'YouTube', icon: Youtube, color: '#FF0000' },
  { name: 'Threads', icon: MessageCircle, color: '#8B5CF6' },
  { name: 'TikTok', icon: TikTokIcon, color: '#00F2EA' },
  { name: 'Email', icon: Mail, color: '#EA4335' },
  { name: 'Blog', icon: FileText, color: '#22c55e' },
  { name: 'Google Ads', icon: Target, color: '#4285F4' },
  { name: 'Naver Ads', icon: Megaphone, color: '#03C75A' },
  { name: 'Kakao Ads', icon: MessageSquare, color: '#FEE500' },
];

const painPoints = [
  "매일 인스타 올릴 시간이 없다",
  "오늘 뭘 올릴지 아이디어가 바닥났다",
  "채널마다 같은 내용을 다시 쓰기 귀찮다",
  "혼자서 10개 채널 관리가 버겁다",
];

const features = [
  {
    icon: Target,
    title: '예산 맞춤 전략',
    description: '예산과 업종을 입력하면 AI가 최적의 채널 조합과 마케팅 전략을 추천',
    metric: '5-10 크레딧',
  },
  {
    icon: PenTool,
    title: 'AI 콘텐츠 생성',
    description: '주제만 입력하면 인스타, 블로그, 이메일 콘텐츠를 30초 만에 작성',
    metric: '3-10 크레딧',
  },
  {
    icon: Clock,
    title: '예약 게시',
    description: '최적의 시간에 자동 게시. 여러 채널에 한 번에 배포',
    metric: '1-2 크레딧',
  },
  {
    icon: TrendingUp,
    title: '성과 분석',
    description: '조회수, 클릭수, 전환율을 실시간 대시보드에서 확인',
    metric: '2 크레딧',
  },
];

export default function MarketingAutomationPage() {
  const workspaceUrl = process.env.NODE_ENV === 'production'
    ? 'https://marketing.aberry.ai/app'
    : 'http://localhost:5072';

  const marketplaceUrl = process.env.NODE_ENV === 'production'
    ? 'https://aberry.ai'
    : 'http://localhost:5070';

  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning>
      {/* Navigation - glass 유지 */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href={marketplaceUrl} className="flex items-center">
                <span className="text-xl font-bold text-primary">Aberry</span>
              </Link>
              <a href="#features" className="hidden md:inline text-sm text-muted-foreground hover:text-foreground transition-colors">
                기능
              </a>
              <a href="#channels" className="hidden md:inline text-sm text-muted-foreground hover:text-foreground transition-colors">
                채널
              </a>
              <a href="#pricing" className="hidden md:inline text-sm text-muted-foreground hover:text-foreground transition-colors">
                요금제
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`${workspaceUrl}/login`}
                className="hidden sm:inline-flex px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                로그인
              </Link>
              <Link
                href={workspaceUrl}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                무료로 시작하기
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="py-16 lg:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* 텍스트 영역 */}
              <div className="space-y-8">
                {/* 타겟 배지 */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">1인 마케터 · 스타트업 · 크리에이터</span>
                </div>

                {/* 헤드라인 */}
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
                    마케팅팀 1명으로<br />
                    <span className="text-primary">다채널 마케팅</span> 자동화
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                    AI가 콘텐츠 작성, 예약 게시, 성과 분석까지.<br />
                    주 10시간을 1시간으로.
                  </p>
                </div>

                {/* 소셜 프루프 */}
                <div className="flex items-center gap-8 py-2">
                  <div>
                    <div className="text-2xl font-bold">80%</div>
                    <div className="text-sm text-muted-foreground">시간 절약</div>
                  </div>
                  <div className="w-px h-12 bg-border" />
                  <div>
                    <div className="text-2xl font-bold">다양한</div>
                    <div className="text-sm text-muted-foreground">마케팅 채널</div>
                  </div>
                  <div className="w-px h-12 bg-border" />
                  <div>
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-sm text-muted-foreground">자동 게시</div>
                  </div>
                </div>

                {/* CTA */}
                <div className="space-y-3">
                  <Link
                    href={workspaceUrl}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    무료로 시작하기
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    가입 없이 바로 체험 가능
                  </p>
                </div>
              </div>

              {/* 데모 영역 */}
              <div className="relative">
                <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-xl">
                  {/* 브라우저 프레임 */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                      <div className="w-3 h-3 rounded-full bg-green-400/60" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="px-4 py-1 rounded-md bg-background text-xs text-muted-foreground font-mono">
                        marketing.aberry.ai
                      </div>
                    </div>
                  </div>
                  {/* 대시보드 미리보기 */}
                  <div className="p-6 space-y-4 bg-background">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-4 rounded-xl bg-muted/50 border border-border">
                        <div className="text-xs text-muted-foreground mb-1">활성 캠페인</div>
                        <div className="text-2xl font-bold">12</div>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/50 border border-border">
                        <div className="text-xs text-muted-foreground mb-1">예약 게시물</div>
                        <div className="text-2xl font-bold">47</div>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/50 border border-border">
                        <div className="text-xs text-muted-foreground mb-1">총 조회수</div>
                        <div className="text-2xl font-bold">2.4K</div>
                      </div>
                    </div>
                    <div className="h-36 rounded-xl bg-muted/30 border border-border p-4">
                      <div className="flex items-end justify-between h-full gap-2">
                        {[35, 55, 40, 70, 50, 85, 65, 90, 75, 60, 80, 95].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-primary/40 rounded-sm transition-all hover:bg-primary/60"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {channels.slice(0, 5).map((channel) => (
                        <div
                          key={channel.name}
                          className="w-9 h-9 rounded-lg bg-muted/50 border border-border flex items-center justify-center"
                        >
                          <channel.icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                      ))}
                      <div className="w-9 h-9 rounded-lg bg-muted/50 border border-border flex items-center justify-center text-xs text-muted-foreground font-medium">
                        +5
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 체크리스트 섹션 */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">이런 고민이 있다면</h2>
              <p className="text-muted-foreground">바로 당신을 위한 서비스예요</p>
            </div>
            <div className="space-y-3">
              {painPoints.map((pain) => (
                <div
                  key={pain}
                  className="flex items-center gap-4 p-5 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-lg">{pain}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <p className="inline-flex items-center text-lg text-muted-foreground">
                <span className="text-xl font-bold text-primary mr-2">Aberry</span>
                <span>가 이 모든 문제를 해결해드립니다</span>
              </p>
            </div>
          </div>
        </section>

        {/* Features 섹션 */}
        <section id="features" className="py-20 px-4 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-3">AI가 대신 해드려요</h2>
              <p className="text-muted-foreground">더 이상 채널마다 오가며 시간 낭비하지 마세요</p>
            </div>

            {/* 기능 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors ${index === 0 ? 'ring-1 ring-primary/20' : ''}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="text-sm font-medium text-primary">
                    {feature.metric} / 건
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 지원 채널 섹션 */}
        <section id="channels" className="py-20 px-4 bg-muted/30 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">여러 채널, 한 곳에서</h2>
              <p className="text-muted-foreground">더 이상 채널마다 로그인할 필요 없어요</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
              {channels.map((channel) => (
                <div
                  key={channel.name}
                  className="group flex flex-col items-center gap-3 p-4 transition-all duration-300"
                  style={{
                    ['--channel-color' as string]: channel.color,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-[0_0_16px_var(--channel-color)]"
                    style={{
                      backgroundColor: `${channel.color}15`,
                    }}
                  >
                    <channel.icon
                      className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                      style={{ color: channel.color }}
                    />
                  </div>
                  <span className="text-sm font-medium">{channel.name}</span>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <span className="inline-flex items-center gap-2 text-sm text-primary font-medium drop-shadow-[0_0_8px_rgba(155,59,229,0.6)]">
                <Check className="w-4 h-4" />
                모든 채널 무료 연동
              </span>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <PricingSection variant="dark" showCreditUsage={false} />

        {/* Final CTA Section */}
        <section className="py-20 px-4 bg-primary">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              직접 확인해보세요
            </h2>
            <p className="text-lg text-white/80 mb-8">
              가입 없이 모든 기능을 체험할 수 있어요
            </p>
            <Link
              href={workspaceUrl}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-lg font-medium bg-white text-primary hover:bg-white/90 transition-colors"
            >
              무료로 시작하기
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-white/60 mt-4">
              클릭 한 번으로 바로 체험
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* 회사 정보 */}
            <div className="space-y-3 text-sm text-white/50">
              <p className="text-white/70 font-medium">주식회사 에이베리</p>
              <p>대표이사: 홍길동 | 사업자등록번호: 123-45-67890</p>
              <p>통신판매업신고: 2024-서울강남-12345</p>
              <p>주소: 서울특별시 강남구 테헤란로 123, 4층</p>
              <p>이메일: support@aberry.ai | 고객센터: 02-1234-5678</p>
            </div>
            {/* 링크 */}
            <div className="flex flex-wrap gap-4 text-sm text-white/50 md:justify-end md:items-start">
              <a href="/terms" className="hover:text-white/70 transition-colors">이용약관</a>
              <a href="/privacy" className="hover:text-white/70 transition-colors">개인정보처리방침</a>
              <a href="/refund" className="hover:text-white/70 transition-colors">환불정책</a>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-sm text-white/40">
            © 2024 Aberry. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
