import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RecommendationQueryDto {
  @ApiProperty({ description: '비즈니스 유형', example: 'startup' })
  @IsString()
  businessType: string;

  @ApiPropertyOptional({ description: '월 예산 (USD)', example: 500 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  budget?: number;

  @ApiPropertyOptional({
    description: '마케팅 목표',
    example: ['brand_awareness', 'lead_generation'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  goals?: string[];

  @ApiPropertyOptional({ description: '타겟 연령대', example: '25-34' })
  @IsOptional()
  @IsString()
  targetAge?: string;

  @ApiPropertyOptional({ description: '타겟 지역', example: 'korea' })
  @IsOptional()
  @IsString()
  targetRegion?: string;

  @ApiPropertyOptional({
    description: '선호 콘텐츠 유형',
    example: ['video', 'image'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contentTypes?: string[];

  @ApiPropertyOptional({
    description: '결과 개수 제한',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  limit?: number;
}

export class ChannelScoreDto {
  @ApiProperty({ description: '채널 ID' })
  id: string;

  @ApiProperty({ description: '채널 이름' })
  name: string;

  @ApiProperty({ description: '채널 슬러그' })
  slug: string;

  @ApiProperty({ description: '채널 카테고리' })
  category: string;

  @ApiProperty({ description: '채널 아이콘' })
  icon: string;

  @ApiProperty({ description: '종합 점수 (0-100)' })
  score: number;

  @ApiProperty({ description: '무료 여부' })
  isFree: boolean;

  @ApiProperty({ description: '월 비용' })
  monthlyCost: number;

  @ApiProperty({ description: '점수 상세' })
  scoreBreakdown: {
    businessFit: number;
    budgetFit: number;
    goalAlignment: number;
    audienceFit: number;
    contentFit: number;
  };

  @ApiProperty({ description: '추천 이유' })
  reasons: string[];
}

export class RecommendationResponseDto {
  @ApiProperty({ description: '성공 여부' })
  success: boolean;

  @ApiProperty({ description: '추천 채널 목록', type: [ChannelScoreDto] })
  data: ChannelScoreDto[];

  @ApiProperty({ description: '총 추천 수' })
  totalCount: number;

  @ApiProperty({ description: '쿼리 파라미터' })
  query: RecommendationQueryDto;
}
