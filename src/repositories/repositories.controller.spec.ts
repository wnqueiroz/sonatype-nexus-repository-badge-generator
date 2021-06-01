import { HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { RepositoriesController } from './repositories.controller';
import { BadgeSettings, RepositoriesService } from './repositories.service';

describe('Unit: RepositoriesController', () => {
  let repositoriesController: RepositoriesController;
  let repositoriesService: RepositoriesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule, HttpModule],
      controllers: [RepositoriesController],
      providers: [RepositoriesService],
    }).compile();

    repositoriesService =
      moduleRef.get<RepositoriesService>(RepositoriesService);
    repositoriesController = moduleRef.get<RepositoriesController>(
      RepositoriesController,
    );
  });

  describe('getNpmPackageBadge', () => {
    it('should return the badge svg based on the package name', async () => {
      const packageName = '@company/application-a';
      const query: BadgeSettings = {
        color: 'red',
        label: 'whatever',
        style: 'for-the-badge',
      };

      const response = 'whatever';

      jest
        .spyOn(repositoriesService, 'getNpmPackageBadge')
        .mockResolvedValue(response);

      const result = await repositoriesController.getNpmPackageBadge(
        packageName,
        query,
      );

      expect(result).toBe(response);
      expect(repositoriesService.getNpmPackageBadge).toBeCalledWith(
        packageName,
        query,
      );
    });
  });
});
