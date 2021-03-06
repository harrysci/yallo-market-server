import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImageBase } from '../interfaces/product-image-base.interface';
import { Product } from './product.entity';

/**
 * Entity Schema for ProductImage
 * @class Product
 */
@Entity({
  name: 'product_image',
})
export class ProductImage implements ProductImageBase {
  @PrimaryGeneratedColumn({ type: 'int' })
  product_image_id: number;

  // Product(1) <-> ProductImage(*)
  @ManyToOne(() => Product, (product) => product.product_image, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
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
