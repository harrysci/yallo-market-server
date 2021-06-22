import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StorePaymethodBase } from '../interfaces/store-paymethod-base.interface';
import { Store } from './store.entity';

/**
 * Entity Schema for Store
 * @class StorePaymethod
 */
@Entity({
  name: 'store_paymethod',
})
export class StorePaymethod implements StorePaymethodBase {
  @PrimaryGeneratedColumn({ type: 'int' })
  store_paymethod_id: number;

  // Store(1) <-> StorePaymethod(*)
  @ManyToOne((type) => Store, (store) => store.store_paymethod, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'store_id' })
  store!: Store;

  @Column({ type: 'char', length: 30 })
  store_pay_method: string;
}
