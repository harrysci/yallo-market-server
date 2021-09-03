/**
 * @interface OrderChildrenBase
 * order_parent entity base interface
 */
export interface OrderChildrenBase {
  order_id: number;
  order_number: string; // 주문 번호
  order_product_name: string; // 주문 상품명
  order_unit_price: number; // 상품 한 개의 가격
  order_quantity: number; // 주문 수량
}
