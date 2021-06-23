import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WeightedProductBase } from '../interfaces/weighted-product-base.interface';
import { Product } from './product.entity';

/**
 * Entity Schema for WeightedProduct
 * @class Product
 */
@Entity({
  name: 'weighted_product',
})
export class WeightedProduct implements WeightedProductBase {
  @PrimaryGeneratedColumn({ type: 'int' })
  weighted_product_id: number;

  // Product(1) <-> WeightedProduct(1)
  @OneToOne(() => Product, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Column({ type: 'char', length: 255 })
  weighted_product_volume: string;
}
