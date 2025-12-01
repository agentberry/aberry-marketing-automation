import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import { ChannelQueryDto, ChannelResponseDto } from './dto/channel.dto';

@ApiTags('channels')
@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  @ApiOperation({ summary: '모든 마케팅 채널 조회' })
  @ApiResponse({ status: 200, type: [ChannelResponseDto] })
  async findAll(@Query() query: ChannelQueryDto) {
    const channels = await this.channelsService.findAll(query);
    return {
      success: true,
      data: channels,
      count: channels.length,
    };
  }

  @Get('categories')
  @ApiOperation({ summary: '채널 카테고리 목록 조회' })
  async getCategories() {
    const categories = await this.channelsService.getCategories();
    return {
      success: true,
      data: categories,
    };
  }

  @Get('free')
  @ApiOperation({ summary: '무료 채널 목록 조회' })
  @ApiQuery({ name: 'businessType', required: false })
  async findFreeChannels(@Query('businessType') businessType?: string) {
    const channels = await this.channelsService.findFreeChannels(businessType);
    return {
      success: true,
      data: channels,
    };
  }

  @Get(':slug')
  @ApiOperation({ summary: '특정 채널 상세 조회' })
  @ApiResponse({ status: 200, type: ChannelResponseDto })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  async findBySlug(@Param('slug') slug: string) {
    const channel = await this.channelsService.findBySlug(slug);

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    return {
      success: true,
      data: channel,
    };
  }
}
