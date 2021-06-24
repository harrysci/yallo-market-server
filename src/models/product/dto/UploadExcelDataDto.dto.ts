import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UploadExcelDataDto {
  @IsNumber()
  store_id: number;

  @IsString()
  product_barcode: string;


  @IsString()
  product_name: string;

  @IsNumber()
  product_original_price: number;

  @IsNumber()
  product_current_price: number;

  @IsString()
  product_description: string;
  @IsNumber()
  product_onsale_price: number;
  @IsString()
  product_category:string;

  @IsNumber()
  product_profit: number;

  @IsBoolean()
  product_is_soldout: boolean;
  @IsBoolean()
  product_onsale: boolean;
  @IsBoolean()
  product_is_processed: boolean;



  @IsString()
  product_volume: string;
}