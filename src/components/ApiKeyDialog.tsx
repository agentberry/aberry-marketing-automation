import { useState } from "react";
import { Key, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channelName: string;
  onSave: (apiKey: string) => void;
}

const ApiKeyDialog = ({ open, onOpenChange, channelName, onSave }: ApiKeyDialogProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey);
      setApiKey("");
      setShowKey(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border/40 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            {channelName} API 키 설정
          </DialogTitle>
          <DialogDescription>
            {channelName} API 키를 입력하여 채널을 연결하세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert className="glass border-border/40">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              API 키는 현재 브라우저에 임시 저장됩니다. 
              <br />
              더 안전한 저장을 위해 Lovable Cloud 연결을 권장합니다.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="api-key">API 키</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="glass border-border/40 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border/20">
            <p className="text-xs text-muted-foreground mb-2 font-semibold">
              API 키 발급 방법:
            </p>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>{channelName} 개발자 포털에 로그인</li>
              <li>애플리케이션 등록 또는 선택</li>
              <li>API 키 생성 섹션에서 새 키 발급</li>
              <li>생성된 키를 복사하여 여기에 입력</li>
            </ol>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 glass border-border/40"
            >
              취소
            </Button>
            <Button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
            >
              저장
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyDialog;
