import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Yallo Market API Server ENV
 * @class env method 집합
 */
@Injectable()
export class MysqlConfigService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('app.host');
  }
  get mysql_port(): string {
    return this.configService.get<string>('app.mysql_port');
  }
  get username(): string {
    return this.configService.get<string>('app.username');
  }
  get password(): number {
    return Number(this.configService.get<number>('app.password'));
  }
  get database(): number {
    return Number(this.configService.get<number>('app.database'));
  }
}
