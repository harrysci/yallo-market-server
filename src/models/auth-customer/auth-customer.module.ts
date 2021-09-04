import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthCustomerController } from './auth-customer.controller';
import { AuthCustomerService } from './auth-customer.service';
import { RegularStore } from './entities/regular-store.entity';
import { UserOrder } from './entities/user-order.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserOrder, RegularStore])],
  controllers: [AuthCustomerController],
  providers: [AuthCustomerService],
  exports: [AuthCustomerService],
})
export class AuthCustomerModule {}
