import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import {
  OAuthProvider,
  OAuthInitiateDto,
  OAuthCallbackDto,
  ConnectedAccountDto,
} from './dto/oauth.dto';
import { v4 as uuidv4 } from 'uuid';

interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  authUrl: string;
  tokenUrl: string;
  scopes: string[];
  redirectUri: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope?: string;
}

@Injectable()
export class OAuthService {
  private readonly logger = new Logger(OAuthService.name);
  private readonly stateStore = new Map<string, { userId: string; provider: OAuthProvider; createdAt: number }>();
  private readonly configs: Partial<Record<OAuthProvider, OAuthConfig>>;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const baseUrl = this.configService.get<string>('API_BASE_URL') || 'http://localhost:3001';

    this.configs = {
      [OAuthProvider.LINKEDIN]: {
        clientId: this.configService.get<string>('LINKEDIN_CLIENT_ID') || '',
        clientSecret: this.configService.get<string>('LINKEDIN_CLIENT_SECRET') || '',
        authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
        tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
        scopes: ['r_liteprofile', 'r_emailaddress', 'w_member_social'],
        redirectUri: `${baseUrl}/api/oauth/callback/linkedin`,
      },
      [OAuthProvider.TWITTER]: {
        clientId: this.configService.get<string>('TWITTER_CLIENT_ID') || '',
        clientSecret: this.configService.get<string>('TWITTER_CLIENT_SECRET') || '',
        authUrl: 'https://twitter.com/i/oauth2/authorize',
        tokenUrl: 'https://api.twitter.com/2/oauth2/token',
        scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
        redirectUri: `${baseUrl}/api/oauth/callback/twitter`,
      },
      [OAuthProvider.META]: {
        clientId: this.configService.get<string>('META_CLIENT_ID') || '',
        clientSecret: this.configService.get<string>('META_CLIENT_SECRET') || '',
        authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
        tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
        scopes: ['pages_manage_posts', 'pages_read_engagement', 'instagram_basic', 'instagram_content_publish'],
        redirectUri: `${baseUrl}/api/oauth/callback/meta`,
      },
      [OAuthProvider.TIKTOK]: {
        clientId: this.configService.get<string>('TIKTOK_CLIENT_KEY') || '',
        clientSecret: this.configService.get<string>('TIKTOK_CLIENT_SECRET') || '',
        authUrl: 'https://www.tiktok.com/v2/auth/authorize/',
        tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
        scopes: ['user.info.basic', 'video.publish', 'video.list'],
        redirectUri: `${baseUrl}/api/oauth/callback/tiktok`,
      },
      [OAuthProvider.GOOGLE]: {
        clientId: this.configService.get<string>('GOOGLE_CLIENT_ID') || '',
        clientSecret: this.configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        scopes: ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube'],
        redirectUri: `${baseUrl}/api/oauth/callback/google`,
      },
      [OAuthProvider.NAVER]: {
        clientId: this.configService.get<string>('NAVER_CLIENT_ID') || '',
        clientSecret: this.configService.get<string>('NAVER_CLIENT_SECRET') || '',
        authUrl: 'https://nid.naver.com/oauth2.0/authorize',
        tokenUrl: 'https://nid.naver.com/oauth2.0/token',
        scopes: ['blog'],
        redirectUri: `${baseUrl}/api/oauth/callback/naver`,
      },
      [OAuthProvider.KAKAO]: {
        clientId: this.configService.get<string>('KAKAO_CLIENT_ID') || '',
        clientSecret: this.configService.get<string>('KAKAO_CLIENT_SECRET') || '',
        authUrl: 'https://kauth.kakao.com/oauth/authorize',
        tokenUrl: 'https://kauth.kakao.com/oauth/token',
        scopes: ['story_publish', 'talk_message'],
        redirectUri: `${baseUrl}/api/oauth/callback/kakao`,
      },
    };
  }

  /**
   * OAuth 인증 URL 생성
   */
  initiateOAuth(dto: OAuthInitiateDto): { authUrl: string; state: string } {
    const config = this.configs[dto.provider];
    if (!config || !config.clientId) {
      throw new BadRequestException(`${dto.provider} OAuth is not configured`);
    }

    const state = uuidv4();
    this.stateStore.set(state, {
      userId: dto.userId,
      provider: dto.provider,
      createdAt: Date.now(),
    });

    // 10분 후 state 자동 삭제
    setTimeout(() => this.stateStore.delete(state), 10 * 60 * 1000);

    const scopes = dto.scopes || config.scopes;
    const redirectUri = dto.redirectUri || config.redirectUri;

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: redirectUri,
      scope: scopes.join(' '),
      state,
      response_type: 'code',
    });

    // Provider별 추가 파라미터
    if (dto.provider === OAuthProvider.TWITTER) {
      params.set('code_challenge', 'challenge');
      params.set('code_challenge_method', 'plain');
    }

    if (dto.provider === OAuthProvider.TIKTOK) {
      params.set('client_key', config.clientId);
      params.delete('client_id');
    }

    return {
      authUrl: `${config.authUrl}?${params.toString()}`,
      state,
    };
  }

  /**
   * OAuth 콜백 처리
   */
  async handleCallback(dto: OAuthCallbackDto): Promise<{
    success: boolean;
    account?: ConnectedAccountDto;
    error?: string;
  }> {
    const stateData = this.stateStore.get(dto.state || '');
    if (!stateData) {
      throw new BadRequestException('Invalid or expired state');
    }

    this.stateStore.delete(dto.state || '');

    const config = this.configs[dto.provider];
    if (!config) {
      throw new BadRequestException(`${dto.provider} OAuth is not configured`);
    }

    try {
      // 토큰 교환
      const tokenResponse = await this.exchangeCodeForToken(
        dto.provider,
        dto.code,
        config,
      );

      // 사용자 정보 조회
      const userInfo = await this.fetchUserInfo(
        dto.provider,
        tokenResponse.access_token,
      );

      // 연결된 계정 저장
      const account = await this.saveConnectedAccount(
        stateData.userId,
        dto.provider,
        tokenResponse,
        userInfo,
      );

      return {
        success: true,
        account,
      };
    } catch (error) {
      this.logger.error(`OAuth callback error for ${dto.provider}`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'OAuth failed',
      };
    }
  }

  /**
   * 연결된 계정 목록 조회
   */
  async getConnectedAccounts(userId: string): Promise<ConnectedAccountDto[]> {
    const accounts = await this.prisma.connectedSocialAccount.findMany({
      where: { userId },
    });

    return accounts.map((acc) => ({
      id: acc.id,
      provider: acc.platform as OAuthProvider,
      platformUserId: acc.platformUserId,
      platformUsername: acc.platformUsername,
      profileImageUrl: acc.profileImageUrl || undefined,
      status: this.getAccountStatus(acc),
      connectedAt: acc.createdAt,
      tokenExpiresAt: acc.tokenExpiresAt || undefined,
    }));
  }

  /**
   * 계정 연결 해제
   */
  async disconnectAccount(userId: string, accountId: string): Promise<boolean> {
    const account = await this.prisma.connectedSocialAccount.findFirst({
      where: { id: accountId, userId },
    });

    if (!account) {
      throw new BadRequestException('Account not found');
    }

    // 플랫폼별 토큰 취소 시도 (best effort)
    try {
      await this.revokeToken(account.platform as OAuthProvider, account.accessToken);
    } catch (error) {
      this.logger.warn(`Token revocation failed for ${account.platform}`, error);
    }

    await this.prisma.connectedSocialAccount.delete({
      where: { id: accountId },
    });

    return true;
  }

  /**
   * 토큰 갱신
   */
  async refreshToken(accountId: string): Promise<boolean> {
    const account = await this.prisma.connectedSocialAccount.findUnique({
      where: { id: accountId },
    });

    if (!account || !account.refreshToken) {
      throw new BadRequestException('Cannot refresh token');
    }

    const config = this.configs[account.platform as OAuthProvider];
    if (!config) {
      throw new BadRequestException('Provider not configured');
    }

    try {
      const response = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: account.refreshToken,
          client_id: config.clientId,
          client_secret: config.clientSecret,
        }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const tokenData: TokenResponse = await response.json();

      await this.prisma.connectedSocialAccount.update({
        where: { id: accountId },
        data: {
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token || account.refreshToken,
          tokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
        },
      });

      return true;
    } catch (error) {
      this.logger.error('Token refresh failed', error);
      return false;
    }
  }

  private async exchangeCodeForToken(
    provider: OAuthProvider,
    code: string,
    config: OAuthConfig,
  ): Promise<TokenResponse> {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: config.redirectUri,
      client_id: config.clientId,
      client_secret: config.clientSecret,
    });

    // Twitter PKCE
    if (provider === OAuthProvider.TWITTER) {
      body.set('code_verifier', 'challenge');
    }

    // TikTok 특별 처리
    if (provider === OAuthProvider.TIKTOK) {
      body.set('client_key', config.clientId);
      body.delete('client_id');
    }

    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token exchange failed: ${errorText}`);
    }

    return response.json();
  }

  private async fetchUserInfo(
    provider: OAuthProvider,
    accessToken: string,
  ): Promise<{ id: string; username: string; profileImage?: string }> {
    const endpoints: Record<OAuthProvider, string> = {
      [OAuthProvider.LINKEDIN]: 'https://api.linkedin.com/v2/me',
      [OAuthProvider.TWITTER]: 'https://api.twitter.com/2/users/me',
      [OAuthProvider.META]: 'https://graph.facebook.com/me?fields=id,name,picture',
      [OAuthProvider.TIKTOK]: 'https://open.tiktokapis.com/v2/user/info/',
      [OAuthProvider.GOOGLE]: 'https://www.googleapis.com/oauth2/v2/userinfo',
      [OAuthProvider.NAVER]: 'https://openapi.naver.com/v1/nid/me',
      [OAuthProvider.KAKAO]: 'https://kapi.kakao.com/v2/user/me',
    };

    const response = await fetch(endpoints[provider], {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    const data = await response.json();

    // Provider별 데이터 파싱
    switch (provider) {
      case OAuthProvider.LINKEDIN:
        return {
          id: data.id,
          username: `${data.localizedFirstName} ${data.localizedLastName}`,
        };
      case OAuthProvider.TWITTER:
        return {
          id: data.data.id,
          username: data.data.username,
          profileImage: data.data.profile_image_url,
        };
      case OAuthProvider.META:
        return {
          id: data.id,
          username: data.name,
          profileImage: data.picture?.data?.url,
        };
      case OAuthProvider.TIKTOK:
        return {
          id: data.data?.user?.open_id || '',
          username: data.data?.user?.display_name || '',
          profileImage: data.data?.user?.avatar_url,
        };
      case OAuthProvider.GOOGLE:
        return {
          id: data.id,
          username: data.name,
          profileImage: data.picture,
        };
      case OAuthProvider.NAVER:
        return {
          id: data.response.id,
          username: data.response.nickname,
          profileImage: data.response.profile_image,
        };
      case OAuthProvider.KAKAO:
        return {
          id: String(data.id),
          username: data.properties?.nickname || '',
          profileImage: data.properties?.profile_image,
        };
      default:
        return { id: '', username: '' };
    }
  }

  private async saveConnectedAccount(
    userId: string,
    provider: OAuthProvider,
    tokenResponse: TokenResponse,
    userInfo: { id: string; username: string; profileImage?: string },
  ): Promise<ConnectedAccountDto> {
    const existingAccount = await this.prisma.connectedSocialAccount.findFirst({
      where: {
        userId,
        platform: provider,
        platformUserId: userInfo.id,
      },
    });

    const accountData = {
      platform: provider,
      platformUserId: userInfo.id,
      platformUsername: userInfo.username,
      profileImageUrl: userInfo.profileImage,
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      tokenExpiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000),
    };

    let account;
    if (existingAccount) {
      account = await this.prisma.connectedSocialAccount.update({
        where: { id: existingAccount.id },
        data: accountData,
      });
    } else {
      account = await this.prisma.connectedSocialAccount.create({
        data: {
          ...accountData,
          userId,
        },
      });
    }

    return {
      id: account.id,
      provider,
      platformUserId: account.platformUserId,
      platformUsername: account.platformUsername,
      profileImageUrl: account.profileImageUrl || undefined,
      status: 'active',
      connectedAt: account.createdAt,
      tokenExpiresAt: account.tokenExpiresAt || undefined,
    };
  }

  private getAccountStatus(account: {
    tokenExpiresAt: Date | null;
  }): 'active' | 'expired' | 'revoked' {
    if (!account.tokenExpiresAt) return 'active';
    if (account.tokenExpiresAt < new Date()) return 'expired';
    return 'active';
  }

  private async revokeToken(
    provider: OAuthProvider,
    accessToken: string,
  ): Promise<void> {
    const revokeEndpoints: Partial<Record<OAuthProvider, string>> = {
      [OAuthProvider.GOOGLE]: 'https://oauth2.googleapis.com/revoke',
      [OAuthProvider.META]: 'https://graph.facebook.com/me/permissions',
      [OAuthProvider.KAKAO]: 'https://kapi.kakao.com/v1/user/logout',
    };

    const endpoint = revokeEndpoints[provider];
    if (!endpoint) return;

    await fetch(endpoint, {
      method: provider === OAuthProvider.META ? 'DELETE' : 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: provider === OAuthProvider.GOOGLE ? `token=${accessToken}` : undefined,
    });
  }
}
