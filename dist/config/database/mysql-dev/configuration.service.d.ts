import { ConfigService } from '@nestjs/config';
export declare class GCPMysqlConfigService {
    private configService;
    constructor(configService: ConfigService);
    get host(): string;
    get port(): string;
    get username(): string;
    get password(): string;
    get database(): string;
}
