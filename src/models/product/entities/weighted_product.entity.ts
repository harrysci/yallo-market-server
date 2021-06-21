import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

/**
 * Entity Schema for Weighted_Product
 * @class Product
 */
@Entity({
  name: 'weighted_product',
})
export class Weighted_Product {
  @PrimaryGeneratedColumn({ type: 'int' })
  weighted_product_id: number;

  // Product(1) <-> Weighted_Product(*)
  @ManyToOne((type) => Product, (product) => product.weighted_product, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  product!: Product;

  @Column({ type: 'char', length: 255 })
  weighted_product_volume: string;
}
