import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Req,
  RawBodyRequest,
  Res,
  Logger,
} from '@nestjs/common';

import * as rawbody from 'raw-body';

import { Request, Response } from 'express';

import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}
  private logger = new Logger('HTTP');

  @Post('kinde')
  async post(@Req() req: RawBodyRequest<Request>, @Res() res: Response) {
    try {
      this.logger.log('Received webhook payload from Kinde');

      if (!req.readable) {
        throw new Error('No readable request');
      }
      const raw = await rawbody(req);
      const payload = raw.toString().trim();

      if (!payload) {
        throw new Error('No payload');
      }

      // Return a response
      return this.webhookService.processKindeWebhook(payload);
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw new Error(error.message);
    }
  }
}
