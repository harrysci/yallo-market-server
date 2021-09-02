import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RegularStoreBase } from '../interfaces/regular-store-base.interface';
import { User } from './user.entity';

/**
 * Entity Schema for AuthCustomer
 * @class RegularStore
 */
@Entity({
  name: 'regular_store',
})
export class RegularStore implements RegularStoreBase {
  @PrimaryGeneratedColumn()
  regular_store_id: number;

  // User(1) <-> RegularStore(*)
  @ManyToOne(() => User, (user) => user.regular_store, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'int' })
  store_id: number;
}
