import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { PostStatus } from '../posts/dto/post.dto';

interface PublishJobData {
  postId: string;
}

interface PlatformPublisher {
  publish(
    accessToken: string,
    content: string,
    options: {
      mediaUrls?: string[];
      hashtags?: string[];
      linkUrl?: string;
    },
  ): Promise<{ success: boolean; postUrl?: string; error?: string }>;
}

@Processor('posts')
export class PostsQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(PostsQueueProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<PublishJobData>): Promise<any> {
    this.logger.log(`Processing job ${job.id}: ${job.name}`);

    switch (job.name) {
      case 'publish':
        return this.handlePublish(job.data);
      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed: ${error.message}`);
  }

  private async handlePublish(data: PublishJobData): Promise<void> {
    const { postId } = data;

    // 게시물 및 타겟 계정 조회
    const post = await this.prisma.scheduledPost.findUnique({
      where: { id: postId },
      include: {
        targetAccounts: {
          include: {
            connectedAccount: true,
          },
        },
      },
    });

    if (!post) {
      this.logger.error(`Post ${postId} not found`);
      return;
    }

    // 상태를 publishing으로 업데이트
    await this.prisma.scheduledPost.update({
      where: { id: postId },
      data: { status: PostStatus.PUBLISHING },
    });

    let allSuccess = true;
    let anySuccess = false;

    // 각 타겟 계정에 발행
    for (const target of post.targetAccounts) {
      try {
        const result = await this.publishToPlat(
          target.connectedAccount.platform,
          target.connectedAccount.accessToken,
          {
            content: post.content,
            mediaUrls: post.mediaUrls,
            hashtags: post.hashtags,
            linkUrl: post.linkUrl || undefined,
          },
        );

        await this.prisma.postTargetAccount.update({
          where: { id: target.id },
          data: {
            status: result.success ? 'published' : 'failed',
            publishedUrl: result.postUrl,
            error: result.error,
            publishedAt: result.success ? new Date() : null,
          },
        });

        if (result.success) {
          anySuccess = true;
        } else {
          allSuccess = false;
        }

        this.logger.log(
          `Published to ${target.connectedAccount.platform}: ${result.success}`,
        );
      } catch (error) {
        allSuccess = false;
        this.logger.error(
          `Failed to publish to ${target.connectedAccount.platform}`,
          error,
        );

        await this.prisma.postTargetAccount.update({
          where: { id: target.id },
          data: {
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });
      }
    }

    // 최종 상태 업데이트
    const finalStatus = allSuccess
      ? PostStatus.PUBLISHED
      : anySuccess
        ? PostStatus.PUBLISHED // 일부 성공도 published로 처리
        : PostStatus.FAILED;

    await this.prisma.scheduledPost.update({
      where: { id: postId },
      data: {
        status: finalStatus,
        publishedAt: anySuccess ? new Date() : null,
      },
    });
  }

  private async publishToPlat(
    platform: string,
    accessToken: string,
    options: {
      content: string;
      mediaUrls: string[];
      hashtags: string[];
      linkUrl?: string;
    },
  ): Promise<{ success: boolean; postUrl?: string; error?: string }> {
    const publisher = this.getPlatformPublisher(platform);

    // 해시태그를 콘텐츠에 추가
    let fullContent = options.content;
    if (options.hashtags && options.hashtags.length > 0) {
      fullContent += '\n\n' + options.hashtags.map((h) => `#${h}`).join(' ');
    }

    return publisher.publish(accessToken, fullContent, {
      mediaUrls: options.mediaUrls,
      linkUrl: options.linkUrl,
    });
  }

  private getPlatformPublisher(platform: string): PlatformPublisher {
    const publishers: Record<string, PlatformPublisher> = {
      linkedin: new LinkedInPublisher(),
      twitter: new TwitterPublisher(),
      meta: new MetaPublisher(),
      tiktok: new TikTokPublisher(),
      naver: new NaverPublisher(),
      kakao: new KakaoPublisher(),
    };

    return publishers[platform] || new GenericPublisher(platform);
  }
}

