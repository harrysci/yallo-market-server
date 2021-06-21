import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
  store!: Store;

  @Column({ type: 'char', length: 30 })
  store_bank_name: string;

  @Column({ type: 'char', length: 30 })
  store_account_number: string;
}
