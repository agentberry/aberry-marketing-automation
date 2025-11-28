import { Eye, Sparkles } from 'lucide-react';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { Button } from '@/components/ui/button';

export default function DemoBanner() {
  const { isDemoMode, triggerUpgrade } = useDemoMode();

  if (!isDemoMode) return null;

  return (
    <div className="bg-gradient-to-r from-primary/90 to-secondary/90 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">
              체험 모드로 둘러보는 중입니다
            </span>
            <span className="text-xs text-white/70 hidden sm:inline">
              · 예시 데이터로 모든 기능을 미리 확인해보세요
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/70 hidden md:inline">
              충전 또는 구독 · 소액부터 시작 가능
            </span>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 text-xs font-semibold"
              onClick={() => triggerUpgrade('시작하기')}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              실제로 시작하기
            </Button>
          </div>
      </div>
    </div>
  );
}
