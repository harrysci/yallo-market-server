import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthCustomerController } from './auth-customer.controller';
import { AuthCustomerService } from './auth-customer.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [AuthCustomerService],
  controllers: [AuthCustomerController],
  providers: [AuthCustomerService],
})
export class AuthCustomerModule {}
