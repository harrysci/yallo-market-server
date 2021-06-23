import { Controller } from '@nestjs/common';
import { AuthOwnerService } from './auth-owner.service';

@Controller('auth-owner')
export class AuthOwnerController {
  constructor(private readonly authOwnerService: AuthOwnerService) {}

  async validateUser(ownername: string, psswd: string): Promise<any> {
    const owner = await this.authOwnerService.findOne(ownername);
    if (owner && owner.psswd === psswd) {
      const { password, ...result } = owner;
      return result;
    }
    return null;
  }
}
