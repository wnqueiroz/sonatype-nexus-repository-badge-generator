import { makeBadge } from 'badge-maker';
import { HttpService, Injectable } from '@nestjs/common';

type BadgeSettings = {
  label?: string;
  color?: string;
  style?: 'plastic' | 'flat' | 'flat-square' | 'for-the-badge' | 'social';
};

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

  async getNpmPackageBadge(packageName: string, settings: BadgeSettings) {
    const version = await this.getNpmPackageLatestVersion(packageName);

    const {
      label = 'npm package',
      color = 'green',
      style = 'plastic',
    } = settings;

    const validStyles = [
      'plastic',
      'flat',
      'flat-square',
      'for-the-badge',
      'social',
    ];

    const isValidStyle = validStyles.includes(style);

    const svg = makeBadge({
      label: !isValidStyle ? 'invalid' : label,
      message: !isValidStyle ? 'style' : version,
      color: !isValidStyle ? 'red' : color,
      style: !isValidStyle ? 'plastic' : style,
    });

    return svg;
  }
}
