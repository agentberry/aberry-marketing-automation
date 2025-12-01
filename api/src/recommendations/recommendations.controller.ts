import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';
import {
  RecommendationQueryDto,
  RecommendationResponseDto,
} from './dto/recommendation.dto';

@ApiTags('recommendations')
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get()
  @ApiOperation({ summary: '채널 추천 받기' })
  @ApiResponse({ status: 200, type: RecommendationResponseDto })
  async getRecommendations(@Query() query: RecommendationQueryDto) {
    const recommendations =
      await this.recommendationsService.getRecommendations(query);

    return {
      success: true,
      data: recommendations,
      totalCount: recommendations.length,
      query,
    };
  }

  @Get('free')
  @ApiOperation({ summary: '무료 채널 추천' })
  @ApiQuery({ name: 'businessType', required: true, example: 'startup' })
  @ApiQuery({ name: 'limit', required: false, example: 5 })
  async getTopFreeChannels(
    @Query('businessType') businessType: string,
    @Query('limit') limit?: number,
  ) {
    const recommendations = await this.recommendationsService.getTopFreeChannels(
      businessType,
      limit || 5,
    );

    return {
      success: true,
      data: recommendations,
      totalCount: recommendations.length,
    };
  }

  @Get('by-goal')
  @ApiOperation({ summary: '목표 기반 채널 추천' })
  @ApiQuery({
    name: 'goal',
    required: true,
    example: 'brand_awareness',
    enum: [
      'brand_awareness',
      'lead_generation',
      'sales',
      'engagement',
      'traffic',
      'retention',
      'thought_leadership',
    ],
  })
  @ApiQuery({ name: 'businessType', required: true, example: 'startup' })
  @ApiQuery({ name: 'budget', required: false, example: 500 })
  async getChannelsByGoal(
    @Query('goal') goal: string,
    @Query('businessType') businessType: string,
    @Query('budget') budget?: number,
  ) {
    const recommendations = await this.recommendationsService.getChannelsByGoal(
      goal,
      businessType,
      budget,
    );

    return {
      success: true,
      data: recommendations,
      totalCount: recommendations.length,
      query: { goal, businessType, budget },
    };
  }

  @Get('quick-start')
  @ApiOperation({ summary: '빠른 시작 플랜 추천' })
  @ApiQuery({ name: 'businessType', required: true, example: 'startup' })
  async getQuickStartPlan(@Query('businessType') businessType: string) {
    const plan =
      await this.recommendationsService.getQuickStartPlan(businessType);

    return {
      success: true,
      data: plan,
    };
  }
}