// LinkedIn Publisher
class LinkedInPublisher implements PlatformPublisher {
  async publish(
    accessToken: string,
    content: string,
    options: { mediaUrls?: string[]; linkUrl?: string },
  ): Promise<{ success: boolean; postUrl?: string; error?: string }> {
    try {
      // 1. 사용자 URN 조회
      const meResponse = await fetch('https://api.linkedin.com/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!meResponse.ok) {
        throw new Error('Failed to get user info');
      }

      const me = await meResponse.json();
      const authorUrn = `urn:li:person:${me.id}`;

      // 2. 게시물 생성
      const postBody: any = {
        author: authorUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content,
            },
            shareMediaCategory: options.mediaUrls?.length ? 'IMAGE' : 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      };

      // 링크 추가
      if (options.linkUrl) {
        postBody.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'ARTICLE';
        postBody.specificContent['com.linkedin.ugc.ShareContent'].media = [
          {
            status: 'READY',
            originalUrl: options.linkUrl,
          },
        ];
      }

      const postResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify(postBody),
      });

      if (!postResponse.ok) {
        const error = await postResponse.text();
        throw new Error(`LinkedIn API error: ${error}`);
      }

      const result = await postResponse.json();
      const postId = result.id?.replace('urn:li:share:', '');

      return {
        success: true,
        postUrl: `https://www.linkedin.com/feed/update/${result.id}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Twitter Publisher
class TwitterPublisher implements PlatformPublisher {
  async publish(
    accessToken: string,
    content: string,
    options: { mediaUrls?: string[] },
  ): Promise<{ success: boolean; postUrl?: string; error?: string }> {
    try {
      const tweetBody: any = { text: content };

      // 미디어 처리 (별도 업로드 필요 - 간소화)
      // TODO: 실제 구현시 미디어 업로드 API 사용

      const response = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tweetBody),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Twitter API error: ${error}`);
      }

      const result = await response.json();

      return {
        success: true,
        postUrl: `https://twitter.com/i/web/status/${result.data.id}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Meta (Facebook/Instagram) Publisher
class MetaPublisher implements PlatformPublisher {
  async publish(
    accessToken: string,
    content: string,
    options: { mediaUrls?: string[]; linkUrl?: string },
  ): Promise<{ success: boolean; postUrl?: string; error?: string }> {
    try {
      // Facebook 페이지 게시 (간소화)
      const params = new URLSearchParams({
        message: content,
        access_token: accessToken,
      });

      if (options.linkUrl) {
        params.set('link', options.linkUrl);
      }

      const response = await fetch(
        `https://graph.facebook.com/v18.0/me/feed?${params.toString()}`,
        { method: 'POST' },
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Meta API error: ${error}`);
      }

      const result = await response.json();

      return {
        success: true,
        postUrl: `https://facebook.com/${result.id}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// TikTok Publisher
class TikTokPublisher implements PlatformPublisher {
  async publish(
    accessToken: string,
    content: string,
    options: { mediaUrls?: string[] },
  ): Promise<{ success: boolean; postUrl?: string; error?: string }> {
    // TikTok은 비디오만 지원, 별도 업로드 플로우 필요
    // TODO: 실제 TikTok API 구현
    return {
      success: false,
      error: 'TikTok publishing requires video upload flow',
    };
  }
}

// Naver Publisher
class NaverPublisher implements PlatformPublisher {
  async publish(
    accessToken: string,
    content: string,
    options: { mediaUrls?: string[] },
  ): Promise<{ success: boolean; postUrl?: string; error?: string }> {
    // 네이버 블로그 API
    // TODO: 실제 네이버 블로그 API 구현
    return {
      success: false,
      error: 'Naver blog API implementation pending',
    };
  }
}

// Kakao Publisher
class KakaoPublisher implements PlatformPublisher {
  async publish(
    accessToken: string,
    content: string,
    options: { mediaUrls?: string[] },
  ): Promise<{ success: boolean; postUrl?: string; error?: string }> {
    try {
      // 카카오스토리 게시
      const formData = new URLSearchParams();
      formData.set('content', content);

      const response = await fetch(
        'https://kapi.kakao.com/v1/api/story/post/note',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData,
        },
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Kakao API error: ${error}`);
      }

      const result = await response.json();

      return {
        success: true,
        postUrl: result.url,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Generic Publisher (Fallback)
class GenericPublisher implements PlatformPublisher {
  constructor(private platform: string) {}

  async publish(): Promise<{ success: boolean; error?: string }> {
    return {
      success: false,
      error: `Platform ${this.platform} is not supported yet`,
    };
  }
}
