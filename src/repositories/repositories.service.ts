import { makeBadge } from 'badge-maker';
import { HttpService, Injectable } from '@nestjs/common';

@Injectable()
export class RepositoriesService {
  constructor(private httpService: HttpService) {}

  async getNpmPackageLatestVersion(packageName: string) {
    const defaultVersion = 'not found';

    const authorization = `Basic ${Buffer.from('npmuser:npmuser').toString(
      'base64',
    )}`; // TODO: read from environment variable

    const response = await this.httpService
      // TODO: read from environment variable
      .get(`http://localhost:8081/repository/npm-private/${packageName}`, {
        headers: { authorization },
      })
      .toPromise()
      .then(({ data }) => data)
      .catch(() => {
        return {
          'dist-tags': {
            latest: defaultVersion,
          },
        };
      });

    const { 'dist-tags': distTags } = response;

    const { latest = defaultVersion } = distTags;

    return latest || defaultVersion;
  }

  async getNpmPackageBadge(packageName: string) {
    const version = await this.getNpmPackageLatestVersion(packageName);

    // TODO: make this properties with parameters
    const svg = makeBadge({
      label: 'npm package',
      message: version,
      color: 'green',
      style: 'for-the-badge',
    });

    return svg;
  }
}
