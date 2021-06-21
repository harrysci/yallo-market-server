import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

/**
 * Entity Schema for Processed_Product
 * @class Product
 */
@Entity({
  name: 'processed_product',
})
export class Processed_Product {
  @PrimaryGeneratedColumn({ type: 'int' })
  processed_product_id: number;

  // Product(1) <-> Processed_Product(*)
  @ManyToOne((type) => Product, (product) => product.processed_product, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  product!: Product;

  @Column({ type: 'char', length: 30 })
  processed_product_name: string;

  @Column({ type: 'char', length: 30 })
  processed_product_company: string;

  @Column({ type: 'char', length: 30 })
  processed_product_standard_type: string;

  @Column({ type: 'char', length: 255 })
  processed_product_standard_values: string;

  @Column({ type: 'char', length: 255 })
  processed_product_composition: string;

  @Column({ type: 'char', length: 255 })
  processed_product_volume: string;

  @Column({ type: 'char', length: 255 })
  processed_product_adult: string;

  @Column({ type: 'char', length: 255 })
  processed_product_caution: string;

  @Column({ type: 'char', length: 255 })
  processed_product_information: string;
}
