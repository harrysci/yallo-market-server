import { Controller, Get, Param } from '@nestjs/common';
import { OrderChildGet } from './dto/OrderChildGet.dto';
import { OrderParentGet } from './dto/OrderParentGet.dto';
import { OrderParent } from './entities/order-parent.entity';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(readonly orderService: OrderService) {}

  @Get('/get')
  getOrderParentList(): Promise<OrderParentGet[]> {
    return this.orderService.getOrderParentList();
  }

  @Get('/get/:order_number')
  getOrderChildList(
    @Param('order_number') order_number: string,
  ): Promise<OrderChildGet[]> {
    console.log(order_number);
    return this.orderService.getOrderChildrenList(order_number);
  }
}
