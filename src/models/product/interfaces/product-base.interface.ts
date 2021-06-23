import { Store } from 'src/models/store/entities/store.entity';
import { ProductImage } from '../entities/product-image.entity';

/**
 * @interface ProductBase
 * product entity base interface
 */
export interface ProductBase {
  product_id: number;
  product_barcode: string;
  product_name: string;
  product_original_price: number;
  product_current_price: number;
  product_profit: number;
  product_description: string;
  product_is_processed: boolean;
  product_is_soldout: boolean;
  product_onsale: boolean;
  product_category: string;
  product_created_at: Date;
  product_image: ProductImage[];

  store: Store;
}
