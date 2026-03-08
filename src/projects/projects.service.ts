import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto, PaginationDto } from './dto/project.dto';
import { ProjectsGateway } from './projects.gateway';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private projectsGateway: ProjectsGateway,
  ) { }

  async getStatuses() {
    return this.prisma.project_status.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(createProjectDto: CreateProjectDto) {
    const { member_ids, ...data } = createProjectDto;
    const project = await this.prisma.project.create({
      data: {
        ...data,
        members: {
          create: member_ids?.map((user_id) => ({ user_id })) || [],
        },
      },
      include: {
        status: true,
        members: { include: { user: true } },
      },
    });
    this.projectsGateway.notifyProjectsChanged();
    return project;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where = search
      ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }
      : {};

    const [items, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: {
          status: true,
          members: { include: { user: true } },
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { project_id: id },
      include: {
        // status: true,
        members: { include: { user: true } },
      },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const { member_ids, ...data } = updateProjectDto;
    try {

      const projectFind = await this.prisma.project.findUnique({
        where: { project_id: id },
      });

      if (!projectFind) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }
      const project = await this.prisma.project.update({
        where: { project_id: id },
        data: {
          ...data,
          members: member_ids
            ? {
              deleteMany: {},
              create: member_ids.map((user_id) => ({ user_id })),
            }
            : undefined,
        },
        include: {
          status: true,
          members: { include: { user: true } },
        },
      });
      this.projectsGateway.notifyProjectsChanged();
      return project;
    } catch (error) {
      console.error('Update project error:', error);
      if (error instanceof NotFoundException) throw error;
      throw new Error(`Failed to update project: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      const result = await this.prisma.project.delete({
        where: { project_id: id },
      });
      this.projectsGateway.notifyProjectsChanged();
      return result;
    } catch (error) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }
}
