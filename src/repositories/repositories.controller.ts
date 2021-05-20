import { Controller, Get, Header, Param, Query } from '@nestjs/common';

import { BadgeSettings, RepositoriesService } from './repositories.service';

@Controller('/repositories')
export class RepositoriesController {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  @Get('/npm/:packageName(*)')
  @Header('content-type', 'image/svg+xml;charset=utf-8sssss')
  getNpmPackageBadge(
    @Param('packageName') packageName: string,
    @Query() query: BadgeSettings,
  ) {
    const { label, style, color } = query;

    return this.repositoriesService.getNpmPackageBadge(packageName, {
      label,
      style,
      color,
    });
  }
}
