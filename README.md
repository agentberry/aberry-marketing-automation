# Aberry Marketing Automation Agent

AI 기반 마케팅 자동화 에이전트 - 다채널 컨텐츠 생성, 예약 게시, 성과 분석을 한 곳에서 관리하세요.

## 🚀 Features

- **파일 업로드 & AI 분석**: 이미지, 문서, 데이터 파일을 업로드하여 AI가 분석하고 마케팅 컨텐츠 생성
- **다채널 컨텐츠 생성**: 소셜 미디어, 이메일, 블로그, 광고 카피 자동 생성
- **자동 예약 게시**: 여러 마케팅 채널에 컨텐츠를 주기적으로 자동 업로드
- **성과 추적**: 조회수, 클릭수, 전환율 등 마케팅 성과 실시간 추적
- **채널 연동**: Instagram, Facebook, Twitter, LinkedIn, TikTok, Email, Blog, Google Ads, Naver Ads
- **크레딧 시스템**: 사용량 기반 과금 시스템으로 투명한 비용 관리

## 📁 Project Structure

```
aberry-marketing-automation/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Homepage (redirects to dashboard)
│   │   ├── globals.css                # Global styles with design system
│   │   ├── dashboard/                 # Dashboard page
│   │   │   └── page.tsx
│   │   ├── content/                   # Content management
│   │   │   ├── create/page.tsx        # Content creation
│   │   │   └── library/page.tsx       # Content library
│   │   ├── campaigns/                 # Campaign management
│   │   │   ├── page.tsx               # Campaigns list
│   │   │   └── [id]/page.tsx          # Campaign detail
│   │   ├── channels/page.tsx          # Channel integration
│   │   ├── analytics/page.tsx         # Analytics dashboard
│   │   └── settings/page.tsx          # Settings
│   ├── components/
│   │   ├── ui/                        # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   └── input.tsx
│   │   ├── navigation.tsx             # Main navigation
│   │   ├── dashboard/                 # Dashboard-specific components
│   │   ├── content/                   # Content-specific components
│   │   ├── campaigns/                 # Campaign-specific components
│   │   └── analytics/                 # Analytics-specific components
│   ├── lib/
│   │   ├── utils.ts                   # Utility functions
│   │   └── mock-data.ts               # Mock data for development
│   ├── messages/                      # i18n translations
│   │   ├── ko.json                    # Korean
│   │   ├── en.json                    # English
│   │   └── ja.json                    # Japanese
│   ├── types/                         # TypeScript types
│   └── i18n.ts                        # i18n configuration
├── middleware.ts                      # Auth & i18n middleware
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── .env.example
```

## 🎨 Design System

This project uses the **Aberry Design System** from marketplace-web:

### Colors (HSL Variables)
- `--background: 240 10% 6%` - Deep space background
- `--card: 240 8% 10%` - Surface color
- `--primary: 239 84% 67%` - Indigo brand color
- `--secondary: 258 90% 66%` - Purple accent
- `--accent: 189 94% 43%` - Cyan highlight

### Glass Morphism
```css
.glass {
  background: hsl(var(--card) / 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid hsl(var(--border) / 0.2);
}
```

### Gradient Buttons
```tsx
<Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
  Button Text
</Button>
```

### Floating Background Orbs
```tsx
<div className="absolute inset-0 overflow-hidden pointer-events-none">
  <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
  <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
  <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
</div>
```

## 💳 Credit System

### Credit Costs (from `lib/mock-data.ts`)

**File Analysis:**
- Image: 3 credits
- Document: 5 credits
- Video: 10 credits
- Data: 5 credits

**Content Generation:**
- Social Post: 3 credits
- Email Campaign: 5 credits
- Blog Post: 10 credits
- Ad Copy: 7 credits

**API Calls:**
- Channel Post: 1 credit
- Scheduled Post: 2 credits

**Analytics:**
- Daily Analytics: 1 credit
- Performance Report: 3 credits

### Integration with @aberry/agent-sdk

```tsx
import { AberryClient } from '@aberry/agent-sdk';

const client = new AberryClient({
  apiUrl: process.env.NEXT_PUBLIC_API_URL
});

// Check balance
const balance = await client.credit.getBalance();

// Use credits
await client.credit.use({
  amount: 10,
  agentSlug: 'marketing-automation',
  description: 'Generated email campaign',
  metadata: { campaignId: '123' }
});

// Check if enough credits
const hasCredits = await client.credit.hasEnoughCredits(50);
```

## 📄 Pages to Implement

### 1. Dashboard (`/dashboard`)

