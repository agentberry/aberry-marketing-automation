import { Injectable } from '@nestjs/common';
import { MarketingChannel } from '@prisma/client';
import { RecommendationQueryDto, ChannelScoreDto } from './dto/recommendation.dto';

interface ScoringWeights {
  businessFit: number;
  budgetFit: number;
  goalAlignment: number;
  audienceFit: number;
  contentFit: number;
}

@Injectable()
export class RecommendationEngine {
  private readonly defaultWeights: ScoringWeights = {
    businessFit: 0.25,
    budgetFit: 0.2,
    goalAlignment: 0.25,
    audienceFit: 0.15,
    contentFit: 0.15,
  };

  private readonly businessTypeChannelMap: Record<string, string[]> = {
    startup: [
      'instagram',
      'linkedin',
      'twitter',
      'product-hunt',
      'hacker-news',
      'reddit',
    ],
    ecommerce: [
      'instagram',
      'facebook',
      'google-ads',
      'naver-shopping',
      'coupang',
      'pinterest',
    ],
    b2b: ['linkedin', 'google-ads', 'email-marketing', 'webinar', 'blog'],
    b2c: [
      'instagram',
      'facebook',
      'tiktok',
      'youtube',
      'influencer-marketing',
    ],
    local_business: [
      'google-my-business',
      'naver-place',
      'kakao-map',
      'instagram',
      'facebook',
    ],
    creator: ['youtube', 'tiktok', 'instagram', 'twitch', 'patreon'],
    agency: ['linkedin', 'clutch', 'behance', 'dribbble', 'upwork'],
    saas: [
      'google-ads',
      'linkedin',
      'product-hunt',
      'g2',
      'capterra',
      'content-marketing',
    ],
    nonprofit: [
      'facebook',
      'instagram',
      'email-marketing',
      'google-ad-grants',
    ],
    education: ['youtube', 'instagram', 'linkedin', 'blog', 'podcast'],
  };

  private readonly goalChannelMap: Record<string, string[]> = {
    brand_awareness: [
      'instagram',
      'youtube',
      'tiktok',
      'facebook',
      'influencer-marketing',
    ],
    lead_generation: [
      'linkedin',
      'google-ads',
      'facebook-ads',
      'email-marketing',
      'webinar',
    ],
    sales: [
      'google-ads',
      'facebook-ads',
      'naver-shopping',
      'coupang',
      'affiliate-marketing',
    ],
    engagement: ['instagram', 'twitter', 'tiktok', 'discord', 'community'],
    traffic: ['seo', 'google-ads', 'blog', 'pinterest', 'reddit'],
    retention: ['email-marketing', 'push-notification', 'community', 'discord'],
    thought_leadership: ['linkedin', 'blog', 'podcast', 'medium', 'substack'],
  };

  private readonly ageGroupChannelMap: Record<string, string[]> = {
    '13-17': ['tiktok', 'instagram', 'youtube', 'snapchat', 'discord'],
    '18-24': ['tiktok', 'instagram', 'youtube', 'twitter', 'discord'],
    '25-34': ['instagram', 'linkedin', 'youtube', 'facebook', 'twitter'],
    '35-44': ['facebook', 'linkedin', 'youtube', 'instagram', 'email-marketing'],
    '45-54': ['facebook', 'linkedin', 'email-marketing', 'google-ads'],
    '55+': ['facebook', 'email-marketing', 'google-ads', 'youtube'],
  };

  private readonly regionChannelMap: Record<string, string[]> = {
    korea: [
      'naver-blog',
      'naver-cafe',
      'kakao',
      'instagram',
      'youtube',
      'naver-shopping',
    ],
    japan: ['line', 'twitter', 'instagram', 'youtube', 'yahoo-japan'],
    china: ['wechat', 'weibo', 'douyin', 'xiaohongshu', 'baidu'],
    us: ['instagram', 'facebook', 'twitter', 'linkedin', 'google-ads'],
    europe: ['instagram', 'facebook', 'linkedin', 'twitter', 'google-ads'],
    sea: ['facebook', 'instagram', 'line', 'shopee', 'lazada'],
    global: ['instagram', 'youtube', 'facebook', 'google-ads', 'linkedin'],
  };

