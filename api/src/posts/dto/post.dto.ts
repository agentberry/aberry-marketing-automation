import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  IsDateString,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PostStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHING = 'publishing',
  PUBLISHED = 'published',
  FAILED = 'failed',
}

export enum ContentType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  CAROUSEL = 'carousel',
  LINK = 'link',
  STORY = 'story',
  REEL = 'reel',
}

export class MediaItemDto {
  @ApiProperty({ description: '미디어 URL' })
  @IsString()
  url: string;

  @ApiProperty({
    description: '미디어 유형',
    enum: ['image', 'video'],
  })
  @IsEnum(['image', 'video'])
  type: 'image' | 'video';

  @ApiPropertyOptional({ description: '대체 텍스트' })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({ description: '썸네일 URL' })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;
}

export class CreatePostDto {
  @ApiProperty({ description: '사용자 ID' })
  @IsString()
  userId: string;

  @ApiProperty({ description: '게시 채널 (계정 ID 목록)' })
  @IsArray()
  @IsString({ each: true })
  accountIds: string[];

  @ApiProperty({ description: '콘텐츠 유형', enum: ContentType })
  @IsEnum(ContentType)
  contentType: ContentType;

  @ApiProperty({ description: '게시물 내용' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: '미디어 파일', type: [MediaItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaItemDto)
  media?: MediaItemDto[];

  @ApiPropertyOptional({ description: '해시태그' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hashtags?: string[];

  @ApiPropertyOptional({ description: '링크 URL' })
  @IsOptional()
  @IsString()
  linkUrl?: string;

  @ApiPropertyOptional({ description: '예약 발행 시간 (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiPropertyOptional({ description: '즉시 발행 여부', default: false })
  @IsOptional()
  @IsBoolean()
  publishNow?: boolean;
}

export class UpdatePostDto {
  @ApiPropertyOptional({ description: '콘텐츠' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: '미디어', type: [MediaItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaItemDto)
  media?: MediaItemDto[];

  @ApiPropertyOptional({ description: '해시태그' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hashtags?: string[];

  @ApiPropertyOptional({ description: '예약 시간 변경' })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}

export class PostResponseDto {
  @ApiProperty({ description: '게시물 ID' })
  id: string;

  @ApiProperty({ description: '사용자 ID' })
  userId: string;

  @ApiProperty({ description: '상태', enum: PostStatus })
  status: PostStatus;

  @ApiProperty({ description: '콘텐츠 유형', enum: ContentType })
  contentType: ContentType;

  @ApiProperty({ description: '내용' })
  content: string;

  @ApiPropertyOptional({ description: '미디어' })
  media?: MediaItemDto[];

  @ApiPropertyOptional({ description: '해시태그' })
  hashtags?: string[];

  @ApiPropertyOptional({ description: '예약 시간' })
  scheduledAt?: Date;

  @ApiPropertyOptional({ description: '발행 시간' })
  publishedAt?: Date;

  @ApiProperty({ description: '생성 시간' })
  createdAt: Date;

  @ApiProperty({ description: '타겟 계정 목록' })
  targetAccounts: Array<{
    accountId: string;
    platform: string;
    status: string;
    publishedUrl?: string;
    error?: string;
  }>;
}

export class PostQueryDto {
  @ApiPropertyOptional({ description: '상태 필터', enum: PostStatus })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @ApiPropertyOptional({ description: '시작 날짜' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: '종료 날짜' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: '페이지 번호', default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: '페이지 크기', default: 20 })
  @IsOptional()
  limit?: number;
}

export class ScheduleAnalyticsDto {
  @ApiProperty({ description: '날짜' })
  date: string;

  @ApiProperty({ description: '예정된 게시물 수' })
  scheduled: number;

  @ApiProperty({ description: '발행된 게시물 수' })
  published: number;

  @ApiProperty({ description: '실패한 게시물 수' })
  failed: number;
}
