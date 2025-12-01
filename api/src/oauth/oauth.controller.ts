import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Param,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { OAuthService } from './oauth.service';
import {
  OAuthProvider,
  OAuthInitiateDto,
  ConnectedAccountDto,
  DisconnectAccountDto,
} from './dto/oauth.dto';

@ApiTags('oauth')
@Controller('oauth')
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) {}

  @Post('initiate')
  @ApiOperation({ summary: 'OAuth 인증 시작' })
  @ApiResponse({ status: 200, description: '인증 URL 반환' })
  async initiateOAuth(@Body() dto: OAuthInitiateDto) {
    const result = this.oauthService.initiateOAuth(dto);

    return {
      success: true,
      data: result,
    };
  }

  @Get('callback/:provider')
  @ApiOperation({ summary: 'OAuth 콜백 처리' })
  @ApiQuery({ name: 'code', required: true })
  @ApiQuery({ name: 'state', required: true })
  async handleCallback(
    @Param('provider') provider: OAuthProvider,
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    const result = await this.oauthService.handleCallback({
      provider,
      code,
      state,
    });

    // 프론트엔드로 리다이렉트
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5072';
    const redirectUrl = result.success
      ? `${frontendUrl}/workspace/marketing/settings?connected=${provider}`
      : `${frontendUrl}/workspace/marketing/settings?error=${encodeURIComponent(result.error || 'unknown')}`;

    res.redirect(redirectUrl);
  }

  @Get('accounts/:userId')
  @ApiOperation({ summary: '연결된 계정 목록 조회' })
  @ApiResponse({ status: 200, type: [ConnectedAccountDto] })
  async getConnectedAccounts(@Param('userId') userId: string) {
    const accounts = await this.oauthService.getConnectedAccounts(userId);

    return {
      success: true,
      data: accounts,
      count: accounts.length,
    };
  }

  @Delete('accounts')
  @ApiOperation({ summary: '계정 연결 해제' })
  async disconnectAccount(@Body() dto: DisconnectAccountDto) {
    await this.oauthService.disconnectAccount(dto.userId, dto.accountId);

    return {
      success: true,
      message: 'Account disconnected successfully',
    };
  }

  @Post('accounts/:accountId/refresh')
  @ApiOperation({ summary: '토큰 갱신' })
  async refreshToken(@Param('accountId') accountId: string) {
    const success = await this.oauthService.refreshToken(accountId);

    return {
      success,
      message: success ? 'Token refreshed' : 'Token refresh failed',
    };
  }

  @Get('providers')
  @ApiOperation({ summary: '지원 OAuth 제공자 목록' })
  async getProviders() {
    const providers = [
      {
        id: OAuthProvider.LINKEDIN,
        name: 'LinkedIn',
        icon: 'linkedin',
        description: '비즈니스 네트워킹 및 B2B 마케팅',
        capabilities: ['post', 'analytics'],
      },
      {
        id: OAuthProvider.TWITTER,
        name: 'Twitter (X)',
        icon: 'twitter',
        description: '실시간 소통 및 트렌드 마케팅',
        capabilities: ['post', 'analytics'],
      },
      {
        id: OAuthProvider.META,
        name: 'Meta (Facebook/Instagram)',
        icon: 'meta',
        description: 'Facebook 페이지 및 Instagram 비즈니스',
        capabilities: ['post', 'stories', 'reels', 'analytics'],
      },
      {
        id: OAuthProvider.TIKTOK,
        name: 'TikTok',
        icon: 'tiktok',
        description: '숏폼 비디오 마케팅',
        capabilities: ['post', 'analytics'],
      },
      {
        id: OAuthProvider.GOOGLE,
        name: 'Google (YouTube)',
        icon: 'youtube',
        description: '동영상 콘텐츠 마케팅',
        capabilities: ['post', 'analytics'],
      },
      {
        id: OAuthProvider.NAVER,
        name: '네이버',
        icon: 'naver',
        description: '네이버 블로그 및 카페',
        capabilities: ['post'],
      },
      {
        id: OAuthProvider.KAKAO,
        name: '카카오',
        icon: 'kakao',
        description: '카카오스토리 및 카카오톡 채널',
        capabilities: ['post', 'message'],
      },
    ];

    return {
      success: true,
      data: providers,
    };
  }
}
