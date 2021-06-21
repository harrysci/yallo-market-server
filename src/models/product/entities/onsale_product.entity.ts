import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

/**
 * Entity Schema for Onsale_Product
 * @class Product
 */
@Entity({
  name: 'onsale_product',
})
export class Onsale_Product {
  @PrimaryGeneratedColumn({ type: 'int' })
  onsale_product_id: number;

  // Product(1) <-> Onsale_Product(*)
  @ManyToOne((type) => Product, (product) => product.onsale_product, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  product!: Product;

  @Column({ type: 'int' })
  product_onsale_price: number;
}
