import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CoachSessionRequestDto,
  CoachSessionType,
  DailyTipDto,
  WeeklyReportResponseDto,
} from './dto/coach.dto';
import { v4 as uuidv4 } from 'uuid';

interface AIGatewayResponse {
  content: string;
  model: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

@Injectable()
export class CoachService {
  private readonly logger = new Logger(CoachService.name);
  private readonly aiGatewayUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.aiGatewayUrl =
      this.configService.get<string>('AI_GATEWAY_URL') ||
      'http://localhost:8000';
  }

  async createSession(request: CoachSessionRequestDto): Promise<{
    sessionId: string;
    response: string;
    actionItems: string[];
    resources: Array<{
      title: string;
      type: 'article' | 'video' | 'tool' | 'template';
      description: string;
    }>;
  }> {
    const sessionId = uuidv4();
    const prompt = this.buildCoachPrompt(request);

    try {
      const aiResponse = await this.callAIGateway(prompt);
      const parsed = this.parseCoachResponse(aiResponse.content);

      return {
        sessionId,
        response: parsed.response,
        actionItems: parsed.actionItems,
        resources: parsed.resources,
      };
    } catch (error) {
      this.logger.error('AI Gateway call failed', error);

      // Fallback response
      return {
        sessionId,
        response: this.getFallbackResponse(request.sessionType),
        actionItems: this.getDefaultActionItems(request.sessionType),
        resources: this.getDefaultResources(request.businessType),
      };
    }
  }

  async getDailyTip(
    businessType?: string,
    activeChannels?: string[],
  ): Promise<DailyTipDto> {
    const tips = this.getDailyTipsPool(businessType, activeChannels);
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        86400000,
    );
    const selectedTip = tips[dayOfYear % tips.length];

