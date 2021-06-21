import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

/**
 * Entity Schema for Product_Image
 * @class Product
 */
@Entity({
  name: 'product_image',
})
export class Product_Image {
  @PrimaryGeneratedColumn({ type: 'int' })
  product_image_id: number;

  // Product(1) <-> Product_Image(*)
  @ManyToOne((type) => Product, (product) => product.product_image, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  product!: Product;

  @Column({ type: 'char', length: 255 })
  product_image: string;

  @Column({ type: 'boolean' })
  is_representative: boolean;

  @Column({ type: 'boolean' })
  is_detail: boolean;

  @Column({ type: 'boolean' })
  is_additional: boolean;
}
