import { useState } from "react";
import { Search, Plus, Grid3x3, List } from "lucide-react";
import Navigation from "@/components/Navigation";
import ContentCard from "@/components/ContentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useContent } from "@/contexts/ContentContext";

const Content = () => {
  const navigate = useNavigate();
  const { contents } = useContent();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filterOptions = [
    { id: "all", label: "전체", count: contents.length },
    { id: "instagram", label: "인스타그램", count: contents.filter(c => c.type === "instagram").length },
    { id: "email", label: "이메일", count: contents.filter(c => c.type === "email").length },
    { id: "blog", label: "블로그", count: contents.filter(c => c.type === "blog").length },
    { id: "google-ads", label: "구글 광고", count: contents.filter(c => c.type === "google-ads").length },
    { id: "video", label: "비디오", count: contents.filter(c => c.type === "video").length },
    { id: "linkedin", label: "LinkedIn", count: contents.filter(c => c.type === "linkedin").length },
  ];

  const filteredContents = contents.filter((content) => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === "all" || content.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div
        className="fixed bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float pointer-events-none"
        style={{ animationDelay: "1s" }}
      />

      <Navigation />

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold mb-2">콘텐츠</h1>
            <p className="text-muted-foreground">AI로 생성한 마케팅 콘텐츠를 관리하고 캠페인에 활용하세요</p>
          </div>
          <Button
            onClick={() => navigate("/content/create")}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white h-12 px-6"
          >
            <Plus className="w-5 h-5 mr-2" />
            AI 콘텐츠 생성
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="콘텐츠 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 glass border-border/40 h-12"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={`glass border-border/40 w-12 h-12 ${viewMode === "grid" ? "bg-primary/10 border-primary/40" : ""}`}
            >
              <Grid3x3 className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode("list")}
              className={`glass border-border/40 w-12 h-12 ${viewMode === "list" ? "bg-primary/10 border-primary/40" : ""}`}
            >
              <List className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {filterOptions.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedFilter === filter.id
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                  : "glass border-border/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {filter.label}
              <span className="ml-2 opacity-70">({filter.count})</span>
            </button>
          ))}
        </div>

        {/* Content Grid */}
        {filteredContents.length > 0 ? (
          <div
            className={`grid gap-6 animate-fade-in ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
            style={{ animationDelay: "0.3s" }}
          >
            {filteredContents.map((content, index) => (
              <ContentCard
                key={content.id}
                content={content}
                viewMode={viewMode}
                style={{ animationDelay: `${0.3 + index * 0.05}s` }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass border-border/40 rounded-xl animate-fade-in">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold mb-2">검색 결과가 없습니다</h3>
            <p className="text-muted-foreground mb-6">다른 검색어나 필터를 시도해보세요</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedFilter("all");
              }}
              className="glass border-border/40"
            >
              필터 초기화
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Content;
