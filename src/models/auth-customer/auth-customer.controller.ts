import { Controller } from '@nestjs/common';
import { AuthCustomerService } from './auth-customer.service';

@Controller('auth')
export class AuthCustomerController {
  constructor(private readonly authCustomerService: AuthCustomerService) {}
}
