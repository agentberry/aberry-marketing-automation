import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PostsQueueProcessor } from './queue.processor';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'posts',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: {
          count: 100,
          age: 24 * 60 * 60, // 24시간
        },
        removeOnFail: {
          count: 500,
          age: 7 * 24 * 60 * 60, // 7일
        },
      },
    }),
  ],
  providers: [PostsQueueProcessor],
  exports: [BullModule],
})
export class QueueModule {}
