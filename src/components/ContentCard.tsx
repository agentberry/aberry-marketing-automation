import { MoreVertical, ExternalLink, TrendingUp, Eye, MousePointerClick, Target, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface Content {
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
}

interface ContentCardProps {
  content: Content;
  viewMode: "grid" | "list";
  style?: React.CSSProperties;
}

const typeLabels = {
  instagram: "인스타그램",
  facebook: "페이스북",
  twitter: "트위터",
  linkedin: "LinkedIn",
  email: "이메일",
  blog: "블로그",
  "google-ads": "구글 광고",
  "naver-ads": "네이버 광고",
  video: "비디오",
};

const typeColors = {
  instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
  facebook: "bg-blue-600",
  twitter: "bg-sky-500",
  linkedin: "bg-blue-700",
  email: "bg-green-600",
  blog: "bg-orange-500",
  "google-ads": "bg-red-600",
  "naver-ads": "bg-green-500",
  video: "bg-indigo-600",
};

const statusLabels = {
  draft: "초안",
  published: "게시됨",
  archived: "보관됨",
};

const statusColors = {
  draft: "bg-primary/10 text-primary border-primary/20",
  published: "bg-green-500/10 text-green-500 border-green-500/20",
  archived: "bg-muted text-muted-foreground border-border",
};

const ContentCard = ({ content, viewMode, style }: ContentCardProps) => {
  const navigate = useNavigate();

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  if (viewMode === "list") {
    return (
      <div
        onClick={() => navigate(`/content/${content.id}`)}
        className="glass border-border/40 rounded-xl p-6 hover:border-primary/40 transition-all cursor-pointer animate-scale-in"
        style={style}
      >
        <div className="flex items-start gap-6">
          {/* Thumbnail */}
          <div className={`w-20 h-20 rounded-lg ${typeColors[content.type]} flex items-center justify-center text-4xl flex-shrink-0`}>
            {content.thumbnail}
          </div>

          {/* Content Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold truncate">{content.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[content.status]}`}>
                    {statusLabels[content.status]}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{content.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="px-2 py-1 rounded-md bg-accent/10 text-accent font-medium">
                    {typeLabels[content.type]}
                  </span>
                  <span>{formatDate(content.createdAt)}</span>
                  {content.targetUrl && (
                    <a
                      href={content.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>연결 URL</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass border-border/40">
                  <DropdownMenuItem className="cursor-pointer">
                    <Edit className="w-4 h-4 mr-2" />
                    편집
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" />
                    캠페인에 추가
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Performance Metrics */}
            {content.status === "published" && (
              <div className="grid grid-cols-4 gap-4 pt-3 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">조회수</div>
                    <div className="font-semibold">{formatNumber(content.performance.views)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MousePointerClick className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">클릭</div>
                    <div className="font-semibold">{formatNumber(content.performance.clicks)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">전환</div>
                    <div className="font-semibold">{formatNumber(content.performance.conversions)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">참여율</div>
                    <div className="font-semibold">{content.performance.engagement}%</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div
      onClick={() => navigate(`/content/${content.id}`)}
      className="glass border-border/40 rounded-xl overflow-hidden hover:border-primary/40 transition-all cursor-pointer group animate-scale-in"
      style={style}
    >
      {/* Thumbnail Header */}
      <div className={`relative h-48 ${typeColors[content.type]} flex items-center justify-center text-6xl`}>
        {content.thumbnail}
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="bg-background/80 backdrop-blur-sm hover:bg-background"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border-border/40">
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="w-4 h-4 mr-2" />
                편집
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                캠페인에 추가
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[content.status]} backdrop-blur-sm`}>
            {statusLabels[content.status]}
          </span>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-6">
        <div className="mb-3">
          <span className="px-2 py-1 rounded-md bg-accent/10 text-accent text-xs font-medium">
            {typeLabels[content.type]}
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{content.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{content.description}</p>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <span>{formatDate(content.createdAt)}</span>
          {content.targetUrl && (
            <a
              href={content.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3" />
              <span>링크</span>
            </a>
          )}
        </div>

        {/* Performance Metrics */}
        {content.status === "published" && (
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/40">
            <div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <Eye className="w-3 h-3" />
                <span>조회수</span>
              </div>
              <div className="text-lg font-semibold">{formatNumber(content.performance.views)}</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <MousePointerClick className="w-3 h-3" />
                <span>클릭</span>
              </div>
              <div className="text-lg font-semibold">{formatNumber(content.performance.clicks)}</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <Target className="w-3 h-3" />
                <span>전환</span>
              </div>
              <div className="text-lg font-semibold">{formatNumber(content.performance.conversions)}</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <TrendingUp className="w-3 h-3" />
                <span>참여율</span>
              </div>
              <div className="text-lg font-semibold">{content.performance.engagement}%</div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          className="w-full mt-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
          onClick={(e) => {
            e.stopPropagation();
            // Navigate to campaign creation with this content
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          캠페인에 추가
        </Button>
      </div>
    </div>
  );
};

export default ContentCard;
