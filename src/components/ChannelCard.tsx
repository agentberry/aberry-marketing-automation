import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LucideIcon, Check, X, Settings, Users, FileText, TrendingUp, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ApiKeyDialog from "./ApiKeyDialog";

interface ChannelCardProps {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  isConnected: boolean;
  requiresApiKey: boolean;
  followers?: number;
  posts?: number;
  engagement?: string;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onSaveApiKey: (id: string, apiKey: string) => void;
}

const ChannelCard = ({
  id,
  name,
  icon: Icon,
  color,
  isConnected,
  requiresApiKey,
  followers,
  posts,
  engagement,
  onConnect,
  onDisconnect,
  onSaveApiKey,
}: ChannelCardProps) => {
  const navigate = useNavigate();
  const [showApiDialog, setShowApiDialog] = useState(false);

  const handleConnect = () => {
    if (requiresApiKey) {
      setShowApiDialog(true);
    } else {
      onConnect(id);
    }
  };

  return (
    <>
      <div
        className={`glass border rounded-xl p-6 transition-all ${
          isConnected
            ? "border-primary/40 bg-primary/5 shadow-[0_10px_30px_hsl(239_84%_67%_/_0.15)]"
            : "border-border/40 hover:border-primary/40"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg bg-card border border-border/40 flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
              <h3 className="font-bold text-lg">{name}</h3>
              <Badge
                variant={isConnected ? "default" : "outline"}
                className={
                  isConnected
                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                    : "bg-muted text-muted-foreground"
                }
              >
                {isConnected ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    연결됨
                  </>
                ) : (
                  <>
                    <X className="w-3 h-3 mr-1" />
                    미연결
                  </>
                )}
              </Badge>
            </div>
          </div>
          {isConnected && (
            <button
              onClick={() => setShowApiDialog(true)}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Stats */}
        {isConnected && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            {followers !== undefined && (
              <div className="glass border border-border/40 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">팔로워</span>
                </div>
                <p className="text-sm font-bold">{followers.toLocaleString()}</p>
              </div>
            )}
            {posts !== undefined && (
              <div className="glass border border-border/40 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <FileText className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">게시물</span>
                </div>
                <p className="text-sm font-bold">{posts}</p>
              </div>
            )}
            {engagement && (
              <div className="glass border border-border/40 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">참여율</span>
                </div>
                <p className="text-sm font-bold">{engagement}</p>
              </div>
            )}
          </div>
        )}

        {/* Connection Guide */}
        {!isConnected && (
          <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-border/20">
            <p className="text-xs text-muted-foreground">
              {requiresApiKey
                ? `${name} API 키를 입력하여 연결하세요`
                : `OAuth 인증으로 ${name}에 연결하세요`}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={() => navigate(`/channels/guide/${id}`)}
            variant="outline"
            size="sm"
            className="glass border-border/40"
          >
            <BookOpen className="w-4 h-4" />
          </Button>
          {isConnected ? (
            <Button
              onClick={() => onDisconnect(id)}
              variant="outline"
              className="flex-1 glass border-border/40"
            >
              연결 해제
            </Button>
          ) : (
            <Button
              onClick={handleConnect}
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
            >
              연결하기
            </Button>
          )}
        </div>
      </div>

      <ApiKeyDialog
        open={showApiDialog}
        onOpenChange={setShowApiDialog}
        channelName={name}
        onSave={(apiKey) => {
          onSaveApiKey(id, apiKey);
          setShowApiDialog(false);
        }}
      />
    </>
  );
};

export default ChannelCard;
