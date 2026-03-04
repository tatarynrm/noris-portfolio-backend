import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'user@example.com', description: 'User email' })
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @ApiProperty({ example: 'password123', description: 'User password' })
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password!: string;

    @ApiProperty({ example: 'John Doe', description: 'User full name', required: false })
    @IsString()
    @IsOptional()
    name?: string;
}
