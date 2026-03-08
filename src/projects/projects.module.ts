import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ProjectsGateway } from './projects.gateway';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsGateway],
  exports: [ProjectsService],
})
export class ProjectsModule {}
