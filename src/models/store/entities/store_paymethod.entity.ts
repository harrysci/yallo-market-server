import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Store } from './store.entity';

/**
 * Entity Schema for Store
 * @class Store_Paymethod
 */
@Entity({
  name: 'store_bank',
})
export class Store_Paymethod {
  @PrimaryGeneratedColumn({ type: 'int' })
  store_paymethod_id: number;

  // Store(1) <-> Store_Paymethod(*)
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
