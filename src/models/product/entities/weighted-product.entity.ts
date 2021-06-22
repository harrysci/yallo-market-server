import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  // Product(1) <-> WeightedProduct(*)
  @ManyToOne((type) => Product, (product) => product.weighted_product, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  product!: Product;

  @Column({ type: 'char', length: 255 })
  weighted_product_volume: string;
}
