import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthCustomerModule } from '../auth-customer/auth-customer.module';
import { UserOrder } from '../auth-customer/entities/user-order.entity';
import { User } from '../auth-customer/entities/user.entity';
import { OrderChild } from './entities/order-child.entity';
import { OrderParent } from './entities/order-parent.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderParent, OrderChild]),
    AuthCustomerModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
