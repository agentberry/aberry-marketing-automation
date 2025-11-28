import { createContext, useContext, useState, ReactNode } from 'react';

interface DemoModeContextType {
  isDemoMode: boolean;
  setDemoMode: (value: boolean) => void;
  showUpgradeModal: boolean;
  setShowUpgradeModal: (value: boolean) => void;
  triggerUpgrade: (action: string) => void;
  blockedAction: string | null;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export function DemoModeProvider({ children }: { children: ReactNode }) {
  // 기본값: 데모 모드 활성화 (로그인 없이 접근 시)
  const [isDemoMode, setDemoMode] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [blockedAction, setBlockedAction] = useState<string | null>(null);

  const triggerUpgrade = (action: string) => {
    setBlockedAction(action);
    setShowUpgradeModal(true);
  };

  return (
    <DemoModeContext.Provider
      value={{
        isDemoMode,
        setDemoMode,
        showUpgradeModal,
        setShowUpgradeModal,
        triggerUpgrade,
        blockedAction,
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
}
