import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserBase } from '../interfaces/user-base.interface';
import { RegularStore } from './regular-store.entity';
import { UserOrder } from './user-order.entity';

/**
 * Entity Schema for AuthCustomer
 * @class User
 */
@Entity({
  name: 'user',
})
export class User implements UserBase {
  @PrimaryGeneratedColumn({ type: 'int' })
  user_id: number;

  @Column({ type: 'char', length: 30 })
  user_email: string;

  @Column({ type: 'char', length: 30 })
  user_password: string;

  @Column({ type: 'char', length: 10 })
  user_account_type: 'local' | 'kakao' | 'apple';

  @Column({ type: 'char', length: 10 })
  user_nickname: string;

  @Column({ type: 'date' })
  user_birthday: Date;

  @Column({ type: 'char', length: 15 })
  user_phone: string;

  @Column({ type: 'boolean' })
  user_marketing_agree: boolean;

  // User(1) <-> RegularStore(*)
  @OneToMany(() => RegularStore, (regular_store) => regular_store.user)
  regular_store!: RegularStore[];

  // User(1) <-> UserOrder(*)
  @OneToMany(() => UserOrder, (user_order) => user_order.user)
  user_order!: UserOrder[];
}
