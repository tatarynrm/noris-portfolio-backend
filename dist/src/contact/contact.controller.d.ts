import { ContactService } from './contact.service';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    sendMessage(data: {
        name: string;
        email: string;
        phone: string;
        interest: string;
        dynamicField?: string;
        projectDetails: string;
    }): Promise<{
        name: string;
        email: string;
        created_at: Date;
        updated_at: Date;
        message_id: string;
        phone: string;
        interest: string;
        dynamic_field: string | null;
        project_details: string;
        status: string;
    }>;
}
