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

  // Product(1) <-> OnsaleProduct(1)
  @OneToOne(() => Product, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Column({ type: 'int' })
  product_onsale_price: number;
}
