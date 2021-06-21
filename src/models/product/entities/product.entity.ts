import { Store } from 'src/models/store/entities/store.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Onsale_Product } from './onsale_product.entity';
import { Processed_Product } from './processed_product.entity';
import { Product_Image } from './product_image.entity';
import { Weighted_Product } from './weighted_product.entity';

/**
 * Entity Schema for Product
 * @class Product
 */
@Entity({
  name: 'product',
})
export class Product {
  @PrimaryGeneratedColumn({ type: 'int' })
  product_id: number;

  // Store(1) <-> Product(*)
  @ManyToOne((type) => Store, (store) => store.product, {
    nullable: false,
    // Store 가 삭제되어도 Product 는 삭제되지 않는다.
    onDelete: 'NO ACTION',
  })
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

  // Product(1) <-> Product_Image(*)
  @OneToMany((type) => Product_Image, (product_image) => product_image.product)
  product_image!: Product_Image[];

  // Product(1) <-> Processed_Product(*)
  @OneToMany(
    (type) => Processed_Product,
    (processed_product) => processed_product.product,
  )
  processed_product!: Processed_Product[];

  // Product(1) <-> Weighted_Product(*)
  @OneToMany(
    (type) => Weighted_Product,
    (weighted_product) => weighted_product.product,
  )
  weighted_product!: Weighted_Product[];

  // Product(1) <-> Onsale_Product(*)
  @OneToMany(
    (type) => Onsale_Product,
    (onsale_product) => onsale_product.product,
  )
  onsale_product!: Onsale_Product[];
}
