import { Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [],
  controllers: [NoteController],
  providers: [NoteService, PrismaService, AuthService],
})
export class NoteModule {}
