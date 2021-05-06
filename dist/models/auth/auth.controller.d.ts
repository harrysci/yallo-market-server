import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    testRoute(): Promise<import("./entities/user.entity").User>;
}
