import { useState, useRef } from "react";
import { ArrowLeft, Sparkles, Coins, Check, Image, Video, FileText, Mail, MessageSquare, Wand2, Settings2, Maximize2, Edit3, X, Plus, Paperclip } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useContent } from "@/contexts/ContentContext";

type Step = "input" | "type" | "preview" | "copy" | "settings" | "complete";

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
  const [selectedPreviewDetail, setSelectedPreviewDetail] = useState<number | null>(null);
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...newFiles]);
    }
  };

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
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const removeTextAttachment = (id: string) => {
    setTextAttachments(textAttachments.filter((att) => att.id !== id));
  };

  const handlePreviewClick = (index: number) => {
    setSelectedPreviewDetail(index);
    setPreviewDialogOpen(true);
  };

  const handleSelectFromDialog = () => {
    if (selectedPreviewDetail !== null && currentStep === "preview") {
      const currentType = contentTypes[currentTypeIndex];
      setSelectedPreviews({ ...selectedPreviews, [currentType]: selectedPreviewDetail });
      setPreviewDialogOpen(false);
    }
  };

  const getCurrentType = () => contentTypes[currentTypeIndex];
  
  const getCurrentTypeName = () => {
    const type = availableContentTypes.find(t => t.id === getCurrentType());
    return type?.name || "";
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
      setCurrentTypeIndex(0);
      setCurrentStep("preview");
    }
    else if (currentStep === "preview") {
      const currentType = getCurrentType();
      if (selectedPreviews[currentType] === undefined) {
        toast({
          title: "시안 선택 필요",
          description: "시안을 선택해주세요.",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep("copy");
    }
    else if (currentStep === "copy") {
      const currentType = getCurrentType();
      if (selectedCopies[currentType] === undefined) {
        toast({
          title: "문구 선택 필요",
          description: "마케팅 문구를 선택해주세요.",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep("settings");
    }
    else if (currentStep === "settings") {
      const currentType = getCurrentType();
      if (!resolutions[currentType]) {
        toast({
          title: "해상도 선택 필요",
          description: "해상도를 선택해주세요.",
          variant: "destructive",
        });
        return;
      }
      
      // Check if there are more types to configure
      if (currentTypeIndex < contentTypes.length - 1) {
        setCurrentTypeIndex(currentTypeIndex + 1);
        setCurrentStep("preview");
      } else {
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
    }
  };

  const getStepNumber = () => {
    const steps: Step[] = ["input", "type", "preview", "copy", "settings"];
    return steps.indexOf(currentStep) + 1;
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
        {currentStep !== "complete" && (
          <div className="flex items-center justify-center gap-2 mb-12 animate-fade-in">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step <= getStepNumber() ? "bg-gradient-to-br from-primary to-secondary text-white" : "glass border-border/40 text-muted-foreground"
                }`}>
                  {step < getStepNumber() ? <Check className="w-5 h-5" /> : step}
                </div>
                {step < 5 && (
                  <div className={`w-12 h-1 mx-1 rounded-full transition-all ${
                    step < getStepNumber() ? "bg-gradient-to-r from-primary to-secondary" : "bg-border/40"
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
              <Card className="glass border-border/40 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">콘텐츠 설명 입력</h2>
                    <p className="text-sm text-muted-foreground">어떤 콘텐츠를 만들고 싶은지 설명하거나 파일을 첨부하세요</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      onPaste={handleTextPaste}
                      placeholder="예: 여름 세일을 홍보하는 밝고 활기찬 이미지를 만들고 싶어요...&#10;&#10;💡 긴 텍스트(100자 이상)를 붙여넣으면 자동으로 첨부물로 추가됩니다."
                      className="glass border-border/40 min-h-[150px] text-base pr-12 resize-none"
                    />
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,video/*,.pdf,.doc,.docx"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        size="sm"
                        variant="ghost"
                        className="glass border-border/40 h-8 w-8 p-0"
                        type="button"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Attachments Display */}
                  {(selectedFiles.length > 0 || textAttachments.length > 0) && (
                    <div className="space-y-3">
                      <Label className="text-sm text-muted-foreground flex items-center gap-2">
                        <Paperclip className="w-4 h-4" />
                        첨부된 내용 ({selectedFiles.length + textAttachments.length}개)
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* File Attachments */}
                        {selectedFiles.map((file, index) => (
                          <div
                            key={`file-${index}`}
                            className="glass border-border/40 rounded-lg p-4 flex items-start gap-3 hover:border-primary/40 transition-all group"
                          >
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              {file.type.startsWith("image/") ? (
                                <Image className="w-6 h-6 text-primary" />
                              ) : file.type.startsWith("video/") ? (
                                <Video className="w-6 h-6 text-primary" />
                              ) : (
                                <FileText className="w-6 h-6 text-primary" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <Button
                              onClick={() => removeFile(index)}
                              size="sm"
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}

                        {/* Text Attachments */}
                        {textAttachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="glass border-border/40 rounded-lg p-4 flex items-start gap-3 hover:border-primary/40 transition-all group"
                          >
                            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-6 h-6 text-secondary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-secondary mb-1">긴 텍스트</p>
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
                    </div>
                  )}

                  {/* Helper Text */}
                  <div className="glass border border-border/40 rounded-lg p-4 bg-primary/5">
                    <div className="flex gap-3">
                      <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm space-y-1">
                        <p className="font-medium">사용 팁</p>
                        <ul className="text-muted-foreground space-y-1 ml-4 list-disc">
                          <li>텍스트 입력창에 직접 설명을 입력하세요</li>
                          <li><strong>+ 버튼</strong>으로 이미지, 영상, 문서를 첨부할 수 있습니다</li>
                          <li><strong>긴 텍스트(100자 이상)</strong>를 붙여넣으면 자동으로 첨부물로 추가됩니다</li>
                          <li>여러 파일과 텍스트를 함께 첨부할 수 있습니다</li>
                        </ul>
                      </div>
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
                  다음 단계 ({contentTypes.length}개 선택됨)
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Preview Selection */}
          {currentStep === "preview" && (
            <div className="space-y-6 animate-scale-in">
              <Card className="glass border-border/40 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                    3
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">시안 선택</h2>
                    <p className="text-sm text-muted-foreground">
                      [{getCurrentTypeName()}] AI가 생성한 시안 중 마음에 드는 것을 선택하세요
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {currentTypeIndex + 1} / {contentTypes.length}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="glass border-border/40">
                    <Wand2 className="w-4 h-4 mr-2" />
                    다시 생성
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockPreviews.map((preview, index) => {
                    const isSelected = selectedPreviews[getCurrentType()] === index;
                    return (
                      <div
                        key={preview.id}
                        className={`glass border-2 rounded-lg overflow-hidden transition-all ${
                          isSelected ? "border-primary" : "border-border/40"
                        }`}
                      >
                        <div className="relative aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-8xl group">
                          {preview.thumbnail}
                          <button
                            onClick={() => handlePreviewClick(index)}
                            className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                          >
                            <div className="glass border-border/40 rounded-full p-4">
                              <Maximize2 className="w-6 h-6 text-white" />
                            </div>
                          </button>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{preview.title}</h3>
                            {isSelected && (
                              <Badge className="bg-primary text-white">
                                <Check className="w-3 h-3 mr-1" />
                                선택됨
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{preview.description}</p>
                          <Button
                            onClick={() => setSelectedPreviews({ ...selectedPreviews, [getCurrentType()]: index })}
                            variant={isSelected ? "default" : "outline"}
                            className={isSelected ? "bg-primary text-white w-full" : "glass border-border/40 w-full"}
                            size="sm"
                          >
                            {isSelected ? "선택됨" : "선택하기"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Preview Detail Dialog */}
                <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
                  <DialogContent className="max-w-4xl glass border-border/40">
                    <DialogHeader>
                      <DialogTitle className="text-2xl flex items-center gap-3">
                        <span className="text-4xl">{selectedPreviewDetail !== null ? mockPreviews[selectedPreviewDetail].thumbnail : ""}</span>
                        {selectedPreviewDetail !== null ? mockPreviews[selectedPreviewDetail].title : ""}
                      </DialogTitle>
                    </DialogHeader>
                    
                    {selectedPreviewDetail !== null && (
                      <div className="space-y-6">
                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center text-9xl animate-scale-in">
                          {mockPreviews[selectedPreviewDetail].thumbnail}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm text-muted-foreground mb-2 block">스타일</Label>
                              <Badge variant="outline" className="text-base px-4 py-1">
                                {mockPreviews[selectedPreviewDetail].style}
                              </Badge>
                            </div>

                            <div>
                              <Label className="text-sm text-muted-foreground mb-2 block">설명</Label>
                              <p className="text-sm leading-relaxed">
                                {mockPreviews[selectedPreviewDetail].details}
                              </p>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm text-muted-foreground mb-2 block">컬러 팔레트</Label>
                            <div className="flex gap-2">
                              {mockPreviews[selectedPreviewDetail].colors.map((color, idx) => (
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
              </Card>

              <div className="flex justify-center gap-3">
                <Button onClick={() => setCurrentStep("type")} variant="outline" className="glass border-border/40 h-12 px-8">
                  이전
                </Button>
                <Button 
                  onClick={handleNextStep} 
                  disabled={selectedPreviews[getCurrentType()] === undefined} 
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white h-12 px-8"
                >
                  다음 단계
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Marketing Copy */}
          {currentStep === "copy" && (
            <div className="space-y-6 animate-scale-in">
              <Card className="glass border-border/40 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                    4
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">마케팅 문구 선택</h2>
                    <p className="text-sm text-muted-foreground">
                      [{getCurrentTypeName()}] AI가 추천하는 마케팅 문구를 선택하세요
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {currentTypeIndex + 1} / {contentTypes.length}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="glass border-border/40">
                    <Sparkles className="w-4 h-4 mr-2" />
                    더 생성하기
                  </Button>
                </div>

                <div className="space-y-4">
                  {mockCopies.map((copy, index) => {
                    const isSelected = selectedCopies[getCurrentType()] === index;
                    return (
                      <div
                        key={copy.id}
                        className={`glass border-2 rounded-lg p-6 transition-all ${
                          isSelected ? "border-primary bg-primary/5" : "border-border/40"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="border-primary/40 text-primary">
                              {copy.title}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            {isSelected && (
                              <Badge className="bg-primary text-white">
                                <Check className="w-3 h-3 mr-1" />
                                선택됨
                              </Badge>
                            )}
                          </div>
                        </div>
                        <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans mb-4">{copy.copy}</pre>
                        <Button
                          onClick={() => setSelectedCopies({ ...selectedCopies, [getCurrentType()]: index })}
                          variant={isSelected ? "default" : "outline"}
                          className={isSelected ? "bg-primary text-white w-full" : "glass border-border/40 w-full"}
                          size="sm"
                        >
                          {isSelected ? "선택됨" : "선택하기"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <div className="flex justify-center gap-3">
                <Button onClick={() => setCurrentStep("preview")} variant="outline" className="glass border-border/40 h-12 px-8">
                  이전
                </Button>
                <Button 
                  onClick={handleNextStep} 
                  disabled={selectedCopies[getCurrentType()] === undefined} 
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white h-12 px-8"
                >
                  다음 단계
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Settings */}
          {currentStep === "settings" && (
            <div className="space-y-6 animate-scale-in">
              <Card className="glass border-border/40 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                    5
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">최종 설정</h2>
                    <p className="text-sm text-muted-foreground">
                      [{getCurrentTypeName()}] 콘텐츠의 해상도와 세부 설정을 선택하세요
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {currentTypeIndex + 1} / {contentTypes.length}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-base mb-3 block flex items-center gap-2">
                      <Settings2 className="w-5 h-5" />
                      해상도 선택
                    </Label>
                    <div className="grid grid-cols-1 gap-3">
                      {(resolutionOptions[getCurrentType()] || []).map((option) => {
                        const isSelected = resolutions[getCurrentType()] === option.value;
                        return (
                          <button
                            key={option.value}
                            onClick={() => setResolutions({ ...resolutions, [getCurrentType()]: option.value })}
                            className={`glass border-2 rounded-lg p-4 text-left transition-all hover:scale-[1.02] flex items-center justify-between ${
                              isSelected ? "border-primary bg-primary/10" : "border-border/40 hover:border-primary/40"
                            }`}
                          >
                            <span className="font-medium">{option.label}</span>
                            {isSelected && <Check className="w-5 h-5 text-primary" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="glass border border-border/40 rounded-lg p-6 bg-primary/5">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      선택 요약
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-2 border-b border-border/40">
                        <span className="text-muted-foreground">콘텐츠 타입:</span>
                        <span className="font-medium">{getCurrentTypeName()}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border/40">
                        <span className="text-muted-foreground">시안:</span>
                        <span className="font-medium">{mockPreviews[selectedPreviews[getCurrentType()]]?.title}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border/40">
                        <span className="text-muted-foreground">문구 스타일:</span>
                        <span className="font-medium">{mockCopies[selectedCopies[getCurrentType()]]?.title}</span>
                      </div>
                      {resolutions[getCurrentType()] && (
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">해상도:</span>
                          <span className="font-medium">{resolutions[getCurrentType()]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex justify-center gap-3">
                <Button onClick={() => setCurrentStep("copy")} variant="outline" className="glass border-border/40 h-12 px-8">
                  이전
                </Button>
                <Button 
                  onClick={handleNextStep} 
                  disabled={!resolutions[getCurrentType()]} 
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white h-12 px-8"
                >
                  <Check className="w-5 h-5 mr-2" />
                  {currentTypeIndex < contentTypes.length - 1 ? "다음 콘텐츠 타입" : "저장하기"}
                </Button>
              </div>
            </div>
          )}

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
