import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('/user')
  async getUser(@Req() req: Request, @Res() res: Response) {
    const kindeId = res['locals'].decodedData.sub;
    console.log('kindeId:', kindeId);

    const user = await this.userService.userByKindeId(kindeId);

    res.status(HttpStatus.OK).json({ status: 'success', data: user });
  }
}
