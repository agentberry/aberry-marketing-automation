import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';

export enum OAuthProvider {
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter',
  META = 'meta',
  TIKTOK = 'tiktok',
  GOOGLE = 'google',
  NAVER = 'naver',
  KAKAO = 'kakao',
}

export class OAuthInitiateDto {
  @ApiProperty({
    description: 'OAuth 제공자',
    enum: OAuthProvider,
    example: OAuthProvider.LINKEDIN,
  })
  @IsEnum(OAuthProvider)
  provider: OAuthProvider;

  @ApiProperty({ description: '사용자 ID' })
  @IsString()
  userId: string;

  @ApiPropertyOptional({ description: '콜백 URL' })
  @IsOptional()
  @IsString()
  redirectUri?: string;

  @ApiPropertyOptional({
    description: '요청 권한 범위',
    example: ['r_liteprofile', 'w_member_social'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  scopes?: string[];
}

export class OAuthCallbackDto {
  @ApiProperty({ description: 'OAuth 제공자', enum: OAuthProvider })
  @IsEnum(OAuthProvider)
  provider: OAuthProvider;

  @ApiProperty({ description: '인증 코드' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ description: 'State 파라미터' })
  @IsOptional()
  @IsString()
  state?: string;
}

export class OAuthTokenResponseDto {
  @ApiProperty({ description: '성공 여부' })
  success: boolean;

  @ApiProperty({ description: 'Access Token' })
  accessToken: string;

  @ApiPropertyOptional({ description: 'Refresh Token' })
  refreshToken?: string;

  @ApiProperty({ description: '만료 시간 (초)' })
  expiresIn: number;

  @ApiProperty({ description: 'Token 유형' })
  tokenType: string;

  @ApiPropertyOptional({ description: '권한 범위' })
  scope?: string;
}

export class ConnectedAccountDto {
  @ApiProperty({ description: '계정 ID' })
  id: string;

  @ApiProperty({ description: '플랫폼', enum: OAuthProvider })
  provider: OAuthProvider;

  @ApiProperty({ description: '플랫폼 사용자 ID' })
  platformUserId: string;

  @ApiProperty({ description: '플랫폼 사용자명' })
  platformUsername: string;

  @ApiPropertyOptional({ description: '프로필 이미지 URL' })
  profileImageUrl?: string;

  @ApiProperty({ description: '연결 상태' })
  status: 'active' | 'expired' | 'revoked';

  @ApiProperty({ description: '연결 일시' })
  connectedAt: Date;

  @ApiPropertyOptional({ description: '토큰 만료 일시' })
  tokenExpiresAt?: Date;
}

export class DisconnectAccountDto {
  @ApiProperty({ description: '사용자 ID' })
  @IsString()
  userId: string;

  @ApiProperty({ description: '연결된 계정 ID' })
  @IsString()
  accountId: string;
}