  private readonly contentTypeChannelMap: Record<string, string[]> = {
    video: ['youtube', 'tiktok', 'instagram', 'facebook'],
    image: ['instagram', 'pinterest', 'facebook'],
    text: ['twitter', 'linkedin', 'blog', 'medium', 'substack'],
    audio: ['podcast', 'spotify', 'clubhouse'],
    live: ['youtube', 'twitch', 'instagram', 'tiktok'],
    stories: ['instagram', 'facebook', 'snapchat', 'tiktok'],
  };

  /**
   * 채널 추천 점수 계산
   */
  calculateScores(
    channels: MarketingChannel[],
    query: RecommendationQueryDto,
  ): ChannelScoreDto[] {
    const scoredChannels = channels.map((channel) => {
      const scoreBreakdown = this.calculateChannelScore(channel, query);
      const totalScore = this.calculateTotalScore(scoreBreakdown);
      const reasons = this.generateReasons(channel, query, scoreBreakdown);

      return {
        id: channel.id,
        name: channel.name,
        slug: channel.slug,
        category: channel.category,
        icon: channel.icon,
        score: Math.round(totalScore * 100) / 100,
        isFree: channel.isFree,
        monthlyCost: channel.monthlyCost,
        scoreBreakdown: {
          businessFit: Math.round(scoreBreakdown.businessFit * 100),
          budgetFit: Math.round(scoreBreakdown.budgetFit * 100),
          goalAlignment: Math.round(scoreBreakdown.goalAlignment * 100),
          audienceFit: Math.round(scoreBreakdown.audienceFit * 100),
          contentFit: Math.round(scoreBreakdown.contentFit * 100),
        },
        reasons,
      };
    });

    // 점수 기준 내림차순 정렬
    return scoredChannels.sort((a, b) => b.score - a.score);
  }

  private calculateChannelScore(
    channel: MarketingChannel,
    query: RecommendationQueryDto,
  ): ScoringWeights {
    return {
      businessFit: this.calculateBusinessFit(channel, query.businessType),
      budgetFit: this.calculateBudgetFit(channel, query.budget),
      goalAlignment: this.calculateGoalAlignment(channel, query.goals),
      audienceFit: this.calculateAudienceFit(
        channel,
        query.targetAge,
        query.targetRegion,
      ),
      contentFit: this.calculateContentFit(channel, query.contentTypes),
    };
  }

  private calculateTotalScore(breakdown: ScoringWeights): number {
    return (
      breakdown.businessFit * this.defaultWeights.businessFit +
      breakdown.budgetFit * this.defaultWeights.budgetFit +
      breakdown.goalAlignment * this.defaultWeights.goalAlignment +
      breakdown.audienceFit * this.defaultWeights.audienceFit +
      breakdown.contentFit * this.defaultWeights.contentFit
    );
  }

  private calculateBusinessFit(
    channel: MarketingChannel,
    businessType: string,
  ): number {
    const recommendedChannels =
      this.businessTypeChannelMap[businessType] || [];

    if (recommendedChannels.length === 0) return 0.5;

    const index = recommendedChannels.indexOf(channel.slug);
    if (index === -1) return 0.3;

    // 상위에 있을수록 높은 점수
    return 1 - index * 0.1;
  }

  private calculateBudgetFit(
    channel: MarketingChannel,
    budget?: number,
  ): number {
    if (budget === undefined || budget === null) return 0.5;

    if (channel.isFree) return 1;

    if (budget === 0) {
      return channel.isFree ? 1 : 0;
    }

    // 예산 대비 채널 비용 비율
    const costRatio = channel.monthlyCost / budget;

    if (costRatio <= 0.1) return 1; // 예산의 10% 이하
    if (costRatio <= 0.2) return 0.9;
    if (costRatio <= 0.3) return 0.8;
    if (costRatio <= 0.5) return 0.6;
    if (costRatio <= 0.7) return 0.4;
    if (costRatio <= 1) return 0.2;
    return 0; // 예산 초과
  }

