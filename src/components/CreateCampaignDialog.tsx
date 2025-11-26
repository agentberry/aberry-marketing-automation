import { useState, useEffect } from "react";
import { Plus, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ChannelSelector from "./ChannelSelector";
import ContentSelectionDialog from "./ContentSelectionDialog";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import { useContent } from "@/contexts/ContentContext";

interface Campaign {
  id: string;
  name: string;
  description: string;
  channels: string[];
  budget: number;
  status: "활성" | "일시정지" | "완료" | "초안";
  startDate: Date;
  endDate: Date;
  contentIds: string[];
}

interface CreateCampaignDialogProps {
  onCreateCampaign: (campaign: Campaign) => void;
}

const CreateCampaignDialog = ({ onCreateCampaign }: CreateCampaignDialogProps) => {
  const [searchParams] = useSearchParams();
  const { contents } = useContent();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedContentIds, setSelectedContentIds] = useState<string[]>([]);
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const { toast } = useToast();

  // Handle pre-selected content from URL
  useEffect(() => {
    const contentId = searchParams.get("contentId");
    if (contentId && open) {
      setSelectedContentIds([contentId]);
    }
  }, [searchParams, open]);

  const handleCreate = () => {
    if (!name.trim()) {
      toast({
        title: "캠페인 이름 필요",
        description: "캠페인 이름을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (selectedChannels.length === 0) {
      toast({
        title: "채널 선택 필요",
        description: "최소 1개 이상의 채널을 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name,
      description,
      channels: selectedChannels,
      budget: parseFloat(budget) || 0,
      status: "초안",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      contentIds: selectedContentIds,
    };

    onCreateCampaign(newCampaign);
    setOpen(false);

    // Reset form
    setName("");
    setDescription("");
    setBudget("");
    setSelectedChannels([]);
    setSelectedContentIds([]);

    toast({
      title: "캠페인 생성 완료",
      description: `${name} 캠페인이 생성되었습니다.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          새 캠페인 생성
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass border-border/40">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">새 캠페인 생성</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Campaign Name */}
          <div className="space-y-2">
            <Label htmlFor="campaign-name">캠페인 이름 *</Label>
            <Input
              id="campaign-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 여름 세일 캠페인"
              className="glass border-border/40"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="campaign-description">캠페인 설명</Label>
            <Textarea
              id="campaign-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="캠페인에 대한 간단한 설명을 입력하세요"
              className="glass border-border/40 min-h-[100px] resize-none"
            />
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="campaign-budget">예산 (원)</Label>
            <Input
              id="campaign-budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="1000000"
              className="glass border-border/40"
            />
          </div>

          {/* Channel Selection */}
          <div className="space-y-2">
            <Label>채널 선택 * (선택: {selectedChannels.length}개)</Label>
            <ChannelSelector
              selectedChannels={selectedChannels}
              onSelectChannel={(channels) => setSelectedChannels(channels)}
            />
          </div>

          {/* Content Selection */}
          <div className="space-y-2">
            <Label>캠페인 콘텐츠 (선택: {selectedContentIds.length}개)</Label>
            <Button
              type="button"
              variant="outline"
              onClick={() => setContentDialogOpen(true)}
              className="w-full glass border-border/40 h-12 justify-start"
            >
              <FileText className="w-4 h-4 mr-2" />
              {selectedContentIds.length > 0
                ? `${selectedContentIds.length}개의 콘텐츠 선택됨`
                : "콘텐츠 선택하기"}
            </Button>
            {selectedContentIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedContentIds.map((id) => {
                  const content = contents.find((c) => c.id === id);
                  return content ? (
                    <div
                      key={id}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20"
                    >
                      {content.thumbnail} {content.title}
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 glass border-border/40">
              취소
            </Button>
            <Button onClick={handleCreate} className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white">
              생성하기
            </Button>
          </div>
        </div>

        <ContentSelectionDialog
          open={contentDialogOpen}
          onOpenChange={setContentDialogOpen}
          selectedContentIds={selectedContentIds}
          onSelectContents={setSelectedContentIds}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateCampaignDialog;
