import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderChildrenBase } from '../interfaces/order-child-base.interface';
import { OrderParent } from './order-parent.entity';

/**
 * Entity Schema for Order
 * @class OrderChild
 */
@Entity({
  name: 'order_child',
})
export class OrderChild implements OrderChildrenBase {
  @PrimaryGeneratedColumn({ type: 'number' })
  order_id: number;

  @Column({ type: 'string' })
  order_number: string; // 주문 번호

  @Column({ type: 'string' })
  order_product_name: string; // 주문 상품명

  @Column({ type: 'number' })
  order_unit_price: number; // 상품 한 개의 가격

  @Column({ type: 'number' })
  order_quantity: number; // 주문 수량

  // OrderChild(*) <-> OrderParent(1)
  @ManyToOne(() => OrderParent, (order_parent) => order_parent.order_number)
  order_parent!: OrderParent;
}
