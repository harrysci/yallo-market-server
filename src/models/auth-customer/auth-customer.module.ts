import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthCustomerController } from './auth-customer.controller';
import { AuthCustomerService } from './auth-customer.service';
import { userJwtConstants } from './constants/userJwtConstants';
import { RegularStore } from './entities/regular-store.entity';
import { UserOrder } from './entities/user-order.entity';
import { User } from './entities/user.entity';
import { JwtUserStrategy } from './passport/jwt.strategy';
import { LocalUserStrategy } from './passport/local.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserOrder, RegularStore]),
    PassportModule,
    JwtModule.register({
      secret: userJwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [AuthCustomerController],
  providers: [AuthCustomerService, LocalUserStrategy, JwtUserStrategy],
  exports: [AuthCustomerService, JwtModule],
})
export class AuthCustomerModule {}
