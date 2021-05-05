import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Yallo Market API Server ENV
 * @class env method 집합
 */
@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get name(): string {
    return this.configService.get<string>('app.name');
  }
  get env(): string {
    return this.configService.get<string>('app.env');
  }
  get url(): string {
    return this.configService.get<string>('app.url');
  }
  get port(): number {
    return Number(this.configService.get<number>('app.port'));
  }
}
