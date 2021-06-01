import { HttpModule, HttpService } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { BadgeSettings, RepositoriesService } from './repositories.service';

describe('RepositoriesService', () => {
  let repositoriesService: RepositoriesService;
  let configService: ConfigService;

  const toPromiseReturn = { data: { foo: 'bar' } };
  const toPromise = jest.fn().mockResolvedValue(toPromiseReturn);
  const mockHttpService = {
    get: jest.fn(() => ({
      toPromise,
    })),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule, HttpModule],
      providers: [RepositoriesService],
    })
      .overrideProvider(HttpService)
      .useValue(mockHttpService)
      .compile();

    repositoriesService =
      moduleRef.get<RepositoriesService>(RepositoriesService);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  describe('getNpmPackageLatestVersion', () => {
    const packageName = 'application-a';
    const serverUrl = 'http://localhost:8081';
    const defaultVersion = 'not found';

    afterEach(() => {
      expect(configService.get).toBeCalledWith('NEXUS_SERVER_URL');
    });

    it('should return the latest version of NPM package', async () => {
      const latest = '1.0.0';

      toPromise.mockResolvedValueOnce({
        data: {
          'dist-tags': {
            latest,
          },
        },
      });

      jest.spyOn(configService, 'get').mockReturnValue(serverUrl);

      const result = await repositoriesService.getNpmPackageLatestVersion(
        packageName,
      );

      expect(result).toEqual(latest);
    });

    it('should return the default version of NPM package', async () => {
      jest.spyOn(configService, 'get').mockReturnValue(serverUrl);

      const result = await repositoriesService.getNpmPackageLatestVersion(
        packageName,
      );

      expect(result).toEqual(defaultVersion);
    });

    it('should return the default version of NPM package (when throw an exception on get version)', async () => {
      toPromise.mockRejectedValue('foo');

      jest.spyOn(configService, 'get').mockReturnValue(serverUrl);

      const result = await repositoriesService.getNpmPackageLatestVersion(
        packageName,
      );

      expect(result).toEqual(defaultVersion);
    });
  });

  describe('getNpmPackageBadge', () => {
    const packageName = 'application-a';
    const latest = '1.0.0';

    beforeEach(() => {
      repositoriesService.getNpmPackageLatestVersion = jest
        .fn()
        .mockResolvedValue(latest);
    });

    afterEach(() => {
      expect(repositoriesService.getNpmPackageLatestVersion).toBeCalledWith(
        packageName,
      );
    });

    it('should return the package badge', async () => {
      const settings: BadgeSettings = {
        color: 'red',
        label: 'FOO',
        style: 'for-the-badge',
      };

      const result = await repositoriesService.getNpmPackageBadge(
        packageName,
        settings,
      );

      expect(result).toBe(
        `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="106.5" height="28" role="img" aria-label="${settings.label}: ${latest}"><title>${settings.label}: ${latest}</title><g shape-rendering="crispEdges"><rect width="47.5" height="28" fill="#555"/><rect x="47.5" width="59" height="28" fill="#e05d44"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="100"><text fill="#fff" x="237.5" y="175" transform="scale(.1)" textLength="235">FOO</text><text fill="#fff" x="770" y="175" font-weight="bold" transform="scale(.1)" textLength="350">${latest}</text></g></svg>`,
      );
    });

    it('should return the package badge (with default preset)', async () => {
      const settings: any = {};

      const result = await repositoriesService.getNpmPackageBadge(
        packageName,
        settings,
      );

      expect(result).toBe(
        `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="124" height="18" role="img" aria-label="npm package: ${latest}"><title>npm package: ${latest}</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0"  stop-color="#fff" stop-opacity=".7"/><stop offset=".1" stop-color="#aaa" stop-opacity=".1"/><stop offset=".9" stop-color="#000" stop-opacity=".3"/><stop offset="1"  stop-color="#000" stop-opacity=".5"/></linearGradient><clipPath id="r"><rect width="124" height="18" rx="4" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="85" height="18" fill="#555"/><rect x="85" width="39" height="18" fill="#97ca00"/><rect width="124" height="18" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="435" y="140" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="750">npm package</text><text x="435" y="130" transform="scale(.1)" fill="#fff" textLength="750">npm package</text><text aria-hidden="true" x="1035" y="140" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="290">${latest}</text><text x="1035" y="130" transform="scale(.1)" fill="#fff" textLength="290">${latest}</text></g></svg>`,
      );
    });

    it('should return the package badge (when the style is invalid)', async () => {
      const settings: any = {
        color: 'red',
        label: 'FOO',
        style: 'foo',
      };

      const result = await repositoriesService.getNpmPackageBadge(
        packageName,
        settings,
      );

      expect(result).toBe(
        `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="82" height="18" role="img" aria-label="invalid: style"><title>invalid: style</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0"  stop-color="#fff" stop-opacity=".7"/><stop offset=".1" stop-color="#aaa" stop-opacity=".1"/><stop offset=".9" stop-color="#000" stop-opacity=".3"/><stop offset="1"  stop-color="#000" stop-opacity=".5"/></linearGradient><clipPath id="r"><rect width="82" height="18" rx="4" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="45" height="18" fill="#555"/><rect x="45" width="37" height="18" fill="#e05d44"/><rect width="82" height="18" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="235" y="140" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="350">invalid</text><text x="235" y="130" transform="scale(.1)" fill="#fff" textLength="350">invalid</text><text aria-hidden="true" x="625" y="140" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="270">style</text><text x="625" y="130" transform="scale(.1)" fill="#fff" textLength="270">style</text></g></svg>`,
      );
    });
  });

  describe('getHeaders', () => {
    it('should return the request headers', () => {
      jest.spyOn(configService, 'get').mockReturnValue('foo');

      const result = repositoriesService.getHeaders();

      expect(result).toEqual({
        authorization: 'Basic Zm9vOmZvbw==',
      });
      expect(configService.get).toBeCalledWith('NEXUS_USER_NAME');
      expect(configService.get).toBeCalledWith('NEXUS_USER_PASS');
    });

    it('should return the empty request headers', () => {
      jest.spyOn(configService, 'get').mockReturnValue(undefined);

      const result = repositoriesService.getHeaders();

      expect(result).toEqual({});
      expect(configService.get).toBeCalledWith('NEXUS_USER_NAME');
      expect(configService.get).toBeCalledWith('NEXUS_USER_PASS');
    });
  });
});
