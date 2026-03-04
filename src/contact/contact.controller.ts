import { Controller, Post, Body } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) { }

    @Post()
    @ApiOperation({ summary: 'Send a contact message' })
    async sendMessage(
        @Body() data: {
            name: string;
            email: string;
            phone: string;
            interest: string;
            dynamicField?: string;
            projectDetails: string;
        },
    ) {
        return this.contactService.create(data);
    }
}
