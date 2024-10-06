import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { Prisma, Project } from '@prisma/client';

@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('/projects')
  async getProjects(): Promise<Project[] | null> {
    return this.projectService.projects({
      clerkId: 'clerk-id',
    });
  }

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
