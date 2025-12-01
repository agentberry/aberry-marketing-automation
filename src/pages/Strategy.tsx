import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useContent } from "@/contexts/ContentContext";
import {
  Lightbulb,
  Target,
  Users,
  TrendingUp,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  MessageCircle,
  Globe,
  PenTool,
  BarChart3,
  Zap,
  DollarSign,
  Clock,
  Star,
  ExternalLink,
  Copy,
  Play,
  FileText,
  Image,
  Video,
  Megaphone,
  BookOpen,
  MessageSquare,
  Heart,
  Share2,
  Eye,
  MousePointerClick,
  Percent,
  AlertCircle,
  ChevronRight,
  Link2,
  Twitter,
  Mail,
  Upload,
  Plus,
  X,
  Loader2,
  Check,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ImagePlus,
  Paperclip,
} from "lucide-react";

// 채널별 상세 정보 타입
interface ChannelStrategy {
  id: string;
  name: string;
  icon: any;
  color: string;
  score: number;
  isOrganic: boolean;
  apiSupport: "full" | "limited" | "none";
  costLevel: "free" | "low" | "high";
  audienceMatch: number;
  difficulty: "easy" | "medium" | "hard";
  bestFor: string[];
  organicApproach: {
    title: string;
    description: string;
    tactics: string[];
    frequency: string;
    bestTime: string;
  };
  contentTypes: {
    type: string;
    icon: any;
    effectiveness: number;
    description: string;
  }[];
  quickWins: string[];
  kpis: { metric: string; target: string }[];
  integrationStatus: "available" | "coming_soon" | "manual";
  integrationNote?: string;
}

// 콘텐츠 생성 관련 타입
type ContentStep = "input" | "type" | "generating" | "complete";

interface GenerationStatus {
  progress: number;
  status: "pending" | "generating" | "completed";
  estimatedTime?: number;
}

