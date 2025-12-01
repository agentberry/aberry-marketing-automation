import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class ChannelQueryDto {
  @ApiPropertyOptional({ description: '채널 타입 (ORGANIC, PAID, HYBRID)' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: '카테고리 (SOCIAL, BLOG, etc.)' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: '비용 레벨 (FREE, LOW, MEDIUM, HIGH)' })
  @IsOptional()
  @IsString()
  costLevel?: string;

  @ApiPropertyOptional({ description: '활성 상태' })
  @IsOptional()
  @IsString()
  active?: string;
}

export class ChannelResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  channelType: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  costLevel: string;

  @ApiProperty()
  difficultyLevel: string;

  @ApiProperty()
  apiAvailable: boolean;

  @ApiProperty()
  automationLevel: string;

  @ApiProperty()
  engagementScore: number;

  @ApiProperty()
  reachPotential: number;

  @ApiProperty()
  viralPotential: number;

  @ApiProperty({ type: [String] })
  supportedContentTypes: string[];

  @ApiPropertyOptional()
  icon?: string;

  @ApiPropertyOptional()
  color?: string;
}
