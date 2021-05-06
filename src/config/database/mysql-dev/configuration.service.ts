import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * AWS RDS TCP/IP ENV
 * @class env method 집합
 */
@Injectable()
export class GCPMysqlConfigService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('gcp_mysql.host');
  }
  get port(): string {
    return this.configService.get<string>('gcp_mysql.port');
  }
  get username(): string {
    return this.configService.get<string>('gcp_mysql.username');
  }
  get password(): string {
    return this.configService.get<string>('gcp_mysql.password');
  }
  get database(): string {
    return this.configService.get<string>('gcp_mysql.database');
  }
}
