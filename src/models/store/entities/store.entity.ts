import { Product } from 'src/models/product/entities/product.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Owner } from '../../auth-owner/entities/owner.entity';
import { StoreBank } from './store_bank.entity';
import { StorePaymethod } from './store_paymethod.entity';
import { StoreBase } from '../interfaces/store-base.interface';

/**
 * Entity Schema for Store
 * @class Store
 */
@Entity({
  name: 'store',
})
export class Store implements StoreBase {
  @PrimaryGeneratedColumn({ type: 'int' })
  store_id: number;

  // Store(1) <-> Owner(1)
  @OneToOne((type) => Owner, (owner) => owner.store, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  owner: Owner;

  @Column({ type: 'char', length: 30 })
  store_name: string;

  @Column({ type: 'char', length: 255 })
  store_address: string;

  @Column({ type: 'char', length: 15 })
  store_phone: string;

  @Column({ type: 'char', length: 255 })
  store_image: string;

  @Column({ type: 'float' })
  store_star_point: number;

  @Column({ type: 'time' })
  store_open_time: string;

  @Column({ type: 'time' })
  store_close_time: string;

  @Column({ type: 'boolean' })
  store_is_open: boolean;

  @Column({ type: 'boolean' })
  store_is_delivery: boolean;

  @Column({ type: 'char', length: 15 })
  store_business_number: string;

  @Column({ type: 'char', length: 30 })
  store_business_store_name: string;

  @Column({ type: 'char', length: 255 })
  store_business_store_address: string;

  @Column({ type: 'date' })
  store_business_date: Date;

  @Column({ type: 'date' })
  store_business_owner_birthday: Date;

  @Column({ type: 'char', length: 15 })
  store_business_owner_name: string;

  @Column({ type: 'char', length: 255 })
  store_business_image: string;

  // Store(1) <-> StoreBank(*)
  @OneToMany((type) => StoreBank, (store_bank) => store_bank.store)
  store_bank!: StoreBank[];

  // Store(1) <-> StorePaymethod(*)
  @OneToMany(
    (type) => StorePaymethod,
    (store_paymethod) => store_paymethod.store,
  )
  store_paymethod!: StorePaymethod[];

  // Store(1) <-> Product(*)
  @OneToMany((type) => Product, (product) => product.store)
  product!: Product[];
}
