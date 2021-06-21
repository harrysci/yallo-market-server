import { Controller, Get, Post } from '@nestjs/common';
import { AuthCustomerService } from './auth-customer.service';

@Controller('auth')
export class AuthCustomerController {
  constructor(private readonly authCustomerService: AuthCustomerService) {}

  @Get('profile')
  async getUserProfile() {
    const req = {
      userId: 'aa',
      accountType: 'KAKAO',
    };

    return this.authCustomerService.searchOneUserProfile(req);
  }

  @Post('profile')
  async saveUserProfile() {
    const req = {
      userId: 'aa',
      accountType: 'KAKAO',
    };

    return this.authCustomerService.saveUserProfile(req);
  }
}
