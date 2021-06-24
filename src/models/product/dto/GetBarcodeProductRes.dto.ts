/**
 *  1. 점포 이름 (storeName)
 *  2. 상품명 (productName)
 *  3. 바코드 (productBarcode)
 *  4. 상품 현재 판매가 (productCurrentPrice)
 *  5. 상품 할인 여부 (productOnsale)
 *  6. 상품 할인가 (productOnsalePrice)
 *  7. 상품 카테고리 (productCategory)
 *  8. 얄로마켓 시스템 내 상품 게시일 (productCreatedAt)
 *  9. 규격 (productVolume)
 */

export class GetBarcodeProductRes {
  storeName: string; // 점포 이름
  productName: string; // 상품명
  productBarcode: string; // 바코드
  productCurrentPrice: number; // 상품 현재 판매가
  productOnsale: boolean; // 상품 할인 여부
  productOnsalePrice?: number; // 상품 할인가
  productCategory: string; // 상품 카테고리
  productCreatedAt: Date; // 얄로마켓 시스템 내 상품 게시일
  productVolume: string; // 규격
}
