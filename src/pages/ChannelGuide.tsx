import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Settings,
  Link2,
  Copy,
  ChevronRight,
} from "lucide-react";
import { Instagram, Facebook, Linkedin, Youtube, MessageCircle, Zap, PenTool, Globe, Twitter } from "lucide-react";

// Channel guide data
const channelGuides: Record<string, {
  id: string;
  name: string;
  icon: any;
  color: string;
  signupUrl: string;
  autoPublish: boolean;
  difficulty: "easy" | "medium" | "hard";
  requirements?: string[];
  note?: string;
  steps: {
    title: string;
    description: string;
    link?: string;
    substeps?: string[];
  }[];
  faq: { question: string; answer: string }[];
}> = {
  instagram: {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "text-pink-500",
    signupUrl: "https://www.instagram.com/accounts/emailsignup/",
    autoPublish: true,
    difficulty: "medium",
    requirements: ["비즈니스 또는 크리에이터 계정", "Facebook 페이지 연결"],
    steps: [
      {
        title: "계정 생성",
        description: "아직 Instagram 계정이 없다면 먼저 생성하세요.",
        link: "https://www.instagram.com/accounts/emailsignup/",
        substeps: [
          "Instagram 앱 또는 웹사이트에서 회원가입",
          "이메일 또는 전화번호로 인증",
          "프로필 정보 입력 완료",
        ],
      },
      {
        title: "비즈니스 계정으로 전환",
        description: "자동 발행을 위해 비즈니스 또는 크리에이터 계정이 필요합니다.",
        substeps: [
          "Instagram 앱 → 설정 → 계정",
          '"프로페셔널 계정으로 전환" 선택',
          '"비즈니스" 또는 "크리에이터" 선택',
          "카테고리 선택 후 완료",
        ],
      },
      {
        title: "Facebook 페이지 연결",
        description: "Instagram API는 Facebook 페이지 연결이 필요합니다.",
        substeps: [
          "Instagram 설정 → 계정 → 연결된 계정",
          "Facebook 선택 → 페이지 연결",
          "(페이지가 없다면) 새 페이지 만들기",
        ],
      },
      {
        title: "Aberry에서 연동",
        description: "설정이 완료되면 Aberry에서 연동합니다.",
        substeps: [
          "Aberry 채널 페이지에서 [Instagram 연동] 클릭",
          "Facebook 로그인 → 권한 허용",
          "연동할 Instagram 계정 선택",
          "완료!",
        ],
      },
    ],
    faq: [
      {
        question: "개인 계정으로도 연동 가능한가요?",
        answer: "아니요, Instagram Graph API는 비즈니스 또는 크리에이터 계정만 지원합니다.",
      },
      {
        question: "Facebook 페이지가 꼭 필요한가요?",
        answer: "네, Instagram API는 Meta Graph API를 통해 작동하므로 Facebook 페이지 연결이 필수입니다.",
      },
      {
        question: "연동 후 어떤 기능을 사용할 수 있나요?",
        answer: "피드 게시물, 릴스, 스토리 자동 발행과 인사이트 분석이 가능합니다.",
      },
    ],
  },
  facebook: {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "text-blue-600",
    signupUrl: "https://www.facebook.com/r.php",
    autoPublish: true,
    difficulty: "medium",
    requirements: ["페이지 생성 (개인 계정으로는 발행 불가)"],
    steps: [
      {
        title: "Facebook 계정 생성",
        description: "아직 Facebook 계정이 없다면 먼저 생성하세요.",
        link: "https://www.facebook.com/r.php",
      },
      {
        title: "Facebook 페이지 생성",
        description: "비즈니스용 페이지를 생성합니다. 개인 프로필로는 자동 발행이 불가능합니다.",
        link: "https://www.facebook.com/pages/create",
        substeps: [
          "Facebook 메뉴 → 페이지 → 새 페이지 만들기",
          "페이지 이름과 카테고리 입력",
          "프로필/커버 이미지 설정",
        ],
      },
      {
        title: "Aberry에서 연동",
        description: "페이지 생성 후 Aberry에서 연동합니다.",
        substeps: [
          "Aberry 채널 페이지에서 [Facebook 연동] 클릭",
          "Facebook 로그인 → 권한 허용",
          "관리할 페이지 선택",
          "완료!",
        ],
      },
    ],
    faq: [
      {
        question: "개인 프로필에 자동 발행 가능한가요?",
        answer: "아니요, Facebook API는 페이지에만 발행을 허용합니다. 개인 프로필은 지원하지 않습니다.",
      },
      {
        question: "여러 페이지를 연동할 수 있나요?",
        answer: "네, 관리하는 모든 페이지를 선택하여 연동할 수 있습니다.",
      },
    ],
  },
  threads: {
    id: "threads",
    name: "Threads",
    icon: MessageCircle,
    color: "text-foreground",
    signupUrl: "https://www.threads.net/",
    autoPublish: true,
    difficulty: "easy",
    requirements: ["Instagram 계정 필요"],
    note: "Meta 앱 검토 승인 후 자동 발행 가능 (현재 준비 중)",
    steps: [
      {
        title: "Instagram 계정 준비",
        description: "Threads는 Instagram 계정으로 가입합니다.",
      },
      {
        title: "Threads 가입",
        description: "Instagram 계정으로 Threads에 로그인합니다.",
        link: "https://www.threads.net/",
        substeps: [
          "Threads 앱 다운로드 또는 웹사이트 방문",
          "Instagram 계정으로 로그인",
          "프로필 설정 (Instagram과 동일하게 가져오기 가능)",
        ],
      },
      {
        title: "Aberry에서 연동",
        description: "Instagram 연동 후 Threads도 함께 연동됩니다.",
        substeps: [
          "Instagram 연동이 먼저 완료되어야 합니다",
          "Threads API는 Instagram 연동 시 함께 활성화",
        ],
      },
    ],
    faq: [
      {
        question: "Instagram 없이 Threads만 사용 가능한가요?",
        answer: "아니요, Threads는 Instagram 계정이 필수입니다.",
      },
      {
        question: "Threads 글자 수 제한이 있나요?",
        answer: "네, 최대 500자까지 작성 가능합니다.",
      },
    ],
  },
  linkedin: {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "text-blue-500",
    signupUrl: "https://www.linkedin.com/signup",
    autoPublish: true,
    difficulty: "easy",
    steps: [
      {
        title: "LinkedIn 계정 생성",
        description: "아직 계정이 없다면 먼저 생성하세요.",
        link: "https://www.linkedin.com/signup",
      },
      {
        title: "프로필 완성",
        description: "비즈니스용으로 프로필을 완성합니다.",
        substeps: [
          "프로필 사진 및 배경 이미지 설정",
          "소개글 작성",
          "직함 및 회사 정보 입력",
        ],
      },
      {
        title: "Aberry에서 연동",
        description: "LinkedIn은 가장 쉽게 연동할 수 있는 채널입니다.",
        substeps: [
          "Aberry 채널 페이지에서 [LinkedIn 연동] 클릭",
          "LinkedIn 로그인 → 권한 허용",
          "완료!",
        ],
      },
    ],
    faq: [
      {
        question: "회사 페이지도 연동 가능한가요?",
        answer: "네, 개인 프로필과 관리하는 회사 페이지 모두 연동 가능합니다.",
      },
    ],
  },
  tiktok: {
    id: "tiktok",
    name: "TikTok",
    icon: Zap,
    color: "text-cyan-500",
    signupUrl: "https://www.tiktok.com/signup",
    autoPublish: true,
    difficulty: "easy",
    requirements: ["비즈니스 계정 전환 (예약 발행 시)"],
    note: "앱 감사 승인 전까지 비공개 모드로 발행",
    steps: [
      {
        title: "TikTok 계정 생성",
        description: "아직 계정이 없다면 먼저 생성하세요.",
        link: "https://www.tiktok.com/signup",
      },
      {
        title: "비즈니스 계정 전환 (선택)",
        description: "예약 발행 기능을 사용하려면 비즈니스 계정이 필요합니다.",
        substeps: [
          "TikTok 앱 → 설정 → 계정 관리",
          '"비즈니스 계정으로 전환" 선택',
          "카테고리 선택 후 완료",
        ],
      },
      {
        title: "Aberry에서 연동",
        description: "TikTok Content Posting API를 통해 연동합니다.",
        substeps: [
          "Aberry 채널 페이지에서 [TikTok 연동] 클릭",
          "TikTok 로그인 → 권한 허용",
          "완료!",
        ],
      },
    ],
    faq: [
      {
        question: "비공개 모드로 발행된다는 게 무슨 뜻인가요?",
        answer: "TikTok API 감사 전까지는 영상이 비공개로 업로드되며, 직접 공개로 전환해야 합니다.",
      },
    ],
  },
  youtube: {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    color: "text-red-500",
    signupUrl: "https://accounts.google.com/",
    autoPublish: false,
    difficulty: "medium",
    requirements: ["채널 생성", "브랜드 계정"],
    note: "영상 업로드 복잡, 분석 기능만 우선 지원",
    steps: [
      {
        title: "Google 계정 준비",
        description: "YouTube는 Google 계정으로 운영됩니다.",
        link: "https://accounts.google.com/",
      },
      {
        title: "YouTube 채널 생성",
        description: "비즈니스용 채널을 생성합니다.",
        link: "https://www.youtube.com/create_channel",
        substeps: [
          "YouTube 스튜디오 접속",
          '"채널 만들기" 클릭',
          "채널 이름 및 설정 완료",
        ],
      },
      {
        title: "브랜드 계정 설정 (선택)",
        description: "여러 관리자가 필요하다면 브랜드 계정으로 전환합니다.",
      },
      {
        title: "Aberry에서 연동",
        description: "YouTube Data API를 통해 연동합니다.",
        substeps: [
          "Aberry 채널 페이지에서 [YouTube 연동] 클릭",
          "Google 로그인 → 권한 허용",
          "연동할 채널 선택",
          "완료!",
        ],
      },
    ],
    faq: [
      {
        question: "자동 영상 업로드가 가능한가요?",
        answer: "현재는 분석 기능만 지원됩니다. 영상 업로드는 향후 지원 예정입니다.",
      },
    ],
  },
  wordpress: {
    id: "wordpress",
    name: "WordPress",
    icon: Globe,
    color: "text-blue-400",
    signupUrl: "https://wordpress.com/start",
    autoPublish: true,
    difficulty: "hard",
    note: "Self-hosted WordPress는 Application Password 설정 필요",
    steps: [
      {
        title: "WordPress 사이트 준비",
        description: "WordPress.com 또는 Self-hosted WordPress 사이트가 필요합니다.",
        link: "https://wordpress.com/start",
      },
      {
        title: "Application Password 생성 (Self-hosted)",
        description: "자체 호스팅 사이트는 Application Password가 필요합니다.",
        substeps: [
          "WordPress 관리자 → 사용자 → 프로필",
          '"Application Passwords" 섹션 찾기',
          "새 암호 이름 입력 후 생성",
          "생성된 암호 안전하게 저장",
        ],
      },
      {
        title: "Aberry에서 연동",
        description: "사이트 URL과 인증 정보를 입력합니다.",
        substeps: [
          "Aberry 채널 페이지에서 [WordPress 연동] 클릭",
          "사이트 URL 입력",
          "사용자명 + Application Password 입력",
          "연결 테스트 → 완료!",
        ],
      },
    ],
    faq: [
      {
        question: "WordPress.com과 Self-hosted 차이가 뭔가요?",
        answer:
          "WordPress.com은 호스팅이 포함된 서비스이고, Self-hosted는 직접 서버에 설치하는 방식입니다. 둘 다 연동 가능합니다.",
      },
    ],
  },
  medium: {
    id: "medium",
    name: "Medium",
    icon: PenTool,
    color: "text-foreground",
    signupUrl: "https://medium.com/m/signin",
    autoPublish: true,
    difficulty: "medium",
    note: "API가 유지보수 모드로, 제한된 기능만 지원",
    steps: [
      {
        title: "Medium 계정 생성",
        description: "Google, Facebook, 또는 이메일로 가입합니다.",
        link: "https://medium.com/m/signin",
      },
      {
        title: "Integration Token 발급",
        description: "Medium API 사용을 위해 토큰을 발급받습니다.",
        link: "https://medium.com/me/settings/security",
        substeps: [
          "Medium 설정 → Security and apps",
          '"Integration tokens" 섹션 찾기',
          "새 토큰 생성 및 복사",
        ],
      },
      {
        title: "Aberry에서 연동",
        description: "발급받은 토큰을 입력합니다.",
        substeps: [
          "Aberry 채널 페이지에서 [Medium 연동] 클릭",
          "Integration Token 입력",
          "완료!",
        ],
      },
    ],
    faq: [
      {
        question: "Medium API가 유지보수 모드라는 게 무슨 뜻인가요?",
        answer: "Medium이 API 업데이트를 중단한 상태입니다. 발행은 가능하지만, 수정/삭제 등 일부 기능이 제한됩니다.",
      },
    ],
  },
  tistory: {
    id: "tistory",
    name: "티스토리",
    icon: PenTool,
    color: "text-orange-500",
    signupUrl: "https://www.tistory.com/",
    autoPublish: false,
    difficulty: "easy",
    note: "API 종료로 자동 발행 불가, 복사+직접 게시만 지원",
    steps: [
      {
        title: "티스토리 계정 생성",
        description: "카카오 계정으로 가입합니다.",
        link: "https://www.tistory.com/",
      },
      {
        title: "블로그 개설",
        description: "새 블로그를 개설합니다.",
        substeps: [
          "티스토리 로그인",
          '"블로그 만들기" 클릭',
          "블로그 주소 및 이름 설정",
        ],
      },
      {
        title: "콘텐츠 복사 후 직접 게시",
        description: "Aberry에서 생성한 콘텐츠를 복사하여 직접 게시합니다.",
        link: "https://www.tistory.com/auth/login?redirectUrl=https://www.tistory.com/manage/post",
        substeps: [
          "Aberry에서 콘텐츠 생성",
          '"복사하기" 버튼 클릭',
          "티스토리 새 글쓰기 페이지에서 붙여넣기",
          "게시!",
        ],
      },
    ],
    faq: [
      {
        question: "왜 자동 발행이 안 되나요?",
        answer: "티스토리가 2024년 2월 API 서비스를 종료했습니다. 복사+직접 게시 방식만 지원합니다.",
      },
      {
        question: "자동화 봇으로 발행하면 안 되나요?",
        answer: "티스토리 이용약관 위반이며, 블로그가 저품질 판정을 받을 수 있습니다.",
      },
    ],
  },
  naver: {
    id: "naver",
    name: "네이버 블로그",
    icon: PenTool,
    color: "text-green-500",
    signupUrl: "https://section.blog.naver.com/",
    autoPublish: false,
    difficulty: "easy",
    note: "자동화 정책 위반으로 복사+직접 게시만 지원",
    steps: [
      {
        title: "네이버 계정 생성",
        description: "네이버 계정을 생성합니다.",
        link: "https://nid.naver.com/user2/join/agree",
      },
      {
        title: "블로그 개설",
        description: "네이버 블로그를 개설합니다.",
        link: "https://section.blog.naver.com/",
        substeps: [
          "네이버 블로그 접속",
          '"블로그 만들기" 진행',
          "블로그 이름 및 설정 완료",
        ],
      },
      {
        title: "콘텐츠 복사 후 직접 게시",
        description: "Aberry에서 생성한 콘텐츠를 복사하여 직접 게시합니다.",
        link: "https://blog.naver.com/PostWriteForm.naver",
        substeps: [
          "Aberry에서 콘텐츠 생성",
          '"복사하기" 버튼 클릭',
          "네이버 블로그 글쓰기 페이지에서 붙여넣기",
          "게시!",
        ],
      },
    ],
    faq: [
      {
        question: "왜 자동 발행이 안 되나요?",
        answer:
          '네이버 블로그 이용약관에서 "자동 프로그램 사용"을 금지하고 있습니다. 위반 시 검색 노출 제외 등 제재를 받을 수 있습니다.',
      },
      {
        question: "네이버 블로그 API는 없나요?",
        answer: "공식 API가 없으며, 비공식 방법은 이용약관 위반입니다.",
      },
    ],
  },
  twitter: {
    id: "twitter",
    name: "X (Twitter)",
    icon: Twitter,
    color: "text-foreground",
    signupUrl: "https://twitter.com/i/flow/signup",
    autoPublish: false,
    difficulty: "hard",
    note: "API 유료화($100-200/월)로 인해 후순위, 복사+직접 게시 권장",
    steps: [
      {
        title: "X 계정 생성",
        description: "X (Twitter) 계정을 생성합니다.",
        link: "https://twitter.com/i/flow/signup",
      },
      {
        title: "콘텐츠 복사 후 직접 게시",
        description: "API 비용이 높아 복사+직접 게시를 권장합니다.",
        link: "https://twitter.com/compose/tweet",
        substeps: [
          "Aberry에서 콘텐츠 생성",
          '"복사하기" 버튼 클릭',
          "X 글쓰기 페이지에서 붙여넣기",
          "게시!",
        ],
      },
    ],
    faq: [
      {
        question: "왜 자동 발행이 어려운가요?",
        answer: "X(Twitter) API가 유료화되어 월 $100-200 이상의 비용이 발생합니다.",
      },
    ],
  },
};

