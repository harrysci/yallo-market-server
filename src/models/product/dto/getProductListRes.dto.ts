import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * @점주_및_점포관리인_WEB_상품목록_조회_결과
 * 1. 상품명    (product_name)
 * 2. 바코드    (product_barcode)
 * 3. 분류      (product_category)
 * 4. 규격      (processed_product_standard_values or weighted_product_volume)
 * 5. 매입 단가   (product_original_price)
 * 6. 판매 단가   (product_current_price)
 * 7. 이익률    (계산)
 * 8. 세일 단가   (product_onsale_price)
 * 8. 원산지 (상세 정보 사진 대채)
 * 9. 제조 일자 (상세 정보 사진 대채)
 * 10. 유효 일자 (상세 정보 사진 대채)
 */
export class GetProductListRes {
  @IsNumber()
  productId: number;

  @IsString()
  productBarcode: string;

  @IsString()
  productName: string;

  @IsNumber()
  productOriginPrice: number | null;

  @IsNumber()
  productCurrentPrice: number;

  @IsNumber()
  @IsOptional()
  productOnSalePrice: number;

  @IsNumber()
  productProfit: number;

  @IsBoolean()
  productIsProcessed: boolean;

  @IsBoolean()
  productOnSale: boolean;

  @IsString()
  productVolume: string;
}
