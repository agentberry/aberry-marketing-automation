# Aberry Marketing Automation - Implementation Guide

## ✅ 완료된 작업

### 1. 프로젝트 구조 생성 ✅
- Next.js 14 App Router 설정
- TypeScript 설정
- Tailwind CSS 4.0 설정
- pnpm workspace 통합

### 2. 디자인 시스템 적용 ✅
- Aberry 마켓플레이스와 동일한 디자인 시스템
- Glass morphism 효과
- Gradient 버튼 및 텍스트
- Floating background orbs
- HSL 색상 변수 시스템
- 애니메이션 (float, fade-in, scale-in)

### 3. 인증 및 i18n ✅
- Cookie 기반 SSO 미들웨어
- next-intl 설정
- 한국어, 영어, 일본어 번역 파일

### 4. 목업 데이터 ✅
- 캠페인 데이터 (5개)
- 컨텐츠 데이터 (5개)
- 채널 데이터 (9개)
- 예약 포스팅 (10개)
- 분석 데이터 (7일치)
- 크레딧 비용 정의

### 5. UI 컴포넌트 ✅
- Button
- Card (+ CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- Badge
- Input
- Navigation

### 6. 페이지 구현 ✅
- Root Layout with floating orbs background
- Dashboard (메트릭 카드, 최근 캠페인, 예정 포스팅)
- Homepage (redirect to /dashboard)

### 7. 마켓플레이스 랜딩페이지 ✅
- SEO 최적화 메타데이터
- Hero 섹션
- 핵심 기능 4개 카드
- 지원 채널 9개 그리드
- 워크플로우 시각화
- 기능 리스트 및 크레딧 가격표
- CTA 섹션
- 완전히 마켓플레이스 디자인 시스템 적용

## 🚀 시작하기

### 1. 개발 서버 실행

```bash
# 마케팅 자동화 에이전트 디렉토리로 이동
cd agents/aberry-marketing-automation

# 환경 변수 설정
cp .env.example .env

# 개발 서버 시작
pnpm dev
```

에이전트는 `http://localhost:5072`에서 실행됩니다.

### 2. 필요한 환경 변수

`.env` 파일에 다음 값을 설정하세요:

```bash
# Authentication (마켓플레이스와 공유)
JWT_SECRET=your-shared-jwt-secret
COOKIE_DOMAIN=localhost
MARKETPLACE_URL=http://localhost:5070

# API
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# Anthropic AI (향후 실제 AI 기능 구현 시)
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### 3. 마켓플레이스에서 접근

마켓플레이스 웹에서 다음 URL로 접근 가능:
```
http://localhost:5070/agent/marketing-automation
```

## 📝 구현해야 할 페이지

다음 페이지들은 README.md의 패턴을 참고하여 구현할 수 있습니다:

### 1. Content Creation (`/content/create`)

**목적**: 파일 업로드 및 AI 컨텐츠 생성

**주요 요소**:
- 파일 드래그앤드롭 영역 (glass effect, dashed border)
- 지원 형식 표시 (이미지, PDF, DOCX, CSV, 비디오)
- 업로드된 파일 미리보기 카드
- 타겟 오디언스, 톤앤매너, 키워드 입력
- "AI 컨텐츠 생성" 버튼 (크레딧 표시)
- 생성된 컨텐츠 카드들 (소셜, 이메일, 블로그, 광고)
- 편집 및 선택 기능

**참고 컴포넌트**:
```tsx
// File upload zone
<div className="glass border-2 border-dashed border-primary/20 rounded-lg p-12 text-center hover:border-primary/40 transition-all cursor-pointer">
  <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
  <p>파일을 드래그하거나 클릭하여 업로드</p>
</div>

// Generated content card
<Card className="glass border-border/40 hover:border-primary/40 transition-all">
  <CardHeader>
    <div className="flex items-center justify-between">
      <Badge>{t('content.social')}</Badge>
      <div className="text-xs text-muted-foreground">3 크레딧</div>
    </div>
  </CardHeader>
  <CardContent>
    <p>{content.body}</p>
  </CardContent>
  <CardFooter>
    <Button variant="outline" size="sm">편집</Button>
    <Button size="sm">선택</Button>
  </CardFooter>
</Card>
```

### 2. Campaigns (`/campaigns`)

**목적**: 캠페인 관리 및 생성

**주요 요소**:
- 캠페인 카드 그리드 (glass effect)
- 캠페인 이름, 상태 배지, 채널 아이콘
- 진행률 바, 성과 요약
- "새 캠페인 만들기" 버튼
- 필터 (전체, 활성, 일시정지, 완료)

**데이터 사용**:
```tsx
import { mockCampaigns, getCampaignStatusColor, getChannelIcon } from '@/lib/mock-data';
```

### 3. Campaign Detail (`/campaigns/[id]`)

**목적**: 캠페인 상세 정보 및 관리

**주요 요소**:
- 캠페인 헤더 (이름, 상태, 편집 버튼)
- 채널 목록 (아이콘 그리드)
- 예약된 포스팅 캘린더
- 성과 차트 (Recharts)
- 컨텐츠 목록

### 4. Channels (`/channels`)

**목적**: 마케팅 채널 연동 관리

**주요 요소**:
- 채널 카드 그리드 (3-4 columns)
- 각 채널: 아이콘, 이름, 연동 상태
- 연동됨: 초록 배지, 마지막 동기화 시간, "관리" 버튼
- 미연동: 회색, "연동하기" 버튼
- OAuth 플로우 다이얼로그 (목업)

**데이터 사용**:
```tsx
import { mockChannels } from '@/lib/mock-data';

{mockChannels.map(channel => (
  <Card key={channel.id} className={`glass border-border/40 ${channel.connected ? 'border-green-500/20' : ''}`}>
    <CardContent className="p-6">
      <div className="text-4xl mb-3">{channel.icon}</div>
      <h3 className="font-bold mb-2">{channel.name}</h3>
      {channel.connected ? (
        <>
          <Badge variant="secondary" className="bg-green-500/10 text-green-500 mb-3">
            {t('channels.connected')}
          </Badge>
          <p className="text-xs text-muted-foreground mb-3">
            {t('channels.lastSync')}: {new Date(channel.lastSync!).toLocaleString()}
          </p>
          <Button variant="outline" size="sm" className="w-full">
            {t('channels.manage')}
          </Button>
        </>
      ) : (
        <Button size="sm" className="w-full bg-gradient-primary">
          {t('channels.connect')}
        </Button>
      )}
    </CardContent>
  </Card>
))}
```

### 5. Analytics (`/analytics`)

**목적**: 마케팅 성과 분석 대시보드

**주요 요소**:
- 기간 선택 드롭다운
- 전체 성과 요약 카드 (조회, 클릭, 전환, 참여율)
- 시간별 트렌드 차트 (Recharts LineChart 또는 AreaChart)
- 채널별 성과 바 차트
- 최고 성과 컨텐츠 테이블

**Recharts 사용 예시**:
```tsx
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockAnalytics, mockChannelPerformance } from '@/lib/mock-data';

