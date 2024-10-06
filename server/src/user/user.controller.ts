import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/user')
  async getUser(): Promise<User | null> {
    return this.userService.user({
      clerkId: 'clerk-id',
    });
  }
}