const Strategy = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addContent } = useContent();
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [executionStep, setExecutionStep] = useState(1);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    businessDescription: "",
    targetAudience: "",
    currentChannels: [] as string[],
    budget: "",
    goals: "",
    competitors: "",
  });

  // 콘텐츠 생성 Dialog 관련 상태
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [contentStep, setContentStep] = useState<ContentStep>("input");
  const [textInput, setTextInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [selectedPreviews, setSelectedPreviews] = useState<Record<string, number>>({});
  const [selectedCopies, setSelectedCopies] = useState<Record<string, number>>({});
  const [resolutions, setResolutions] = useState<Record<string, string>>({});
  const [generationStatuses, setGenerationStatuses] = useState<Record<string, GenerationStatus>>({});
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [filePreviews, setFilePreviews] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 콘텐츠 타입 정의
  const availableContentTypes = [
    { id: "instagram", name: "인스타그램 포스트", icon: Image, description: "1080x1080 정사각형 이미지" },
    { id: "facebook", name: "페이스북 광고", icon: Image, description: "1200x628 가로형 이미지" },
    { id: "video", name: "영상 콘텐츠", icon: Video, description: "1920x1080 Full HD 영상" },
    { id: "blog", name: "블로그 포스트", icon: FileText, description: "텍스트 + 이미지 조합" },
    { id: "email", name: "이메일 마케팅", icon: Mail, description: "HTML 이메일 템플릿" },
    { id: "twitter", name: "트위터 포스트", icon: MessageSquare, description: "1200x675 이미지 + 텍스트" },
  ];

  const estimatedTimes: Record<string, number> = {
    instagram: 3, facebook: 3, video: 12, blog: 5, email: 4, twitter: 3,
  };

  const mockPreviews = [
    { id: 1, thumbnail: "🎨", title: "시안 A", description: "밝고 활기찬 디자인" },
    { id: 2, thumbnail: "✨", title: "시안 B", description: "미니멀하고 세련된 디자인" },
    { id: 3, thumbnail: "🌟", title: "시안 C", description: "대담하고 강렬한 디자인" },
    { id: 4, thumbnail: "💎", title: "시안 D", description: "프리미엄 고급스러운 디자인" },
  ];

  const mockCopies = [
    { id: 1, title: "감성적 접근", copy: "당신의 특별한 순간을 더욱 빛나게 만들어드립니다. ✨" },
    { id: 2, title: "혜택 강조", copy: "🎉 특별 프로모션! 지금 구매하시면 30% 할인!" },
    { id: 3, title: "스토리텔링", copy: "수많은 고객들이 선택한 이유가 있습니다." },
  ];

  const resolutionOptions: Record<string, { label: string; value: string }[]> = {
    instagram: [{ label: "정사각형 (1080x1080)", value: "1080x1080" }, { label: "세로형 (1080x1350)", value: "1080x1350" }],
    facebook: [{ label: "가로형 (1200x628)", value: "1200x628" }],
    video: [{ label: "Full HD (1920x1080)", value: "1920x1080" }],
    blog: [{ label: "Featured 이미지 (1200x630)", value: "1200x630" }],
    email: [{ label: "헤더 배너 (600x200)", value: "600x200" }],
    twitter: [{ label: "기본 (1200x675)", value: "1200x675" }],
  };

  const industries = [
    "테크/IT",
    "이커머스/쇼핑몰",
    "F&B/음식점",
    "뷰티/화장품",
    "패션/의류",
    "교육/학원",
    "건강/피트니스",
    "부동산",
    "금융/보험",
    "여행/관광",
    "기타",
  ];

  const channels = [
    { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-500" },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-600" },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "text-blue-500" },
    { id: "youtube", name: "YouTube", icon: Youtube, color: "text-red-500" },
    { id: "threads", name: "Threads", icon: MessageCircle, color: "text-foreground" },
    { id: "tiktok", name: "TikTok", icon: Zap, color: "text-cyan-500" },
    { id: "blog", name: "블로그", icon: PenTool, color: "text-green-500" },
    { id: "website", name: "웹사이트", icon: Globe, color: "text-purple-500" },
  ];

  const handleChannelToggle = (channelId: string) => {
    setFormData((prev) => ({
      ...prev,
      currentChannels: prev.currentChannels.includes(channelId)
        ? prev.currentChannels.filter((c) => c !== channelId)
        : [...prev.currentChannels, channelId],
    }));
  };

  // 콘텐츠 생성 관련 함수들
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      addFilesWithPreviews(newFiles);
    }
  };

  const addFilesWithPreviews = (files: File[]) => {
    const newPreviews: Record<string, string> = {};
    files.forEach(file => {
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        const url = URL.createObjectURL(file);
        newPreviews[file.name + file.size] = url;
      }
    });
    setFilePreviews(prev => ({ ...prev, ...newPreviews }));
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      addFilesWithPreviews(files);
      toast({ title: "파일 추가 완료", description: `${files.length}개의 파일이 추가되었습니다.` });
    }
  }, [toast]);

  const removeFile = (index: number) => {
    const file = selectedFiles[index];
    const previewKey = file.name + file.size;
    if (filePreviews[previewKey]) {
      URL.revokeObjectURL(filePreviews[previewKey]);
      setFilePreviews(prev => {
        const updated = { ...prev };
        delete updated[previewKey];
        return updated;
      });
    }
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const getFilePreview = (file: File) => filePreviews[file.name + file.size];

  const getTypeName = (typeId: string) => availableContentTypes.find(t => t.id === typeId)?.name || "";
  const getTypeIcon = (typeId: string) => availableContentTypes.find(t => t.id === typeId)?.icon || Image;

  const simulateTypeGeneration = (typeId: string) => {
    const totalTime = estimatedTimes[typeId] || 5;
    const intervalMs = 200;
    const increment = 100 / (totalTime * (1000 / intervalMs));

    const interval = setInterval(() => {
      setGenerationStatuses(prev => {
        const current = prev[typeId];
        if (!current || current.progress >= 100) {
          clearInterval(interval);
          setSelectedPreviews(p => ({ ...p, [typeId]: 0 }));
          setSelectedCopies(c => ({ ...c, [typeId]: 0 }));
          setResolutions(r => ({ ...r, [typeId]: resolutionOptions[typeId]?.[0]?.value || "1080x1080" }));
          setExpandedCards(e => ({ ...e, [typeId]: true }));
          return { ...prev, [typeId]: { ...current, progress: 100, status: "completed" } };
        }
        return { ...prev, [typeId]: { ...current, progress: Math.min(current.progress + increment + Math.random() * 5, 100) } };
      });
    }, intervalMs);
  };

  const startGenerating = () => {
    setContentStep("generating");
    const initialStatuses: Record<string, GenerationStatus> = {};
    contentTypes.forEach(type => {
      initialStatuses[type] = { progress: 0, status: "generating", estimatedTime: estimatedTimes[type] || 5 };
    });
    setGenerationStatuses(initialStatuses);
    contentTypes.forEach((type, index) => {
      setTimeout(() => simulateTypeGeneration(type), index * 300);
    });
  };

  const isAllGenerationComplete = () => contentTypes.every(type => generationStatuses[type]?.status === "completed");
  const completedCount = contentTypes.filter(type => generationStatuses[type]?.status === "completed").length;

  const handleContentNextStep = () => {
    if (contentStep === "input" && !textInput.trim() && selectedFiles.length === 0) {
      toast({ title: "입력 필요", description: "텍스트를 입력하거나 파일을 업로드해주세요.", variant: "destructive" });
      return;
    }
    if (contentStep === "input") setContentStep("type");
    else if (contentStep === "type" && contentTypes.length > 0) startGenerating();
    else if (contentStep === "generating" && isAllGenerationComplete()) {
      contentTypes.forEach(type => {
        const newContent = {
          id: Date.now().toString() + "-" + type,
          title: `${availableContentTypes.find(t => t.id === type)?.name}`,
          description: textInput || "AI로 생성된 마케팅 콘텐츠",
          type: type as any,
          thumbnail: mockPreviews[selectedPreviews[type] ?? 0].thumbnail,
          targetUrl: "https://example.com",
          createdAt: new Date(),
          status: "draft" as const,
          performance: { views: 0, clicks: 0, conversions: 0, engagement: 0 },
          generatedContent: mockCopies[selectedCopies[type] ?? 0].copy,
          mediaUrl: undefined,
        };
        addContent(newContent);
      });
      setContentStep("complete");
      toast({ title: "콘텐츠 저장 완료", description: `${contentTypes.length}개의 콘텐츠가 성공적으로 생성되었습니다.` });
    }
  };

  const resetContentDialog = () => {
    setContentStep("input");
    setTextInput("");
    setSelectedFiles([]);
    setContentTypes([]);
    setSelectedPreviews({});
    setSelectedCopies({});
    setResolutions({});
    setGenerationStatuses({});
    setExpandedCards({});
  };

  const openContentDialog = () => {
    // 비즈니스 정보를 기반으로 기본 텍스트 입력 제안
    if (formData.businessName && formData.industry) {
      setTextInput(`${formData.businessName}의 ${formData.industry} 관련 콘텐츠를 만들어주세요. ${formData.businessDescription || ""}`);
    }
    setContentDialogOpen(true);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  // 실제 AI가 분석한 것처럼 구체적인 채널별 전략
  const channelStrategies: ChannelStrategy[] = [
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "text-pink-500",
      score: 94,
      isOrganic: true,
      apiSupport: "full",
      costLevel: "free",
      audienceMatch: 85,
      difficulty: "medium",
      bestFor: ["브랜드 인지도", "비주얼 스토리텔링", "커뮤니티 구축"],
      organicApproach: {
        title: "릴스 중심 오가닉 성장 전략",
        description: "인스타그램 알고리즘이 릴스를 강력하게 밀어주고 있어, 릴스 콘텐츠로 팔로워 없이도 노출을 극대화할 수 있습니다.",
        tactics: [
          "릴스 15-30초 숏폼 콘텐츠로 도달률 극대화",
          "트렌딩 오디오 + 업계 관련 콘텐츠 결합",
          "캐러셀 포스트로 저장수 유도 (알고리즘 가점)",
          "스토리 투표/퀴즈로 참여율 상승",
          "해시태그 10-15개 전략적 사용",
        ],
        frequency: "릴스 주 4-5회, 피드 주 2회, 스토리 매일",
        bestTime: "평일 오후 6-9시, 주말 오전 10-12시",
      },
      contentTypes: [
        { type: "릴스 (Reels)", icon: Video, effectiveness: 95, description: "15-60초 숏폼 영상, 가장 높은 도달률" },
        { type: "캐러셀", icon: Image, effectiveness: 80, description: "교육/팁 콘텐츠, 저장 유도에 최적" },
        { type: "스토리", icon: MessageSquare, effectiveness: 70, description: "일상 공유, 투표/퀴즈로 참여 유도" },
        { type: "피드 이미지", icon: Image, effectiveness: 60, description: "브랜드 이미지, 제품 소개" },
      ],
      quickWins: [
        "프로필 바이오에 CTA와 링크 추가",
        "하이라이트로 카테고리별 콘텐츠 정리",
        "경쟁사 팔로워에게 의미있는 댓글 남기기",
      ],
      kpis: [
        { metric: "도달률", target: "팔로워 대비 30%+" },
        { metric: "저장수", target: "좋아요 대비 10%+" },
        { metric: "릴스 조회수", target: "팔로워 수 이상" },
      ],
      integrationStatus: "available",
      integrationNote: "Meta 앱 검토 후 자동 발행 가능",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      color: "text-blue-500",
      score: 88,
      isOrganic: true,
      apiSupport: "full",
      costLevel: "free",
      audienceMatch: 78,
      difficulty: "easy",
      bestFor: ["B2B 리드 생성", "전문성 확보", "네트워킹"],
      organicApproach: {
        title: "전문가 포지셔닝 콘텐츠 전략",
        description: "LinkedIn은 전문성 있는 콘텐츠가 알고리즘에 의해 강력하게 확산됩니다. 광고 없이도 업계 오피니언 리더로 성장 가능합니다.",
        tactics: [
          "개인 경험 기반 인사이트 공유 (스토리텔링)",
          "업계 트렌드에 대한 의견 포스트",
          "캐러셀 PDF로 교육 콘텐츠 제공",
          "댓글로 대화 유도하는 질문형 마무리",
          "다른 전문가 글에 가치 있는 댓글 남기기",
        ],
        frequency: "주 3-4회 포스트, 매일 5-10개 댓글",
        bestTime: "평일 오전 7-9시, 점심 12-1시",
      },
      contentTypes: [
        { type: "텍스트 포스트", icon: FileText, effectiveness: 90, description: "개인 인사이트, 스토리텔링" },
        { type: "캐러셀 PDF", icon: Image, effectiveness: 85, description: "팁/가이드, 저장 유도" },
        { type: "영상", icon: Video, effectiveness: 75, description: "짧은 인사이트 영상" },
        { type: "뉴스레터", icon: FileText, effectiveness: 70, description: "정기 구독자 확보" },
      ],
      quickWins: [
        "헤드라인을 구체적 성과로 수정 (예: '마케터 → 3년간 100+ 캠페인 운영한 마케터')",
        "Featured 섹션에 대표 콘텐츠/포트폴리오 추가",
        "매일 업계 관련 글에 가치있는 댓글 5개 이상",
      ],
      kpis: [
        { metric: "노출수", target: "주당 5,000+" },
        { metric: "프로필 조회", target: "주당 100+" },
        { metric: "연결 요청", target: "주당 20+" },
      ],
      integrationStatus: "available",
    },
    {
      id: "blog",
      name: "블로그 (SEO)",
      icon: PenTool,
      color: "text-green-500",
      score: 82,
      isOrganic: true,
      apiSupport: "full",
      costLevel: "free",
      audienceMatch: 72,
      difficulty: "medium",
      bestFor: ["검색 유입", "장기 자산", "전문성 확보"],
      organicApproach: {
        title: "SEO 기반 검색 유입 전략",
        description: "블로그는 검색 엔진을 통한 지속적인 유입이 가능한 장기 자산입니다. 키워드 전략이 핵심입니다.",
        tactics: [
          "롱테일 키워드 중심 콘텐츠 작성",
          "문제 해결형 'How to' 콘텐츠",
          "내부 링크로 체류 시간 증가",
          "구조화된 데이터(Schema) 적용",
          "정기적인 콘텐츠 업데이트",
        ],
        frequency: "주 1-2회 심층 포스트 (1,500자+)",
        bestTime: "상시 (검색 기반)",
      },
      contentTypes: [
        { type: "How-to 가이드", icon: BookOpen, effectiveness: 90, description: "문제 해결형, 검색 최적화" },
        { type: "리스트 포스트", icon: FileText, effectiveness: 85, description: "'10가지 방법' 형식, 스캔 용이" },
        { type: "케이스 스터디", icon: BarChart3, effectiveness: 80, description: "신뢰도 구축, 전환 유도" },
        { type: "비교 분석", icon: Target, effectiveness: 75, description: "구매 결정 단계 타겟" },
      ],
      quickWins: [
        "기존 콘텐츠에 최신 정보 업데이트",
        "타이틀에 연도 추가 (예: '2024 가이드')",
        "메타 디스크립션에 CTA 포함",
      ],
      kpis: [
        { metric: "월간 방문자", target: "전월 대비 15%+" },
        { metric: "평균 체류시간", target: "3분+" },
        { metric: "검색 순위", target: "타겟 키워드 1페이지" },
      ],
      integrationStatus: "available",
      integrationNote: "WordPress 자동 발행 지원",
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: Zap,
      color: "text-cyan-500",
      score: 79,
      isOrganic: true,
      apiSupport: "limited",
      costLevel: "free",
      audienceMatch: 65,
      difficulty: "easy",
      bestFor: ["바이럴 확산", "젊은 층 타겟", "브랜드 인지도"],
      organicApproach: {
        title: "트렌드 서핑 바이럴 전략",
        description: "TikTok은 팔로워 수와 관계없이 콘텐츠 품질로 도달을 결정합니다. 신규 계정도 바이럴 가능성이 높습니다.",
        tactics: [
          "트렌딩 사운드/챌린지 빠르게 참여",
          "처음 1-3초에 시선 잡는 훅",
          "자막 필수 (소리 없이 보는 사용자 고려)",
          "댓글에 적극 답변으로 참여율 상승",
          "해시태그 3-5개 (덜 사용하는 게 효과적)",
        ],
        frequency: "주 5-7회 (매일이 이상적)",
        bestTime: "오후 7-9시, 점심 12-1시",
      },
      contentTypes: [
        { type: "트렌드 참여", icon: Zap, effectiveness: 95, description: "인기 사운드/챌린지 활용" },
        { type: "비하인드 씬", icon: Video, effectiveness: 85, description: "진정성 있는 일상 공유" },
        { type: "팁/튜토리얼", icon: BookOpen, effectiveness: 80, description: "짧고 실용적인 정보" },
        { type: "스토리텔링", icon: MessageSquare, effectiveness: 75, description: "경험/사례 공유" },
      ],
      quickWins: [
        "바이오에 다른 SNS 링크 추가",
        "인기 영상 댓글에 관련 영상 링크 남기기",
        "듀엣/스티치로 인기 크리에이터와 연결",
      ],
      kpis: [
        { metric: "영상 조회수", target: "팔로워의 10배+" },
        { metric: "프로필 조회", target: "일 100+" },
        { metric: "완시청률", target: "50%+" },
      ],
      integrationStatus: "coming_soon",
      integrationNote: "앱 감사 전까지 비공개 모드로 업로드",
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: Youtube,
      color: "text-red-500",
      score: 75,
      isOrganic: true,
      apiSupport: "limited",
      costLevel: "free",
      audienceMatch: 70,
      difficulty: "hard",
      bestFor: ["심층 콘텐츠", "검색 유입", "장기 자산"],
      organicApproach: {
        title: "쇼츠 + 롱폼 하이브리드 전략",
        description: "YouTube Shorts로 도달을 늘리고, 롱폼 콘텐츠로 구독자를 전환하는 전략입니다.",
        tactics: [
          "Shorts로 빠른 노출 확보 (60초 이하)",
          "Shorts에서 롱폼으로 유도하는 CTA",
          "검색 최적화된 제목과 설명",
          "썸네일 A/B 테스트",
          "챕터 마커로 SEO 강화",
        ],
        frequency: "Shorts 주 3-5회, 롱폼 주 1회",
        bestTime: "주말 오후, 평일 저녁",
      },
      contentTypes: [
        { type: "Shorts", icon: Video, effectiveness: 90, description: "60초 이하 숏폼, 도달 극대화" },
        { type: "How-to 영상", icon: BookOpen, effectiveness: 85, description: "튜토리얼, 검색 유입" },
        { type: "브이로그", icon: Video, effectiveness: 70, description: "친밀감 형성" },
        { type: "리뷰/비교", icon: Target, effectiveness: 75, description: "구매 결정 영향" },
      ],
      quickWins: [
        "기존 롱폼 영상을 Shorts로 재편집",
        "썸네일에 텍스트 3단어 이내로",
        "제목에 검색 키워드 앞에 배치",
      ],
      kpis: [
        { metric: "Shorts 조회수", target: "영상당 1,000+" },
        { metric: "구독 전환율", target: "조회수 대비 1%+" },
        { metric: "평균 시청 시간", target: "40%+" },
      ],
      integrationStatus: "coming_soon",
      integrationNote: "현재 분석 기능만 지원, 업로드는 향후 지원",
    },
    {
      id: "twitter",
      name: "X (Twitter)",
      icon: Twitter,
      color: "text-foreground",
      score: 68,
      isOrganic: true,
      apiSupport: "none",
      costLevel: "high",
      audienceMatch: 55,
      difficulty: "easy",
      bestFor: ["실시간 소통", "업계 네트워킹", "뉴스/트렌드"],
      organicApproach: {
        title: "쓰레드 기반 전문성 전략",
        description: "짧은 트윗보다 쓰레드(연결 트윗)가 더 높은 참여를 얻습니다. 전문 지식을 쓰레드로 풀어내세요.",
        tactics: [
          "쓰레드로 심층 인사이트 공유",
          "업계 인플루언서 트윗에 가치 있는 답글",
          "밈/트렌드에 브랜드 목소리로 참여",
          "폴(투표) 기능으로 참여 유도",
          "스페이스(오디오)로 실시간 소통",
        ],
        frequency: "일 3-5회 트윗, 쓰레드 주 2회",
        bestTime: "오전 9-10시, 오후 12-1시",
      },
      contentTypes: [
        { type: "쓰레드", icon: FileText, effectiveness: 90, description: "연결 트윗으로 심층 콘텐츠" },
        { type: "밈/트렌드", icon: Zap, effectiveness: 80, description: "바이럴 잠재력" },
        { type: "인사이트 트윗", icon: Lightbulb, effectiveness: 75, description: "짧고 임팩트 있는 한 줄" },
        { type: "큐레이션", icon: Share2, effectiveness: 65, description: "가치 있는 콘텐츠 공유" },
      ],
      quickWins: [
        "프로필에 대표 쓰레드 고정",
        "업계 인플루언서 리스트 만들어 모니터링",
        "알림 설정으로 빠른 트렌드 참여",
      ],
      kpis: [
        { metric: "노출수", target: "트윗당 1,000+" },
        { metric: "프로필 방문", target: "일 50+" },
        { metric: "팔로워 증가", target: "주 50+" },
      ],
      integrationStatus: "manual",
      integrationNote: "API 유료화($100+/월)로 복사+직접 게시 권장",
    },
  ];

  // 콘텐츠 방향 제안
  const contentDirections = [
    {
      type: "교육/정보형",
      percentage: 40,
      description: "타겟 고객의 문제를 해결하는 실용적인 정보",
      examples: ["업계 트렌드 분석", "How-to 가이드", "팁 & 트릭", "FAQ 콘텐츠"],
      color: "bg-blue-500",
      icon: BookOpen,
    },
    {
      type: "스토리텔링",
      percentage: 25,
      description: "브랜드와 고객의 감정적 연결을 만드는 이야기",
      examples: ["창업 스토리", "고객 성공 사례", "비하인드 씬", "팀 소개"],
      color: "bg-purple-500",
      icon: Heart,
    },
    {
      type: "참여 유도형",
      percentage: 20,
      description: "댓글, 공유, 저장을 유도하는 인터랙티브 콘텐츠",
      examples: ["투표/퀴즈", "Q&A", "챌린지", "의견 요청"],
      color: "bg-green-500",
      icon: MessageSquare,
    },
    {
      type: "프로모션",
      percentage: 15,
      description: "제품/서비스를 직접 홍보하는 전환 중심 콘텐츠",
      examples: ["제품 소개", "특별 혜택", "이벤트 안내", "리뷰 요청"],
      color: "bg-orange-500",
      icon: Megaphone,
    },
  ];

  // 주간 콘텐츠 캘린더 (더 구체적)
  const weeklyCalendar = [
    {
      day: "월",
      theme: "교육 콘텐츠",
      channels: [
        { name: "LinkedIn", content: "업계 인사이트 포스트" },
        { name: "Instagram", content: "팁 캐러셀" },
      ],
    },
    {
      day: "화",
      theme: "릴스 데이",
      channels: [
        { name: "Instagram", content: "릴스 (트렌드 오디오)" },
        { name: "TikTok", content: "같은 영상 크로스포스팅" },
      ],
    },
    {
      day: "수",
      theme: "블로그 발행",
      channels: [
        { name: "Blog", content: "심층 포스트 발행" },
        { name: "LinkedIn", content: "블로그 내용 요약 공유" },
      ],
    },
    {
      day: "목",
      theme: "참여 콘텐츠",
      channels: [
        { name: "Instagram", content: "스토리 투표/퀴즈" },
        { name: "LinkedIn", content: "의견 요청 포스트" },
      ],
    },
    {
      day: "금",
      theme: "비하인드 씬",
      channels: [
        { name: "Instagram", content: "릴스 (일상/작업 과정)" },
        { name: "LinkedIn", content: "주간 회고/배움" },
      ],
    },
    {
      day: "토",
      theme: "커뮤니티",
      channels: [
        { name: "Instagram", content: "팔로워 소통 스토리" },
        { name: "전체", content: "댓글/DM 답변" },
      ],
    },
    {
      day: "일",
      theme: "휴식/기획",
      channels: [
        { name: "-", content: "다음 주 콘텐츠 기획" },
        { name: "-", content: "성과 분석 및 인사이트" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "1s" }} />

      <Navigation />

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Lightbulb className="w-10 h-10 text-primary" />
            AI 마케팅 전략 어드바이저
          </h1>
          <p className="text-muted-foreground text-lg">
            비즈니스 정보를 입력하면 AI가 <strong>실행 가능한 오가닉 마케팅 전략</strong>을 제안합니다
          </p>
        </div>

        {!analysisComplete ? (
          <div className="max-w-3xl mx-auto">
            {/* 세련된 스텝 인디케이터 */}
            <div className="flex items-center justify-center gap-2 mb-10">
              {[
                { num: 1, label: "비즈니스" },
                { num: 2, label: "채널 & 목표" },
                { num: 3, label: "분석 시작" },
              ].map((s, i) => (
                <div key={s.num} className="flex items-center">
                  <button
                    onClick={() => s.num < step && setStep(s.num)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      step === s.num
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                        : step > s.num
                        ? "bg-primary/20 text-primary cursor-pointer hover:bg-primary/30"
                        : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step > s.num ? "bg-primary text-white" : step === s.num ? "bg-white/20" : "bg-muted"
                    }`}>
                      {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                    </span>
                    <span className="text-sm font-medium hidden sm:inline">{s.label}</span>
                  </button>
                  {i < 2 && (
                    <div className={`w-8 md:w-12 h-0.5 mx-1 rounded-full transition-all ${
                      step > s.num ? "bg-primary" : "bg-muted/50"
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: 비즈니스 정보 - 카드 스타일 */}
            {step === 1 && (
              <div className="animate-fade-in">
                {/* 헤더 */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">비즈니스에 대해 알려주세요</h2>
                  <p className="text-muted-foreground">AI가 맞춤 마케팅 전략을 제안해드립니다</p>
                </div>

                {/* 입력 폼 그리드 */}
                <div className="space-y-6">
                  {/* 브랜드명 & 업종 - 인라인 */}
                  <div className="glass border-border/40 rounded-2xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessName" className="text-sm font-medium flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center text-xs text-primary font-bold">1</span>
                          브랜드명
                        </Label>
                        <Input
                          id="businessName"
                          placeholder="예: 에이베리 스튜디오"
                          value={formData.businessName}
                          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                          className="h-12 bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="industry" className="text-sm font-medium flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center text-xs text-primary font-bold">2</span>
                          업종
                        </Label>
                        <Select
                          value={formData.industry}
                          onValueChange={(value) => setFormData({ ...formData, industry: value })}
                        >
                          <SelectTrigger className="h-12 bg-background/50">
                            <SelectValue placeholder="업종 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map((industry) => (
                              <SelectItem key={industry} value={industry}>
                                {industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* 비즈니스 설명 */}
                  <div className="glass border-border/40 rounded-2xl p-6">
                    <Label htmlFor="businessDescription" className="text-sm font-medium flex items-center gap-2 mb-3">
                      <span className="w-5 h-5 rounded bg-secondary/10 flex items-center justify-center text-xs text-secondary font-bold">3</span>
                      어떤 비즈니스인가요?
                    </Label>
                    <Textarea
                      id="businessDescription"
                      placeholder="주요 제품/서비스, 차별점, 브랜드 가치 등을 자유롭게 설명해주세요"
                      rows={3}
                      value={formData.businessDescription}
                      onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                      className="bg-background/50 resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-2">상세할수록 더 정확한 전략을 제안받을 수 있어요</p>
                  </div>

                  {/* 타겟 고객 */}
                  <div className="glass border-border/40 rounded-2xl p-6">
                    <Label htmlFor="targetAudience" className="text-sm font-medium flex items-center gap-2 mb-3">
                      <span className="w-5 h-5 rounded bg-accent/10 flex items-center justify-center text-xs text-accent font-bold">4</span>
                      타겟 고객은 누구인가요?
                    </Label>
                    <Textarea
                      id="targetAudience"
                      placeholder="예: 20-35세 여성, 서울/수도권 거주, 자기계발에 관심 있는 직장인"
                      rows={2}
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                      className="bg-background/50 resize-none"
                    />
                  </div>
                </div>

                {/* 다음 버튼 */}
                <div className="mt-8">
                  <Button
                    className="w-full h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg font-semibold rounded-2xl"
                    onClick={() => setStep(2)}
                    disabled={!formData.businessName || !formData.industry}
                  >
                    다음 단계
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    브랜드명과 업종은 필수 입력이에요
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: 채널 & 목표 */}
            {step === 2 && (
              <div className="animate-fade-in">
                {/* 헤더 */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">현재 상황을 알려주세요</h2>
                  <p className="text-muted-foreground">지금 하고 계신 마케팅 활동이 있나요?</p>
                </div>

                <div className="space-y-6">
                  {/* 현재 채널 선택 */}
                  <div className="glass border-border/40 rounded-2xl p-6">
                    <Label className="text-sm font-medium mb-4 block">사용 중인 마케팅 채널</Label>

                    {/* 처음 시작 옵션 */}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, currentChannels: [] })}
                      className={`w-full p-4 rounded-xl border-2 border-dashed transition-all flex items-center gap-3 mb-4 ${
                        formData.currentChannels.length === 0
                          ? "border-primary bg-primary/5"
                          : "border-border/40 hover:border-primary/40"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        formData.currentChannels.length === 0 ? "bg-primary/20" : "bg-muted"
                      }`}>
                        <Sparkles className={`w-5 h-5 ${formData.currentChannels.length === 0 ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div className="text-left">
                        <p className={`font-medium ${formData.currentChannels.length === 0 ? "text-primary" : ""}`}>
                          이제 막 시작해요
                        </p>
                        <p className="text-xs text-muted-foreground">아직 마케팅 채널을 운영하고 있지 않아요</p>
                      </div>
                      {formData.currentChannels.length === 0 && (
                        <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />
                      )}
                    </button>

                    {/* 채널 그리드 */}
                    <div className="grid grid-cols-4 gap-2">
                      {channels.map((channel) => (
                        <button
                          key={channel.id}
                          type="button"
                          onClick={() => handleChannelToggle(channel.id)}
                          className={`p-3 rounded-xl border transition-all text-center ${
                            formData.currentChannels.includes(channel.id)
                              ? "border-primary bg-primary/10"
                              : "border-border/40 hover:border-primary/40 hover:bg-muted/50"
                          }`}
                        >
                          <channel.icon className={`w-5 h-5 mx-auto mb-1.5 ${channel.color}`} />
                          <span className="text-xs font-medium">{channel.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 예산 & 목표 - 2열 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass border-border/40 rounded-2xl p-6">
                      <Label className="text-sm font-medium flex items-center gap-2 mb-3">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        월 마케팅 예산
                      </Label>
                      <Select
                        value={formData.budget}
                        onValueChange={(value) => setFormData({ ...formData, budget: value })}
                      >
                        <SelectTrigger className="h-12 bg-background/50">
                          <SelectValue placeholder="선택 (선택사항)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">무료 (오가닉만)</SelectItem>
                          <SelectItem value="50">~50만원</SelectItem>
                          <SelectItem value="100">50~100만원</SelectItem>
                          <SelectItem value="300">100~300만원</SelectItem>
                          <SelectItem value="500">300~500만원</SelectItem>
                          <SelectItem value="1000">500만원 이상</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="glass border-border/40 rounded-2xl p-6">
                      <Label className="text-sm font-medium flex items-center gap-2 mb-3">
                        <Target className="w-4 h-4 text-primary" />
                        주요 목표
                      </Label>
                      <Select
                        value={formData.goals}
                        onValueChange={(value) => setFormData({ ...formData, goals: value })}
                      >
                        <SelectTrigger className="h-12 bg-background/50">
                          <SelectValue placeholder="선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="awareness">브랜드 인지도 향상</SelectItem>
                          <SelectItem value="leads">리드/문의 생성</SelectItem>
                          <SelectItem value="sales">매출 증가</SelectItem>
                          <SelectItem value="community">커뮤니티 구축</SelectItem>
                          <SelectItem value="engagement">고객 참여 증대</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* 버튼 영역 */}
                <div className="mt-8 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-14 rounded-2xl"
                  >
                    이전
                  </Button>
                  <Button
                    className="flex-[2] h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg font-semibold rounded-2xl"
                    onClick={() => setStep(3)}
                  >
                    다음 단계
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: 분석 시작 */}
            {step === 3 && (
              <div className="animate-fade-in">
                {/* 헤더 */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">마지막 단계예요!</h2>
                  <p className="text-muted-foreground">경쟁사 정보는 선택사항이에요</p>
                </div>

                <div className="space-y-6">
                  {/* 경쟁사 입력 (선택) */}
                  <div className="glass border-border/40 rounded-2xl p-6">
                    <Label htmlFor="competitors" className="text-sm font-medium flex items-center gap-2 mb-3">
                      <BarChart3 className="w-4 h-4 text-accent" />
                      경쟁사 정보 (선택)
                    </Label>
                    <Textarea
                      id="competitors"
                      placeholder="경쟁사 이름이나 SNS 계정을 입력하면 더 정확한 전략을 받을 수 있어요"
                      rows={3}
                      value={formData.competitors}
                      onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
                      className="bg-background/50 resize-none"
                    />
                  </div>

                  {/* AI 분석 미리보기 */}
                  <div className="glass border-border/40 rounded-2xl p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">AI가 분석해드릴 내용</p>
                        <p className="text-xs text-muted-foreground">입력하신 정보를 바탕으로 맞춤 전략을 제안합니다</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: Target, label: "최적 채널 추천", color: "text-primary" },
                        { icon: FileText, label: "콘텐츠 방향", color: "text-secondary" },
                        { icon: Calendar, label: "발행 일정", color: "text-accent" },
                        { icon: TrendingUp, label: "성장 전략", color: "text-green-500" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2 p-3 rounded-xl bg-background/50">
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                          <span className="text-sm">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 분석 진행 상태 */}
                  {isAnalyzing && (
                    <div className="glass border-primary/30 rounded-2xl p-6 animate-pulse">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-white animate-spin" />
                        </div>
                        <div>
                          <p className="font-semibold">AI가 전략을 분석하고 있어요</p>
                          <p className="text-sm text-muted-foreground">잠시만 기다려주세요...</p>
                        </div>
                      </div>
                      <Progress value={66} className="h-2" />
                    </div>
                  )}
                </div>

                {/* 버튼 영역 */}
                <div className="mt-8 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex-1 h-14 rounded-2xl"
                    disabled={isAnalyzing}
                  >
                    이전
                  </Button>
                  <Button
                    className="flex-[2] h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg font-semibold rounded-2xl"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                        분석 중...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        맞춤 전략 받기
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Analysis Results - 단계별 실행 가이드 */
          <div className="space-y-6 animate-fade-in">
            {/* 전략 요약 헤더 */}
            <div className="glass border-border/40 rounded-xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">맞춤 전략이 준비되었습니다!</h2>
              <p className="text-muted-foreground">
                아래 6단계를 순서대로 진행하면 마케팅을 시작할 수 있어요
              </p>
            </div>

            {/* 진행 상황 표시 */}
            <div className="flex items-center justify-center gap-0.5">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    executionStep >= num
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {executionStep > num ? <CheckCircle2 className="w-3 h-3" /> : num}
                  </div>
                  {num < 6 && (
                    <div className={`w-6 h-0.5 mx-0.5 rounded ${
                      executionStep > num ? "bg-primary" : "bg-muted"
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: 채널 선택 */}
            <div className={`glass border-border/40 rounded-xl overflow-hidden transition-all ${
              executionStep === 1 ? "border-primary" : ""
            }`}>
              <div
                className="p-6 cursor-pointer"
                onClick={() => setExecutionStep(executionStep === 1 ? 0 : 1)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    executionStep > 1
                      ? "bg-green-500 text-white"
                      : executionStep === 1
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {executionStep > 1 ? <CheckCircle2 className="w-6 h-6" /> : "1"}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">채널 선택하기</h3>
                    <p className="text-sm text-muted-foreground">
                      {executionStep > 1
                        ? `${selectedChannels.length}개 채널 선택 완료`
                        : "추천 채널 중 시작할 채널을 1-2개 선택하세요"}
                    </p>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                    executionStep === 1 ? "rotate-90" : ""
                  }`} />
                </div>
              </div>

              {executionStep === 1 && (
                <div className="px-6 pb-6 border-t border-border/40 pt-4 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    💡 처음에는 1-2개 채널에 집중하세요. 익숙해지면 확장할 수 있어요.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {channelStrategies.slice(0, 6).map((channel) => (
                      <div
                        key={channel.id}
                        onClick={() => {
                          if (selectedChannels.includes(channel.id)) {
                            setSelectedChannels(selectedChannels.filter(c => c !== channel.id));
                          } else if (selectedChannels.length < 3) {
                            setSelectedChannels([...selectedChannels, channel.id]);
                          }
                        }}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedChannels.includes(channel.id)
                            ? "border-primary bg-primary/10"
                            : "border-border/40 hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            selectedChannels.includes(channel.id) ? "bg-primary/20" : "bg-muted"
                          }`}>
                            <channel.icon className={`w-5 h-5 ${channel.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{channel.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {channel.score}점
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{channel.organicApproach.title}</p>
                          </div>
                          {selectedChannels.includes(channel.id) && (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-secondary"
                    disabled={selectedChannels.length === 0}
                    onClick={() => setExecutionStep(2)}
                  >
                    {selectedChannels.length > 0 ? `${selectedChannels.length}개 채널로 계속` : "채널을 선택해주세요"}
                  </Button>
                </div>
              )}
            </div>

            {/* Step 2: 콘텐츠 방향 확인 */}
            <div className={`glass border-border/40 rounded-xl overflow-hidden transition-all ${
              executionStep === 2 ? "border-primary" : ""
            }`}>
              <div
                className={`p-6 ${executionStep >= 1 ? "cursor-pointer" : "opacity-50"}`}
                onClick={() => executionStep >= 1 && setExecutionStep(executionStep === 2 ? 1 : 2)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    executionStep > 2
                      ? "bg-green-500 text-white"
                      : executionStep === 2
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {executionStep > 2 ? <CheckCircle2 className="w-6 h-6" /> : "2"}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">콘텐츠 황금 비율</h3>
                    <p className="text-sm text-muted-foreground">
                      {executionStep > 2 ? "확인 완료" : "어떤 종류의 콘텐츠를 얼마나 만들지 확인하세요"}
                    </p>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                    executionStep === 2 ? "rotate-90" : ""
                  }`} />
                </div>
              </div>

              {executionStep === 2 && (
                <div className="px-6 pb-6 border-t border-border/40 pt-4 space-y-4">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm font-medium text-primary mb-2">핵심 원칙: 홍보는 15%만!</p>
                    <p className="text-xs text-muted-foreground">
                      교육/정보 콘텐츠로 신뢰를 쌓고, 참여 콘텐츠로 관계를 만들어야 프로모션이 효과적입니다.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {contentDirections.map((content) => (
                      <div key={content.type} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${content.color}/20 flex items-center justify-center flex-shrink-0`}>
                          <content.icon className={`w-4 h-4 ${content.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{content.type}</span>
                            <span className="text-sm font-bold">{content.percentage}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${content.color}`}
                              style={{ width: `${content.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-primary to-secondary"
                    onClick={() => setExecutionStep(3)}
                  >
                    이해했어요, 다음 단계로
                  </Button>
                </div>
              )}
            </div>

            {/* Step 3: 첫 콘텐츠 만들기 */}
            <div className={`glass border-border/40 rounded-xl overflow-hidden transition-all ${
              executionStep === 3 ? "border-primary" : ""
            }`}>
              <div
                className={`p-6 ${executionStep >= 2 ? "cursor-pointer" : "opacity-50"}`}
                onClick={() => executionStep >= 2 && setExecutionStep(executionStep === 3 ? 2 : 3)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    executionStep > 3
                      ? "bg-green-500 text-white"
                      : executionStep === 3
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {executionStep > 3 ? <CheckCircle2 className="w-6 h-6" /> : "3"}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">첫 콘텐츠 만들기</h3>
                    <p className="text-sm text-muted-foreground">
                      {executionStep > 3 ? "콘텐츠 생성 완료" : "AI가 첫 번째 콘텐츠를 만들어드려요"}
                    </p>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                    executionStep === 3 ? "rotate-90" : ""
                  }`} />
                </div>
              </div>

              {executionStep === 3 && (
                <div className="px-6 pb-6 border-t border-border/40 pt-4 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    💡 첫 콘텐츠로 <span className="text-primary font-medium">교육/정보형</span>을 추천해요.
                    팔로워에게 가치를 먼저 제공하면 신뢰가 쌓입니다.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {contentDirections.slice(0, 2).map((content) => (
                      <div
                        key={content.type}
                        className={`p-4 rounded-lg ${content.color}/10 border ${content.color.replace('bg-', 'border-')}/20`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <content.icon className={`w-4 h-4 ${content.color.replace('bg-', 'text-')}`} />
                          <span className="font-medium text-sm">{content.type.split('/')[0]}</span>
                        </div>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {content.examples.slice(0, 2).map((example) => (
                            <li key={example}>• {example}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-primary to-secondary"
                    onClick={openContentDialog}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI로 콘텐츠 만들기
                  </Button>

                  <button
                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setExecutionStep(4)}
                  >
                    나중에 만들게요, 다음 단계로 →
                  </button>
                </div>
              )}
            </div>

            {/* Step 4: 채널 연동 */}
            <div className={`glass border-border/40 rounded-xl overflow-hidden transition-all ${
              executionStep === 4 ? "border-primary" : ""
            }`}>
              <div
                className={`p-6 ${executionStep >= 3 ? "cursor-pointer" : "opacity-50"}`}
                onClick={() => executionStep >= 3 && setExecutionStep(executionStep === 4 ? 3 : 4)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    executionStep > 4
                      ? "bg-green-500 text-white"
                      : executionStep === 4
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {executionStep > 4 ? <CheckCircle2 className="w-6 h-6" /> : "4"}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">채널 연동하기</h3>
                    <p className="text-sm text-muted-foreground">
                      {executionStep > 4 ? "연동 완료" : "선택한 채널을 연동하면 자동 발행이 가능해요"}
                    </p>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                    executionStep === 4 ? "rotate-90" : ""
                  }`} />
                </div>
              </div>

              {executionStep === 4 && (
                <div className="px-6 pb-6 border-t border-border/40 pt-4 space-y-4">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm font-medium mb-1">채널을 연동하면 할 수 있는 것들</p>
                    <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        콘텐츠 자동 발행 및 예약
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        실시간 성과 분석 및 리포트
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        AI 기반 최적 발행 시간 추천
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    {/* 선택한 채널이 있으면 선택한 채널 표시, 없으면 추천 채널 상위 3개 표시 */}
                    {(selectedChannels.length > 0 ? selectedChannels : ["instagram", "linkedin", "blog"]).map((channelId) => {
                      const channel = channelStrategies.find(c => c.id === channelId);
                      if (!channel) return null;
                      return (
                        <div
                          key={channelId}
                          className="flex items-center gap-3 p-4 rounded-lg border border-border/40 hover:border-primary/40 transition-all"
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-muted`}>
                            <channel.icon className={`w-5 h-5 ${channel.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{channel.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {channel.integrationStatus === "available"
                                ? "연동 가능"
                                : channel.integrationStatus === "coming_soon"
                                ? "곧 지원 예정"
                                : "수동 관리"}
                            </p>
                          </div>
                          {channel.integrationStatus === "available" ? (
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-primary to-secondary text-xs h-8"
                              onClick={() => navigate("/channels")}
                            >
                              <Link2 className="w-3 h-3 mr-1" />
                              연동하기
                            </Button>
                          ) : channel.integrationStatus === "coming_soon" ? (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              Coming Soon
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                              수동 관리
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {selectedChannels.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center">
                      Step 1에서 채널을 선택하지 않았다면, 위 추천 채널로 시작해보세요
                    </p>
                  )}

                  <Button
                    className="w-full bg-gradient-to-r from-primary to-secondary"
                    onClick={() => setExecutionStep(5)}
                  >
                    다음 단계로
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <button
                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setExecutionStep(5)}
                  >
                    나중에 연동할게요, 다음 단계로 →
                  </button>
                </div>
              )}
            </div>

            {/* Step 5: 주간 발행 일정 */}
            <div className={`glass border-border/40 rounded-xl overflow-hidden transition-all ${
              executionStep === 5 ? "border-primary" : ""
            }`}>
              <div
                className={`p-6 ${executionStep >= 4 ? "cursor-pointer" : "opacity-50"}`}
                onClick={() => executionStep >= 4 && setExecutionStep(executionStep === 5 ? 4 : 5)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    executionStep > 5
                      ? "bg-green-500 text-white"
                      : executionStep === 5
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {executionStep > 5 ? <CheckCircle2 className="w-6 h-6" /> : "5"}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">주간 발행 일정</h3>
                    <p className="text-sm text-muted-foreground">
                      {executionStep > 5 ? "일정 확인 완료" : "일관된 발행이 성장의 핵심이에요"}
                    </p>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                    executionStep === 5 ? "rotate-90" : ""
                  }`} />
                </div>
              </div>

              {executionStep === 5 && (
                <div className="px-6 pb-6 border-t border-border/40 pt-4 space-y-4">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm font-medium mb-1">처음에는 주 3회부터 시작하세요</p>
                    <p className="text-xs text-muted-foreground">
                      완벽한 콘텐츠보다 꾸준한 발행이 더 중요합니다. 익숙해지면 점차 늘려가세요.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {weeklyCalendar.filter(d => d.day !== "일").map((day) => (
                      <div
                        key={day.day}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border/40"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                          {day.day}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{day.theme}</p>
                          <p className="text-xs text-muted-foreground">
                            {day.channels[0]?.content}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {day.channels.length}개 채널
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-primary to-secondary"
                    onClick={() => setExecutionStep(6)}
                  >
                    이해했어요, 다음 단계로
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>

            {/* Step 6: 캠페인 만들기 */}
            <div className={`glass border-border/40 rounded-xl overflow-hidden transition-all ${
              executionStep === 6 ? "border-primary" : ""
            }`}>
              <div
                className={`p-6 ${executionStep >= 5 ? "cursor-pointer" : "opacity-50"}`}
                onClick={() => executionStep >= 5 && setExecutionStep(executionStep === 6 ? 5 : 6)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    executionStep > 6
                      ? "bg-green-500 text-white"
                      : executionStep === 6
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {executionStep > 6 ? <CheckCircle2 className="w-6 h-6" /> : "6"}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">첫 캠페인 시작</h3>
                    <p className="text-sm text-muted-foreground">
                      콘텐츠를 캠페인에 담아 발행해보세요
                    </p>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                    executionStep === 6 ? "rotate-90" : ""
                  }`} />
                </div>
              </div>

              {executionStep === 6 && (
                <div className="px-6 pb-6 border-t border-border/40 pt-4 space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/5 to-green-500/10 border border-green-500/20">
                    <p className="text-sm font-medium mb-1 text-green-600">🎉 마케팅을 시작할 준비가 되었어요!</p>
                    <p className="text-xs text-muted-foreground">
                      이제 캠페인을 만들어 콘텐츠를 발행하면 마케팅이 시작됩니다.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-primary">{selectedChannels.length || 3}</p>
                      <p className="text-xs text-muted-foreground">선택 채널</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-secondary">3+</p>
                      <p className="text-xs text-muted-foreground">주간 콘텐츠</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-accent">40%</p>
                      <p className="text-xs text-muted-foreground">교육 콘텐츠</p>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-primary to-secondary h-12"
                    onClick={() => navigate("/campaigns")}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    첫 캠페인 만들기
                  </Button>
                </div>
              )}
            </div>

            {/* 다시 분석 버튼 */}
            <div className="text-center pt-4">
              <button
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => {
                  setAnalysisComplete(false);
                  setStep(1);
                  setSelectedChannel(null);
                  setExecutionStep(1);
                  setSelectedChannels([]);
                }}
              >
                ← 새로운 분석 시작하기
              </button>
            </div>
          </div>
        )}

        {/* 콘텐츠 생성 Dialog */}
        <Dialog
          open={contentDialogOpen}
          onOpenChange={(open) => {
            setContentDialogOpen(open);
            if (!open) resetContentDialog();
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass border-border/40">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                AI 콘텐츠 생성
              </DialogTitle>
            </DialogHeader>

            {/* Step Progress (input & type 단계에서만) */}
            {contentStep !== "complete" && contentStep !== "generating" && (
              <div className="flex items-center justify-center gap-2 py-4">
                {[
                  { step: "input", num: 1, label: "입력" },
                  { step: "type", num: 2, label: "타입 선택" },
                  { step: "generating", num: 3, label: "생성" },
                ].map((s, i) => (
                  <div key={s.step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      (contentStep === s.step) || (contentStep === "type" && s.num < 2) || (contentStep === "generating" && s.num < 3)
                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {(contentStep === "type" && s.num === 1) || (contentStep === "generating" && s.num < 3)
                        ? <Check className="w-4 h-4" />
                        : s.num}
                    </div>
                    {i < 2 && (
                      <div className={`w-12 h-1 mx-2 rounded ${
                        (contentStep === "type" && s.num === 1) || (contentStep === "generating")
                          ? "bg-primary"
                          : "bg-muted"
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Step 1: 입력 */}
            {contentStep === "input" && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <Label className="text-sm font-medium mb-2 block">콘텐츠 설명</Label>
                  <Textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="어떤 콘텐츠를 만들고 싶은지 설명해주세요..."
                    className="glass border-border/40 min-h-[100px] resize-none"
                  />
                </div>

                {/* 파일 업로드 영역 */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                    isDragging
                      ? "border-primary bg-primary/10"
                      : "border-border/40 hover:border-primary/40"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                  <p className="text-sm font-medium mb-1">
                    {isDragging ? "여기에 놓으세요!" : "참조 파일 업로드 (선택)"}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">이미지, 영상 파일 드래그 또는</p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    size="sm"
                    type="button"
                    className="glass border-border/40"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    파일 선택
                  </Button>
                </div>

                {/* 업로드된 파일 목록 */}
                {selectedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="relative group w-16 h-16 rounded-lg overflow-hidden border border-border/40"
                      >
                        {file.type.startsWith("image/") ? (
                          <img src={getFilePreview(file)} alt={file.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <Video className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                        <button
                          onClick={() => removeFile(idx)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  onClick={handleContentNextStep}
                  disabled={!textInput.trim() && selectedFiles.length === 0}
                  className="w-full bg-gradient-to-r from-primary to-secondary h-11"
                >
                  다음 단계
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: 타입 선택 */}
            {contentStep === "type" && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <Label className="text-sm font-medium mb-3 block">콘텐츠 타입 선택 (복수 선택 가능)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableContentTypes.map((type) => {
                      const isSelected = contentTypes.includes(type.id);
                      return (
                        <div
                          key={type.id}
                          onClick={() => {
                            if (isSelected) {
                              setContentTypes(contentTypes.filter(t => t !== type.id));
                            } else {
                              setContentTypes([...contentTypes, type.id]);
                            }
                          }}
                          className={`glass border rounded-lg p-4 cursor-pointer transition-all hover:scale-105 ${
                            isSelected ? "border-primary bg-primary/10" : "border-border/40 hover:border-primary/40"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Checkbox checked={isSelected} className="h-4 w-4" />
                            <type.icon className={`w-5 h-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                          </div>
                          <p className="font-medium text-sm">{type.name}</p>
                          <p className="text-xs text-muted-foreground">{type.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setContentStep("input")}
                    variant="outline"
                    className="flex-1 h-11 glass border-border/40"
                  >
                    이전
                  </Button>
                  <Button
                    onClick={handleContentNextStep}
                    disabled={contentTypes.length === 0}
                    className="flex-[2] h-11 bg-gradient-to-r from-primary to-secondary"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {contentTypes.length}개 콘텐츠 생성
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: 생성 중 / 결과 */}
            {contentStep === "generating" && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {isAllGenerationComplete() ? "생성 완료!" : "콘텐츠 생성 중..."}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {completedCount}/{contentTypes.length}개 완료
                    </p>
                  </div>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {contentTypes.map((typeId) => {
                    const TypeIcon = getTypeIcon(typeId);
                    const status = generationStatuses[typeId];
                    const isCompleted = status?.status === "completed";
                    const progress = status?.progress || 0;
                    const isExpanded = expandedCards[typeId];
                    const selectedPreviewIndex = selectedPreviews[typeId] ?? 0;
                    const selectedCopyIndex = selectedCopies[typeId] ?? 0;

                    return (
                      <div
                        key={typeId}
                        className={`glass border-border/40 rounded-lg overflow-hidden ${isCompleted ? "" : "opacity-90"}`}
                      >
                        <div className="p-3 flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isCompleted ? "bg-green-500/10" : "bg-primary/10"
                          }`}>
                            {isCompleted ? (
                              <Check className="w-5 h-5 text-green-500" />
                            ) : (
                              <Loader2 className="w-5 h-5 text-primary animate-spin" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{getTypeName(typeId)}</p>
                            {!isCompleted && (
                              <div className="w-full h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            )}
                          </div>
                          {isCompleted && (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-lg">
                                {mockPreviews[selectedPreviewIndex].thumbnail}
                              </div>
                              <button
                                onClick={() => setExpandedCards(prev => ({ ...prev, [typeId]: !prev[typeId] }))}
                                className="p-1 hover:bg-muted rounded"
                              >
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            </div>
                          )}
                        </div>

                        {isCompleted && isExpanded && (
                          <div className="px-3 pb-3 border-t border-border/40 pt-3 space-y-3">
                            {/* 시안 선택 */}
                            <div>
                              <Label className="text-xs text-muted-foreground mb-2 block">시안 선택</Label>
                              <div className="flex gap-2">
                                {mockPreviews.map((preview, index) => (
                                  <button
                                    key={preview.id}
                                    onClick={() => setSelectedPreviews({ ...selectedPreviews, [typeId]: index })}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all ${
                                      selectedPreviewIndex === index
                                        ? "ring-2 ring-primary bg-primary/10"
                                        : "bg-muted hover:bg-muted/80"
                                    }`}
                                  >
                                    {preview.thumbnail}
                                  </button>
                                ))}
                              </div>
                            </div>
                            {/* 문구 선택 */}
                            <div>
                              <Label className="text-xs text-muted-foreground mb-2 block">마케팅 문구</Label>
                              <div className="space-y-1">
                                {mockCopies.map((copy, index) => (
                                  <button
                                    key={copy.id}
                                    onClick={() => setSelectedCopies({ ...selectedCopies, [typeId]: index })}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                                      selectedCopyIndex === index
                                        ? "bg-primary/10 border border-primary"
                                        : "glass border border-border/40 hover:border-primary/40"
                                    }`}
                                  >
                                    <span className="font-medium">{copy.title}</span>
                                    <span className="text-muted-foreground ml-2">{copy.copy.slice(0, 30)}...</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setContentStep("type")}
                    variant="outline"
                    className="flex-1 h-11 glass border-border/40"
                  >
                    이전
                  </Button>
                  <Button
                    onClick={handleContentNextStep}
                    disabled={!isAllGenerationComplete()}
                    className="flex-[2] h-11 bg-gradient-to-r from-primary to-secondary"
                  >
                    {isAllGenerationComplete() ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        콘텐츠 저장하기
                      </>
                    ) : (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        생성 중...
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: 완료 */}
            {contentStep === "complete" && (
              <div className="text-center py-6 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">콘텐츠 생성 완료!</h3>
                <p className="text-muted-foreground mb-6">
                  {contentTypes.length}개의 콘텐츠가 저장되었습니다.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 glass border-border/40"
                    onClick={() => {
                      setContentDialogOpen(false);
                      resetContentDialog();
                      setExecutionStep(4);
                    }}
                  >
                    다음 단계로
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-primary to-secondary"
                    onClick={() => navigate("/content")}
                  >
                    콘텐츠 확인하기
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Strategy;
