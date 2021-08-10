import { IsBoolean, IsNumber, IsString, IsDate } from 'class-validator';

/**
 * @점주_및_점포관리인_App_상품정보_입력_요청
 */
export class CreateBarcodeWeightedProductRes {
  // product 공통 attributes
  @IsNumber()
  productId: number;

  @IsString()
  productBarcode: string;

  @IsString()
  productName: string;

  @IsNumber()
  productOriginalPrice: number;

  @IsNumber()
  productCurrentPrice: number;

  @IsNumber()
  productProfit: number;

  @IsString()
  productDescription: string;

  @IsBoolean()
  productIsProcessed: boolean;

  @IsBoolean()
  productIsSoldout: boolean;

  @IsBoolean()
  productOnsale: boolean;

  @IsString()
  productCategory: string;

  @IsDate()
  productCreatedAt: Date;

  // product_image attributes
  @IsString()
  representativeProductImage?: string;

  @IsString()
  detailProductImage?: string;

  @IsString()
  additionalProductImage?: string;

  // weighted_product attributes
  @IsNumber()
  weightedProductId?: number;

  @IsString()
  weightedProductVolume?: string;
}
