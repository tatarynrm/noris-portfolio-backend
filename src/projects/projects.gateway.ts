import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'projects',
})
export class ProjectsGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('Projects WebSocket Gateway Initialized');
  }

  notifyProjectsChanged() {
    this.server.emit('projects_changed', { timestamp: new Date() });
  }
}
