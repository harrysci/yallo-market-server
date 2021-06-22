import { Controller } from '@nestjs/common';
import { AuthOwnerService } from './auth-owner.service';

@Controller('auth-owner')
export class AuthOwnerController {
  constructor(private readonly authOwnerService: AuthOwnerService) {}
}
