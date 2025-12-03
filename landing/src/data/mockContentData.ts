export interface GeneratedContent {
  channel: string;
  imageUrl: string;
  caption: string;
  hashtags: string[];
  estimatedReach: number;
  bestPostingTime: string;
}

export interface ChannelPerformance {
  channel: string;
  metrics: {
    dates: string[];
    views: number[];
    engagement: number[];
    clicks: number[];
  };
  summary: {
    totalViews: number;
    avgEngagement: string;
    topPost: string;
  };
}

// Content templates for different topics and channels
export const MOCK_CONTENT_TEMPLATES: Record<string, Record<string, GeneratedContent>> = {
  "신제품 출시": {
    Instagram: {
      channel: "Instagram",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      caption: "✨ 드디어 공개합니다! 여러분이 기다리던 신제품이 출시되었어요. 혁신적인 디자인과 뛰어난 성능을 자랑하는 우리의 신제품을 지금 만나보세요. 사전 예약 고객분들께 특별 할인 혜택을 드립니다!",
      hashtags: ["#신제품", "#런칭", "#특별할인", "#혁신", "#디자인", "#한정판매"],
      estimatedReach: 15000,
      bestPostingTime: "오후 7시 - 9시"
    },
    Facebook: {
      channel: "Facebook",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      caption: "🎉 신제품 런칭 소식을 알려드립니다!\n\n오랜 연구와 개발 끝에 드디어 여러분께 선보이게 되었습니다. 고객님들의 소중한 피드백을 반영하여 더욱 개선된 성능과 디자인으로 돌아왔습니다.\n\n💫 주요 특징:\n- 혁신적인 기능\n- 세련된 디자인\n- 합리적인 가격\n\n지금 사전 예약하시면 20% 특별 할인!",
      hashtags: ["#신제품", "#출시", "#사전예약", "#할인이벤트"],
      estimatedReach: 12000,
      bestPostingTime: "오전 10시 - 12시"
    },
    Blog: {
      channel: "Blog",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      caption: "[신제품 출시] 1년간의 개발 스토리와 제품 상세 소개\n\n안녕하세요, 여러분! 오늘은 드디어 우리의 신제품을 소개하는 특별한 날입니다. 이 제품이 탄생하기까지의 과정과 숨겨진 이야기를 함께 나누고자 합니다.\n\n개발팀은 1년간 수백 번의 프로토타입 제작과 테스트를 거쳤습니다...",
      hashtags: ["신제품", "개발스토리", "제품리뷰", "런칭"],
      estimatedReach: 8000,
      bestPostingTime: "오후 2시 - 4시"
    }
  },
  "할인 프로모션": {
    Instagram: {
      channel: "Instagram",
      imageUrl: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&q=80",
      caption: "🔥 깜짝 세일 이벤트! 오늘만 최대 50% 할인! 놓치지 마세요!\n\n이번 주말 특별 프로모션으로 전 품목 대폭 할인합니다. 장바구니에 담아두셨던 상품들을 지금 바로 만나보세요. 선착순 100명 추가 쿠폰 증정!",
      hashtags: ["#세일", "#할인", "#프로모션", "#특가", "#쇼핑", "#한정수량"],
      estimatedReach: 20000,
      bestPostingTime: "오후 8시 - 10시"
    },
    Facebook: {
      channel: "Facebook",
      imageUrl: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&q=80",
      caption: "💰 주말 특별 세일 이벤트!\n\n이번 주말 동안만 진행되는 특별 할인 행사를 알려드립니다.\n\n🎁 이벤트 혜택:\n- 전 품목 20-50% 할인\n- 5만원 이상 구매시 무료배송\n- 첫 구매 고객 추가 10% 쿠폰\n- 선착순 100명 사은품 증정\n\n이번 기회를 놓치지 마세요!",
      hashtags: ["#세일", "#할인행사", "#주말이벤트", "#특가"],
      estimatedReach: 18000,
      bestPostingTime: "오전 11시 - 1시"
    },
    Blog: {
      channel: "Blog",
      imageUrl: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&q=80",
      caption: "[이벤트] 주말 특별 세일 + 구매 가이드\n\n이번 주말 특별 세일을 맞아 인기 상품 추천과 구매 꿀팁을 정리해드립니다.\n\n▶ 카테고리별 추천 상품\n▶ 가격대별 베스트 아이템\n▶ 할인율 높은 상품 TOP 10\n\n스마트한 쇼핑으로 더 많이 절약하세요!",
      hashtags: ["세일", "할인", "쇼핑가이드", "추천템"],
      estimatedReach: 10000,
      bestPostingTime: "오전 10시 - 12시"
    }
  },
  "이벤트 홍보": {
    Instagram: {
      channel: "Instagram",
      imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
      caption: "🎊 특별한 이벤트에 여러분을 초대합니다!\n\n다음 주 토요일, 우리 브랜드의 특별한 날을 함께할 분들을 모집합니다. 제품 체험, 경품 추첨, 특별 공연까지! 참가 신청은 프로필 링크에서 가능합니다.",
      hashtags: ["#이벤트", "#초대", "#체험행사", "#경품", "#이벤트참여"],
      estimatedReach: 12000,
      bestPostingTime: "오후 6시 - 8시"
    },
    Facebook: {
      channel: "Facebook",
      imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
      caption: "🎉 [이벤트 초대] 브랜드 체험 행사에 초대합니다!\n\n📅 일시: 2024년 3월 23일 (토) 오후 2시\n📍 장소: 강남구 브랜드 플래그십 스토어\n\n🎁 이벤트 프로그램:\n- 신제품 무료 체험\n- 전문가 상담 및 가이드\n- 럭키드로우 경품 추첨\n- 참가자 전원 기념품 증정\n\n선착순 100명 한정! 지금 바로 신청하세요.",
      hashtags: ["#이벤트", "#브랜드체험", "#초대행사", "#경품이벤트"],
      estimatedReach: 15000,
      bestPostingTime: "오전 10시 - 11시"
    },
    Blog: {
      channel: "Blog",
      imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
      caption: "[이벤트 안내] 브랜드 체험 행사 상세 정보\n\n다가오는 주말, 특별한 브랜드 체험 행사를 개최합니다. 이번 포스팅에서는 행사의 모든 정보를 상세히 안내해드립니다.\n\n행사 일정, 참가 방법, 프로그램 소개, 오시는 길까지 모든 정보를 확인하세요!",
      hashtags: ["이벤트", "체험행사", "참가신청", "브랜드스토리"],
      estimatedReach: 7000,
      bestPostingTime: "오후 3시 - 5시"
    }
  },
  "브랜드 스토리": {
    Instagram: {
      channel: "Instagram",
      imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
      caption: "💫 우리의 시작 이야기를 들려드립니다.\n\n작은 아이디어에서 시작된 우리의 여정. 고객님들과 함께 성장해온 지난 시간들을 돌아봅니다. 여러분의 응원이 있었기에 가능했습니다. 앞으로도 더 나은 제품과 서비스로 보답하겠습니다.",
      hashtags: ["#브랜드스토리", "#우리의이야기", "#성장", "#감사", "#비하인드"],
      estimatedReach: 8000,
      bestPostingTime: "오후 8시 - 10시"
    },
    Facebook: {
      channel: "Facebook",
      imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
      caption: "📖 브랜드 스토리: 우리가 걸어온 길\n\n2020년 작은 스타트업으로 시작한 우리 브랜드는 고객님들의 성원에 힘입어 이제 업계를 선도하는 기업으로 성장했습니다.\n\n우리의 핵심 가치:\n✨ 고객 중심의 혁신\n✨ 지속 가능한 성장\n✨ 사회적 책임\n\n앞으로도 변함없이 최선을 다하겠습니다.",
      hashtags: ["#브랜드스토리", "#기업문화", "#비전", "#성장스토리"],
      estimatedReach: 10000,
      bestPostingTime: "오후 1시 - 3시"
    },
    Blog: {
      channel: "Blog",
      imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
      caption: "[브랜드 스토리] 시작부터 현재까지, 우리의 여정\n\n창업자의 작은 꿈에서 시작된 우리 브랜드의 이야기를 소개합니다.\n\n초기의 어려움, 첫 제품 출시의 설렘, 고객님들의 반응, 그리고 지금까지의 성장 과정을 솔직하게 담았습니다.\n\n이 모든 여정의 중심에는 항상 고객님들이 계셨습니다.",
      hashtags: ["브랜드스토리", "창업이야기", "성장기록", "기업철학"],
      estimatedReach: 6000,
      bestPostingTime: "오후 2시 - 4시"
    }
  }
};

