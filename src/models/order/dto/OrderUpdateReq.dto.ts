import { IsString } from 'class-validator';
export class OrderUpdateReq {
  @IsString()
  order_number: string;

  @IsString()
  order_status: number;
}
