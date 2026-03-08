import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'My Awesome Project' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Detailed description of the project', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'uuid-of-status', required: false })
  @IsString()
  @IsOptional()
  status_id?: string;

  @ApiProperty({ example: ['user-id-1', 'user-id-2'], required: false })
  @IsOptional()
  member_ids?: string[];
}

export class UpdateProjectDto {
  @ApiProperty({ example: 'Updated Project Title', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'uuid-of-status', required: false })
  @IsString()
  @IsOptional()
  status_id?: string;

  @ApiProperty({ example: ['user-id-1', 'user-id-2'], required: false })
  @IsOptional()
  member_ids?: string[];
}

export class PaginationDto {
  @ApiProperty({ example: 1, required: false, default: 1 })
  @IsOptional()
  page?: number;

  @ApiProperty({ example: 10, required: false, default: 10 })
  @IsOptional()
  limit?: number;

  @ApiProperty({ example: 'Search title...', required: false })
  @IsOptional()
  @IsString()
  search?: string;
}
