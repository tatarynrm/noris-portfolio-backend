import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleNativeLoginDto {
    @ApiProperty({
        description: 'Google Access Token from Native SDK',
        example: 'ya29.a0AfH6S...',
    })
    @IsString()
    @IsNotEmpty()
    access_token: string;
}
