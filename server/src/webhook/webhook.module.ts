import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService, UserService, PrismaService],
  exports: [WebhookService],
})
export class WebhookModule {}
