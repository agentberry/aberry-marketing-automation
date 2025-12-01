import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './prisma/prisma.module';
import { ChannelsModule } from './channels/channels.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { CoachModule } from './coach/coach.module';
import { OAuthModule } from './oauth/oauth.module';
import { PostsModule } from './posts/posts.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // BullMQ with Redis
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || undefined,
      },
    }),

    // Database
    PrismaModule,

    // Feature modules
    ChannelsModule,
    RecommendationsModule,
    CoachModule,
    OAuthModule,
    PostsModule,
    QueueModule,
  ],
})
export class AppModule {}
