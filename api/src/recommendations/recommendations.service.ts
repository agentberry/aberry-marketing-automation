import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecommendationEngine } from './recommendation-engine';
import {
  RecommendationQueryDto,
  ChannelScoreDto,
} from './dto/recommendation.dto';

@Injectable()
export class RecommendationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly engine: RecommendationEngine,
  ) {}

  async getRecommendations(
    query: RecommendationQueryDto,
  ): Promise<ChannelScoreDto[]> {
    // 활성화된 모든 채널 조회
    const channels = await this.prisma.marketingChannel.findMany({
      where: {
        isActive: true,
      },
    });

    // 추천 엔진으로 점수 계산
    const scoredChannels = this.engine.calculateScores(channels, query);

    // 예산 필터 적용 (예산이 0이면 무료 채널만)
    let filteredChannels = scoredChannels;
    if (query.budget === 0) {
      filteredChannels = scoredChannels.filter((ch) => ch.isFree);
    } else if (query.budget !== undefined) {
      filteredChannels = scoredChannels.filter(
        (ch) => ch.isFree || ch.monthlyCost <= query.budget,
      );
    }

    // 결과 개수 제한
    const limit = query.limit || 10;
    return filteredChannels.slice(0, limit);
  }

  async getTopFreeChannels(
    businessType: string,
    limit = 5,
  ): Promise<ChannelScoreDto[]> {
    const channels = await this.prisma.marketingChannel.findMany({
      where: {
        isActive: true,
        isFree: true,
      },
    });

    const query: RecommendationQueryDto = {
      businessType,
      budget: 0,
      limit,
    };

    const scored = this.engine.calculateScores(channels, query);
    return scored.slice(0, limit);
  }

  async getChannelsByGoal(
    goal: string,
    businessType: string,
    budget?: number,
  ): Promise<ChannelScoreDto[]> {
    const channels = await this.prisma.marketingChannel.findMany({
      where: {
        isActive: true,
      },
    });

    const query: RecommendationQueryDto = {
      businessType,
      goals: [goal],
      budget,
      limit: 10,
    };

    return this.engine.calculateScores(channels, query).slice(0, 10);
  }

  async getQuickStartPlan(businessType: string): Promise<{
    free: ChannelScoreDto[];
    paid: ChannelScoreDto[];
    strategy: string[];
  }> {
    const channels = await this.prisma.marketingChannel.findMany({
      where: { isActive: true },
    });

    // 무료 채널 추천
    const freeQuery: RecommendationQueryDto = {
      businessType,
      budget: 0,
      limit: 3,
    };
    const freeChannels = this.engine
      .calculateScores(
        channels.filter((c) => c.isFree),
        freeQuery,
      )
      .slice(0, 3);

    // 유료 채널 추천 (중간 예산)
    const paidQuery: RecommendationQueryDto = {
      businessType,
      budget: 500,
      limit: 3,
    };
    const paidChannels = this.engine
      .calculateScores(
        channels.filter((c) => !c.isFree),
        paidQuery,
      )
      .slice(0, 3);

    // 전략 제안
    const strategy = this.generateQuickStartStrategy(
      businessType,
      freeChannels,
      paidChannels,
    );

    return {
      free: freeChannels,
      paid: paidChannels,
      strategy,
    };
  }

  private generateQuickStartStrategy(
    businessType: string,
    freeChannels: ChannelScoreDto[],
    paidChannels: ChannelScoreDto[],
  ): string[] {
    const strategies: string[] = [];

    // 비즈니스 타입별 전략
    const typeStrategies: Record<string, string[]> = {
      startup: [
        '초기에는 무료 채널에 집중하여 PMF(Product-Market Fit)를 검증하세요',
        'Product Hunt 런칭을 준비하고, 초기 사용자 피드백을 수집하세요',
        'LinkedIn을 통해 투자자 및 파트너십 네트워크를 구축하세요',
      ],
      ecommerce: [
        '인스타그램 쇼핑 기능을 활성화하여 구매 전환을 높이세요',
        '네이버 쇼핑/쿠팡에 입점하여 검색 노출을 확보하세요',
        '리타겟팅 광고로 장바구니 이탈 고객을 다시 유도하세요',
      ],
      b2b: [
        'LinkedIn에서 타겟 기업의 의사결정자에게 도달하세요',
        '웨비나와 화이트페이퍼로 리드를 생성하세요',
        '이메일 마케팅으로 리드를 육성(Nurturing)하세요',
      ],
      b2c: [
        '인스타그램 릴스와 TikTok으로 바이럴 콘텐츠를 제작하세요',
        '인플루언서 마케팅으로 신뢰도를 높이세요',
        '사용자 생성 콘텐츠(UGC)를 적극 활용하세요',
      ],
      local_business: [
        '구글 마이비즈니스와 네이버 플레이스를 최적화하세요',
        '지역 키워드로 SEO를 강화하세요',
        '고객 리뷰를 적극적으로 수집하고 관리하세요',
      ],
      creator: [
        '유튜브를 메인 채널로, 쇼츠/릴스를 통해 새 시청자를 유입하세요',
        '커뮤니티를 구축하여 충성 팬을 확보하세요',
        '멀티 플랫폼 전략으로 리스크를 분산하세요',
      ],
    };

    const defaultStrategy = [
      '무료 채널부터 시작하여 효과를 검증하세요',
      '가장 높은 점수의 채널에 집중하세요',
      '콘텐츠를 일관성 있게 발행하세요',
    ];

    strategies.push(...(typeStrategies[businessType] || defaultStrategy));

    // 추천 채널 기반 추가 전략
    if (freeChannels.length > 0) {
      strategies.push(
        `먼저 ${freeChannels[0].name}부터 시작하여 기초를 다지세요`,
      );
    }

    if (paidChannels.length > 0) {
      strategies.push(
        `예산이 확보되면 ${paidChannels[0].name}을 통해 스케일업하세요`,
      );
    }

    return strategies.slice(0, 5);
  }
}
