import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

/**
 * @점주_및_점포관리인_App_상품상세정보_수정_요청
 *  1. 상품번호 (product_id)
 *  2. 공산품 여부 (product_is_processed)
 *  3. 바코드 (product_barcode)
 *  4. 상품명 (product_name)
 *  5. 판매 단가 (product_current_price)
 *  6. 분류 (product_category)
 *  7. 상품 게시일 (product_created_at)
 *  8. 규격 (processed_product_standard_values or weighted_product_volume)
 *  9. 상품 매진 여부 (product_is_soldout)
 * 10. 매입 단가 (product_original_price)
 * 11. 상품 설명 (product_description)
 */
export class UpdateBarcodeProductInfoRes {
  @IsNumber()
  productId: number;

  @IsBoolean()
  productIsProcessed: boolean;

  @IsString()
  productBarcode: string;

  @IsString()
  productName: string;

  @IsNumber()
  productCurrentPrice: number;

  @IsString()
  productCategory: string;

  @IsDate()
  productCreatedAt: Date;

  @IsString()
  productVolume: string;

  @IsBoolean()
  productIsSoldout: boolean;

  // 매입처 DB 칼럼에 없음.

  @IsNumber()
  productOriginPrice: number;

  @IsString()
  productDescription: string;
}
