import { useState, useEffect, useCallback } from "react";
import { useToast } from "./use-toast";

export type IntegrationProvider =
  | "LINKEDIN"
  | "WORDPRESS"
  | "MEDIUM"
  | "INSTAGRAM"
  | "FACEBOOK"
  | "THREADS"
  | "TIKTOK"
  | "YOUTUBE"
  | "TWITTER"
  | "TISTORY"
  | "NAVER_BLOG";

export type IntegrationType = "OAUTH" | "API_KEY" | "WEBHOOK";

export interface Integration {
  id: string;
  provider: IntegrationProvider;
  type: IntegrationType;
  status: "ACTIVE" | "INACTIVE" | "ERROR";
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface ConnectParams {
  provider: IntegrationProvider;
  type: IntegrationType;
  credentials?: Record<string, string>;
  agentId: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5070";

export function useIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // 통합 목록 조회
  const fetchIntegrations = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/integrations/list`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch integrations");
      }

      const data = await response.json();
      setIntegrations(data.integrations || []);
    } catch (error) {
      console.error("Failed to fetch integrations:", error);
      toast({
        title: "연동 정보 로드 실패",
        description: "연동 정보를 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // 초기 로드
  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  // 연결
  const connect = useCallback(
    async (params: ConnectParams) => {
      try {
        if (params.type === "OAUTH") {
          // OAuth 플로우 시작
          const response = await fetch(`${API_BASE_URL}/api/integrations/connect`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              provider: params.provider,
              type: params.type,
              agentId: params.agentId,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to initiate OAuth flow");
          }

          const data = await response.json();

          // OAuth URL로 리디렉션
          if (data.authUrl) {
            window.location.href = data.authUrl;
          }
        } else if (params.type === "API_KEY") {
          // API Key 저장
          const response = await fetch(`${API_BASE_URL}/api/integrations/connect`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              provider: params.provider,
              type: params.type,
              credentials: params.credentials,
              agentId: params.agentId,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to save API key");
          }

          toast({
            title: "연결 완료",
            description: `${params.provider} 연결이 완료되었습니다.`,
          });

          // 목록 새로고침
          await fetchIntegrations();
        }
      } catch (error) {
        console.error("Connection failed:", error);
        toast({
          title: "연결 실패",
          description: `${params.provider} 연결에 실패했습니다.`,
          variant: "destructive",
        });
        throw error;
      }
    },
    [toast, fetchIntegrations]
  );

  // 연결 해제
  const disconnect = useCallback(
    async (integrationId: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/integrations/disconnect`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ integrationId }),
        });

        if (!response.ok) {
          throw new Error("Failed to disconnect");
        }

        toast({
          title: "연결 해제 완료",
          description: "연동이 해제되었습니다.",
        });

        // 목록 새로고침
        await fetchIntegrations();
      } catch (error) {
        console.error("Disconnection failed:", error);
        toast({
          title: "연결 해제 실패",
          description: "연동 해제에 실패했습니다.",
          variant: "destructive",
        });
        throw error;
      }
    },
    [toast, fetchIntegrations]
  );

  // 연결 여부 확인
  const isConnected = useCallback(
    (provider: IntegrationProvider) => {
      return integrations.some(
        (integration) =>
          integration.provider === provider && integration.status === "ACTIVE"
      );
    },
    [integrations]
  );

  return {
    integrations,
    loading,
    connect,
    disconnect,
    isConnected,
    refresh: fetchIntegrations,
  };
}