    return selectedTip;
  }

  async getWeeklyReport(userId: string): Promise<WeeklyReportResponseDto> {
    // TODO: 실제 사용자 데이터 기반 리포트 생성
    // 현재는 더미 데이터 반환
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      success: true,
      period: {
        start: weekAgo.toISOString().split('T')[0],
        end: now.toISOString().split('T')[0],
      },
      summary:
        '이번 주는 전반적으로 안정적인 성과를 보였습니다. 인스타그램 참여율이 소폭 상승했고, LinkedIn 콘텐츠의 도달률이 개선되었습니다.',
      channelInsights: [
        {
          channel: 'instagram',
          performance: 'improving',
          insight: '릴스 콘텐츠의 평균 조회수가 23% 증가했습니다',
          recommendation: '현재 릴스 전략을 유지하면서 스토리와의 연계를 강화하세요',
        },
        {
          channel: 'linkedin',
          performance: 'stable',
          insight: '게시물당 평균 노출이 유지되고 있습니다',
          recommendation: '캐러셀 포스트를 더 자주 활용해보세요',
        },
      ],
      nextWeekActions: [
        '인스타그램 릴스 3개 이상 발행',
        'LinkedIn 캐러셀 포스트 2개 제작',
        '주간 뉴스레터 발송',
        '댓글 및 DM 응대율 개선',
      ],
      overallScore: 72,
    };
  }

  private buildCoachPrompt(request: CoachSessionRequestDto): string {
    const basePrompt = `당신은 전문 마케팅 코치입니다. 사용자의 비즈니스 성장을 돕는 것이 목표입니다.

사용자 정보:
- 비즈니스 유형: ${request.businessType || '미지정'}
- 현재 목표: ${request.currentGoals?.join(', ') || '미지정'}
- 활성 채널: ${request.activeChannels?.join(', ') || '미지정'}
- 추가 컨텍스트: ${request.context || '없음'}

세션 유형: ${request.sessionType}

`;

    switch (request.sessionType) {
      case CoachSessionType.DAILY:
        return (
          basePrompt +
          `오늘의 마케팅 조언을 제공하세요. 짧고 실행 가능한 팁 위주로 응답하세요.

응답 형식:
1. 오늘의 메인 조언 (2-3문장)
2. 액션 아이템 (3개)
3. 추천 리소스 (있다면)`
        );

      case CoachSessionType.WEEKLY:
        return (
          basePrompt +
          `주간 마케팅 전략 리뷰를 제공하세요.

응답 형식:
1. 주간 성과 요약
2. 개선이 필요한 영역
3. 다음 주 우선순위 액션 아이템 (5개)
4. 장기적 전략 제안`
        );

      case CoachSessionType.STRATEGY:
        return (
          basePrompt +
          `마케팅 전략 컨설팅을 제공하세요. 비즈니스 목표 달성을 위한 구체적인 전략을 제안하세요.

응답 형식:
1. 현재 상황 분석
2. 추천 전략 (3가지)
3. 채널별 구체적 전술
4. KPI 및 성공 지표 제안`
        );

      case CoachSessionType.PROBLEM_SOLVING:
        return (
          basePrompt +
          `사용자가 직면한 마케팅 문제에 대한 솔루션을 제공하세요.

응답 형식:
1. 문제 분석
2. 가능한 원인들
3. 해결 방안 (우선순위별)
4. 예방을 위한 제안`
        );

      default:
        return basePrompt + '마케팅 조언을 제공하세요.';
    }
  }

  private async callAIGateway(prompt: string): Promise<AIGatewayResponse> {
    const response = await fetch(`${this.aiGatewayUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content:
              '당신은 디지털 마케팅 전문가이자 비즈니스 코치입니다. 실용적이고 실행 가능한 조언을 제공합니다.',
          },
          { role: 'user', content: prompt },
        ],
        model: 'nano-banana-pro',
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    return response.json();
  }

  private parseCoachResponse(content: string): {
    response: string;
    actionItems: string[];
    resources: Array<{
      title: string;
      type: 'article' | 'video' | 'tool' | 'template';
      description: string;
    }>;
  } {
    // 간단한 파싱 로직 - 실제로는 더 정교한 파싱 필요
    const lines = content.split('\n').filter((l) => l.trim());

    const actionItems: string[] = [];
    const responseLines: string[] = [];

    let inActionSection = false;

    for (const line of lines) {
      if (
        line.includes('액션') ||
        line.includes('Action') ||
        line.includes('할 일')
      ) {
        inActionSection = true;
        continue;
      }

      if (inActionSection && (line.startsWith('-') || line.match(/^\d+\./))) {
        actionItems.push(line.replace(/^[-\d.]\s*/, '').trim());
      } else if (!inActionSection) {
        responseLines.push(line);
      }

      if (line.includes('리소스') || line.includes('Resource')) {
        inActionSection = false;
      }
    }

    return {
      response: responseLines.join('\n') || content,
      actionItems: actionItems.length > 0 ? actionItems : this.getDefaultActionItems('daily'),
      resources: [],
    };
  }

  private getFallbackResponse(sessionType: CoachSessionType): string {
    const responses: Record<CoachSessionType, string> = {
      [CoachSessionType.DAILY]:
        '오늘은 핵심 채널에 집중하세요. 하나의 채널에서 양질의 콘텐츠를 발행하는 것이 여러 채널에 분산하는 것보다 효과적입니다.',
      [CoachSessionType.WEEKLY]:
        '이번 주는 콘텐츠 캘린더를 정비하고, 지난 주 성과가 좋았던 콘텐츠 유형을 분석해보세요.',
      [CoachSessionType.STRATEGY]:
        '전략 수립을 위해 먼저 목표를 명확히 정의하세요. SMART 목표 설정 프레임워크를 활용하는 것을 권장합니다.',
      [CoachSessionType.PROBLEM_SOLVING]:
        '문제 해결을 위해 데이터를 먼저 확인하세요. 가설을 세우고 작은 실험부터 시작하는 것이 좋습니다.',
    };

    return responses[sessionType];
  }

  private getDefaultActionItems(sessionType: string): string[] {
    const actions: Record<string, string[]> = {
      daily: [
        '오늘 발행할 콘텐츠 1개 준비하기',
        '어제 게시물의 댓글에 응답하기',
        '경쟁사 채널 10분간 모니터링하기',
      ],
      weekly: [
        '주간 콘텐츠 캘린더 업데이트',
        '지난 주 성과 지표 분석',
        '다음 주 캠페인 기획',
        'A/B 테스트 결과 검토',
        '팀 미팅에서 인사이트 공유',
      ],
      strategy: [
        'SWOT 분석 수행',
        '타겟 페르소나 재정의',
        '경쟁사 벤치마킹',
        'KPI 대시보드 설정',
      ],
      problem_solving: [
        '문제 상황 데이터 수집',
        '가설 3가지 수립',
        '작은 테스트 실행',
        '결과 측정 및 분석',
      ],
    };

    return actions[sessionType] || actions.daily;
  }

  private getDefaultResources(
    businessType?: string,
  ): Array<{
    title: string;
    type: 'article' | 'video' | 'tool' | 'template';
    description: string;
  }> {
    const resources = [
      {
        title: '콘텐츠 캘린더 템플릿',
        type: 'template' as const,
        description: '30일 콘텐츠 계획을 위한 스프레드시트 템플릿',
      },
      {
        title: '소셜 미디어 최적화 가이드',
        type: 'article' as const,
        description: '플랫폼별 최적의 게시 시간과 형식 정리',
      },
      {
        title: 'Canva',
        type: 'tool' as const,
        description: '무료로 사용할 수 있는 디자인 도구',
      },
    ];

    if (businessType === 'b2b') {
      resources.push({
        title: 'LinkedIn 마케팅 전략',
        type: 'article' as const,
        description: 'B2B 기업을 위한 LinkedIn 활용법',
      });
    }

    return resources;
  }

  private getDailyTipsPool(
    businessType?: string,
    activeChannels?: string[],
  ): DailyTipDto[] {
    const baseTips: DailyTipDto[] = [
      {
        title: '해시태그 전략 점검',
        content:
          '인스타그램에서 해시태그는 3-5개가 최적입니다. 너무 많은 해시태그는 오히려 알고리즘에 불리합니다.',
        category: 'social_media',
        relatedChannels: ['instagram'],
        difficulty: 'beginner',
      },
      {
        title: '콘텐츠 재활용 팁',
        content:
          '하나의 블로그 글을 LinkedIn 포스트, 인스타 캐러셀, 트위터 스레드로 변환하세요. 콘텐츠 생산 효율이 4배가 됩니다.',
        category: 'content',
        relatedChannels: ['blog', 'linkedin', 'instagram', 'twitter'],
        difficulty: 'intermediate',
      },
      {
        title: 'CTA 최적화',
        content:
          '모든 콘텐츠에 명확한 CTA(Call to Action)를 포함하세요. "자세히 알아보기"보다 "무료 가이드 다운로드"가 3배 더 효과적입니다.',
        category: 'conversion',
        relatedChannels: ['email', 'landing-page'],
        difficulty: 'beginner',
      },
      {
        title: '최적의 게시 시간',
        content:
          'B2B는 화-목 오전 9-11시, B2C는 수-금 저녁 7-9시가 참여율이 높습니다. 하지만 당신의 오디언스를 분석해보세요.',
        category: 'timing',
        relatedChannels: ['instagram', 'linkedin', 'facebook'],
        difficulty: 'beginner',
      },
      {
        title: 'A/B 테스트 시작하기',
        content:
          '이메일 제목을 2가지 버전으로 테스트하세요. 작은 변화가 큰 차이를 만듭니다. 한 번에 하나의 변수만 테스트하세요.',
        category: 'optimization',
        relatedChannels: ['email-marketing'],
        difficulty: 'intermediate',
      },
      {
        title: '스토리 활용법',
        content:
          '인스타그램/페이스북 스토리에 설문, 퀴즈, 질문 스티커를 활용하세요. 참여형 콘텐츠는 알고리즘 점수를 높입니다.',
        category: 'engagement',
        relatedChannels: ['instagram', 'facebook'],
        difficulty: 'beginner',
      },
      {
        title: 'SEO 기본기',
        content:
          '블로그 글의 첫 100자에 주요 키워드를 포함하세요. H1 태그는 페이지당 하나만 사용하고, H2-H3로 구조화하세요.',
        category: 'seo',
        relatedChannels: ['blog', 'website'],
        difficulty: 'intermediate',
      },
      {
        title: '비디오 시작 3초의 법칙',
        content:
          '틱톡/릴스의 처음 3초가 조회수를 결정합니다. 질문으로 시작하거나, 결과를 먼저 보여주세요.',
        category: 'video',
        relatedChannels: ['tiktok', 'instagram', 'youtube'],
        difficulty: 'beginner',
      },
      {
        title: '이메일 개인화',
        content:
          '이메일 제목에 수신자 이름을 넣으면 오픈율이 26% 상승합니다. 단, 남용하지 마세요.',
        category: 'email',
        relatedChannels: ['email-marketing'],
        difficulty: 'beginner',
      },
      {
        title: 'UGC 활용',
        content:
          '사용자 생성 콘텐츠(UGC)는 브랜드 콘텐츠보다 신뢰도가 9배 높습니다. 고객 리뷰와 사용 후기를 적극 공유하세요.',
        category: 'social_proof',
        relatedChannels: ['instagram', 'tiktok', 'facebook'],
        difficulty: 'intermediate',
      },
    ];

    // 비즈니스 타입에 따른 필터링
    if (businessType === 'b2b') {
      return baseTips.filter(
        (tip) =>
          tip.relatedChannels.includes('linkedin') ||
          tip.relatedChannels.includes('email-marketing') ||
          tip.relatedChannels.includes('blog'),
      );
    }

    // 활성 채널에 따른 필터링
    if (activeChannels && activeChannels.length > 0) {
      const filtered = baseTips.filter((tip) =>
        tip.relatedChannels.some((ch) => activeChannels.includes(ch)),
      );
      if (filtered.length >= 3) return filtered;
    }

    return baseTips;
  }
}