<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={mockAnalytics}>
    <defs>
      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
    <YAxis stroke="hsl(var(--muted-foreground))" />
    <Tooltip
      contentStyle={{
        backgroundColor: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '8px',
      }}
    />
    <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fill="url(#colorViews)" />
  </AreaChart>
</ResponsiveContainer>
```

### 6. Content Library (`/content/library`)

**목적**: 생성된 컨텐츠 라이브러리

**주요 요소**:
- 검색 바 (glass effect, rounded-2xl)
- 필터 (타입, 채널, 날짜)
- 컨텐츠 카드 그리드
- 각 카드: 썸네일/아이콘, 제목, 타입 배지, 성과 지표
- 액션 버튼 (편집, 복사, 삭제)

**데이터 사용**:
```tsx
import { mockContents, getContentTypeLabel, getContentTypeCost } from '@/lib/mock-data';
```

### 7. Settings (`/settings`)

**목적**: 사용자 설정 및 관리

**주요 요소**:
- Tabs (채널 관리, 알림, API 키, 프로필)
- 각 탭: glass cards with forms
- Input, Select, Switch 컴포넌트
- 저장/취소 버튼

## 🎨 디자인 가이드

### 공통 패턴

#### Page Layout
```tsx
<div className="min-h-screen bg-background relative overflow-hidden">
  {/* Floating background orbs */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
  </div>

  <Navigation />

  <main className="relative z-10 p-6 max-w-7xl mx-auto">
    {/* Page content */}
  </main>
</div>
```

#### Glass Card
```tsx
<Card className="glass border-border/40 hover:border-primary/40 transition-all duration-300 hover:shadow-glow hover:-translate-y-1">
```

#### Gradient Button
```tsx
<Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
  Button Text
</Button>
```

#### Status Badge
```tsx
<Badge className="bg-green-500/10 text-green-500 border border-green-500/20">
  Active
</Badge>
```

#### Metric Card
```tsx
<Card className="glass border-border/40 hover:border-primary/40 transition-all">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">Title</CardTitle>
    <Icon className="h-4 w-4 text-primary" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">1,234</div>
    <p className="text-xs text-muted-foreground">+12% from last week</p>
  </CardContent>
</Card>
```

## 🔧 크레딧 시스템 통합

### 크레딧 체크 예시

```tsx
'use client';

import { useState } from 'react';
import { AberryClient } from '@aberry/agent-sdk';
import { CREDIT_COSTS } from '@/lib/mock-data';

export function ContentCreator() {
  const [loading, setLoading] = useState(false);
  const client = new AberryClient({
    apiUrl: process.env.NEXT_PUBLIC_API_URL
  });

  async function handleGenerate() {
    try {
      setLoading(true);

      // Check if user has enough credits
      const hasCredits = await client.credit.hasEnoughCredits(
        CREDIT_COSTS.CONTENT_SOCIAL_POST
      );

      if (!hasCredits) {
        // Show upgrade dialog
        alert('크레딧이 부족합니다. 업그레이드하세요!');
        return;
      }

      // Use credits
      await client.credit.use({
        amount: CREDIT_COSTS.CONTENT_SOCIAL_POST,
        agentSlug: 'marketing-automation',
        description: '소셜 포스트 생성',
        metadata: { contentType: 'social' }
      });

      // Generate content (실제 AI 호출)
      // ...

      // Update UI
      alert('컨텐츠가 생성되었습니다!');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleGenerate}
      disabled={loading}
      className="bg-gradient-primary"
    >
      {loading ? '생성 중...' : 'AI 컨텐츠 생성'}
      <span className="ml-2 text-xs">
        ({CREDIT_COSTS.CONTENT_SOCIAL_POST} 크레딧)
      </span>
    </Button>
  );
}
```

## 📱 반응형 디자인

모든 페이지는 다음 breakpoint를 따라야 합니다:

- Mobile: < 768px (1 column)
- Tablet: 768px - 1024px (2 columns)
- Desktop: 1024px - 1280px (3 columns)
- Large: > 1280px (4-6 columns)

**예시**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
```

## 🌐 다국어 지원

모든 텍스트는 `useTranslations` 훅을 사용:

```tsx
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('marketing');

  return (
    <h1>{t('dashboard.title')}</h1>
  );
}
```

번역 추가는 `src/messages/{locale}.json` 파일을 수정하세요.

## 🚀 배포

### 개발 환경
```bash
pnpm dev
# http://localhost:5072
```

### 프로덕션 빌드
```bash
pnpm build
pnpm start
```

### 프로덕션 환경 변수
```bash
JWT_SECRET=<production-secret>
COOKIE_DOMAIN=.aberry.ai
MARKETPLACE_URL=https://aberry.ai
NEXT_PUBLIC_API_URL=https://api.aberry.ai
ANTHROPIC_API_KEY=<production-key>
```

### 도메인
프로덕션 도메인: `https://marketing.aberry.ai`

## 📚 참고 자료

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/docs/primitives)
- [Recharts](https://recharts.org/en-US/)
- [next-intl](https://next-intl-docs.vercel.app/)
- [@aberry/agent-sdk](../packages/agent-sdk/README.md)

## 🐛 문제 해결

### 빌드 오류
```bash
# 의존성 재설치
rm -rf node_modules .next
pnpm install

# 캐시 정리
pnpm build --no-cache
```

### i18n 오류
- `messages/{locale}.json` 파일이 있는지 확인
- `i18n.ts`에서 locale이 SUPPORTED_LOCALES에 포함되어 있는지 확인

### 인증 오류
- JWT_SECRET이 마켓플레이스와 동일한지 확인
- COOKIE_DOMAIN이 올바른지 확인 (localhost 또는 .aberry.ai)

## ✅ 체크리스트

프로덕션 배포 전 확인 사항:

- [ ] 모든 환경 변수 설정 완료
- [ ] 모든 페이지 구현 완료
- [ ] 다국어 번역 완료 (ko, en, ja)
- [ ] 반응형 디자인 테스트 완료
- [ ] 크레딧 시스템 통합 테스트
- [ ] 채널 OAuth 플로우 구현
- [ ] 실제 AI 기능 통합 (Anthropic API)
- [ ] 성과 분석 데이터 실시간 수집
- [ ] 마켓플레이스 sitemap 업데이트
- [ ] SEO 메타데이터 검증
- [ ] 에러 핸들링 구현
- [ ] 로딩 상태 구현
- [ ] 프로덕션 빌드 테스트

## 🎉 다음 단계

1. 나머지 페이지 구현 (Content Creation, Campaigns, Channels, Analytics, Library, Settings)
2. Anthropic API 통합하여 실제 AI 컨텐츠 생성 기능 구현
3. 마켓플레이스 API와 연동하여 크레딧 시스템 동작 확인
4. OAuth 플로우 구현 (소셜 미디어 채널 연동)
5. WebSocket 또는 폴링으로 실시간 성과 데이터 수집
6. 이메일 알림 기능 추가
7. 캘린더 UI로 예약 포스팅 관리 개선
8. 컨텐츠 편집기 고도화
9. A/B 테스트 기능 추가
10. 랜딩페이지 에이전트와의 연동 구현

프로젝트 구조와 기본 기능이 완성되었습니다! 🚀
