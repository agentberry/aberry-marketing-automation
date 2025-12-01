import { useState, useRef, useCallback } from "react";
import { ArrowLeft, Sparkles, Coins, Check, Image, Video, FileText, Mail, MessageSquare, X, Plus, Paperclip, Loader2, RefreshCw, ChevronDown, ChevronUp, Upload, ImagePlus, Play } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useContent } from "@/contexts/ContentContext";

type Step = "input" | "type" | "generating" | "complete";

// 각 타입별 생성 상태
interface GenerationStatus {
  progress: number;
  status: "pending" | "generating" | "completed";
  estimatedTime?: number; // 예상 소요 시간 (초)
}

const ContentGenerate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addContent } = useContent();
  
  const [currentStep, setCurrentStep] = useState<Step>("input");
  const [textInput, setTextInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [textAttachments, setTextAttachments] = useState<{ id: string; text: string }[]>([]);
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [selectedPreviews, setSelectedPreviews] = useState<Record<string, number>>({});
  const [selectedCopies, setSelectedCopies] = useState<Record<string, number>>({});
  const [resolutions, setResolutions] = useState<Record<string, string>>({});
  const [savedContentIds, setSavedContentIds] = useState<string[]>([]);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedPreviewDetail, setSelectedPreviewDetail] = useState<{ typeId: string; previewIndex: number } | null>(null);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [generationStatuses, setGenerationStatuses] = useState<Record<string, GenerationStatus>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 타입별 예상 생성 시간 (초)
  const estimatedTimes: Record<string, number> = {
    instagram: 3,
    facebook: 3,
    video: 12, // 영상은 오래 걸림
    blog: 5,
    email: 4,
    twitter: 3,
  };

  const availableContentTypes = [
    { id: "instagram", name: "인스타그램 포스트", icon: Image, description: "1080x1080 정사각형 이미지" },
    { id: "facebook", name: "페이스북 광고", icon: Image, description: "1200x628 가로형 이미지" },
    { id: "video", name: "영상 콘텐츠", icon: Video, description: "1920x1080 Full HD 영상" },
    { id: "blog", name: "블로그 포스트", icon: FileText, description: "텍스트 + 이미지 조합" },
    { id: "email", name: "이메일 마케팅", icon: Mail, description: "HTML 이메일 템플릿" },
    { id: "twitter", name: "트위터 포스트", icon: MessageSquare, description: "1200x675 이미지 + 텍스트" },
  ];

  // Mock previews
  const mockPreviews = [
    { 
      id: 1, 
      thumbnail: "🎨", 
      title: "시안 A", 
      description: "밝고 활기찬 디자인",
      details: "여름 시즌에 최적화된 밝은 컬러와 다이나믹한 레이아웃으로 시선을 사로잡습니다.",
      colors: ["#FF6B6B", "#FFD93D", "#6BCF7F"],
      style: "Modern & Vibrant"
    },
    { 
      id: 2, 
      thumbnail: "✨", 
      title: "시안 B", 
      description: "미니멀하고 세련된 디자인",
      details: "깔끔한 여백과 타이포그래피 중심의 세련된 레이아웃으로 전문성을 강조합니다.",
      colors: ["#2C3E50", "#ECF0F1", "#3498DB"],
      style: "Minimalist & Clean"
    },
    { 
      id: 3, 
      thumbnail: "🌟", 
      title: "시안 C", 
      description: "대담하고 강렬한 디자인",
      details: "강렬한 대비와 큰 타이포그래피로 즉각적인 주목을 유도합니다.",
      colors: ["#E74C3C", "#000000", "#FFFFFF"],
      style: "Bold & Dramatic"
    },
    { 
      id: 4, 
      thumbnail: "💎", 
      title: "시안 D", 
      description: "프리미엄 고급스러운 디자인",
      details: "우아한 그라데이션과 섬세한 디테일로 프리미엄 브랜드 이미지를 전달합니다.",
      colors: ["#8E44AD", "#3498DB", "#F39C12"],
      style: "Luxury & Premium"
    },
  ];

  // Mock marketing copies
  const mockCopies = [
    { id: 1, title: "감성적 접근", copy: "당신의 특별한 순간을 더욱 빛나게 만들어드립니다. ✨\n지금 바로 경험해보세요!\n\n#특별한순간 #프리미엄경험 #지금바로" },
    { id: 2, title: "혜택 강조", copy: "🎉 특별 프로모션! 지금 구매하시면 30% 할인!\n\n기간 한정 특가\n무료 배송 + 사은품 증정\n\n놓치지 마세요! 👉" },
    { id: 3, title: "스토리텔링", copy: "수많은 고객들이 선택한 이유가 있습니다.\n\n💬 \"인생템 찾았어요!\"\n⭐ 평점 4.9/5.0\n\n당신도 경험해보세요." },
  ];

  const resolutionOptions: Record<string, { label: string; value: string }[]> = {
    instagram: [
      { label: "정사각형 (1080x1080)", value: "1080x1080" },
      { label: "세로형 (1080x1350)", value: "1080x1350" },
      { label: "스토리 (1080x1920)", value: "1080x1920" },
    ],
    facebook: [
      { label: "가로형 (1200x628)", value: "1200x628" },
      { label: "정사각형 (1080x1080)", value: "1080x1080" },
    ],
    video: [
      { label: "Full HD (1920x1080)", value: "1920x1080" },
      { label: "4K (3840x2160)", value: "3840x2160" },
      { label: "세로형 (1080x1920)", value: "1080x1920" },
    ],
    blog: [
      { label: "Featured 이미지 (1200x630)", value: "1200x630" },
      { label: "본문 이미지 (800x600)", value: "800x600" },
    ],
    email: [
      { label: "헤더 배너 (600x200)", value: "600x200" },
      { label: "본문 이미지 (600x400)", value: "600x400" },
    ],
    twitter: [
      { label: "기본 (1200x675)", value: "1200x675" },
      { label: "정사각형 (1080x1080)", value: "1080x1080" },
    ],
  };

  const [isDragging, setIsDragging] = useState(false);
  const [filePreviews, setFilePreviews] = useState<Record<string, string>>({});

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
      toast({
        title: "파일 추가 완료",
        description: `${files.length}개의 파일이 추가되었습니다.`,
      });
    }
  }, [toast]);

  const handleTextPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData("text");
    
    // 긴 텍스트(100자 이상)면 첨부물로 처리
    if (pastedText.length > 100) {
      e.preventDefault();
      const newAttachment = {
        id: Date.now().toString(),
        text: pastedText,
      };
      setTextAttachments([...textAttachments, newAttachment]);
      toast({
        title: "텍스트 첨부 완료",
        description: "긴 텍스트가 첨부물로 추가되었습니다.",
      });
    }
  };

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

  const getFilePreview = (file: File) => {
    return filePreviews[file.name + file.size];
  };

  const removeTextAttachment = (id: string) => {
    setTextAttachments(textAttachments.filter((att) => att.id !== id));
  };

  const handlePreviewClick = (typeId: string, previewIndex: number) => {
    setSelectedPreviewDetail({ typeId, previewIndex });
    setPreviewDialogOpen(true);
  };

  const handleSelectFromDialog = () => {
    if (selectedPreviewDetail !== null) {
      setSelectedPreviews({ ...selectedPreviews, [selectedPreviewDetail.typeId]: selectedPreviewDetail.previewIndex });
      setPreviewDialogOpen(false);
    }
  };

  const toggleCardExpanded = (typeId: string) => {
    setExpandedCards(prev => ({ ...prev, [typeId]: !prev[typeId] }));
  };

  const getTypeName = (typeId: string) => {
    const type = availableContentTypes.find(t => t.id === typeId);
    return type?.name || "";
  };

  const getTypeIcon = (typeId: string) => {
    const type = availableContentTypes.find(t => t.id === typeId);
    return type?.icon || Image;
  };

  // 개별 타입 생성 시뮬레이션
  const simulateTypeGeneration = (typeId: string) => {
    const totalTime = estimatedTimes[typeId] || 5;
    const intervalMs = 200;
    const increment = 100 / (totalTime * (1000 / intervalMs));

    const interval = setInterval(() => {
      setGenerationStatuses(prev => {
        const current = prev[typeId];
        if (!current || current.progress >= 100) {
          clearInterval(interval);

          // 완료 시 기본값 설정
          setSelectedPreviews(p => ({ ...p, [typeId]: 0 }));
          setSelectedCopies(c => ({ ...c, [typeId]: 0 }));
          setResolutions(r => ({ ...r, [typeId]: resolutionOptions[typeId]?.[0]?.value || "1080x1080" }));
          setExpandedCards(e => ({ ...e, [typeId]: true }));

          return {
            ...prev,
            [typeId]: { ...current, progress: 100, status: "completed" }
          };
        }
        return {
          ...prev,
          [typeId]: { ...current, progress: Math.min(current.progress + increment + Math.random() * 5, 100) }
        };
      });
    }, intervalMs);
  };

  // 일괄 생성 시작
  const startGenerating = () => {
    setCurrentStep("generating");

    // 각 타입별 초기 상태 설정
    const initialStatuses: Record<string, GenerationStatus> = {};
    contentTypes.forEach(type => {
      initialStatuses[type] = {
        progress: 0,
        status: "generating",
        estimatedTime: estimatedTimes[type] || 5,
      };
    });
    setGenerationStatuses(initialStatuses);

    // 각 타입별로 약간의 딜레이를 두고 생성 시작 (동시 시작하되 순차적 표시)
    contentTypes.forEach((type, index) => {
      setTimeout(() => {
        simulateTypeGeneration(type);
      }, index * 300); // 0.3초 간격으로 시작
    });
  };

  // 모든 생성이 완료되었는지 확인
  const isAllGenerationComplete = () => {
    return contentTypes.every(type => generationStatuses[type]?.status === "completed");
  };

  // 완료된 콘텐츠 수
  const completedCount = contentTypes.filter(type => generationStatuses[type]?.status === "completed").length;

  const regenerateForType = (typeId: string) => {
    // 해당 타입의 상태를 다시 생성 중으로 변경
    setGenerationStatuses(prev => ({
      ...prev,
      [typeId]: {
        progress: 0,
        status: "generating",
        estimatedTime: estimatedTimes[typeId] || 5,
      }
    }));

    // 카드 접기
    setExpandedCards(prev => ({ ...prev, [typeId]: false }));

    toast({
      title: "다시 생성 중...",
      description: `${getTypeName(typeId)} 콘텐츠를 다시 생성합니다.`,
    });

    // 생성 시뮬레이션 시작
    simulateTypeGeneration(typeId);
  };

  const isAllConfigured = () => {
    return contentTypes.every(type =>
      selectedPreviews[type] !== undefined &&
      selectedCopies[type] !== undefined &&
      resolutions[type]
    );
  };

  const handleNextStep = () => {
    if (currentStep === "input" && (!textInput.trim() && selectedFiles.length === 0 && textAttachments.length === 0)) {
      toast({
        title: "입력 필요",
        description: "텍스트를 입력하거나 파일을 업로드해주세요.",
        variant: "destructive",
      });
      return;
    }
    if (currentStep === "input") setCurrentStep("type");
    else if (currentStep === "type" && contentTypes.length > 0) {
      startGenerating();
    }
    else if (currentStep === "generating" && isAllGenerationComplete()) {
      // Save all content
      const newContentIds: string[] = [];
      contentTypes.forEach(type => {
        const newContent = {
          id: Date.now().toString() + "-" + type,
          title: `${availableContentTypes.find(t => t.id === type)?.name}`,
          description: textInput || "AI로 생성된 마케팅 콘텐츠",
          type: type as any,
          thumbnail: mockPreviews[selectedPreviews[type]].thumbnail,
          targetUrl: "https://example.com",
          createdAt: new Date(),
          status: "draft" as const,
          performance: {
            views: 0,
            clicks: 0,
            conversions: 0,
            engagement: 0,
          },
          generatedContent: mockCopies[selectedCopies[type]].copy,
          mediaUrl: undefined,
        };
        addContent(newContent);
        newContentIds.push(newContent.id);
      });
      setSavedContentIds(newContentIds);
      setCurrentStep("complete");
      toast({
        title: "콘텐츠 저장 완료",
        description: `${contentTypes.length}개의 콘텐츠가 성공적으로 생성되었습니다.`,
      });
    }
  };

  const getStepNumber = () => {
    const steps: Step[] = ["input", "type", "generating"];
    const index = steps.indexOf(currentStep);
    return index >= 0 ? index + 1 : 1;
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "1s" }} />

      <Navigation />

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <button onClick={() => navigate("/content")} className="glass border-border/40 hover:border-primary/40 rounded-lg p-2 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">AI 콘텐츠 생성</h1>
            <p className="text-muted-foreground">단계별로 진행하여 완벽한 마케팅 콘텐츠를 만들어보세요</p>
          </div>
          <div className="flex items-center gap-2 glass rounded-full px-6 py-3 border border-border/40">
            <Coins className="w-5 h-5 text-primary" />
            <div className="text-right">
              <div className="text-sm text-muted-foreground">예상 소비</div>
              <div className="text-xl font-bold text-primary">5 크레딧</div>
            </div>
          </div>
        </div>

        {/* Step Progress */}
        {currentStep !== "complete" && currentStep !== "generating" && (
          <div className="flex items-center justify-center gap-2 mb-12 animate-fade-in">
            {[
              { num: 1, label: "입력" },
              { num: 2, label: "타입 선택" },
              { num: 3, label: "결과 확인" },
            ].map((step, idx) => (
              <div key={step.num} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step.num <= getStepNumber() ? "bg-gradient-to-br from-primary to-secondary text-white" : "glass border-border/40 text-muted-foreground"
                  }`}>
                    {step.num < getStepNumber() ? <Check className="w-5 h-5" /> : step.num}
                  </div>
                  <span className="text-xs text-muted-foreground">{step.label}</span>
                </div>
                {idx < 2 && (
                  <div className={`w-16 h-1 mx-2 rounded-full transition-all ${
                    step.num < getStepNumber() ? "bg-gradient-to-r from-primary to-secondary" : "bg-border/40"
                  }`} />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="max-w-5xl mx-auto">
          {/* Step 1: Input */}
          {currentStep === "input" && (
            <div className="space-y-6 animate-scale-in">
              {/* 콘텐츠 설명 */}
              <Card className="glass border-border/40 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">콘텐츠 설명 입력</h2>
                    <p className="text-sm text-muted-foreground">어떤 콘텐츠를 만들고 싶은지 설명해주세요</p>
                  </div>
                </div>

                <Textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onPaste={handleTextPaste}
                  placeholder="예: 여름 세일을 홍보하는 밝고 활기찬 이미지를 만들고 싶어요. 타겟 고객은 20-30대 여성이고, 시원한 느낌의 블루톤을 사용해주세요..."
                  className="glass border-border/40 min-h-[120px] text-base resize-none"
                />
              </Card>

              {/* 참조 자료 업로드 */}
              <Card className="glass border-border/40 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
                    <ImagePlus className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">참조 자료 첨부 (선택)</h3>
                    <p className="text-sm text-muted-foreground">서비스 캡처본, 참조 이미지, 브랜드 가이드 등을 첨부하면 더 정확한 콘텐츠를 생성합니다</p>
                  </div>
                </div>

                {/* 드래그 앤 드롭 영역 */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    isDragging
                      ? "border-primary bg-primary/10"
                      : "border-border/40 hover:border-primary/40 hover:bg-primary/5"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                      isDragging ? "bg-primary/20" : "bg-muted"
                    }`}>
                      <Upload className={`w-8 h-8 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className="font-medium mb-1">
                        {isDragging ? "여기에 놓으세요!" : "파일을 드래그하거나 클릭하여 업로드"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        이미지, 영상, PDF, 문서 파일 지원
                      </p>
                    </div>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="glass border-border/40 mt-2"
                      type="button"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      파일 선택
                    </Button>
                  </div>
                </div>

                {/* 첨부된 파일 미리보기 */}
                {(selectedFiles.length > 0 || textAttachments.length > 0) && (
                  <div className="mt-6 space-y-4">
                    <Label className="text-sm text-muted-foreground flex items-center gap-2">
                      <Paperclip className="w-4 h-4" />
                      첨부된 참조 자료 ({selectedFiles.length + textAttachments.length}개)
                    </Label>

                    {/* 이미지/영상 미리보기 그리드 */}
                    {selectedFiles.some(f => f.type.startsWith("image/") || f.type.startsWith("video/")) && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {selectedFiles.filter(f => f.type.startsWith("image/") || f.type.startsWith("video/")).map((file, index) => {
                          const preview = getFilePreview(file);
                          const originalIndex = selectedFiles.indexOf(file);
                          return (
                            <div
                              key={`media-${index}`}
                              className="relative group aspect-square rounded-lg overflow-hidden border border-border/40 hover:border-primary/40 transition-all"
                            >
                              {file.type.startsWith("image/") ? (
                                <img
                                  src={preview}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="relative w-full h-full bg-black">
                                  <video
                                    src={preview}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                                      <Play className="w-6 h-6 text-black ml-1" />
                                    </div>
                                  </div>
                                </div>
                              )}
                              {/* 파일 정보 오버레이 */}
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                <p className="text-xs text-white truncate">{file.name}</p>
                                <p className="text-xs text-white/70">
                                  {(file.size / 1024 / 1024).toFixed(1)} MB
                                </p>
                              </div>
                              {/* 삭제 버튼 */}
                              <Button
                                onClick={() => removeFile(originalIndex)}
                                size="sm"
                                variant="ghost"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0 bg-black/50 hover:bg-destructive text-white"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                              {/* 타입 배지 */}
                              <Badge className="absolute top-2 left-2 text-xs bg-black/50 text-white border-0">
                                {file.type.startsWith("image/") ? "이미지" : "영상"}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* 문서 파일 리스트 */}
                    {selectedFiles.some(f => !f.type.startsWith("image/") && !f.type.startsWith("video/")) && (
                      <div className="space-y-2">
                        {selectedFiles.filter(f => !f.type.startsWith("image/") && !f.type.startsWith("video/")).map((file, index) => {
                          const originalIndex = selectedFiles.indexOf(file);
                          return (
                            <div
                              key={`doc-${index}`}
                              className="glass border-border/40 rounded-lg p-3 flex items-center gap-3 hover:border-primary/40 transition-all group"
                            >
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                              <Button
                                onClick={() => removeFile(originalIndex)}
                                size="sm"
                                variant="ghost"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* 텍스트 첨부물 */}
                    {textAttachments.length > 0 && (
                      <div className="space-y-2">
                        {textAttachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="glass border-border/40 rounded-lg p-3 flex items-start gap-3 hover:border-primary/40 transition-all group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-secondary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-secondary mb-1">참조 텍스트</p>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {attachment.text}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {attachment.text.length}자
                              </p>
                            </div>
                            <Button
                              onClick={() => removeTextAttachment(attachment.id)}
                              size="sm"
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 참조 자료 팁 */}
                <div className="mt-6 glass border border-border/40 rounded-lg p-4 bg-secondary/5">
                  <div className="flex gap-3">
                    <Sparkles className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div className="text-sm space-y-1">
                      <p className="font-medium text-secondary">참조 자료 활용 팁</p>
                      <ul className="text-muted-foreground space-y-1 ml-4 list-disc">
                        <li><strong>서비스 캡처본</strong>을 첨부하면 실제 화면을 반영한 콘텐츠를 생성합니다</li>
                        <li><strong>참조 이미지</strong>의 스타일과 분위기를 분석하여 유사한 콘텐츠를 만듭니다</li>
                        <li><strong>브랜드 가이드</strong>나 로고를 첨부하면 일관된 브랜드 아이덴티티를 유지합니다</li>
                        <li><strong>긴 텍스트(100자 이상)</strong>를 붙여넣으면 자동으로 참조 자료로 추가됩니다</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex justify-center">
                <Button
                  onClick={handleNextStep}
                  disabled={!textInput.trim() && selectedFiles.length === 0 && textAttachments.length === 0}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white h-12 px-8 disabled:opacity-50"
                >
                  다음 단계
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Content Type */}
          {currentStep === "type" && (
            <div className="space-y-6 animate-scale-in">
              <Card className="glass border-border/40 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">콘텐츠 타입 선택</h2>
                    <p className="text-sm text-muted-foreground">여러 형태의 콘텐츠를 선택할 수 있습니다 (멀티 선택 가능)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        className={`glass border-2 rounded-lg p-6 cursor-pointer transition-all hover:scale-105 ${
                          isSelected ? "border-primary bg-primary/10" : "border-border/40 hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Checkbox checked={isSelected} className="h-5 w-5" />
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary"
                          }`}>
                            <type.icon className="w-5 h-5" />
                          </div>
                        </div>
                        <h3 className="font-semibold mb-1">{type.name}</h3>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <div className="flex justify-center gap-3">
                <Button onClick={() => setCurrentStep("input")} variant="outline" className="glass border-border/40 h-12 px-8">
                  이전
                </Button>
                <Button onClick={handleNextStep} disabled={contentTypes.length === 0} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white h-12 px-8">
                  <Sparkles className="w-5 h-5 mr-2" />
                  {contentTypes.length}개 콘텐츠 일괄 생성
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Generating - 실시간 카드 그리드 */}
          {currentStep === "generating" && (
            <div className="space-y-6 animate-scale-in">
              {/* 헤더 */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    {isAllGenerationComplete() ? "생성 완료" : "콘텐츠 생성 중..."}
                  </h2>
                  <p className="text-muted-foreground">
                    {isAllGenerationComplete()
                      ? `${contentTypes.length}개의 콘텐츠가 생성되었습니다. 각 카드에서 시안과 문구를 조정하세요.`
                      : `${completedCount}/${contentTypes.length}개 완료 - 완료된 콘텐츠는 먼저 확인할 수 있습니다.`}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("type")}
                  className="glass border-border/40"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  타입 다시 선택
                </Button>
              </div>

              {/* 결과 카드 그리드 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {contentTypes.map((typeId) => {
                  const TypeIcon = getTypeIcon(typeId);
                  const status = generationStatuses[typeId];
                  const isCompleted = status?.status === "completed";
                  const progress = status?.progress || 0;
                  const isExpanded = expandedCards[typeId];
                  const selectedPreviewIndex = selectedPreviews[typeId] ?? 0;
                  const selectedCopyIndex = selectedCopies[typeId] ?? 0;
                  const selectedResolution = resolutions[typeId];

                  return (
                    <Card
                      key={typeId}
                      className={`glass border-border/40 overflow-hidden transition-all ${
                        isCompleted ? "" : "opacity-90"
                      }`}
                    >
                      {/* 카드 헤더 */}
                      <div className="p-4 border-b border-border/40">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                              isCompleted
                                ? "bg-primary/10"
                                : "bg-gradient-to-br from-primary/20 to-secondary/20"
                            }`}>
                              {isCompleted ? (
                                <TypeIcon className="w-5 h-5 text-primary" />
                              ) : (
                                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{getTypeName(typeId)}</h3>
                                {isCompleted && (
                                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">
                                    완료
                                  </Badge>
                                )}
                              </div>
                              {isCompleted ? (
                                <p className="text-xs text-muted-foreground">
                                  {mockPreviews[selectedPreviewIndex].title} · {mockCopies[selectedCopyIndex].title}
                                </p>
                              ) : (
                                <p className="text-xs text-muted-foreground">
                                  예상 {status?.estimatedTime || 5}초 · {Math.round(progress)}% 완료
                                </p>
                              )}
                            </div>
                          </div>
                          {isCompleted && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => regenerateForType(typeId)}
                                className="h-8 w-8 p-0"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleCardExpanded(typeId)}
                                className="h-8 w-8 p-0"
                              >
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* 진행률 바 (생성 중일 때만) */}
                        {!isCompleted && (
                          <div className="mt-3">
                            <div className="h-1.5 bg-border/40 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 rounded-full"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 미리보기/로딩 영역 */}
                      <div className="p-4">
                        {isCompleted ? (
                          <div className="flex gap-4">
                            {/* 썸네일 */}
                            <div
                              className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-4xl cursor-pointer hover:scale-105 transition-transform flex-shrink-0"
                              onClick={() => handlePreviewClick(typeId, selectedPreviewIndex)}
                            >
                              {mockPreviews[selectedPreviewIndex].thumbnail}
                            </div>
                            {/* 문구 미리보기 */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm line-clamp-3 text-muted-foreground">
                                {mockCopies[selectedCopyIndex].copy}
                              </p>
                              <Badge variant="outline" className="mt-2 text-xs">
                                {selectedResolution}
                              </Badge>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-4 items-center">
                            {/* 로딩 썸네일 */}
                            <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0 animate-pulse">
                              <Sparkles className="w-8 h-8 text-primary/40" />
                            </div>
                            {/* 로딩 텍스트 */}
                            <div className="flex-1 space-y-2">
                              <div className="h-3 bg-border/40 rounded w-3/4 animate-pulse" />
                              <div className="h-3 bg-border/40 rounded w-1/2 animate-pulse" />
                              <div className="h-3 bg-border/40 rounded w-2/3 animate-pulse" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 확장 영역 - 세부 설정 (완료된 경우에만) */}
                      {isCompleted && isExpanded && (
                        <div className="border-t border-border/40 p-4 space-y-4 animate-fade-in bg-muted/30">
                          {/* 시안 선택 */}
                          <div>
                            <Label className="text-sm font-medium mb-2 block">시안 선택</Label>
                            <div className="grid grid-cols-4 gap-2">
                              {mockPreviews.map((preview, index) => (
                                <button
                                  key={preview.id}
                                  onClick={() => setSelectedPreviews({ ...selectedPreviews, [typeId]: index })}
                                  className={`aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl transition-all hover:scale-105 ${
                                    selectedPreviewIndex === index
                                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                                      : "opacity-60 hover:opacity-100"
                                  }`}
                                >
                                  {preview.thumbnail}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 문구 선택 */}
                          <div>
                            <Label className="text-sm font-medium mb-2 block">마케팅 문구</Label>
                            <div className="space-y-2">
                              {mockCopies.map((copy, index) => (
                                <button
                                  key={copy.id}
                                  onClick={() => setSelectedCopies({ ...selectedCopies, [typeId]: index })}
                                  className={`w-full text-left p-3 rounded-lg transition-all ${
                                    selectedCopyIndex === index
                                      ? "bg-primary/10 border-2 border-primary"
                                      : "glass border border-border/40 hover:border-primary/40"
                                  }`}
                                >
                                  <Badge variant="outline" className="mb-1 text-xs">
                                    {copy.title}
                                  </Badge>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {copy.copy}
                                  </p>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 해상도 선택 */}
                          <div>
                            <Label className="text-sm font-medium mb-2 block">해상도</Label>
                            <div className="flex flex-wrap gap-2">
                              {(resolutionOptions[typeId] || []).map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => setResolutions({ ...resolutions, [typeId]: option.value })}
                                  className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                                    selectedResolution === option.value
                                      ? "bg-primary text-white"
                                      : "glass border border-border/40 hover:border-primary/40"
                                  }`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>

              {/* 하단 버튼 */}
              <div className="flex justify-center gap-3 pt-4">
                <Button
                  onClick={() => setCurrentStep("type")}
                  variant="outline"
                  className="glass border-border/40 h-12 px-8"
                >
                  이전
                </Button>
                <Button
                  onClick={handleNextStep}
                  disabled={!isAllGenerationComplete()}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white h-12 px-8 disabled:opacity-50"
                >
                  {isAllGenerationComplete() ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      {contentTypes.length}개 콘텐츠 저장하기
                    </>
                  ) : (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      생성 중... ({completedCount}/{contentTypes.length})
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Preview Detail Dialog */}
          <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
            <DialogContent className="max-w-4xl glass border-border/40">
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-3">
                  <span className="text-4xl">
                    {selectedPreviewDetail !== null ? mockPreviews[selectedPreviewDetail.previewIndex].thumbnail : ""}
                  </span>
                  {selectedPreviewDetail !== null ? mockPreviews[selectedPreviewDetail.previewIndex].title : ""}
                </DialogTitle>
              </DialogHeader>

              {selectedPreviewDetail !== null && (
                <div className="space-y-6">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center text-9xl animate-scale-in">
                    {mockPreviews[selectedPreviewDetail.previewIndex].thumbnail}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-muted-foreground mb-2 block">스타일</Label>
                        <Badge variant="outline" className="text-base px-4 py-1">
                          {mockPreviews[selectedPreviewDetail.previewIndex].style}
                        </Badge>
                      </div>

                      <div>
                        <Label className="text-sm text-muted-foreground mb-2 block">설명</Label>
                        <p className="text-sm leading-relaxed">
                          {mockPreviews[selectedPreviewDetail.previewIndex].details}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm text-muted-foreground mb-2 block">컬러 팔레트</Label>
                      <div className="flex gap-2">
                        {mockPreviews[selectedPreviewDetail.previewIndex].colors.map((color, idx) => (
                          <div key={idx} className="flex-1">
                            <div
                              className="w-full h-16 rounded-lg border border-border/40 shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                            <p className="text-xs text-center mt-2 font-mono text-muted-foreground">
                              {color}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setPreviewDialogOpen(false)}
                      variant="outline"
                      className="flex-1 glass border-border/40"
                    >
                      닫기
                    </Button>
                    <Button
                      onClick={handleSelectFromDialog}
                      className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      이 시안 선택하기
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Complete */}
          {currentStep === "complete" && (
            <div className="space-y-6 animate-scale-in">
              <Card className="glass border-border/40 p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-6 flex items-center justify-center">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-3">🎉 콘텐츠 생성 완료!</h2>
                <p className="text-muted-foreground mb-8">
                  {contentTypes.length}개의 AI 마케팅 콘텐츠가 성공적으로 생성되었습니다.<br />
                  이제 콘텐츠를 확인하고 캠페인에 활용해보세요.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <Button
                    onClick={() => navigate("/content")}
                    variant="outline"
                    className="glass border-border/40 h-12"
                  >
                    콘텐츠 목록으로
                  </Button>
                  <Button
                    onClick={() => navigate("/campaigns")}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white h-12"
                  >
                    캠페인 만들기
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ContentGenerate;
