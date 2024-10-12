import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ProjectService } from './project.service';
import { Prisma, Project } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(AuthGuard)
  @Get('/projects')
  async getProjects(@Res() res: Response) {
    const kindeId = res['locals'].decodedData.sub;
    const projects = await this.projectService.projects({
      kindeId,
    });

    res.status(HttpStatus.OK).json({ status: 'success', data: projects });
  }

  @UseGuards(AuthGuard)
  @Post('/project')
  async createProject(
    @Body() data: Prisma.ProjectCreateInput,
    @Res() res: Response,
  ) {
    const kindeId = res['locals'].decodedData.sub;
    const project = await this.projectService.createProject({
      ...data,
      user: {
        connect: {
          kindeId,
        },
      },
    });

    res.status(HttpStatus.OK).json({ status: 'success', data: project });
  }

  @UseGuards(AuthGuard)
  @Put('/project/:id')
  async updateProject(
    @Param('id') id: string,
    @Body() data: Prisma.ProjectUpdateInput,
    @Res() res: Response,
  ) {
    const kindeId = res['locals'].decodedData.sub;
    const project = await this.projectService.updateProject({
      where: { id, user: { kindeId } },
      data,
    });

    res.status(HttpStatus.OK).json({ status: 'success', data: project });
  }

  @UseGuards(AuthGuard)
  @Delete('/project/:id')
  async deleteProject(@Param('id') id: string, @Res() res: Response) {
    const kindeId = res['locals'].decodedData.sub;
    const project = await this.projectService.deleteProject({
      id,
      user: { kindeId },
    });

    res.status(HttpStatus.OK).json({ status: 'success', data: project });
  }
}
