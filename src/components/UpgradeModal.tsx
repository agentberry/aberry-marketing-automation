import { Check, Sparkles, X, Zap } from 'lucide-react';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const benefits = [
  '내 채널 연결하고 실제 게시하기',
  'AI로 나만의 콘텐츠 무제한 생성',
  '실시간 성과 분석 리포트',
  '예산에 맞는 채널 전략 추천',
];

export default function UpgradeModal() {
  const { showUpgradeModal, setShowUpgradeModal, blockedAction } = useDemoMode();

  return (
    <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            실제로 사용해보세요
          </DialogTitle>
          <DialogDescription>
            {blockedAction && (
              <span className="text-foreground font-medium">'{blockedAction}'</span>
            )}
            {blockedAction ? ' 기능을 사용하려면 가입이 필요해요.' : '가입하고 직접 사용해보세요.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 space-y-3">
            <Button
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              onClick={() => {
                // TODO: 실제 가입/로그인 페이지로 이동
                window.location.href = '/login';
              }}
            >
              <Zap className="w-4 h-4 mr-2" />
              무료로 시작하기
            </Button>
            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={() => setShowUpgradeModal(false)}
            >
              계속 둘러보기
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            충전 또는 구독 · 소액부터 시작 가능
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
