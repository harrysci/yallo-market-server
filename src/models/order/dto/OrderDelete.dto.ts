import { IsNumber, IsString, IsDate, IsBoolean } from 'class-validator';

export class OrderDelete {
  //order parent data
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
  //order children data
  @IsNumber()
  order_id: number;

  @IsString()
  order_product_name: string;

  @IsNumber()
  order_unit_price: number;

  @IsNumber()
  order_quantity: number;
}
