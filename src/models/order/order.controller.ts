import { Controller, Get } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(readonly orderService: OrderService) {}

  @Get('/get')
  getOne(): Promise<OrderGetRes> {
    return this.orderService.getOne();
  }
}
