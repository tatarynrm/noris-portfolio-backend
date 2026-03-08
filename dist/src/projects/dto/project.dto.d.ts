export declare class CreateProjectDto {
    title: string;
    description?: string;
    status_id?: string;
    member_ids?: string[];
}
export declare class UpdateProjectDto {
    title?: string;
    description?: string;
    status_id?: string;
    member_ids?: string[];
}
export declare class PaginationDto {
    page?: number;
    limit?: number;
    search?: string;
}
