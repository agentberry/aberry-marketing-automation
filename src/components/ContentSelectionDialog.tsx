import { useState } from "react";
import { Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useContent, Content } from "@/contexts/ContentContext";

interface ContentSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedContentIds: string[];
  onSelectContents: (contentIds: string[]) => void;
}

const ContentSelectionDialog = ({
  open,
  onOpenChange,
  selectedContentIds,
  onSelectContents,
}: ContentSelectionDialogProps) => {
  const { contents } = useContent();
  const [localSelected, setLocalSelected] = useState<string[]>(selectedContentIds);

  const toggleContent = (contentId: string) => {
    setLocalSelected((prev) =>
      prev.includes(contentId)
        ? prev.filter((id) => id !== contentId)
        : [...prev, contentId]
    );
  };

  const handleConfirm = () => {
    onSelectContents(localSelected);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] glass border-border/40">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            캠페인에 추가할 콘텐츠 선택
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            선택된 콘텐츠: {localSelected.length}개
          </p>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {contents.map((content) => {
              const isSelected = localSelected.includes(content.id);
              return (
                <div
                  key={content.id}
                  onClick={() => toggleContent(content.id)}
                  className={`glass border rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border/40 hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl">
                      {content.thumbnail}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-1">{content.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {content.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                          {content.type}
                        </span>
                        <span>👁 {content.performance.views.toLocaleString()}</span>
                        <span>🖱 {content.performance.clicks.toLocaleString()}</span>
                      </div>
                    </div>
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-primary border-primary"
                          : "border-border/40"
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 glass border-border/40"
          >
            취소
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
          >
            {localSelected.length}개 콘텐츠 추가
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentSelectionDialog;
