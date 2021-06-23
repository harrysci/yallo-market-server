import { Store } from 'src/models/store/entities/store.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductBase } from '../interfaces/product-base.interface';
import { ProductImage } from './product-image.entity';

/**
 * Entity Schema for Product
 * @class Product
 */
@Entity({
  name: 'product',
})
export class Product implements ProductBase {
  @PrimaryGeneratedColumn({ type: 'int' })
  product_id: number;

  // Store(1) <-> Product(*)
  @ManyToOne(() => Store, (store) => store.product, {
    nullable: false,
    // Store 가 삭제되어도 Product 는 삭제되지 않는다.
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'store_id' })
  store!: Store;

  @Column({ type: 'char', length: 30 })
  product_barcode: string;

  @Column({ type: 'char', length: 30 })
  product_name: string;

  @Column({ type: 'int' })
  product_original_price: number;

  @Column({ type: 'int' })
  product_current_price: number;

  @Column({ type: 'float' })
  product_profit: number;

  @Column({ type: 'char', length: 255 })
  product_description: string;

  @Column({ type: 'boolean' })
  product_is_processed: boolean;

  @Column({ type: 'boolean' })
  product_is_soldout: boolean;

  @Column({ type: 'boolean' })
  product_onsale: boolean;

  @Column({ type: 'char', length: 30 })
  product_category: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  product_created_at: Date;

  // Product(1) <-> ProductImage(*)
  @OneToMany(() => ProductImage, (product_image) => product_image.product)
  product_image!: ProductImage[];
}
