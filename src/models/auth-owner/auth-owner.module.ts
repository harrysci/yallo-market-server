import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthOwnerController } from './auth-owner.controller';
import { AuthOwnerService } from './auth-owner.service';
import { Owner } from './entities/owner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Owner])],
  exports: [AuthOwnerService],
  providers: [AuthOwnerService],
  controllers: [AuthOwnerController],
})
export class AuthOwnerModule {}
