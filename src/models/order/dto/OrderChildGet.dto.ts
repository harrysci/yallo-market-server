import { IsNumber, IsString } from 'class-validator';
import { OrderChildrenBase } from '../interfaces/order-child-base.interface';

export class OrderChildGet implements OrderChildrenBase {
  @IsNumber()
  order_id: number;

  @IsString()
  order_number: string;

  @IsString()
  order_product_name: string;

  @IsNumber()
  order_unit_price: number;

  @IsNumber()
  order_quantity: number;
}
