import { Store } from 'src/models/store/entities/store.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductBase } from '../interfaces/product-base.interface';
import { OnsaleProduct } from './onsale-product.entity';
import { ProcessedProduct } from './processed-product.entity';
import { ProductImage } from './product-image.entity';
import { WeightedProduct } from './weighted-product.entity';

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

  // Product(1) <-> ProcessedProduct(1)
  @OneToOne(() => ProcessedProduct, {
    nullable: true,
    onDelete: 'NO ACTION',
    cascade: ['insert']
  })
  @JoinColumn({ name: 'processed_product_id' })
  processed_product: ProcessedProduct;

  // Product(1) <-> WeightedProduct(1)
  @OneToOne(() => WeightedProduct, {
    nullable: true,
    onDelete: 'NO ACTION',
    cascade: ['insert']
  })
  @JoinColumn({ name: 'weighted_product_id' })
  weighted_product: WeightedProduct;

  // Product(1) <-> OnsaleProduct(1)
  @OneToOne(() => OnsaleProduct, {
    nullable: true,
    onDelete: 'NO ACTION',
    cascade: ['insert']
  })
  @JoinColumn({ name: 'onsale_product_id' })
  onsale_product: OnsaleProduct;
}
