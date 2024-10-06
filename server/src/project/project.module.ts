import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [],
  controllers: [ProjectController],
  providers: [ProjectService, PrismaService, AuthService],
})
export class ProjectModule {}
