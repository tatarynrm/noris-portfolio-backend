import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendPasswordResetEmail(email: string, token: string, name: string): Promise<void>;
    sendContactNotification(data: {
        name: string;
        email: string;
        phone: string;
        interest: string;
        dynamicField?: string;
        projectDetails: string;
    }): Promise<void>;
}
