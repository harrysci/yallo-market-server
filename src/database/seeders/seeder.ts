import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from 'src/models/auth/auth.service';

@Injectable()
export class Seeder {
  constructor(
    private readonly logger: Logger,
    private readonly authService: AuthService,
  ) {}
  async seed() {
    /* */
  }
}
