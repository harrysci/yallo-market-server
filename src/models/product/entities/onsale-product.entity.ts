import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  // Product(1) <-> OnsaleProduct(*)
  @ManyToOne((type) => Product, (product) => product.onsale_product, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  product!: Product;

  @Column({ type: 'int' })
  product_onsale_price: number;
}
