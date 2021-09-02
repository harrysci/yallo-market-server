import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { OrderParentBase } from '../interfaces/order-parent-base.interface';
import { OrderChild } from './order-child.entity';

/**
 * Entity Schema for Order
 * @class OrderParent
 */
@Entity({
  name: 'order_parent',
})
export class OrderParent implements OrderParentBase {
  // OrderParent(1) <-> OrderChild(*)
  @PrimaryColumn({ type: 'string' })
  @OneToMany(() => OrderChild, (order_child) => order_child.order_number, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  order_number: string;

  @Column({ type: 'timestamp' })
  order_created_at: Date;

  @Column({ type: 'number' })
  order_status: number;

  @Column({ type: 'number' })
  order_total_price: number;

  @Column({ type: 'boolean' })
  order_is_pickup: boolean;

  @Column({ type: 'number' })
  store_id: number;

  @Column({ type: 'timestamp' })
  order_completed_at: Date;

  @Column({ type: 'string' })
  order_pay_method: string;
}
