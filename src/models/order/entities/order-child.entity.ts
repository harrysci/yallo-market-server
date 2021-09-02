import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OrderChildrenBase } from '../interfaces/order-child-base.interface';

/**
 * Entity Schema for Order
 * @class OrderChild
 */
@Entity({
  name: 'order_child',
})
export class OrderChild implements OrderChildrenBase {
  @PrimaryGeneratedColumn({ type: 'int' })
  order_id: number;

  @Column({ type: 'char', length: 30 })
  order_number: string; // 주문 번호

  @Column({ type: 'char', length: 30 })
  order_product_name: string; // 주문 상품명

  @Column({ type: 'int' })
  order_unit_price: number; // 상품 한 개의 가격

  @Column({ type: 'int' })
  order_quantity: number; // 주문 수량
}
