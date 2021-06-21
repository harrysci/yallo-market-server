import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

/**
 * Entity Schema for OnsaleProduct
 * @class Product
 */
@Entity({
  name: 'onsale_product',
})
export class OnsaleProduct {
  @PrimaryGeneratedColumn({ type: 'int' })
  onsale_product_id: number;

  // Product(1) <-> OnsaleProduct(*)
  @ManyToOne((type) => Product, (product) => product.onsale_product, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  product!: Product;

  @Column({ type: 'int' })
  product_onsale_price: number;
}
