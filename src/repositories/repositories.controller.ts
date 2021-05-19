import { Controller, Get, Header, Param, Query } from '@nestjs/common';
import { RepositoriesService } from './repositories.service';

@Controller('/repositories')
export class RepositoriesController {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  @Get('/npm/:packageName(*)')
  @Header('content-type', 'image/svg+xml;charset=utf-8')
  getNpmPackageBadge(
    @Param('packageName') packageName: string,
    @Query() query: any, // TODO: add type for this
  ) {
    const { label, style, color } = query;

    return this.repositoriesService.getNpmPackageBadge(packageName, {
      label,
      style,
      color,
    });
  }
}
