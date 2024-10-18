import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { NoteService } from './note.service';
import { Prisma, Note } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller()
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @UseGuards(AuthGuard)
  @Get('/note/:id')
  async getNote(@Param('id') id: string, @Res() res: Response) {
    const kindeId = res['locals'].decodedData.sub;
    const note = await this.noteService.note({
      projectId: id,
      user: { kindeId },
    });
    res.status(HttpStatus.OK).json({ status: 'success', data: note });
  }

  @UseGuards(AuthGuard)
  @Post('/note/:id')
  async createNote(
    @Param('id') id: string,
    @Body() data: Prisma.NoteCreateInput,
    @Res() res: Response,
  ) {
    const kindeId = res['locals'].decodedData.sub;
    const note = await this.noteService.createNote({
      content: data.content,
      project: {
        connect: {
          id,
        },
      },
      user: {
        connect: {
          kindeId,
        },
      },
    });

    res.status(HttpStatus.OK).json({ status: 'success', data: note });
  }

  @UseGuards(AuthGuard)
  @Put('/note/:id')
  async updateNote(
    @Param('id') id: string,
    @Body() data: Prisma.NoteUpdateInput,
    @Res() res: Response,
  ) {
    const kindeId = res['locals'].decodedData.sub;
    const note = await this.noteService.updateNote({
      where: { projectId: id, user: { kindeId } },
      data: { content: data.content },
    });

    res.status(HttpStatus.OK).json({ status: 'success', data: note });
  }
}
