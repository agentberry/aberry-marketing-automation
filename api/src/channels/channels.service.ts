import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChannelQueryDto } from './dto/channel.dto';

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ChannelQueryDto) {
    const { type, category, costLevel, active } = query;

    return this.prisma.marketingChannel.findMany({
      where: {
        ...(type && { channelType: type as any }),
        ...(category && { category: category as any }),
        ...(costLevel && { costLevel: costLevel as any }),
        ...(active !== undefined && { isActive: active === 'true' }),
      },
      orderBy: [{ engagementScore: 'desc' }, { reachPotential: 'desc' }],
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.marketingChannel.findUnique({
      where: { slug },
    });
  }

  async findFreeChannels(businessType?: string) {
    return this.prisma.marketingChannel.findMany({
      where: {
        isActive: true,
        costLevel: 'FREE',
        ...(businessType && {
          bestForBusinessTypes: {
            has: businessType,
          },
        }),
      },
      orderBy: [{ engagementScore: 'desc' }, { reachPotential: 'desc' }],
      take: 10,
    });
  }

  async getCategories() {
    const categories = await this.prisma.marketingChannel.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
      where: { isActive: true },
    });

    return categories.map((c) => ({
      name: c.category,
      count: c._count.category,
    }));
  }
}
