import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthCustomerService } from '../auth-customer.service';

@Injectable()
export class LocalUserStrategy extends PassportStrategy(Strategy) {
  constructor(private authCustomerService: AuthCustomerService) {
    super();
  }

  async validate(user_email: string, user_password: string): Promise<any> {
    const user = await this.authCustomerService.validateUser(
      user_email,
      user_password,
    );

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
