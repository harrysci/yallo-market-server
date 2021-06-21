import { Module } from '@nestjs/common';
import { AuthOwnerService } from './auth-owner.service';

@Module({
  providers: [AuthOwnerService],
})
export class AuthOwnerModule {}
