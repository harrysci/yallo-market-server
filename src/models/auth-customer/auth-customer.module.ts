import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthCustomerController } from './auth-customer.controller';
import { AuthCustomerService } from './auth-customer.service';
import { RegularStore } from './entities/regular-store.entity';
import { UserOrder } from './entities/user-order.entity';
import { User } from './entities/user.entity';
import { LocalUserStrategy } from './passport/local.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserOrder, RegularStore]),
    PassportModule,
  ],
  controllers: [AuthCustomerController],
  providers: [AuthCustomerService, LocalUserStrategy],
  exports: [AuthCustomerService],
})
export class AuthCustomerModule {}
