"use client";

import { useState } from "react";
import { Wallet, Check, Zap, Crown, Rocket } from "lucide-react";

export interface CreditPack {
  name: string;
  price: string;
  credits: string;
  perCredit: string;
  description: string;
  icon: typeof Wallet;
  color: string;
  badge?: string;
  features: string[];
  cta: string;
  popular: boolean;
}

export interface Subscription {
  name: string;
  price: string;
  credits: string;
  period: string;
  description: string;
  icon: typeof Wallet;
  color: string;
  badge?: string;
  features: string[];
  cta: string;
  popular: boolean;
}

// 기본 크레딧 팩 데이터
export const defaultCreditPacks: CreditPack[] = [
  {
    name: "Starter",
    price: "9,000",
    credits: "100",
    perCredit: "90원",
    description: "가볍게 시작하기",
    icon: Wallet,
    color: "from-gray-500 to-slate-500",
    features: [
      "100 크레딧",
      "유효기간 무제한",
      "기본 AI 모델",
      "커뮤니티 지원",
    ],
    cta: "충전하기",
    popular: false,
  },
  {
    name: "Popular",
    price: "45,000",
    credits: "600",
    perCredit: "75원",
    description: "가장 인기있는 선택",
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    badge: "BEST VALUE",
    features: [
      "600 크레딧 (+20% 보너스)",
      "유효기간 무제한",
      "고급 AI 모델",
      "우선 지원",
    ],
    cta: "충전하기",
    popular: true,
  },
  {
    name: "Pro Pack",
    price: "150,000",
    credits: "2,500",
    perCredit: "60원",
    description: "대용량 사용자",
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    badge: "40% SAVE",
    features: [
      "2,500 크레딧 (+67% 보너스)",
      "유효기간 무제한",
      "최고급 AI 모델",
      "전담 지원",
      "API 접근",
    ],
    cta: "충전하기",
    popular: false,
  },
];

// 기본 구독 데이터
export const defaultSubscriptions: Subscription[] = [
  {
    name: "Starter",
    price: "29,000",
    credits: "400",
    period: "월",
    description: "정기적 사용자를 위한 멤버십",
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    features: [
      "월 400 크레딧 (충전 대비 20% 할인)",
      "다음 달 이월 가능 (최대 1개월)",
      "우선 응답 속도",
      "프리미엄 템플릿",
      "무제한 프로젝트",
      "30일 히스토리",
      "10GB 저장공간",
    ],
    cta: "구독하기",
    popular: false,
  },
  {
    name: "Professional",
    price: "79,000",
    credits: "1,300",
    period: "월",
    description: "전문가를 위한 프리미엄",
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    badge: "추천",
    features: [
      "월 1,300 크레딧 (충전 대비 30% 할인)",
      "다음 달 이월 가능 (최대 2개월)",
      "최우선 응답 속도",
      "API 무제한 접근",
      "팀 협업 기능 (5명)",
      "커스텀 브랜딩",
      "90일 히스토리",
      "50GB 저장공간",
    ],
    cta: "구독하기",
    popular: true,
  },
  {
    name: "Business",
    price: "299,000",
    credits: "6,000",
    period: "월",
    description: "팀과 기업을 위한 솔루션",
    icon: Rocket,
    color: "from-orange-500 to-red-500",
    features: [
      "월 6,000 크레딧 (충전 대비 40% 할인)",
      "크레딧 무제한 이월",
      "전담 계정 매니저",
      "24/7 프리미엄 지원",
      "SLA 99.9% 보장",
      "팀 협업 무제한",
      "화이트라벨 옵션",
      "무제한 히스토리",
      "500GB 저장공간",
      "맞춤형 AI 모델 튜닝",
      "온프레미스 배포 옵션",
    ],
    cta: "구독하기",
    popular: false,
  },
];

interface PricingSectionProps {
  creditPacks?: CreditPack[];
  subscriptions?: Subscription[];
  variant?: 'dark' | 'light';
  showCreditUsage?: boolean;
  className?: string;
}