Display overview metrics and recent activity:

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { Navigation } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockCampaigns, mockScheduledPosts, mockAnalytics } from '@/lib/mock-data';
import { Activity, Calendar, Eye, MousePointerClick, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const t = useTranslations('marketing');

  const activeCampaigns = mockCampaigns.filter(c => c.status === 'active').length;
  const scheduledPosts = mockScheduledPosts.filter(p => p.status === 'pending').length;
  const latestAnalytics = mockAnalytics[mockAnalytics.length - 1];
  const totalViews = mockAnalytics.reduce((sum, d) => sum + d.views, 0);
  const totalClicks = mockAnalytics.reduce((sum, d) => sum + d.clicks, 0);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <Navigation />

      <main className="relative z-10 p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 gradient-text">{t('dashboard.title')}</h1>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card className="glass border-border/40 hover:border-primary/40 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.activeCampaigns')}</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCampaigns}</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>

          <Card className="glass border-border/40 hover:border-primary/40 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.scheduledPosts')}</CardTitle>
              <Calendar className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduledPosts}</div>
              <p className="text-xs text-muted-foreground">Next: Today 14:00</p>
            </CardContent>
          </Card>

          <Card className="glass border-border/40 hover:border-primary/40 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.thisWeekPosts')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+12% from last week</p>
            </CardContent>
          </Card>

          <Card className="glass border-border/40 hover:border-primary/40 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.totalViews')}</CardTitle>
              <Eye className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+18% from last week</p>
            </CardContent>
          </Card>

          <Card className="glass border-border/40 hover:border-primary/40 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.totalClicks')}</CardTitle>
              <MousePointerClick className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+23% from last week</p>
            </CardContent>
          </Card>

          <Card className="glass border-border/40 hover:border-primary/40 transition-all duration-300 ring-2 ring-primary/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.creditBalance')}</CardTitle>
              <span className="text-2xl">💎</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,000</div>
              <p className="text-xs text-primary">Premium Plan</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Campaigns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass border-border/40">
            <CardHeader>
              <CardTitle>{t('dashboard.recentCampaigns')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCampaigns.slice(0, 5).map(campaign => (
                  <div key={campaign.id} className="flex items-center justify-between p-3 glass-card hover:border-primary/40 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-semibold">
                        {campaign.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-xs text-muted-foreground">{campaign.channels.length} channels</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      campaign.status === 'active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                      campaign.status === 'paused' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                      'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                    }`}>
                      {t(`campaigns.${campaign.status}`)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-border/40">
            <CardHeader>
              <CardTitle>{t('dashboard.upcomingPosts')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockScheduledPosts.slice(0, 5).map(post => (
                  <div key={post.id} className="flex items-center justify-between p-3 glass-card hover:border-primary/40 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getChannelIcon(post.channel)}</div>
                      <div>
                        <p className="font-medium">{post.campaignName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(post.scheduledTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      {post.status}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function getChannelIcon(channel: string) {
  const icons: Record<string, string> = {
    instagram: '📷',
    facebook: '👥',
    twitter: '🐦',
    linkedin: '💼',
    tiktok: '🎵',
    email: '✉️',
    blog: '📝',
    google_ads: '🎯',
    naver_ads: '🟢',
  };
  return icons[channel] || '📱';
}
```

### 2. Content Creation (`/content/create`)

File upload and AI content generation interface.

### 3. Campaigns (`/campaigns`)

Campaign management with list and detail views.

### 4. Channels (`/channels`)

Channel integration status and OAuth connections.

### 5. Analytics (`/analytics`)

Performance dashboard with Recharts visualizations.

### 6. Content Library (`/content/library`)

Browse and manage generated content.

### 7. Settings (`/settings`)

User preferences and API keys management.

## 🌐 Landing Page in Marketplace-Web

Create a SEO-optimized landing page at:
`apps/marketplace-web/src/app/(marketing)/agent/marketing-automation/page.tsx`

Key sections:
1. Hero with gradient text and CTA
2. Features grid (4 cards with glass effect)
3. Supported channels showcase
4. Credit pricing table
5. Workflow visualization
6. Final CTA section

Update `apps/marketplace-web/src/app/sitemap.ts` to include the new page.

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd agents/aberry-marketing-automation
pnpm install
```

### 2. Set up Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required variables:
- `JWT_SECRET` - Shared JWT secret for cookie auth
- `COOKIE_DOMAIN` - localhost (dev) or .aberry.ai (prod)
- `MARKETPLACE_URL` - http://localhost:5070
- `NEXT_PUBLIC_API_URL` - http://localhost:4000/api
- `ANTHROPIC_API_KEY` - Your Anthropic API key

### 3. Run Development Server

```bash
pnpm dev
```

The agent will be available at `http://localhost:5072`

### 4. Build for Production

```bash
pnpm build
pnpm start
```

## 📝 Next Steps

1. ✅ Basic structure and configuration
2. ✅ Design system integration
3. ✅ Mock data and i18n
4. ⏳ Implement remaining pages (campaigns, channels, analytics, etc.)
5. ⏳ Integrate real AI functionality with Anthropic API
6. ⏳ Connect to marketplace-api for credit system
7. ⏳ Implement OAuth flows for channel connections
8. ⏳ Add real-time analytics with WebSocket
9. ⏳ Create landing page in marketplace-web
10. ⏳ Deploy to production

## 🤝 Contributing

This agent follows the Aberry platform conventions:
- Use marketplace design system (glass effects, HSL colors, gradients)
- Implement i18n for all user-facing text
- Use @aberry/agent-sdk for auth and credits
- Follow Next.js 14 App Router patterns
- Write TypeScript with strict mode

## 📞 Support

For issues or questions, please open an issue in the main Aberry repository.
