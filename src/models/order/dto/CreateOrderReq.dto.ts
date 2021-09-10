import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';
import { PayProductDto } from './PayProductDto.dto';

export default class CreateOrderReq {
  @IsString()
  orderNumber: string;

  @IsNumber()
  orderStatus: number;

  @IsNumber()
  orderTotalPrice: number;

  @IsBoolean()
  orderIsPickup: boolean;

  @IsNumber()
  storeId: number;

  @IsNumber()
  storeName: string;

  @IsNumber()
  orderPayMethod: string;

  @IsArray()
  orderProductArray: PayProductDto[];
}