const ChannelGuide = () => {
  const { channel } = useParams<{ channel: string }>();
  const navigate = useNavigate();
  const guide = channel ? channelGuides[channel] : null;

  if (!guide) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">가이드를 찾을 수 없습니다</h1>
          <Button onClick={() => navigate("/channels")}>채널 목록으로</Button>
        </div>
      </div>
    );
  }

  const Icon = guide.icon;
  const difficultyLabels = {
    easy: { label: "쉬움", color: "text-green-500 bg-green-500/10 border-green-500/20" },
    medium: { label: "보통", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
    hard: { label: "복잡", color: "text-red-500 bg-red-500/10 border-red-500/20" },
  };
  const difficulty = difficultyLabels[guide.difficulty];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "1s" }} />

      <Navigation />

      <main className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <button
            onClick={() => navigate("/channels")}
            className="glass border-border/40 hover:border-primary/40 rounded-lg p-2 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4 flex-1">
            <div className={`w-14 h-14 rounded-xl glass border-border/40 flex items-center justify-center`}>
              <Icon className={`w-8 h-8 ${guide.color}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{guide.name} 연동 가이드</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${difficulty.color}`}>
                  난이도: {difficulty.label}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  guide.autoPublish
                    ? "text-green-500 bg-green-500/10 border-green-500/20"
                    : "text-orange-500 bg-orange-500/10 border-orange-500/20"
                }`}>
                  {guide.autoPublish ? "자동 발행 지원" : "복사+직접 게시"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements & Note */}
        {(guide.requirements || guide.note) && (
          <div className="glass border-border/40 rounded-xl p-6 mb-8 animate-scale-in">
            {guide.requirements && (
              <div className="mb-4">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  필수 요구사항
                </h3>
                <ul className="space-y-1">
                  {guide.requirements.map((req, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {guide.note && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm">
                  <strong>참고:</strong> {guide.note}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Signup Link */}
        <div className="glass border-border/40 rounded-xl p-6 mb-8 animate-scale-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold mb-1">계정이 없으신가요?</h3>
              <p className="text-sm text-muted-foreground">먼저 {guide.name} 계정을 만드세요</p>
            </div>
            <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              <a href={guide.signupUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                {guide.name} 가입하기
              </a>
            </Button>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            연동 단계
          </h2>

          {guide.steps.map((step, index) => (
            <div
              key={index}
              className="glass border-border/40 rounded-xl p-6 animate-scale-in"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold">{step.title}</h3>
                    {step.link && (
                      <a
                        href={step.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm flex items-center gap-1"
                      >
                        바로가기 <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-3">{step.description}</p>

                  {step.substeps && (
                    <div className="space-y-2 bg-muted/20 rounded-lg p-4">
                      {step.substeps.map((substep, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{substep}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="glass border-border/40 rounded-xl p-6 animate-scale-in" style={{ animationDelay: "0.6s" }}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-secondary" />
            자주 묻는 질문
          </h2>
          <div className="space-y-4">
            {guide.faq.map((item, index) => (
              <div key={index} className="border-b border-border/20 pb-4 last:border-0 last:pb-0">
                <p className="font-medium mb-1">Q: {item.question}</p>
                <p className="text-sm text-muted-foreground">A: {item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 flex justify-center gap-4">
          <Button variant="outline" onClick={() => navigate("/channels")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            채널 목록으로
          </Button>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90" onClick={() => navigate("/channels")}>
            <Link2 className="w-4 h-4 mr-2" />
            {guide.name} 연동하기
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ChannelGuide;
