import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, PaginationDto } from './dto/project.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    getStatuses(): Promise<{
        status_id: string;
        name: string;
        color: string | null;
        created_at: Date;
        updated_at: Date;
    }[]>;
    create(createProjectDto: CreateProjectDto): Promise<{
        status: {
            status_id: string;
            name: string;
            color: string | null;
            created_at: Date;
            updated_at: Date;
        } | null;
        members: ({
            user: {
                name: string | null;
                created_at: Date;
                updated_at: Date;
                role: import(".prisma/client").$Enums.UserRole;
                user_id: string;
                email: string;
                password: string | null;
                picture: string | null;
                google_id: string | null;
                password_reset_token: string | null;
                password_reset_expires: Date | null;
            };
        } & {
            created_at: Date;
            updated_at: Date;
            project_id: string;
            id: string;
            role: string | null;
            user_id: string;
        })[];
    } & {
        status_id: string | null;
        created_at: Date;
        updated_at: Date;
        project_id: string;
        title: string;
        description: string | null;
    }>;
    findAll(paginationDto: PaginationDto): Promise<{
        items: ({
            status: {
                status_id: string;
                name: string;
                color: string | null;
                created_at: Date;
                updated_at: Date;
            } | null;
            members: ({
                user: {
                    name: string | null;
                    created_at: Date;
                    updated_at: Date;
                    role: import(".prisma/client").$Enums.UserRole;
                    user_id: string;
                    email: string;
                    password: string | null;
                    picture: string | null;
                    google_id: string | null;
                    password_reset_token: string | null;
                    password_reset_expires: Date | null;
                };
            } & {
                created_at: Date;
                updated_at: Date;
                project_id: string;
                id: string;
                role: string | null;
                user_id: string;
            })[];
        } & {
            status_id: string | null;
            created_at: Date;
            updated_at: Date;
            project_id: string;
            title: string;
            description: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        members: ({
            user: {
                name: string | null;
                created_at: Date;
                updated_at: Date;
                role: import(".prisma/client").$Enums.UserRole;
                user_id: string;
                email: string;
                password: string | null;
                picture: string | null;
                google_id: string | null;
                password_reset_token: string | null;
                password_reset_expires: Date | null;
            };
        } & {
            created_at: Date;
            updated_at: Date;
            project_id: string;
            id: string;
            role: string | null;
            user_id: string;
        })[];
    } & {
        status_id: string | null;
        created_at: Date;
        updated_at: Date;
        project_id: string;
        title: string;
        description: string | null;
    }>;
    update(id: string, updateProjectDto: UpdateProjectDto): Promise<{
        status: {
            status_id: string;
            name: string;
            color: string | null;
            created_at: Date;
            updated_at: Date;
        } | null;
        members: ({
            user: {
                name: string | null;
                created_at: Date;
                updated_at: Date;
                role: import(".prisma/client").$Enums.UserRole;
                user_id: string;
                email: string;
                password: string | null;
                picture: string | null;
                google_id: string | null;
                password_reset_token: string | null;
                password_reset_expires: Date | null;
            };
        } & {
            created_at: Date;
            updated_at: Date;
            project_id: string;
            id: string;
            role: string | null;
            user_id: string;
        })[];
    } & {
        status_id: string | null;
        created_at: Date;
        updated_at: Date;
        project_id: string;
        title: string;
        description: string | null;
    }>;
    remove(id: string): Promise<{
        status_id: string | null;
        created_at: Date;
        updated_at: Date;
        project_id: string;
        title: string;
        description: string | null;
    }>;
}
