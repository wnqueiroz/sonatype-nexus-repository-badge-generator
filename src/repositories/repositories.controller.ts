import { Controller, Get, Header, Param } from '@nestjs/common';
import { RepositoriesService } from './repositories.service';

@Controller('/repositories')
export class RepositoriesController {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  @Get('/npm/:packageName(*)')
  @Header('content-type', 'image/svg+xml;charset=utf-8')
  getNpmPackageBadge(@Param('packageName') packageName: string) {
    return this.repositoriesService.getNpmPackageBadge(packageName);
  }
}
