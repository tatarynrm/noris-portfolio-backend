"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const projects_gateway_1 = require("./projects.gateway");
let ProjectsService = class ProjectsService {
    prisma;
    projectsGateway;
    constructor(prisma, projectsGateway) {
        this.prisma = prisma;
        this.projectsGateway = projectsGateway;
    }
    async getStatuses() {
        return this.prisma.project_status.findMany({
            orderBy: { name: 'asc' },
        });
    }
    async create(createProjectDto) {
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
    async findAll(paginationDto) {
        const { page = 1, limit = 10, search } = paginationDto;
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        const where = search
            ? {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
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
    async findOne(id) {
        const project = await this.prisma.project.findUnique({
            where: { project_id: id },
            include: {
                members: { include: { user: true } },
            },
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${id} not found`);
        }
        return project;
    }
    async update(id, updateProjectDto) {
        const { member_ids, ...data } = updateProjectDto;
        try {
            const projectFind = await this.prisma.project.findUnique({
                where: { project_id: id },
            });
            if (!projectFind) {
                throw new common_1.NotFoundException(`Project with ID ${id} not found`);
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
        }
        catch (error) {
            console.error('Update project error:', error);
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new Error(`Failed to update project: ${error.message}`);
        }
    }
    async remove(id) {
        try {
            const result = await this.prisma.project.delete({
                where: { project_id: id },
            });
            this.projectsGateway.notifyProjectsChanged();
            return result;
        }
        catch (error) {
            throw new common_1.NotFoundException(`Project with ID ${id} not found`);
        }
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        projects_gateway_1.ProjectsGateway])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map