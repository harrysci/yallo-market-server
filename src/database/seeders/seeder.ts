import { Injectable, Logger } from '@nestjs/common';
import { AuthCustomerService } from 'src/models/auth-customer/auth-customer.service';

@Injectable()
export class Seeder {
  constructor(
    private readonly logger: Logger,
    private readonly authCustomerService: AuthCustomerService,
  ) {}
  async seed() {
    /* */
  }
}
