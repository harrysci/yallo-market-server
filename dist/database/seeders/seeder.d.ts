import { Logger } from '@nestjs/common';
import { AuthService } from 'src/models/auth/auth.service';
export declare class Seeder {
    private readonly logger;
    private readonly authService;
    constructor(logger: Logger, authService: AuthService);
    seed(): Promise<void>;
}
