import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePostDto,
  UpdatePostDto,
  PostStatus,
  PostQueryDto,
  PostResponseDto,
  ScheduleAnalyticsDto,
} from './dto/post.dto';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('posts') private readonly postsQueue: Queue,
  ) {}

  /**
   * 게시물 생성
   */
  async createPost(dto: CreatePostDto): Promise<PostResponseDto> {
    // 게시물 생성
    const post = await this.prisma.scheduledPost.create({
      data: {
        userId: dto.userId,
        content: dto.content,
        contentType: dto.contentType,
        mediaUrls: dto.media?.map((m) => m.url) || [],
        hashtags: dto.hashtags || [],
        linkUrl: dto.linkUrl,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
        status: dto.publishNow ? PostStatus.PUBLISHING : PostStatus.SCHEDULED,
        targetAccounts: {
          create: dto.accountIds.map((accountId) => ({
            connectedAccountId: accountId,
            status: 'pending',
          })),
        },
      },
      include: {
        targetAccounts: {
          include: {
            connectedAccount: true,
          },
        },
      },
    });

    // 즉시 발행 또는 예약 발행 처리
    if (dto.publishNow) {
      await this.postsQueue.add(
        'publish',
        { postId: post.id },
        { priority: 1 },
      );
    } else if (dto.scheduledAt) {
      const delay = new Date(dto.scheduledAt).getTime() - Date.now();
      if (delay > 0) {
        await this.postsQueue.add(
          'publish',
          { postId: post.id },
          {
            delay,
            jobId: `scheduled-${post.id}`,
          },
        );
        this.logger.log(`Post ${post.id} scheduled for ${dto.scheduledAt}`);
      }
    }

    return this.mapToResponse(post);
  }

  /**
   * 게시물 목록 조회
   */
  async getPosts(
    userId: string,
    query: PostQueryDto,
  ): Promise<{ posts: PostResponseDto[]; total: number }> {
    const where: any = { userId };

    if (query.status) {
      where.status = query.status;
    }

    if (query.startDate || query.endDate) {
      where.scheduledAt = {};
      if (query.startDate) {
        where.scheduledAt.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        where.scheduledAt.lte = new Date(query.endDate);
      }
    }

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.prisma.scheduledPost.findMany({
        where,
        include: {
          targetAccounts: {
            include: {
              connectedAccount: true,
            },
          },
        },
        orderBy: { scheduledAt: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.scheduledPost.count({ where }),
    ]);

    return {
      posts: posts.map(this.mapToResponse),
      total,
    };
  }

  /**
   * 단일 게시물 조회
   */
  async getPost(postId: string, userId: string): Promise<PostResponseDto> {
    const post = await this.prisma.scheduledPost.findFirst({
      where: { id: postId, userId },
      include: {
        targetAccounts: {
          include: {
            connectedAccount: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.mapToResponse(post);
  }

  /**
   * 게시물 수정
   */
  async updatePost(
    postId: string,
    userId: string,
    dto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    const existingPost = await this.prisma.scheduledPost.findFirst({
      where: { id: postId, userId },
    });

    if (!existingPost) {
      throw new NotFoundException('Post not found');
    }

    // 이미 발행된 게시물은 수정 불가
    if (existingPost.status === PostStatus.PUBLISHED) {
      throw new Error('Cannot update published post');
    }

    const post = await this.prisma.scheduledPost.update({
      where: { id: postId },
      data: {
        content: dto.content ?? existingPost.content,
        mediaUrls: dto.media?.map((m) => m.url) ?? existingPost.mediaUrls,
        hashtags: dto.hashtags ?? existingPost.hashtags,
        scheduledAt: dto.scheduledAt
          ? new Date(dto.scheduledAt)
          : existingPost.scheduledAt,
      },
      include: {
        targetAccounts: {
          include: {
            connectedAccount: true,
          },
        },
      },
    });

    // 예약 시간이 변경되었으면 큐 업데이트
    if (dto.scheduledAt && existingPost.scheduledAt !== new Date(dto.scheduledAt)) {
      await this.reschedulePost(post.id, new Date(dto.scheduledAt));
    }

    return this.mapToResponse(post);
  }

  /**
   * 게시물 삭제
   */
  async deletePost(postId: string, userId: string): Promise<boolean> {
    const post = await this.prisma.scheduledPost.findFirst({
      where: { id: postId, userId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // 큐에서 예약된 작업 제거
    await this.postsQueue.remove(`scheduled-${postId}`);

    // 타겟 계정 관계 먼저 삭제
    await this.prisma.postTargetAccount.deleteMany({
      where: { scheduledPostId: postId },
    });

    // 게시물 삭제
    await this.prisma.scheduledPost.delete({
      where: { id: postId },
    });

    return true;
  }

  /**
   * 캘린더 뷰용 스케줄 조회
   */
  async getScheduleCalendar(
    userId: string,
    year: number,
    month: number,
  ): Promise<ScheduleAnalyticsDto[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const posts = await this.prisma.scheduledPost.findMany({
      where: {
        userId,
        scheduledAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        scheduledAt: true,
        status: true,
      },
    });

    // 날짜별 집계
    const analytics = new Map<string, ScheduleAnalyticsDto>();

    for (let d = 1; d <= endDate.getDate(); d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      analytics.set(dateStr, {
        date: dateStr,
        scheduled: 0,
        published: 0,
        failed: 0,
      });
    }

    posts.forEach((post) => {
      if (!post.scheduledAt) return;
      const dateStr = post.scheduledAt.toISOString().split('T')[0];
      const stat = analytics.get(dateStr);
      if (stat) {
        if (post.status === PostStatus.PUBLISHED) {
          stat.published++;
        } else if (post.status === PostStatus.FAILED) {
          stat.failed++;
        } else {
          stat.scheduled++;
        }
      }
    });

    return Array.from(analytics.values());
  }

  /**
   * 추천 게시 시간 조회
   */
  async getRecommendedTimes(
    userId: string,
    platform: string,
  ): Promise<{ day: string; times: string[]; reason: string }[]> {
    // TODO: 실제 사용자 데이터 기반 분석
    // 현재는 일반적인 추천 시간 반환
    const recommendations: Record<
      string,
      { day: string; times: string[]; reason: string }[]
    > = {
      instagram: [
        {
          day: '화요일',
          times: ['11:00', '14:00', '19:00'],
          reason: '참여율이 가장 높은 시간대',
        },
        {
          day: '수요일',
          times: ['11:00', '14:00'],
          reason: '피드 노출이 좋은 시간대',
        },
        {
          day: '목요일',
          times: ['12:00', '19:00'],
          reason: '저녁 시간 참여율 상승',
        },
      ],
      linkedin: [
        {
          day: '화요일',
          times: ['08:00', '10:00', '12:00'],
          reason: 'B2B 타겟 활성 시간',
        },
        {
          day: '수요일',
          times: ['09:00', '12:00'],
          reason: '비즈니스 오전 활동 시간',
        },
        {
          day: '목요일',
          times: ['10:00', '14:00'],
          reason: '주중 참여율 피크',
        },
      ],
      twitter: [
        {
          day: '수요일',
          times: ['09:00', '12:00', '17:00'],
          reason: '리트윗이 많은 시간대',
        },
        {
          day: '금요일',
          times: ['09:00', '14:00'],
          reason: '주말 전 활성 시간',
        },
      ],
      tiktok: [
        {
          day: '화요일',
          times: ['19:00', '21:00'],
          reason: '저녁 시간 활성 사용자',
        },
        {
          day: '목요일',
          times: ['12:00', '19:00'],
          reason: '점심/저녁 피크 타임',
        },
        {
          day: '금요일',
          times: ['17:00', '21:00'],
          reason: '주말 전 활성 시간',
        },
      ],
    };

    return recommendations[platform.toLowerCase()] || recommendations.instagram;
  }

  /**
   * 게시물 재예약
   */
  private async reschedulePost(postId: string, newTime: Date): Promise<void> {
    // 기존 예약 작업 제거
    await this.postsQueue.remove(`scheduled-${postId}`);

    // 새 예약 작업 추가
    const delay = newTime.getTime() - Date.now();
    if (delay > 0) {
      await this.postsQueue.add(
        'publish',
        { postId },
        {
          delay,
          jobId: `scheduled-${postId}`,
        },
      );
    }
  }

  private mapToResponse(post: any): PostResponseDto {
    return {
      id: post.id,
      userId: post.userId,
      status: post.status as PostStatus,
      contentType: post.contentType,
      content: post.content,
      media: post.mediaUrls?.map((url: string) => ({
        url,
        type: 'image' as const,
      })),
      hashtags: post.hashtags,
      scheduledAt: post.scheduledAt,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      targetAccounts:
        post.targetAccounts?.map((ta: any) => ({
          accountId: ta.connectedAccountId,
          platform: ta.connectedAccount?.platform || 'unknown',
          status: ta.status,
          publishedUrl: ta.publishedUrl,
          error: ta.error,
        })) || [],
    };
  }
}
