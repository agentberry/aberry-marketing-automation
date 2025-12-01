import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Marketing Automation API Hooks
 */

// Types
export interface MarketingChannel {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  description: string;
  channelType: 'ORGANIC' | 'PAID' | 'HYBRID';
  category: string;
  costLevel: string;
  difficultyLevel: string;
  apiAvailable: boolean;
  automationLevel: string;
  engagementScore: number;
  reachPotential: number;
  viralPotential: number;
  supportedContentTypes: string[];
  icon?: string;
  color?: string;
}

export interface ChannelRecommendation {
  priority: number;
  channel: MarketingChannel;
  scores: {
    overall: number;
    budgetFit: number;
    timeFit: number;
    businessFit: number;
    audienceFit: number;
    goalFit: number;
    maturityFit: number;
  };
  reasoning: string;
  suggestedActions: string[];
  expectedResults: {
    reach: string;
    engagement: string;
    roi: string;
  };
}

export interface MarketingProfile {
  id: string;
  userId: string;
  businessName?: string;
  businessType: string;
  industry?: string;
  budgetRange: string;
  monthlyBudget?: number;
  weeklyTimeHours?: number;
  marketingMaturity: string;
  primaryGoals: string[];
  currentChannels: string[];
  preferredContentTypes: string[];
  targetLocations: string[];
}

export interface CoachingSession {
  recommendations: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    actionItems: string[];
  }>;
  contentIdeas: Array<{
    title: string;
    description: string;
    channel: string;
    contentType: string;
    estimatedEngagement: 'high' | 'medium' | 'low';
  }>;
  trendingTopics: Array<{
    topic: string;
    relevance: string;
    suggestedAngle: string;
  }>;
  summary: string;
  actionItems: string[];
}

export interface Integration {
  id: string;
  provider: string;
  status: string;
  accountName?: string;
  accountEmail?: string;
  avatarUrl?: string;
  expiresAt?: string;
  connectedAt: string;
}

export interface ScheduledPost {
  id: string;
  channelType: string;
  content: string;
  mediaUrls: string[];
  scheduledAt: string;
  status: string;
  publishedAt?: string;
  postUrl?: string;
  error?: string;
}

// API Helper
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'API request failed');
  }

  return data.data;
}

// ============================================
// Channel Hooks
// ============================================

export function useChannels(filters?: {
  type?: string;
  category?: string;
  costLevel?: string;
}) {
  return useQuery({
    queryKey: ['channels', filters],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters?.type) params.set('type', filters.type);
      if (filters?.category) params.set('category', filters.category);
      if (filters?.costLevel) params.set('costLevel', filters.costLevel);

      const query = params.toString();
      return fetchApi<MarketingChannel[]>(
        `/api/channels${query ? `?${query}` : ''}`
      );
    },
  });
}

export function useChannel(slug: string) {
  return useQuery({
    queryKey: ['channel', slug],
    queryFn: () => fetchApi<MarketingChannel>(`/api/channels/${slug}`),
    enabled: !!slug,
  });
}

export function useFreeChannels(businessType?: string) {
  return useQuery({
    queryKey: ['freeChannels', businessType],
    queryFn: () => {
      const params = businessType ? `?businessType=${businessType}` : '';
      return fetchApi<MarketingChannel[]>(`/api/channels/free/list${params}`);
    },
  });
}

// ============================================
// Recommendation Hooks
// ============================================

export function useMarketingProfile(userId: string) {
  return useQuery({
    queryKey: ['marketingProfile', userId],
    queryFn: () =>
      fetchApi<MarketingProfile & { recommendations: ChannelRecommendation[] }>(
        `/api/recommendations/profile/${userId}`
      ),
    enabled: !!userId,
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profile: Partial<MarketingProfile>) =>
      fetchApi<MarketingProfile>('/api/recommendations/profile', {
        method: 'POST',
        body: JSON.stringify(profile),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['marketingProfile', data.userId] });
    },
  });
}

export function useGenerateRecommendations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      userId: string;
      profileId?: string;
      options?: {
        limit?: number;
        channelTypes?: string[];
        excludeCurrentChannels?: boolean;
      };
    }) =>
      fetchApi<{ recommendations: ChannelRecommendation[]; totalChannels: number }>(
        '/api/recommendations/generate',
        {
          method: 'POST',
          body: JSON.stringify(params),
        }
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['marketingProfile', variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['recommendations', variables.userId],
      });
    },
  });
}

export function useRecommendations(userId: string) {
  return useQuery({
    queryKey: ['recommendations', userId],
    queryFn: () =>
      fetchApi<ChannelRecommendation[]>(`/api/recommendations/${userId}`),
    enabled: !!userId,
  });
}

export function useAcceptRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recommendationId: string) =>
      fetchApi(`/api/recommendations/${recommendationId}/accept`, {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['marketingProfile'] });
    },
  });
}

