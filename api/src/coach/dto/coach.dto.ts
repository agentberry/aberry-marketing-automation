import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';

export enum CoachSessionType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  STRATEGY = 'strategy',
  PROBLEM_SOLVING = 'problem_solving',
}

export class CoachSessionRequestDto {
  @ApiProperty({ description: '사용자 ID' })
  @IsString()
  userId: string;

  @ApiProperty({
    description: '세션 유형',
    enum: CoachSessionType,
    example: CoachSessionType.DAILY,
  })
  @IsEnum(CoachSessionType)
  sessionType: CoachSessionType;

  @ApiPropertyOptional({ description: '비즈니스 유형', example: 'startup' })
  @IsOptional()
  @IsString()
  businessType?: string;

  @ApiPropertyOptional({
    description: '현재 마케팅 목표',
    example: ['brand_awareness', 'lead_generation'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  currentGoals?: string[];

  @ApiPropertyOptional({
    description: '현재 사용 중인 채널',
    example: ['instagram', 'linkedin'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  activeChannels?: string[];

  @ApiPropertyOptional({
    description: '추가 컨텍스트 또는 질문',
    example: '최근 인스타그램 참여율이 떨어지고 있어요',
  })
  @IsOptional()
  @IsString()
  context?: string;
}

export class CoachMessageDto {
  @ApiProperty({ description: '역할', enum: ['user', 'assistant'] })
  role: 'user' | 'assistant';

  @ApiProperty({ description: '메시지 내용' })
  content: string;
}

export class CoachSessionResponseDto {
  @ApiProperty({ description: '성공 여부' })
  success: boolean;

  @ApiProperty({ description: '세션 ID' })
  sessionId: string;

  @ApiProperty({ description: '코치 응답' })
  response: string;

  @ApiProperty({ description: '제안된 액션 아이템' })
  actionItems: string[];

  @ApiProperty({ description: '추천 리소스' })
  resources: Array<{
    title: string;
    type: 'article' | 'video' | 'tool' | 'template';
    description: string;
  }>;
}

export class DailyTipDto {
  @ApiProperty({ description: '팁 제목' })
  title: string;

  @ApiProperty({ description: '팁 내용' })
  content: string;

  @ApiProperty({ description: '카테고리' })
  category: string;

  @ApiProperty({ description: '관련 채널' })
  relatedChannels: string[];

  @ApiProperty({ description: '난이도', enum: ['beginner', 'intermediate', 'advanced'] })
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export class WeeklyReportRequestDto {
  @ApiProperty({ description: '사용자 ID' })
  @IsString()
  userId: string;

  @ApiPropertyOptional({ description: '분석 기간 (일)', example: 7 })
  @IsOptional()
  period?: number;
}

export class WeeklyReportResponseDto {
  @ApiProperty({ description: '성공 여부' })
  success: boolean;

  @ApiProperty({ description: '리포트 기간' })
  period: {
    start: string;
    end: string;
  };

  @ApiProperty({ description: '성과 요약' })
  summary: string;

  @ApiProperty({ description: '채널별 인사이트' })
  channelInsights: Array<{
    channel: string;
    performance: 'improving' | 'stable' | 'declining';
    insight: string;
    recommendation: string;
  }>;

  @ApiProperty({ description: '다음 주 추천 액션' })
  nextWeekActions: string[];

  @ApiProperty({ description: '전체 점수 (0-100)' })
  overallScore: number;
}
