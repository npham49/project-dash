import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { Prisma, Project } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('/projects')
  async getProjects(): Promise<Project[] | null> {
    return this.projectService.projects({
      kindeId: 'clerk-id',
    });
  }

  @UseGuards(AuthGuard)
  @Post('/project')
  async createProject(
    @Body() data: Prisma.ProjectCreateInput,
  ): Promise<Project> {
    return this.projectService.createProject(data);
  }

  @Put('/project/:id')
  async updateProject(
    @Param('id') id: string,
    @Body() data: Prisma.ProjectUpdateInput,
  ): Promise<Project> {
    return this.projectService.updateProject({
      where: { id },
      data,
    });
  }

  @Delete('/project/:id')
  async deleteProject(@Param('id') id: string): Promise<Project> {
    return this.projectService.deleteProject({ id });
  }
}
