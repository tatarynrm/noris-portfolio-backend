import { OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';
export declare class ProjectsGateway implements OnGatewayInit {
    server: Server;
    afterInit(server: Server): void;
    notifyProjectsChanged(): void;
}
