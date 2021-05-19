import { makeBadge } from 'badge-maker';
import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type BadgeSettings = {
  label?: string;
  color?: string;
  style?: 'plastic' | 'flat' | 'flat-square' | 'for-the-badge' | 'social';
};

@Injectable()
export class RepositoriesService {
  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getNpmPackageLatestVersion(packageName: string) {
    const serverUrl = this.configService.get('NEXUS_SERVER_URL');

    const defaultVersion = 'not found';

    const response = await this.httpService
      .get(`${serverUrl}/repository/npm-private/${packageName}`, {
        headers: this.getHeaders(),
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

  getHeaders() {
    const userName = this.configService.get('NEXUS_USER_NAME');
    const userPass = this.configService.get('NEXUS_USER_PASS');

    if (userName && userPass) {
      const authorization = `Basic ${Buffer.from(
        `${userName}:${userPass}`,
      ).toString('base64')}`;

      return {
        authorization,
      };
    }

    return {};
  }
}
