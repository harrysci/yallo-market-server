import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { OrderParentBase } from '../interfaces/order-parent-base.interface';

/**
 * Entity Schema for Order
 * @class OrderParent
 */
@Entity({
  name: 'order_parent',
})
export class OrderParent implements OrderParentBase {
  // OrderParent(1) <-> OrderChild(*)
  @PrimaryGeneratedColumn({ type: 'int' })
  order_parent_id: number;

  @Column({ type: 'char', length: 30 })
  order_number: string;

  @Column({ type: 'timestamp' })
  order_created_at: Date;

  @Column({ type: 'int' })
  order_status: number;

  @Column({ type: 'int' })
  order_total_price: number;

  @Column({ type: 'boolean' })
  order_is_pickup: boolean;

  @Column({ type: 'int' })
  store_id: number;

  @Column({ type: 'timestamp' })
  order_completed_at: Date;

  @Column({ type: 'char', length: 30 })
  order_pay_method: string;

  @Column({ type: 'char', length: 20 })
  store_name: string;
}
