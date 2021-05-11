import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  async getUserProfile() {
    const req = {
      userId: 'aa',
      accountType: 'KAKAO',
    };

    return this.authService.searchOneUserProfile(req);
  }
}
