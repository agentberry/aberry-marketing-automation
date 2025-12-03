"use client";

import { useState, useEffect, useRef } from "react";
import { Instagram, Facebook, FileText, Sparkles, Loader2, CheckCircle, ChevronRight } from "lucide-react";
import { MOCK_CONTENT_TEMPLATES, GeneratedContent } from "@/data/mockContentData";

const TOPICS = [
  { id: "product-launch", label: "신제품 출시" },
  { id: "discount", label: "할인 프로모션" },
  { id: "event", label: "이벤트 홍보" },
  { id: "brand-story", label: "브랜드 스토리" }
];

const CHANNELS = [
  { id: "Instagram", label: "인스타그램", icon: Instagram },
  { id: "Facebook", label: "페이스북", icon: Facebook },
  { id: "Blog", label: "블로그", icon: FileText }
];

export function MiniContentGeneratorDemo() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying || hasUserInteracted) return;

    const scheduleNextAction = () => {
      if (!selectedTopic) {
        // Step 1: Select topic automatically
        autoPlayTimeoutRef.current = setTimeout(() => {
          setSelectedTopic(TOPICS[0].id);
        }, 1500);
      } else if (selectedChannels.length === 0) {
        // Step 2: Select channel automatically
        autoPlayTimeoutRef.current = setTimeout(() => {
          setSelectedChannels([CHANNELS[0].id]);
        }, 1500);
      } else if (!isGenerating && !generatedContent) {
        // Step 3: Generate content automatically
        autoPlayTimeoutRef.current = setTimeout(() => {
          handleGenerate();
        }, 1500);
      } else if (generatedContent) {
        // Step 4: Reset and loop after showing result
        autoPlayTimeoutRef.current = setTimeout(() => {
          resetDemo();
        }, 5000);
      }
    };

    scheduleNextAction();

    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, [isAutoPlaying, hasUserInteracted, selectedTopic, selectedChannels, isGenerating, generatedContent]);

  const stopAutoPlay = () => {
    setHasUserInteracted(true);
    setIsAutoPlaying(false);
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }
  };

  const resetDemo = () => {
    setSelectedTopic(null);
    setSelectedChannels([]);
    setIsGenerating(false);
    setGeneratedContent(null);
  };

  const handleChannelToggle = (channelId: string) => {
    stopAutoPlay();
    setSelectedChannels(prev =>
      prev.includes(channelId)
        ? prev.filter(c => c !== channelId)
        : [...prev, channelId]
    );
  };

  const handleGenerate = () => {
    if (!selectedTopic || selectedChannels.length === 0) return;

    setIsGenerating(true);
    setGeneratedContent(null);

    // Simulate AI generation
    setTimeout(() => {
      const topicKey = TOPICS.find(t => t.id === selectedTopic)?.label || "신제품 출시";
      const channelKey = selectedChannels[0];

      const content = MOCK_CONTENT_TEMPLATES[topicKey]?.[channelKey];

      if (content) {
        setGeneratedContent(content);
      }
      setIsGenerating(false);
    }, 2000);
  };

  const handleTopicSelect = (topicId: string) => {
    stopAutoPlay();
    setSelectedTopic(topicId);
  };

  const canGenerate = selectedTopic && selectedChannels.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="glass border-border/40 rounded-2xl overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Step 1: Topic Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                1
              </div>
              <h3 className="font-bold text-sm">주제 선택</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleTopicSelect(topic.id)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    selectedTopic === topic.id
                      ? "border-primary bg-primary/5"
                      : "border-border/40 hover:border-primary/40"
                  }`}
                >
                  <p className="text-sm font-medium">{topic.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Channel Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                2
              </div>
              <h3 className="font-bold text-sm">채널 선택</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {CHANNELS.map((channel) => {
                const Icon = channel.icon;
                const isSelected = selectedChannels.includes(channel.id);
                return (
                  <button
                    key={channel.id}
                    onClick={() => handleChannelToggle(channel.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border/40 hover:border-primary/40"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{channel.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              canGenerate && !isGenerating
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                AI가 콘텐츠를 생성하고 있어요...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                콘텐츠 생성하기
              </>
            )}
          </button>

          {/* Generated Content Result */}
          {generatedContent && (
            <div className="space-y-4 animate-fade-in pt-4 border-t border-border/40">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle className="w-5 h-5" />
                <h3 className="font-bold">콘텐츠가 생성되었습니다!</h3>
              </div>

              <div className="glass border-border/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {CHANNELS.find(c => c.id === generatedContent.channel)?.icon && (
                      (() => {
                        const Icon = CHANNELS.find(c => c.id === generatedContent.channel)!.icon;
                        return <Icon className="w-4 h-4 text-primary" />;
                      })()
                    )}
                    <span className="font-semibold text-sm">{generatedContent.channel}</span>
                  </div>
                  <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    AI 생성
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-foreground/90 whitespace-pre-wrap">
                    {generatedContent.caption}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {generatedContent.hashtags.map((tag, i) => (
                      <span key={i} className="text-xs text-primary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40">
                  <div>
                    <div className="text-xs text-muted-foreground">예상 도달</div>
                    <div className="text-sm font-bold">
                      {generatedContent.estimatedReach.toLocaleString()}명
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">최적 시간</div>
                    <div className="text-sm font-bold">{generatedContent.bestPostingTime}</div>
                  </div>
                </div>
              </div>

              <a
                href={`${process.env.NEXT_PUBLIC_MARKETING_WORKSPACE_URL || 'http://localhost:5072'}/generate`}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition-all"
              >
                더 많은 콘텐츠 생성하기
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
