import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Content {
  id: string;
  title: string;
  description: string;
  type: "instagram" | "facebook" | "twitter" | "linkedin" | "email" | "blog" | "google-ads" | "naver-ads" | "video";
  thumbnail: string;
  targetUrl: string;
  createdAt: Date;
  status: "draft" | "published" | "archived";
  performance: {
    views: number;
    clicks: number;
    conversions: number;
    engagement: number;
  };
  generatedContent?: string;
  mediaUrl?: string;
}

interface ContentContextType {
  contents: Content[];
  addContent: (content: Content) => void;
  updateContent: (id: string, updates: Partial<Content>) => void;
  deleteContent: (id: string) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [contents, setContents] = useState<Content[]>([
    {
      id: "1",
      title: "신제품 런칭 소셜 미디어 포스트",
      description: "새로운 제품 출시를 알리는 인스타그램 콘텐츠",
      type: "instagram",
      thumbnail: "📱",
      targetUrl: "https://example.com/product",
      createdAt: new Date("2024-01-15"),
      status: "published",
      performance: {
        views: 15420,
        clicks: 892,
        conversions: 45,
        engagement: 5.8,
      },
      generatedContent: "🎉 드디어 공개합니다! 🎉\n\n여러분이 기다려주신 신제품이 드디어 출시되었습니다! 💫\n\n✨ 혁신적인 디자인\n🚀 뛰어난 성능\n💎 합리적인 가격\n\n지금 바로 만나보세요!\n\n👉 프로필 링크에서 자세한 정보 확인\n\n#신제품 #런칭 #NewArrival #혁신 #프리미엄",
    },
    {
      id: "2",
      title: "이메일 마케팅 - 할인 프로모션",
      description: "VIP 고객 대상 특별 할인 이벤트",
      type: "email",
      thumbnail: "📧",
      targetUrl: "https://example.com/promo",
      createdAt: new Date("2024-01-12"),
      status: "published",
      performance: {
        views: 8500,
        clicks: 1240,
        conversions: 187,
        engagement: 14.6,
      },
      generatedContent: "안녕하세요 [고객명]님,\n\n소중한 VIP 고객님만을 위한 특별한 혜택을 준비했습니다.\n\n🎁 VIP 전용 30% 할인\n⏰ 72시간 한정\n🚚 무료 배송\n\n이번 기회를 놓치지 마세요!\n\n[지금 쇼핑하기]\n\n감사합니다.",
    },
    {
      id: "3",
      title: "블로그 - SEO 최적화 가이드",
      description: "검색 엔진 최적화를 위한 완벽 가이드",
      type: "blog",
      thumbnail: "📝",
      targetUrl: "https://example.com/blog/seo-guide",
      createdAt: new Date("2024-01-10"),
      status: "published",
      performance: {
        views: 23400,
        clicks: 3420,
        conversions: 234,
        engagement: 14.6,
      },
      generatedContent: "# SEO 최적화 완벽 가이드\n\n## 서론\n검색 엔진 최적화(SEO)는 현대 디지털 마케팅의 핵심입니다.\n\n## 주요 전략\n\n### 1. 키워드 리서치\n- 타겟 키워드 선정\n- 검색 의도 분석\n- 경쟁 강도 평가\n\n### 2. 온페이지 최적화\n- 제목 태그 최적화\n- 메타 디스크립션 작성\n- 콘텐츠 품질 향상\n\n### 3. 기술적 SEO\n- 사이트 속도 개선\n- 모바일 최적화\n- 구조화된 데이터\n\n## 결론\n지속적인 모니터링과 개선이 성공의 열쇠입니다.",
    },
    {
      id: "4",
      title: "구글 광고 - 브랜드 인지도",
      description: "브랜드 인지도 향상을 위한 디스플레이 광고",
      type: "google-ads",
      thumbnail: "🎯",
      targetUrl: "https://example.com/landing",
      createdAt: new Date("2024-01-08"),
      status: "published",
      performance: {
        views: 45200,
        clicks: 2890,
        conversions: 156,
        engagement: 6.4,
      },
      generatedContent: "브랜드를 혁신하다\n\n당신의 비즈니스를 다음 단계로.\n\n✓ 업계 1위 품질\n✓ 검증된 성능\n✓ 고객 만족도 99%\n\n지금 무료 체험 시작하기\n[체험 신청]",
    },
    {
      id: "5",
      title: "제품 소개 영상",
      description: "신제품의 주요 기능을 소개하는 짧은 영상",
      type: "video",
      thumbnail: "🎬",
      targetUrl: "https://example.com/video",
      createdAt: new Date("2024-01-05"),
      status: "draft",
      performance: {
        views: 0,
        clicks: 0,
        conversions: 0,
        engagement: 0,
      },
      generatedContent: "[영상 스크립트]\n\n00:00 - 인트로\n\"혁신적인 제품을 소개합니다\"\n\n00:05 - 주요 기능 1\n\"뛰어난 성능과 효율성\"\n\n00:10 - 주요 기능 2\n\"직관적인 사용자 경험\"\n\n00:15 - 주요 기능 3\n\"합리적인 가격대\"\n\n00:20 - 클로징\n\"지금 바로 만나보세요\"",
    },
    {
      id: "6",
      title: "LinkedIn 전문가 인사이트",
      description: "업계 트렌드 분석 및 전망",
      type: "linkedin",
      thumbnail: "💼",
      targetUrl: "https://example.com/insights",
      createdAt: new Date("2024-01-03"),
      status: "published",
      performance: {
        views: 12300,
        clicks: 1850,
        conversions: 92,
        engagement: 15.0,
      },
      generatedContent: "2024년 마케팅 자동화 트렌드 분석\n\n최근 조사에 따르면, 마케팅 자동화 도입 기업의 87%가 ROI 향상을 경험했습니다.\n\n주요 인사이트:\n\n1️⃣ AI 기반 개인화\n- 실시간 고객 데이터 분석\n- 맞춤형 콘텐츠 제공\n\n2️⃣ 옴니채널 통합\n- 일관된 고객 경험\n- 크로스 채널 추적\n\n3️⃣ 예측 분석\n- 고객 행동 예측\n- 선제적 마케팅\n\n귀사는 어떤 전략을 사용하고 계신가요?\n\n#마케팅자동화 #AI #디지털트랜스포메이션",
    },
  ]);

  const addContent = (content: Content) => {
    setContents((prev) => [content, ...prev]);
  };

  const updateContent = (id: string, updates: Partial<Content>) => {
    setContents((prev) =>
      prev.map((content) =>
        content.id === id ? { ...content, ...updates } : content
      )
    );
  };

  const deleteContent = (id: string) => {
    setContents((prev) => prev.filter((content) => content.id !== id));
  };

  return (
    <ContentContext.Provider
      value={{ contents, addContent, updateContent, deleteContent }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
