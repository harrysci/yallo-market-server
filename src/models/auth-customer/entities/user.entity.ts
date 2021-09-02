import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { UserBase } from '../interfaces/user-base.interface';
import { RegularStore } from './regular-store.entity';
import { UserOrder } from './user-order.entity';

/**
 * Entity Schema for Users
 * @class User
 */
@Entity({
  name: 'user',
})
export class User implements UserBase {
  @PrimaryColumn({ type: 'string' })
  user_email: string;

  @Column({ type: 'string' })
  user_password: string;

  @Column({ type: 'string' })
  user_account_type: 'local' | 'kakao' | 'apple';

  @Column({ type: 'string' })
  user_nickname: string;

  @Column({ type: 'date' })
  user_birthday: Date;

  @Column({ type: 'string' })
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
