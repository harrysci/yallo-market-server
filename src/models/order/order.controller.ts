import { Controller, Get, Param, Post } from '@nestjs/common';
import { FormToObject } from 'src/common/decorator/form-to-object.decorator';
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
    return this.orderService.getOrderChildrenList(order_number);
  }

  @Post('/create')
  createOrderList(@FormToObject('payInfo') req: any): Promise<OrderParent> {
    return this.orderService.createOrderList(req.body);
  }

  // @Get('/get/lastOrderNum')
  @Get('/lastOrderNum')
  // getLastOrderNumber(): Promise<string>{
  getLastOrderNumber(): Promise<any> {
    return this.orderService.getLastOrderNumber();
  }
}
