import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CoachService } from './coach.service';
import {
  CoachSessionRequestDto,
  CoachSessionResponseDto,
  DailyTipDto,
  WeeklyReportRequestDto,
  WeeklyReportResponseDto,
} from './dto/coach.dto';

@ApiTags('coach')
@Controller('coach')
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @Post('session')
  @ApiOperation({ summary: '코칭 세션 시작' })
  @ApiResponse({ status: 201, type: CoachSessionResponseDto })
  async createSession(
    @Body() request: CoachSessionRequestDto,
  ): Promise<CoachSessionResponseDto> {
    const result = await this.coachService.createSession(request);

    return {
      success: true,
      ...result,
    };
  }

  @Get('daily-tip')
  @ApiOperation({ summary: '오늘의 마케팅 팁' })
  @ApiQuery({ name: 'businessType', required: false, example: 'startup' })
  @ApiQuery({
    name: 'channels',
    required: false,
    example: 'instagram,linkedin',
  })
  @ApiResponse({ status: 200, type: DailyTipDto })
  async getDailyTip(
    @Query('businessType') businessType?: string,
    @Query('channels') channels?: string,
  ): Promise<{ success: boolean; data: DailyTipDto }> {
    const activeChannels = channels?.split(',').map((c) => c.trim());
    const tip = await this.coachService.getDailyTip(businessType, activeChannels);

    return {
      success: true,
      data: tip,
    };
  }

  @Post('weekly-report')
  @ApiOperation({ summary: '주간 마케팅 리포트' })
  @ApiResponse({ status: 200, type: WeeklyReportResponseDto })
  async getWeeklyReport(
    @Body() request: WeeklyReportRequestDto,
  ): Promise<WeeklyReportResponseDto> {
    return this.coachService.getWeeklyReport(request.userId);
  }

  @Get('quick-advice')
  @ApiOperation({ summary: '빠른 조언 (특정 주제)' })
  @ApiQuery({
    name: 'topic',
    required: true,
    example: 'instagram_engagement',
    enum: [
      'instagram_engagement',
      'linkedin_reach',
      'email_open_rate',
      'content_ideas',
      'budget_allocation',
      'competitor_analysis',
    ],
  })
  async getQuickAdvice(@Query('topic') topic: string) {
    const advices: Record<
      string,
      { title: string; advice: string; actionItems: string[] }
    > = {
      instagram_engagement: {
        title: '인스타그램 참여율 높이기',
        advice:
          '참여율을 높이려면 릴스와 캐러셀 포스트를 적극 활용하세요. 댓글에 빠르게 응답하고, 스토리 스티커로 상호작용을 유도하세요.',
        actionItems: [
          '매일 최소 1개의 스토리 발행',
          '모든 댓글에 2시간 내 응답',
          '주 2회 이상 릴스 업로드',
          '캡션에 질문을 포함하여 댓글 유도',
        ],
      },
      linkedin_reach: {
        title: 'LinkedIn 도달률 개선',
        advice:
          'LinkedIn은 첫 1시간의 참여가 중요합니다. 게시 직후 댓글에 적극 응답하고, 관련 해시태그 3-5개를 사용하세요.',
        actionItems: [
          '게시 후 30분간 댓글 모니터링',
          '문서(Document) 포스트 활용',
          '업계 인플루언서 태그하기',
          '화-목 오전 9시 게시',
        ],
      },
      email_open_rate: {
        title: '이메일 오픈율 개선',
        advice:
          '제목은 50자 이내로 유지하고, 개인화를 적용하세요. 발송 시간을 A/B 테스트하여 최적의 타이밍을 찾으세요.',
        actionItems: [
          '제목 A/B 테스트 실시',
          '발신자 이름 최적화',
          '프리헤더 텍스트 활용',
          '모바일 미리보기 확인',
        ],
      },
      content_ideas: {
        title: '콘텐츠 아이디어 발굴',
        advice:
          '고객 FAQ를 콘텐츠화하고, 업계 트렌드를 분석하세요. 경쟁사의 인기 콘텐츠를 참고하되 차별화하세요.',
        actionItems: [
          '고객 문의 TOP 10 정리',
          'Google Trends 주간 체크',
          '업계 뉴스레터 5개 구독',
          '월간 콘텐츠 브레인스토밍',
        ],
      },
      budget_allocation: {
        title: '마케팅 예산 배분',
        advice:
          '70-20-10 법칙을 적용하세요. 검증된 채널에 70%, 성장 가능 채널에 20%, 실험에 10%를 배분하세요.',
        actionItems: [
          '채널별 ROI 분석',
          '분기별 예산 리뷰',
          'CAC와 LTV 계산',
          '벤치마크 데이터 수집',
        ],
      },
      competitor_analysis: {
        title: '경쟁사 분석',
        advice:
          '경쟁사 소셜 미디어를 정기적으로 모니터링하고, 그들의 성공 전략을 분석하세요. 단, 복사하지 말고 인사이트를 얻으세요.',
        actionItems: [
          '경쟁사 5개 리스트업',
          '월간 경쟁사 리포트 작성',
          '차별화 포인트 정의',
          '벤치마킹 항목 선정',
        ],
      },
    };

    const advice = advices[topic] || {
      title: '일반 조언',
      advice: '먼저 명확한 목표를 설정하고, 데이터 기반의 의사결정을 하세요.',
      actionItems: ['목표 KPI 설정', '현황 분석', '실행 계획 수립', '결과 측정'],
    };

    return {
      success: true,
      data: advice,
    };
  }
}