// Performance data for different channels and time ranges
export const MOCK_PERFORMANCE_DATA: Record<string, ChannelPerformance> = {
  Instagram: {
    channel: "Instagram",
    metrics: {
      dates: ["1일", "2일", "3일", "4일", "5일", "6일", "7일"],
      views: [12000, 15000, 18000, 16000, 22000, 25000, 28000],
      engagement: [8.5, 9.2, 10.1, 9.5, 11.3, 12.5, 13.8],
      clicks: [480, 585, 720, 640, 935, 1125, 1400]
    },
    summary: {
      totalViews: 136000,
      avgEngagement: "10.7%",
      topPost: "신제품 출시 캠페인"
    }
  },
  Facebook: {
    channel: "Facebook",
    metrics: {
      dates: ["1일", "2일", "3일", "4일", "5일", "6일", "7일"],
      views: [8000, 10000, 12000, 11000, 15000, 17000, 19000],
      engagement: [6.2, 7.1, 7.8, 7.3, 8.9, 9.5, 10.2],
      clicks: [320, 450, 552, 495, 795, 935, 1102]
    },
    summary: {
      totalViews: 92000,
      avgEngagement: "8.1%",
      topPost: "주말 특별 세일"
    }
  },
  YouTube: {
    channel: "YouTube",
    metrics: {
      dates: ["1일", "2일", "3일", "4일", "5일", "6일", "7일"],
      views: [5000, 7500, 9000, 12000, 15000, 18000, 22000],
      engagement: [12.5, 13.8, 14.2, 15.5, 16.8, 17.5, 18.3],
      clicks: [375, 585, 765, 1020, 1350, 1620, 2046]
    },
    summary: {
      totalViews: 88500,
      avgEngagement: "15.5%",
      topPost: "제품 리뷰 영상"
    }
  },
  Blog: {
    channel: "Blog",
    metrics: {
      dates: ["1일", "2일", "3일", "4일", "5일", "6일", "7일"],
      views: [3000, 4000, 5500, 6000, 7500, 8500, 9500],
      engagement: [15.2, 16.5, 18.1, 17.8, 19.5, 20.8, 22.1],
      clicks: [270, 420, 627, 708, 975, 1190, 1454]
    },
    summary: {
      totalViews: 44000,
      avgEngagement: "18.6%",
      topPost: "브랜드 스토리 시리즈"
    }
  },
  TikTok: {
    channel: "TikTok",
    metrics: {
      dates: ["1일", "2일", "3일", "4일", "5일", "6일", "7일"],
      views: [15000, 22000, 28000, 35000, 42000, 50000, 58000],
      engagement: [14.5, 16.2, 17.8, 19.1, 20.5, 22.3, 24.1],
      clicks: [1125, 1782, 2492, 3332, 4410, 5750, 7250]
    },
    summary: {
      totalViews: 250000,
      avgEngagement: "19.2%",
      topPost: "챌린지 캠페인"
    }
  },
  Twitter: {
    channel: "Twitter",
    metrics: {
      dates: ["1일", "2일", "3일", "4일", "5일", "6일", "7일"],
      views: [6000, 7500, 9000, 10500, 12000, 13500, 15000],
      engagement: [5.8, 6.5, 7.2, 7.8, 8.5, 9.2, 10.1],
      clicks: [210, 293, 405, 525, 660, 810, 1020]
    },
    summary: {
      totalViews: 73500,
      avgEngagement: "7.9%",
      topPost: "실시간 이벤트 트윗"
    }
  }
};
