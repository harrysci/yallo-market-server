import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OnsaleProductBase } from '../interfaces/onsale-product-base.interface';
import { Product } from './product.entity';

/**
 * Entity Schema for OnsaleProduct
 * @class Product
 */
@Entity({
  name: 'onsale_product',
})
export class OnsaleProduct implements OnsaleProductBase {
  @PrimaryGeneratedColumn({ type: 'int' })
  onsale_product_id: number;

  @Column({ type: 'int' })
  product_onsale_price: number;
}