  private calculateGoalAlignment(
    channel: MarketingChannel,
    goals?: string[],
  ): number {
    if (!goals || goals.length === 0) return 0.5;

    let totalScore = 0;
    let matchCount = 0;

    for (const goal of goals) {
      const recommendedChannels = this.goalChannelMap[goal] || [];
      if (recommendedChannels.length === 0) continue;

      const index = recommendedChannels.indexOf(channel.slug);
      if (index !== -1) {
        totalScore += 1 - index * 0.15;
        matchCount++;
      }
    }

    if (matchCount === 0) return 0.2;
    return totalScore / goals.length;
  }

  private calculateAudienceFit(
    channel: MarketingChannel,
    targetAge?: string,
    targetRegion?: string,
  ): number {
    let ageScore = 0.5;
    let regionScore = 0.5;

    if (targetAge) {
      const ageChannels = this.ageGroupChannelMap[targetAge] || [];
      if (ageChannels.length > 0) {
        const index = ageChannels.indexOf(channel.slug);
        ageScore = index !== -1 ? 1 - index * 0.15 : 0.2;
      }
    }

    if (targetRegion) {
      const regionChannels = this.regionChannelMap[targetRegion] || [];
      if (regionChannels.length > 0) {
        const index = regionChannels.indexOf(channel.slug);
        regionScore = index !== -1 ? 1 - index * 0.1 : 0.3;
      }
    }

    return (ageScore + regionScore) / 2;
  }

  private calculateContentFit(
    channel: MarketingChannel,
    contentTypes?: string[],
  ): number {
    if (!contentTypes || contentTypes.length === 0) return 0.5;

    let totalScore = 0;
    let matchCount = 0;

    for (const contentType of contentTypes) {
      const recommendedChannels = this.contentTypeChannelMap[contentType] || [];
      if (recommendedChannels.length === 0) continue;

      const index = recommendedChannels.indexOf(channel.slug);
      if (index !== -1) {
        totalScore += 1 - index * 0.2;
        matchCount++;
      }
    }

    if (matchCount === 0) return 0.3;
    return totalScore / contentTypes.length;
  }

  private generateReasons(
    channel: MarketingChannel,
    query: RecommendationQueryDto,
    scores: ScoringWeights,
  ): string[] {
    const reasons: string[] = [];

    // 비즈니스 적합성 이유
    if (scores.businessFit >= 0.8) {
      reasons.push(`${query.businessType} 비즈니스에 최적화된 채널입니다`);
    }

    // 예산 적합성 이유
    if (channel.isFree) {
      reasons.push('무료로 시작할 수 있습니다');
    } else if (scores.budgetFit >= 0.8 && query.budget) {
      reasons.push(`예산(${query.budget}$) 내에서 효율적으로 운영 가능합니다`);
    }

    // 목표 적합성 이유
    if (scores.goalAlignment >= 0.7 && query.goals) {
      const matchedGoals = query.goals.filter((goal) =>
        (this.goalChannelMap[goal] || []).includes(channel.slug),
      );
      if (matchedGoals.length > 0) {
        reasons.push(`${matchedGoals.join(', ')} 목표 달성에 효과적입니다`);
      }
    }

    // 타겟 오디언스 이유
    if (scores.audienceFit >= 0.7) {
      if (query.targetAge) {
        reasons.push(`${query.targetAge}세 타겟에게 도달하기 좋습니다`);
      }
      if (query.targetRegion) {
        reasons.push(`${query.targetRegion} 지역에서 인기있는 채널입니다`);
      }
    }

    // 콘텐츠 적합성 이유
    if (scores.contentFit >= 0.7 && query.contentTypes) {
      reasons.push(`${query.contentTypes.join(', ')} 콘텐츠에 적합합니다`);
    }

    // 기본 이유
    if (reasons.length === 0) {
      reasons.push(`${channel.category} 카테고리의 인기 채널입니다`);
    }

    return reasons.slice(0, 3); // 최대 3개 이유
  }
}
