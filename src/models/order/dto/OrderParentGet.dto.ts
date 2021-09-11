import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
import { OrderParentBase } from '../interfaces/order-parent-base.interface';

export class OrderParentGet implements OrderParentBase {
  @IsNumber()
  order_parent_id: number;

  @IsString()
  order_number: string;

  @IsDate()
  order_created_at: Date;

  @IsNumber()
  order_status: number;

  @IsNumber()
  order_total_price: number;

  @IsBoolean()
  order_is_pickup: boolean;

  @IsNumber()
  store_id: number;

  @IsDate()
  order_completed_at: Date;

  @IsString()
  order_pay_method: string;

  @IsString()
  store_phone: string;
}
