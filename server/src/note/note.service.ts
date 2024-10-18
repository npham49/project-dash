import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Note, Prisma } from '@prisma/client';

@Injectable()
export class NoteService {
  constructor(private prisma: PrismaService) {}

  async note(
    noteWhereUniqueInput: Prisma.NoteWhereUniqueInput,
  ): Promise<Note | null> {
    return this.prisma.note.findUnique({
      where: noteWhereUniqueInput,
    });
  }

  async createNote(data: Prisma.NoteCreateInput): Promise<Note> {
    return this.prisma.note.create({
      data,
    });
  }

  async updateNote(params: {
    where: Prisma.NoteWhereUniqueInput;
    data: Prisma.NoteUpdateInput;
  }): Promise<Note> {
    const { data, where } = params;
    return this.prisma.note.update({
      data,
      where,
    });
  }

  async deleteNote(where: Prisma.NoteWhereUniqueInput): Promise<Note> {
    return this.prisma.note.delete({
      where,
    });
  }
}
