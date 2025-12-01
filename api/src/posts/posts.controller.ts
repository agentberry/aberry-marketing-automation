import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import {
  CreatePostDto,
  UpdatePostDto,
  PostResponseDto,
  PostQueryDto,
} from './dto/post.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: '게시물 생성' })
  @ApiResponse({ status: 201, type: PostResponseDto })
  async createPost(@Body() dto: CreatePostDto) {
    const post = await this.postsService.createPost(dto);

    return {
      success: true,
      data: post,
    };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '사용자 게시물 목록 조회' })
  @ApiResponse({ status: 200, type: [PostResponseDto] })
  async getPosts(
    @Param('userId') userId: string,
    @Query() query: PostQueryDto,
  ) {
    const result = await this.postsService.getPosts(userId, query);

    return {
      success: true,
      data: result.posts,
      total: result.total,
      page: query.page || 1,
      limit: query.limit || 20,
    };
  }

  @Get(':postId')
  @ApiOperation({ summary: '게시물 상세 조회' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiResponse({ status: 200, type: PostResponseDto })
  async getPost(
    @Param('postId') postId: string,
    @Query('userId') userId: string,
  ) {
    const post = await this.postsService.getPost(postId, userId);

    return {
      success: true,
      data: post,
    };
  }

  @Put(':postId')
  @ApiOperation({ summary: '게시물 수정' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiResponse({ status: 200, type: PostResponseDto })
  async updatePost(
    @Param('postId') postId: string,
    @Query('userId') userId: string,
    @Body() dto: UpdatePostDto,
  ) {
    const post = await this.postsService.updatePost(postId, userId, dto);

    return {
      success: true,
      data: post,
    };
  }

  @Delete(':postId')
  @ApiOperation({ summary: '게시물 삭제' })
  @ApiQuery({ name: 'userId', required: true })
  async deletePost(
    @Param('postId') postId: string,
    @Query('userId') userId: string,
  ) {
    await this.postsService.deletePost(postId, userId);

    return {
      success: true,
      message: 'Post deleted successfully',
    };
  }

  @Get('calendar/:userId')
  @ApiOperation({ summary: '캘린더 뷰 스케줄 조회' })
  @ApiQuery({ name: 'year', required: true, example: 2024 })
  @ApiQuery({ name: 'month', required: true, example: 12 })
  async getScheduleCalendar(
    @Param('userId') userId: string,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    const schedule = await this.postsService.getScheduleCalendar(
      userId,
      Number(year),
      Number(month),
    );

    return {
      success: true,
      data: schedule,
    };
  }

  @Get('recommended-times/:userId')
  @ApiOperation({ summary: '추천 게시 시간 조회' })
  @ApiQuery({ name: 'platform', required: true, example: 'instagram' })
  async getRecommendedTimes(
    @Param('userId') userId: string,
    @Query('platform') platform: string,
  ) {
    const times = await this.postsService.getRecommendedTimes(userId, platform);

    return {
      success: true,
      data: times,
    };
  }
}