export function useQuickRecommendations() {
  return useMutation({
    mutationFn: (params: {
      businessType: string;
      budgetRange: string;
      marketingMaturity?: string;
      primaryGoals?: string[];
    }) =>
      fetchApi<
        Array<{
          priority: number;
          channel: Partial<MarketingChannel>;
          score: number;
          quickTip: string;
        }>
      >('/api/recommendations/quick', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
  });
}

// ============================================
// Coach Hooks
// ============================================

export function useDailyCoaching() {
  return useMutation({
    mutationFn: (userId: string) =>
      fetchApi<CoachingSession>('/api/coach/daily', {
        method: 'POST',
        body: JSON.stringify({ userId }),
      }),
  });
}

export function useWeeklyReview() {
  return useMutation({
    mutationFn: (userId: string) =>
      fetchApi<CoachingSession>('/api/coach/weekly', {
        method: 'POST',
        body: JSON.stringify({ userId }),
      }),
  });
}

export function useCoachingSessions(
  userId: string,
  options?: { limit?: number; sessionType?: string }
) {
  return useQuery({
    queryKey: ['coachingSessions', userId, options],
    queryFn: () => {
      const params = new URLSearchParams();
      if (options?.limit) params.set('limit', options.limit.toString());
      if (options?.sessionType) params.set('sessionType', options.sessionType);

      const query = params.toString();
      return fetchApi<any[]>(
        `/api/coach/sessions/${userId}${query ? `?${query}` : ''}`
      );
    },
    enabled: !!userId,
  });
}

export function useLatestCoaching(userId: string) {
  return useQuery({
    queryKey: ['latestCoaching', userId],
    queryFn: () => fetchApi<CoachingSession | null>(`/api/coach/latest/${userId}`),
    enabled: !!userId,
  });
}

export function useUnreadCoachingCount(userId: string) {
  return useQuery({
    queryKey: ['unreadCoaching', userId],
    queryFn: () =>
      fetchApi<{ unreadCount: number }>(`/api/coach/unread/${userId}`),
    enabled: !!userId,
  });
}

// ============================================
// OAuth Hooks
// ============================================

export function useOAuthProviders() {
  return useQuery({
    queryKey: ['oauthProviders'],
    queryFn: () =>
      fetchApi<
        Array<{
          provider: string;
          configured: boolean;
          scopes: string[];
        }>
      >('/api/oauth/providers'),
  });
}

export function useUserIntegrations(userId: string) {
  return useQuery({
    queryKey: ['integrations', userId],
    queryFn: () => fetchApi<Integration[]>(`/api/oauth/integrations/${userId}`),
    enabled: !!userId,
  });
}

export function useConnectOAuth() {
  return useMutation({
    mutationFn: async (params: {
      provider: string;
      userId: string;
      agentId?: string;
    }) => {
      const { provider, userId, agentId } = params;
      const query = new URLSearchParams({ userId });
      if (agentId) query.set('agentId', agentId);

      const data = await fetchApi<{ authUrl: string; state: string }>(
        `/api/oauth/${provider}/connect?${query.toString()}`
      );

      // Open OAuth window
      window.location.href = data.authUrl;
      return data;
    },
  });
}

export function useDisconnectIntegration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (integrationId: string) =>
      fetchApi(`/api/oauth/integrations/${integrationId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    },
  });
}

// ============================================
// Posting Hooks
// ============================================

export function usePublishPost() {
  return useMutation({
    mutationFn: (params: {
      userId: string;
      channelType: string;
      content: string;
      mediaUrls?: string[];
      link?: string;
    }) =>
      fetchApi<{ postId: string; postUrl: string }>('/api/posts/publish', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
  });
}

export function useSchedulePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      userId: string;
      channelType: string;
      content: string;
      mediaUrls?: string[];
      scheduledAt: string;
      campaignId?: string;
    }) =>
      fetchApi<{ postId: string; scheduledAt: string }>('/api/posts/schedule', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['scheduledPosts', variables.userId],
      });
    },
  });
}

export function useScheduledPosts(
  userId: string,
  options?: { status?: string; channelType?: string; limit?: number }
) {
  return useQuery({
    queryKey: ['scheduledPosts', userId, options],
    queryFn: () => {
      const params = new URLSearchParams();
      if (options?.status) params.set('status', options.status);
      if (options?.channelType) params.set('channelType', options.channelType);
      if (options?.limit) params.set('limit', options.limit.toString());

      const query = params.toString();
      return fetchApi<ScheduledPost[]>(
        `/api/posts/scheduled/${userId}${query ? `?${query}` : ''}`
      );
    },
    enabled: !!userId,
  });
}

export function useCancelPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) =>
      fetchApi(`/api/posts/${postId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledPosts'] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      postId: string;
      content?: string;
      mediaUrls?: string[];
      scheduledAt?: string;
    }) => {
      const { postId, ...updates } = params;
      return fetchApi(`/api/posts/${postId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledPosts'] });
    },
  });
}

export function useBulkSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      userId: string;
      channels: string[];
      content: string;
      mediaUrls?: string[];
      scheduledAt: string;
      campaignId?: string;
    }) =>
      fetchApi<{
        scheduledAt: string;
        results: Array<{
          channelType: string;
          success: boolean;
          postId?: string;
          error?: string;
        }>;
        successCount: number;
        failCount: number;
      }>('/api/posts/bulk-schedule', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['scheduledPosts', variables.userId],
      });
    },
  });
}
