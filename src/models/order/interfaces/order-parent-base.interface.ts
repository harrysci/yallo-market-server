/**
 * @interface OrderParentBase
 * order_parent entity base interface
 */
export interface OrderParentBase {
  order_number: string; // 주문 번호
  order_created_at: Date; // 주문 생성 일시
  /**
   * 주문 상태
   *    0: 주문 접수중
   *    1: 준비중
   *    2: 픽업 가능
   *    3: 픽업 완료
   *    4: 주문 취소
   */
  order_status: number;
  order_total_price: number; // 주문 총액
  /**
   * 상품 인도 방식
   *    false: 배달
   *    true: 픽업
   */
  order_is_pickup: boolean;
  store_id: number; // 점포 id
  /**
   * 상품 인도 완료 일시
   *    order_status 가 3 인 경우 (픽업 완료): 픽업 완료 일시
   *    order_status 가 4 인 경우 (주문 취소): 취소 일시
   */
  order_completed_at: Date;
  order_pay_method: string; // 결제 방식
}