export function PricingSection({
  creditPacks = defaultCreditPacks,
  subscriptions = defaultSubscriptions,
  variant = 'dark',
  showCreditUsage = true,
  className = '',
}: PricingSectionProps) {
  const isDark = variant === 'dark';

  // 초기 선택값: 크레딧 팩에서 popular가 true인 것 (예: 'pack-1')
  const defaultPackIndex = creditPacks.findIndex(p => p.popular);
  const defaultSelection = defaultPackIndex >= 0 ? `pack-${defaultPackIndex}` : 'pack-1';

  // 단일 선택 상태: 'pack-0', 'pack-1', 'pack-2', 'sub-0', 'sub-1', 'sub-2'
  const [selected, setSelected] = useState(defaultSelection);

  // 앵커 링크 네비게이션 상태
  const [activeSection, setActiveSection] = useState<'credit-packs' | 'subscriptions'>('credit-packs');

  const scrollToSection = (sectionId: 'credit-packs' | 'subscriptions') => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  // 스타일 변수
  const styles = {
    section: isDark ? '' : 'bg-[#f5f5f5]',
    heading: isDark ? 'text-foreground' : 'text-gray-900',
    subtext: isDark ? 'text-muted-foreground' : 'text-gray-600',
    card: isDark
      ? 'bg-card border-border/40'
      : 'bg-white border-gray-200/60 shadow-sm',
    cardSelected: isDark
      ? 'bg-card border-primary ring-2 ring-primary shadow-lg shadow-primary/10 -translate-y-1'
      : 'bg-white border-primary ring-2 ring-primary shadow-lg shadow-primary/10 -translate-y-1',
    featureText: isDark ? 'text-muted-foreground' : 'text-gray-600',
    infoBox: isDark
      ? 'bg-card border-primary/20'
      : 'bg-white border-gray-200/60 shadow-sm',
    buttonDefault: isDark
      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
      : 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    buttonSelected: 'bg-primary text-primary-foreground hover:bg-primary/90',
  };

  return (
    <section id="pricing" className={`py-20 px-4 scroll-mt-20 ${styles.section} ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Wallet className="w-4 h-4 text-primary" />
            <span className={`text-sm ${styles.subtext}`}>충전 또는 구독, 선택은 자유</span>
          </div>
          <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${styles.heading}`}>
            당신에게 맞는 플랜
          </h2>

          {/* 앵커 링크 버튼 */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => scrollToSection('credit-packs')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeSection === 'credit-packs'
                  ? 'bg-primary text-white'
                  : isDark ? 'bg-muted hover:bg-muted/80' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              충전
            </button>
            <button
              onClick={() => scrollToSection('subscriptions')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeSection === 'subscriptions'
                  ? 'bg-primary text-white'
                  : isDark ? 'bg-muted hover:bg-muted/80' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              구독
            </button>
          </div>

          <p className={`${styles.subtext} mt-4`}>
            가볍게 쓸 땐 충전으로, 자주 쓸 땐 구독으로
          </p>
        </div>

        {/* Credit Packs */}
        <div id="credit-packs" className="mb-16 scroll-mt-20">
          <div className="text-center mb-8">
            <h3 className={`text-2xl font-bold mb-2 ${styles.heading}`}>크레딧 팩 · 충전</h3>
            <p className={styles.subtext}>필요할 때 충전해서 사용 · 유효기간 무제한</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {creditPacks.map((pack, index) => {
              const cardId = `pack-${index}`;
              const isSelected = selected === cardId;
              return (
                <div
                  key={index}
                  onClick={() => setSelected(cardId)}
                  className={`relative rounded-lg border transition-all duration-300 overflow-hidden cursor-pointer
                    ${isSelected ? styles.cardSelected : styles.card}
                    ${!isSelected ? 'hover:border-primary/50 hover:shadow-md' : ''}
                  `}
                >
                  {/* Top bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-primary transition-opacity duration-300
                    ${isSelected ? 'opacity-100' : 'opacity-0'}
                  `} />

                  <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pack.color} flex items-center justify-center`}>
                          <pack.icon className="w-6 h-6 text-white" />
                        </div>
                        {pack.badge && (
                          <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                            <span className="text-xs text-primary font-medium">{pack.badge}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className={`text-2xl font-bold mb-1 ${styles.heading}`}>{pack.name}</h4>
                        <p className={`text-sm ${styles.subtext}`}>{pack.description}</p>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-4xl font-bold ${styles.heading}`}>₩{pack.price}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className={`font-medium ${styles.heading}`}>{pack.credits} 크레딧</span>
                        <span className={styles.subtext}>· {pack.perCredit}/개</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      className={`w-full h-10 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300
                        ${isSelected ? styles.buttonSelected : styles.buttonDefault}
                      `}
                    >
                      {pack.cta}
                    </button>

                    {/* Features */}
                    <div className={`space-y-3 pt-4 border-t ${isDark ? 'border-border/40' : 'border-gray-200/60'}`}>
                      {pack.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-primary" />
                          </div>
                          <span className={`text-sm ${styles.featureText}`}>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subscriptions */}
        <div id="subscriptions" className="mb-16 scroll-mt-20">
          <div className="text-center mb-8">
            <h3 className={`text-2xl font-bold mb-2 ${styles.heading}`}>멤버십 · 구독</h3>
            <p className={styles.subtext}>정기 사용자라면 구독이 더 유리 · 충전 대비 최대 40% 할인</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {subscriptions.map((plan, index) => {
              const cardId = `sub-${index}`;
              const isSelected = selected === cardId;
              return (
                <div
                  key={index}
                  onClick={() => setSelected(cardId)}
                  className={`relative rounded-lg border transition-all duration-300 overflow-hidden cursor-pointer
                    ${isSelected ? styles.cardSelected : styles.card}
                    ${!isSelected ? 'hover:border-primary/50 hover:shadow-md' : ''}
                  `}
                >
                  {/* Top bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-primary transition-opacity duration-300
                    ${isSelected ? 'opacity-100' : 'opacity-0'}
                  `} />

                  <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                          <plan.icon className="w-6 h-6 text-white" />
                        </div>
                        {plan.badge && (
                          <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                            <span className="text-xs text-primary font-medium">{plan.badge}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className={`text-2xl font-bold mb-1 ${styles.heading}`}>{plan.name}</h4>
                        <p className={`text-sm ${styles.subtext}`}>{plan.description}</p>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-4xl font-bold ${styles.heading}`}>₩{plan.price}</span>
                        <span className={styles.subtext}>/{plan.period}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className={`font-medium ${styles.heading}`}>{plan.credits} 크레딧/월</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      className={`w-full h-10 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300
                        ${isSelected ? styles.buttonSelected : styles.buttonDefault}
                      `}
                    >
                      {plan.cta}
                    </button>

                    {/* Features */}
                    <div className={`space-y-3 pt-4 border-t ${isDark ? 'border-border/40' : 'border-gray-200/60'}`}>
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-primary" />
                          </div>
                          <span className={`text-sm ${styles.featureText}`}>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Credit Usage Info */}
        {showCreditUsage && (
          <div className="text-center space-y-6">
            <div className={`rounded-2xl p-8 border ${styles.infoBox} max-w-3xl mx-auto`}>
              <h3 className={`text-2xl font-bold mb-4 ${styles.heading}`}>크레딧 사용 안내</h3>
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ${styles.subtext}`}>
                <div className="text-left">
                  <p className={`font-medium ${styles.heading} mb-2`}>· 콘텐츠 생성</p>
                  <p className="ml-4">짧은 콘텐츠: 5 크레딧</p>
                  <p className="ml-4">긴 콘텐츠: 10 크레딧</p>
                </div>
                <div className="text-left">
                  <p className={`font-medium ${styles.heading} mb-2`}>· 이미지 생성</p>
                  <p className="ml-4">기본 이미지: 5 크레딧</p>
                  <p className="ml-4">고품질 이미지: 10 크레딧</p>
                </div>
                <div className="text-left">
                  <p className={`font-medium ${styles.heading} mb-2`}>· 캠페인 관리</p>
                  <p className="ml-4">캠페인 생성: 10 크레딧</p>
                  <p className="ml-4">성과 분석: 5 크레딧</p>
                </div>
                <div className="text-left">
                  <p className={`font-medium ${styles.heading} mb-2`}>· 채널 게시</p>
                  <p className="ml-4">채널당 게시: 2 크레딧</p>
                  <p className="ml-4">예약 게시: 3 크레딧</p>
                </div>
              </div>
            </div>

            <p className={styles.subtext}>
              · 충전한 크레딧은 유효기간 제한 없이 사용 가능<br/>
              · 구독 멤버십은 매월 크레딧이 자동 지급되며, 이월 한도 내에서 누적 가능<br/>
              · 구독 중에도 크레딧 팩 추가 구매 가능
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
