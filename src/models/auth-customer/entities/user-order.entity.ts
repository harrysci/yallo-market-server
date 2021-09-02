import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserOrderBase } from '../interfaces/user-order-base.interface';
import { User } from './user.entity';

/**
 * Entity Schema for Users
 * @class UserOrder
 */
@Entity({
  name: 'user_order',
})
export class UserOrder implements UserOrderBase {
  @PrimaryGeneratedColumn()
  user_order_id: number;

  // User(1) <-> RegularStore(*)
  @ManyToOne(() => User, (user) => user.user_order, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'char', length: 30 })
  order_number: string;
}
