import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Store } from './store-entity';

/**
 * Entity Schema for Store
 * @class Store_Bank
 */
@Entity({
  name: 'store_bank',
})
export class Store_Bank {
  @PrimaryGeneratedColumn({ type: 'int' })
  store_bank_id: number;

  // Store(1) <-> Store_Bank(*)
  @ManyToOne((type) => Store, (store) => store.store_bank, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  store!: Store;

  @Column({ type: 'char', length: 30 })
  store_bank_name: string;

  @Column({ type: 'char', length: 30 })
  store_account_number: string;
}
